import "server-only";
import { createHash, randomUUID } from "node:crypto";
import { portalDb } from "@/lib/portal";
import { nextBusinessFollowUp, type Lead } from "@/lib/lead-fields";

let ready: Promise<unknown> | undefined;
export async function ensureLeads() {
  ready ??= (async () => {
    const sql = portalDb();
    await sql`CREATE TABLE IF NOT EXISTS studio_leads (
      id text PRIMARY KEY, submission_id text NOT NULL UNIQUE, payload_hash text NOT NULL,
      name text NOT NULL, email text NOT NULL, business text NOT NULL DEFAULT '', brief jsonb NOT NULL,
      stage text NOT NULL DEFAULT 'new' CHECK (stage IN ('new','qualified','consultation','proposal','negotiation','won','lost')),
      notes text NOT NULL DEFAULT '', next_action text NOT NULL DEFAULT 'Review inquiry and reply', follow_up_on date,
      project_id text REFERENCES portal_projects(id) ON DELETE SET NULL,
      studio_email_status text NOT NULL DEFAULT 'pending', confirmation_status text NOT NULL DEFAULT 'pending',
      history jsonb NOT NULL DEFAULT '[]', revision integer NOT NULL DEFAULT 1,
      created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
    )`;
    await sql`CREATE INDEX IF NOT EXISTS studio_leads_follow_up ON studio_leads(stage, follow_up_on)`;
  })();
  try { await ready; } catch (error) { ready = undefined; throw error; }
}

export type InquiryLead = Pick<Lead, "name" | "email" | "business" | "projectType" | "classification" | "needs" | "timing" | "investment" | "currentUrl" | "currentProblem" | "successGoal" | "assets" | "source" | "productCount" | "bookingType" | "guestPain">;
export async function saveInquiryLead(submissionId: string, inquiry: InquiryLead) {
  await ensureLeads();
  const sql = portalDb();
  const hash = createHash("sha256").update(JSON.stringify(inquiry)).digest("hex");
  const history = JSON.stringify([{ at: new Date().toISOString(), action: "Inquiry received", stage: "new" }]);
  const rows = await sql`INSERT INTO studio_leads(id, submission_id, payload_hash, name, email, business, brief, follow_up_on, history)
    VALUES (${randomUUID()}, ${submissionId}, ${hash}, ${inquiry.name}, ${inquiry.email}, ${inquiry.business}, ${JSON.stringify(inquiry)}::jsonb, ${nextBusinessFollowUp()}::date, ${history}::jsonb)
    ON CONFLICT (submission_id) DO NOTHING RETURNING id`;
  if (rows.length) return { id: String(rows[0].id), fresh: true, confirmationSent: false, conflict: false };
  const existing = await sql`SELECT id, payload_hash, confirmation_status FROM studio_leads WHERE submission_id = ${submissionId}`;
  return { id: String(existing[0].id), fresh: false, confirmationSent: existing[0].confirmation_status === "accepted", conflict: existing[0].payload_hash !== hash };
}

export async function leadEmailStatus(id: string, studio: string, confirmation: string) {
  await portalDb()`UPDATE studio_leads SET studio_email_status = ${studio}, confirmation_status = ${confirmation} WHERE id = ${id}`;
}

export async function studioLeads(): Promise<Lead[]> {
  await ensureLeads();
  const rows = await portalDb()`SELECT *, follow_up_on::text AS follow_up_date FROM studio_leads ORDER BY created_at DESC`;
  return rows.map(row => ({ ...row.brief, id: String(row.id), name: String(row.name), email: String(row.email), business: String(row.business),
    stage: row.stage, notes: String(row.notes), nextAction: String(row.next_action), followUpOn: String(row.follow_up_date || ""), projectId: String(row.project_id || ""),
    createdAt: new Date(row.created_at).toISOString(), updatedAt: new Date(row.updated_at).toISOString(), revision: Number(row.revision),
    studioEmailStatus: String(row.studio_email_status), confirmationStatus: String(row.confirmation_status), history: row.history,
  })) as Lead[];
}
