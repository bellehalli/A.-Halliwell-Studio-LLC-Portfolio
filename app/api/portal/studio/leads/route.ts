import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { currentPortalClient, isPortalStudio, portalDb, portalEnabled } from "@/lib/portal";
import { ensureLeads } from "@/lib/leads";
import { leadInvestmentCents, validFollowUpDate, validLeadStage } from "@/lib/lead-fields";

export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store" };
const fail = (status: number, message: string) => NextResponse.json({ ok: false, message }, { status, headers });
const clean = (value: unknown, max: number) => typeof value === "string" ? value.trim().replace(/\0/g, "").slice(0, max) : "";

export async function POST(request: Request) {
  if (!portalEnabled()) return fail(503, "Portal unavailable.");
  if (request.headers.get("origin") !== new URL(request.url).origin) return fail(403, "Forbidden.");
  const studio = await currentPortalClient();
  if (!isPortalStudio(studio)) return fail(403, "Forbidden.");
  try {
    const raw = await request.text();
    if (Buffer.byteLength(raw, "utf8") > 16_000) return fail(413, "Request too large.");
    let data;
    try { data = JSON.parse(raw); } catch { return fail(400, "Invalid request."); }
    if (!data || typeof data !== "object" || Array.isArray(data)) return fail(400, "Invalid request.");
    const id = clean(data.id, 36);
    if (!/^[a-f0-9-]{36}$/.test(id)) return fail(400, "Choose a lead.");
    await ensureLeads();
    const sql = portalDb();
    if (data.action === "update") {
      const name = clean(data.name, 100), email = clean(data.email, 254).toLowerCase(), business = clean(data.business, 150);
      const notes = clean(data.notes, 6000), nextAction = clean(data.nextAction, 500), followUpOn = clean(data.followUpOn, 10);
      if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !validLeadStage(data.stage) || !validFollowUpDate(followUpOn) || !Number.isSafeInteger(data.revision)) return fail(400, "Check the contact details, stage, and follow-up date.");
      const event = JSON.stringify([{ at: new Date().toISOString(), by: studio!.email, action: "Lead updated", stage: data.stage, name, email, business, notes, nextAction, followUpOn }]);
      const rows = await sql`UPDATE studio_leads SET name = ${name}, email = ${email}, business = ${business}, stage = ${data.stage},
        notes = ${notes}, next_action = ${nextAction}, follow_up_on = ${followUpOn || null}::date, history = history || ${event}::jsonb,
        updated_at = now(), revision = revision + 1 WHERE id = ${id} AND revision = ${data.revision} RETURNING id`;
      if (!rows.length) return fail(409, "This lead changed in another window. Refresh before saving again.");
      return NextResponse.json({ ok: true }, { headers });
    }
    if (data.action === "createWorkspace") {
      const title = clean(data.title, 150);
      if (!title) return fail(400, "Give the project a title.");
      let amount: number | null;
      try { amount = leadInvestmentCents(clean(data.investment, 30)); } catch (error) { return fail(400, (error as Error).message); }
      const projectId = randomUUID();
      const event = JSON.stringify([{ at: new Date().toISOString(), by: studio!.email, action: "Private workspace created" }]);
      // Lock the lead for the whole transaction. Repeated clicks cannot create two workspaces.
      const result = await sql.transaction([
        sql`SELECT id FROM studio_leads WHERE id = ${id} FOR UPDATE`,
        sql`INSERT INTO portal_clients(id, email, first_name)
          SELECT ${randomUUID()}, email, name FROM studio_leads WHERE id = ${id} AND project_id IS NULL
          ON CONFLICT (email) DO NOTHING`,
        sql`INSERT INTO portal_projects(id, client_id, title, summary, client_business, investment_cents)
          SELECT ${projectId}, c.id, ${title}, concat('Requested services: ', coalesce((SELECT string_agg(value, ', ') FROM jsonb_array_elements_text(l.brief->'needs')), ''), E'\n\nCurrent challenge: ', l.brief->>'currentProblem', E'\n\nProject goal: ', l.brief->>'successGoal'), l.business, ${amount}
          FROM studio_leads l JOIN portal_clients c ON c.email = l.email AND c.role = 'client'
          WHERE l.id = ${id} AND l.project_id IS NULL`,
        sql`UPDATE studio_leads SET project_id = ${projectId}, history = history || ${event}::jsonb, updated_at = now(), revision = revision + 1
          WHERE id = ${id} AND project_id IS NULL AND EXISTS (SELECT 1 FROM portal_projects WHERE id = ${projectId})`,
        sql`SELECT project_id FROM studio_leads WHERE id = ${id}`,
      ]);
      const linked = result[4][0]?.project_id;
      if (!linked) return fail(409, "Could not create a client workspace. Check that this contact is a client rather than a studio account.");
      return NextResponse.json({ ok: true, projectId: String(linked) }, { headers });
    }
    return fail(400, "Unknown action.");
  } catch { return fail(500, "The lead could not be saved. Please try again."); }
}
