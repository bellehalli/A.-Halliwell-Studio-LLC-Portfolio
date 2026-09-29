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

export function newToken() { return randomBytes(32).toString("base64url"); }
export function tokenHash(token: string) { return createHash("sha256").update(token).digest("hex"); }
export function validToken(token: unknown): token is string {
  return typeof token === "string" && /^[A-Za-z0-9_-]{43}$/.test(token);
}

export type PortalClient = { id: string; email: string; first_name: string; role: "client" | "studio" };
export type PortalProject = { id: string; client_id: string; title: string; summary: string; stage: string; agreement_url: string | null; stripe_invoice_id: string | null; payment_instructions: string; client_business: string; investment_cents: number | null };
export type PortalDeliverable = { id: string; project_id: string; version: number; title: string; file_name: string; status: string; created_at: Date };
export type PortalDocument = { id: string; project_id: string; kind: "agreement" | "invoice"; title: string; file_name: string; blob_url: string; sha256: string; created_at: Date; studio_signed_at: Date | null; client_signed_at: Date | null };
export type PortalInvoice = { document_id: string; invoice_number: string; amount_cents: number; due_on: string | null; payment_url: string | null; zelle_id: string; check_address: string; status: "issued" | "paid" | "void"; paid_at: Date | null };

export async function currentPortalClient(): Promise<PortalClient | null> {
  if (!portalEnabled()) return null;
  const token = (await cookies()).get(PORTAL_COOKIE)?.value;
  if (!validToken(token)) return null;
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
  const rows = await portalDb()`SELECT id, client_id, title, summary, stage, agreement_url, stripe_invoice_id, payment_instructions, client_business, investment_cents
    FROM portal_projects WHERE client_id = ${clientId} ORDER BY created_at DESC`;
  return rows as PortalProject[];
}

export async function portalProject(clientId: string, projectId: string): Promise<PortalProject | null> {
  const rows = await portalDb()`SELECT id, client_id, title, summary, stage, agreement_url, stripe_invoice_id, payment_instructions, client_business, investment_cents
    FROM portal_projects WHERE client_id = ${clientId} AND id = ${projectId} LIMIT 1`;
  return (rows[0] as PortalProject | undefined) ?? null;
}

export async function portalDeliverables(projectId: string): Promise<PortalDeliverable[]> {
  const rows = await portalDb()`SELECT id, project_id, version, title, file_name, status, created_at
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
  const rows = await portalDb()`SELECT i.*, i.due_on::text AS due_on FROM portal_invoices i JOIN portal_documents d ON d.id = i.document_id
    WHERE d.project_id = ${projectId} ORDER BY d.created_at DESC, d.id DESC`;
  return rows as PortalInvoice[];
}
