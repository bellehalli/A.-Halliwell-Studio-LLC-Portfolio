import { NextResponse } from "next/server";
import { Resend } from "resend";
import { currentPortalClient, isPortalStudio, portalDb, portalEnabled } from "@/lib/portal";
import { ensurePortalSupport } from "@/lib/portal-support";
import { saveInquiryLead, leadEmailStatus } from "@/lib/leads";
import { checkRequestLimit } from "@/lib/request-rate-limit";
export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store" };
const fail = (status: number, message: string) => NextResponse.json({ ok: false, message }, { status, headers });
export async function POST(request: Request) {
  if (!portalEnabled()) return fail(503, "Portal unavailable.");
  if (request.headers.get("origin") !== new URL(request.url).origin) return fail(403, "Forbidden.");
  const client = await currentPortalClient();
  if (!client || isPortalStudio(client) || client.role !== "client") return fail(403, "Sign in to your client workspace.");
  let saved = false;
  try {
    const raw = await request.text();
    if (Buffer.byteLength(raw, "utf8") > 12_000) return fail(413, "Request too large.");
    let data;
    try { data = JSON.parse(raw); } catch { return fail(400, "Invalid request."); }
    if (!data || typeof data !== "object" || Array.isArray(data)) return fail(400, "Invalid request.");
    const id = String(data.id || ""), projectId = String(data.projectId || "");
    const message = typeof data.message === "string" ? data.message.trim().replace(/\0/g, "") : "";
    const timing = typeof data.timing === "string" ? data.timing.trim().replace(/\0/g, "") : "";
    if (!/^[a-f0-9-]{36}$/.test(id) || !/^[a-f0-9-]{36}$/.test(projectId) || message.length < 5 || message.length > 5000 || timing.length > 200) return fail(400, "Tell us what you need in 5–5,000 characters.");
    const sql = portalDb();
    const projects = await sql`SELECT p.title, p.client_business FROM portal_projects p WHERE p.id = ${projectId} AND p.client_id = ${client.id}
      AND p.invited_at IS NOT NULL AND p.archived_at IS NULL AND EXISTS (
        SELECT 1 FROM portal_invoices i JOIN portal_documents d ON d.id = i.document_id
        WHERE d.project_id = p.id AND i.status = 'paid' AND i.paid_at IS NOT NULL AND i.milestone_number IN (0,1)
      ) LIMIT 1`;
    if (!projects.length) return fail(403, "Support requests open after your deposit is confirmed for an active project.");
    await ensurePortalSupport();
    const existing = await sql`SELECT message, timing FROM portal_support_requests WHERE id = ${id} AND client_id = ${client.id} AND project_id = ${projectId}`;
    if (existing.length) return existing[0].message === message && existing[0].timing === timing ? NextResponse.json({ ok: true }, { headers }) : fail(409, "This reference was already used. Refresh before sending another request.");
    const limit = await checkRequestLimit(request, "portal-support", 10, 15 * 60 * 1000);
    if (limit.limited) return fail(429, "Please wait before sending another request.");
    const project = projects[0];
    const lead = await saveInquiryLead(id, { name: client.first_name, email: client.email, business: String(project.client_business || ""),
      projectType: "Existing client", classification: "SUPPORT", needs: ["Ongoing support"], timing: timing || "Flexible",
      investment: "Custom scope", currentUrl: "", currentProblem: message, successGoal: `Support for ${project.title}`,
      assets: [], source: "Client portal", productCount: "", bookingType: "", guestPain: "" });
    if (lead.conflict) return fail(409, "This reference was already used. Refresh before sending another request.");
    await sql.transaction([
      sql`INSERT INTO portal_support_requests(id, project_id, client_id, lead_id, message, timing) VALUES (${id}, ${projectId}, ${client.id}, ${lead.id}, ${message}, ${timing}) ON CONFLICT (id) DO NOTHING`,
      sql`UPDATE studio_leads SET project_id = ${projectId} WHERE id = ${lead.id}`,
    ]);
    saved = true;
    if (lead.fresh) {
      let status = "unavailable";
      const to = process.env.INQUIRY_TO_EMAIL || process.env.PORTAL_STUDIO_EMAIL;
      if (to) try {
        const result = await new Resend(process.env.RESEND_API_KEY).emails.send({
          from: process.env.INQUIRY_FROM_EMAIL || "A. Halliwell Studio <onboarding@resend.dev>", to: [to], replyTo: client.email,
          subject: "New client support request",
          text: `Project: ${project.title}\nClient: ${client.first_name}\nTiming: ${timing || "Flexible"}\n\n${message}\n\nReview in the Leads desk: https://www.ahalliwellstudio.com/portal/studio/leads`,
        }, { idempotencyKey: `portal-support/${id}` });
        status = result.error ? "failed" : "accepted";
      } catch { status = "failed"; }
      await leadEmailStatus(lead.id, status, "not requested");
    }
    return NextResponse.json({ ok: true }, { headers });
  } catch { return saved ? NextResponse.json({ ok: true }, { headers }) : fail(500, "Your request could not be saved. Please try again."); }
}
