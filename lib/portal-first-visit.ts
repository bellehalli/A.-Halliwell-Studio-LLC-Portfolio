import "server-only";
import { Resend } from "resend";
import { portalDb } from "./portal";
export async function recordFirstClientVisit(projectId: string, clientId: string) {
  try {
    const sql = portalDb();
    const rows = await sql`UPDATE portal_projects SET first_client_opened_at = coalesce(first_client_opened_at, now())
      WHERE id = ${projectId} AND client_id = ${clientId} AND invited_at IS NOT NULL AND archived_at IS NULL
      RETURNING title, first_client_opened_at, first_visit_alert_at`;
    if (!rows.length || rows[0].first_visit_alert_at || !process.env.PORTAL_STUDIO_EMAIL) return;
    const clients = await sql`SELECT first_name FROM portal_clients WHERE id = ${clientId} LIMIT 1`;
    const { data, error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: process.env.INQUIRY_FROM_EMAIL || "A. Halliwell Studio <onboarding@resend.dev>", to: [process.env.PORTAL_STUDIO_EMAIL],
      subject: `${clients[0]?.first_name || "Your client"} opened their project workspace`,
      text: `${clients[0]?.first_name || "Your client"} signed in and opened ${rows[0].title} for the first time.\n\nOpen the client desk: https://www.ahalliwellstudio.com/portal/studio\n\nThis confirms a workspace visit, not a signature or payment.`,
    }, { idempotencyKey: `portal-first-visit/${projectId}` });
    if (!error && data?.id) await sql`UPDATE portal_projects SET first_visit_alert_at = now() WHERE id = ${projectId} AND first_visit_alert_at IS NULL`;
  } catch { console.warn("Portal first-visit alert could not complete; it will retry on the next visit."); }
}
