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

export function newToken() { return randomBytes(32).toString("base64url"); }
export function tokenHash(token: string) { return createHash("sha256").update(token).digest("hex"); }
export function validToken(token: unknown): token is string {
  return typeof token === "string" && /^[A-Za-z0-9_-]{43}$/.test(token);
}

export type PortalClient = { id: string; email: string; first_name: string; role: "client" | "studio" };
export type PortalProject = { id: string; client_id: string; title: string; summary: string; stage: string; agreement_url: string | null; stripe_invoice_id: string | null; payment_instructions: string };
export type PortalDeliverable = { id: string; project_id: string; version: number; title: string; file_name: string; status: string; created_at: Date };

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

export function isPortalStudio(client: PortalClient | null): client is PortalClient {
  return !!client && client.role === "studio" && client.email === process.env.PORTAL_STUDIO_EMAIL?.trim().toLowerCase();
}

export async function portalProjects(clientId: string): Promise<PortalProject[]> {
  const rows = await portalDb()`SELECT id, client_id, title, summary, stage, agreement_url, stripe_invoice_id, payment_instructions
    FROM portal_projects WHERE client_id = ${clientId} ORDER BY created_at DESC`;
  return rows as PortalProject[];
}

export async function portalProject(clientId: string, projectId: string): Promise<PortalProject | null> {
  const rows = await portalDb()`SELECT id, client_id, title, summary, stage, agreement_url, stripe_invoice_id, payment_instructions
    FROM portal_projects WHERE client_id = ${clientId} AND id = ${projectId} LIMIT 1`;
  return (rows[0] as PortalProject | undefined) ?? null;
}

export async function portalDeliverables(projectId: string): Promise<PortalDeliverable[]> {
  const rows = await portalDb()`SELECT id, project_id, version, title, file_name, status, created_at
    FROM portal_deliverables WHERE project_id = ${projectId} ORDER BY version DESC`;
  return rows as PortalDeliverable[];
}
