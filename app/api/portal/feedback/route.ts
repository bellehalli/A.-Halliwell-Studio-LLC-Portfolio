import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { currentPortalClient, portalDb, portalEnabled } from "@/lib/portal";

export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store" };

export async function POST(request: Request) {
  if (!portalEnabled()) return NextResponse.json({ ok: false }, { status: 503, headers });
  if (request.headers.get("origin") !== new URL(request.url).origin) return NextResponse.json({ ok: false }, { status: 403, headers });
  const client = await currentPortalClient();
  if (!client) return NextResponse.json({ ok: false }, { status: 401, headers });
  try {
    const raw = await request.text();
    if (raw.length > 5_000) return NextResponse.json({ ok: false }, { status: 413, headers });
    const data = JSON.parse(raw);
    const id = String(data?.deliverableId || "");
    const decision = data?.decision;
    const note = String(data?.note || "").trim();
    if (!/^[a-f0-9-]{36}$/.test(id) || !["approved", "changes_requested"].includes(decision) || note.length > 4000 || (decision === "changes_requested" && !note)) return NextResponse.json({ ok: false }, { status: 400, headers });
    const rows = await portalDb()`WITH target AS (
      UPDATE portal_deliverables SET status = ${decision}
      WHERE id = ${id} AND status = 'review' AND project_id IN (SELECT id FROM portal_projects WHERE client_id = ${client.id})
      RETURNING id
    ) INSERT INTO portal_feedback(id, deliverable_id, client_id, decision, note)
      SELECT ${randomUUID()}, id, ${client.id}, ${decision}, ${note} FROM target RETURNING id`;
    if (!rows.length) return NextResponse.json({ ok: false }, { status: 409, headers });
    if (process.env.PORTAL_STUDIO_EMAIL) {
      await new Resend(process.env.RESEND_API_KEY).emails.send({
        from: process.env.INQUIRY_FROM_EMAIL || "A. Halliwell Studio <onboarding@resend.dev>",
        to: [process.env.PORTAL_STUDIO_EMAIL],
        subject: decision === "approved" ? "Client approved a review version" : "Client sent revision notes",
        text: `${client.first_name} ${decision === "approved" ? "approved a version" : "requested revisions"}.\n\n${note || "No additional note."}\n\nOpen the studio workspace: https://www.ahalliwellstudio.com/portal/studio`,
      }, { idempotencyKey: `portal-feedback/${id}` }).catch(() => { /* The decision is saved even if the alert fails. */ });
    }
    return NextResponse.json({ ok: true }, { headers });
  } catch { return NextResponse.json({ ok: false }, { status: 400, headers }); }
}
