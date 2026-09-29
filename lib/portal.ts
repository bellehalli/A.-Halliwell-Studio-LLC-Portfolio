import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { neon } from "@neondatabase/serverless";

export const PORTAL_COOKIE = "__Host-ahs_client_session";
export const SESSION_AGE_SECONDS = 7 * 24 * 60 * 60;

export function portalEnabled() {
  return process.env.PORTAL_ENABLED === "true" && Boolean(process.env.DATABASE_URL && process.env.RESEND_API_KEY);
}

export function portalDb() {
  const url = process.env.DATABASE_URL;
  if (!portalEnabled() || !url) throw new Error("Client portal is not configured");
  return neon(url);
}

// Keeps existing portal databases current without requiring a separate deployment step.
let paymentOptionsReady: Promise<unknown> | undefined;
export async function ensurePortalPaymentOptions() {
  paymentOptionsReady ??= portalDb()`CREATE TABLE IF NOT EXISTS portal_payment_options (
    document_id text PRIMARY KEY REFERENCES portal_invoices(document_id) ON DELETE CASCADE,
    client_id text REFERENCES portal_clients(id) ON DELETE CASCADE,
    ach_url text NOT NULL DEFAULT '',
    selected_method text CHECK (selected_method IN ('zelle','ach','chase','card','check')),
    selected_at timestamptz
  )`;
  try { await paymentOptionsReady; }
  catch (error) { paymentOptionsReady = undefined; throw error; }
}

let proposalsReady: Promise<unknown> | undefined;
export async function ensurePortalProposals() {
  proposalsReady ??= portalDb()`CREATE TABLE IF NOT EXISTS portal_proposals (
    id text PRIMARY KEY,
    project_id text NOT NULL REFERENCES portal_projects(id) ON DELETE CASCADE,
    title text NOT NULL,
    file_name text NOT NULL,
    blob_url text NOT NULL UNIQUE,
    sha256 text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
  )`;
  try { await proposalsReady; }
  catch (error) { proposalsReady = undefined; throw error; }
}

// Additive migrations keep existing signed records and invoices in place.
let lifecycleReady: Promise<unknown> | undefined;
export async function ensurePortalLifecycle() {
  lifecycleReady ??= (async () => {
    const sql = portalDb();
    await sql`ALTER TABLE portal_documents ADD COLUMN IF NOT EXISTS signature_layout jsonb`;
    await sql`ALTER TABLE portal_documents ADD COLUMN IF NOT EXISTS aligned_pdf_url text`;
    await sql`ALTER TABLE portal_documents ADD COLUMN IF NOT EXISTS aligned_pdf_sha256 text`;
    await sql`ALTER TABLE portal_documents ADD COLUMN IF NOT EXISTS completed_email_id text`;
    await sql`ALTER TABLE portal_projects ADD COLUMN IF NOT EXISTS invited_at timestamptz`;
    await sql`ALTER TABLE portal_projects ADD COLUMN IF NOT EXISTS archived_at timestamptz`;
    await sql`ALTER TABLE portal_projects ADD COLUMN IF NOT EXISTS milestone_1_cents integer`;
    await sql`ALTER TABLE portal_projects ADD COLUMN IF NOT EXISTS milestone_2_cents integer`;
    await sql`ALTER TABLE portal_projects ADD COLUMN IF NOT EXISTS milestone_3_cents integer`;
    await sql`ALTER TABLE portal_projects ADD COLUMN IF NOT EXISTS first_client_opened_at timestamptz`;
    await sql`ALTER TABLE portal_projects ADD COLUMN IF NOT EXISTS first_visit_alert_at timestamptz`;
    await sql`ALTER TABLE portal_login_links ADD COLUMN IF NOT EXISTS project_id text`;
    await sql`UPDATE portal_login_links SET expires_at = created_at + interval '48 hours'
      WHERE consumed_at IS NULL AND created_at > now() - interval '48 hours' AND expires_at < created_at + interval '48 hours'`;
    await sql`CREATE TABLE IF NOT EXISTS portal_login_codes (
      token_hash text PRIMARY KEY, code_hash text NOT NULL, client_id text NOT NULL REFERENCES portal_clients(id) ON DELETE CASCADE,
      project_id text, attempts integer NOT NULL DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now(), expires_at timestamptz NOT NULL, consumed_at timestamptz
    )`;
    await sql`ALTER TABLE portal_deliverables ADD COLUMN IF NOT EXISTS shared_at timestamptz DEFAULT now()`;
    await sql`ALTER TABLE portal_invoices ADD COLUMN IF NOT EXISTS shared_at timestamptz DEFAULT now()`;
    await sql`ALTER TABLE portal_deliverables ADD COLUMN IF NOT EXISTS notification_status text NOT NULL DEFAULT 'unknown'`;
    await sql`ALTER TABLE portal_invoices ADD COLUMN IF NOT EXISTS notification_status text NOT NULL DEFAULT 'unknown'`;
    await sql`ALTER TABLE portal_deliverables ADD COLUMN IF NOT EXISTS notification_attempted_at timestamptz`;
    await sql`ALTER TABLE portal_invoices ADD COLUMN IF NOT EXISTS notification_attempted_at timestamptz`;
    await sql`ALTER TABLE portal_deliverables ADD COLUMN IF NOT EXISTS notification_email_id text`;
    await sql`ALTER TABLE portal_invoices ADD COLUMN IF NOT EXISTS notification_email_id text`;
    await sql`ALTER TABLE portal_invoices ADD COLUMN IF NOT EXISTS milestone_number integer DEFAULT 1 CHECK (milestone_number BETWEEN 1 AND 3)`;
    await sql`ALTER TABLE portal_invoices ADD COLUMN IF NOT EXISTS stripe_invoice_id text`;
    await sql`ALTER TABLE portal_invoices ADD COLUMN IF NOT EXISTS chase_closed_at timestamptz`;
    await sql`UPDATE portal_invoices i SET stripe_invoice_id = p.stripe_invoice_id
      FROM portal_documents d JOIN portal_projects p ON p.id = d.project_id
      WHERE d.id = i.document_id AND i.stripe_invoice_id IS NULL AND p.stripe_invoice_id IS NOT NULL
      AND i.document_id = (SELECT d2.id FROM portal_documents d2 JOIN portal_invoices i2 ON i2.document_id = d2.id
        WHERE d2.project_id = p.id AND i2.status = 'issued' ORDER BY d2.created_at DESC, d2.id DESC LIMIT 1)`;
  })();
  try { await lifecycleReady; } catch (error) { lifecycleReady = undefined; throw error; }
}

export function newToken() { return randomBytes(32).toString("base64url"); }
export function tokenHash(token: string) { return createHash("sha256").update(token).digest("hex"); }
export function validToken(token: unknown): token is string {
  return typeof token === "string" && /^[A-Za-z0-9_-]{43}$/.test(token);
}

export type PortalClient = { id: string; email: string; first_name: string; role: "client" | "studio" };
export type PortalProject = { id: string; client_id: string; title: string; summary: string; stage: string; agreement_url: string | null; stripe_invoice_id: string | null; payment_instructions: string; client_business: string; investment_cents: number | null; milestone_1_cents: number | null; milestone_2_cents: number | null; milestone_3_cents: number | null; invited_at: Date | null; archived_at: Date | null };
export type PortalDeliverable = { id: string; project_id: string; version: number; title: string; file_name: string; status: string; shared_at: Date | null; created_at: Date };
export type PortalDocument = { id: string; project_id: string; kind: "agreement" | "invoice"; title: string; file_name: string; blob_url: string; sha256: string; created_at: Date; studio_signed_at: Date | null; client_signed_at: Date | null };
export type PortalInvoice = { document_id: string; invoice_number: string; amount_cents: number; due_on: string | null; payment_url: string | null; zelle_id: string; check_address: string; status: "issued" | "paid" | "void"; paid_at: Date | null; shared_at: Date | null; milestone_number: number; stripe_invoice_id: string | null; chase_closed_at: Date | null };

export async function currentPortalClient(): Promise<PortalClient | null> {
  if (!portalEnabled()) return null;
  const token = (await cookies()).get(PORTAL_COOKIE)?.value;
  if (!validToken(token)) return null;
  await ensurePortalLifecycle();
  const sql = portalDb();
  const rows = await sql`SELECT c.id, c.email, c.first_name, c.role FROM portal_sessions s
    JOIN portal_clients c ON c.id = s.client_id
    WHERE s.token_hash = ${tokenHash(token)} AND s.expires_at > now() LIMIT 1`;
  return (rows[0] as PortalClient | undefined) ?? null;
}

export function isPortalStudio(client: PortalClient | null): boolean {
  return !!client && client.role === "studio" && client.email === process.env.PORTAL_STUDIO_EMAIL?.trim().toLowerCase();
}

export async function portalProjects(clientId: string): Promise<PortalProject[]> {
  await ensurePortalLifecycle();
  const rows = await portalDb()`SELECT id, client_id, title, summary, stage, agreement_url, stripe_invoice_id, payment_instructions, client_business, investment_cents, milestone_1_cents, milestone_2_cents, milestone_3_cents, invited_at, archived_at
    FROM portal_projects WHERE client_id = ${clientId} AND invited_at IS NOT NULL AND archived_at IS NULL ORDER BY created_at DESC`;
  return rows as PortalProject[];
}

export async function portalProject(clientId: string, projectId: string): Promise<PortalProject | null> {
  await ensurePortalLifecycle();
  const rows = await portalDb()`SELECT id, client_id, title, summary, stage, agreement_url, stripe_invoice_id, payment_instructions, client_business, investment_cents, milestone_1_cents, milestone_2_cents, milestone_3_cents, invited_at, archived_at
    FROM portal_projects WHERE client_id = ${clientId} AND id = ${projectId} LIMIT 1`;
  return (rows[0] as PortalProject | undefined) ?? null;
}

export async function portalDeliverables(projectId: string): Promise<PortalDeliverable[]> {
  await ensurePortalLifecycle();
  const rows = await portalDb()`SELECT id, project_id, version, title, file_name, status, shared_at, created_at
    FROM portal_deliverables WHERE project_id = ${projectId} ORDER BY version DESC`;
  return rows as PortalDeliverable[];
}

export async function portalDocuments(projectId: string): Promise<PortalDocument[]> {
  const rows = await portalDb()`SELECT d.id, d.project_id, d.kind, d.title, d.file_name, d.blob_url, d.sha256, d.created_at,
    ss.signed_at AS studio_signed_at, cs.signed_at AS client_signed_at
    FROM portal_documents d
    LEFT JOIN portal_agreement_signatures ss ON ss.document_id = d.id AND ss.signer_role = 'studio'
    LEFT JOIN portal_agreement_signatures cs ON cs.document_id = d.id AND cs.signer_role = 'client'
    WHERE d.project_id = ${projectId} ORDER BY d.created_at DESC, d.id DESC`;
  return rows as PortalDocument[];
}

export async function portalInvoices(projectId: string): Promise<PortalInvoice[]> {
  await ensurePortalLifecycle();
  const rows = await portalDb()`SELECT i.*, i.due_on::text AS due_on FROM portal_invoices i JOIN portal_documents d ON d.id = i.document_id
    WHERE d.project_id = ${projectId} ORDER BY d.created_at DESC, d.id DESC`;
  return rows as PortalInvoice[];
}
