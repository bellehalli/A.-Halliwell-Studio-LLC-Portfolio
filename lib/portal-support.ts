import "server-only";
import { portalDb } from "./portal";
import { ensureLeads } from "./leads";
let ready: Promise<unknown> | undefined;
export async function ensurePortalSupport() {
  ready ??= (async () => {
    await ensureLeads();
    await portalDb()`CREATE TABLE IF NOT EXISTS portal_support_requests (
      id text PRIMARY KEY, project_id text NOT NULL REFERENCES portal_projects(id) ON DELETE CASCADE,
      client_id text NOT NULL REFERENCES portal_clients(id), lead_id text NOT NULL REFERENCES studio_leads(id),
      message text NOT NULL, timing text NOT NULL DEFAULT '', created_at timestamptz NOT NULL DEFAULT now()
    )`;
  })();
  try { await ready; } catch (error) { ready = undefined; throw error; }
}
