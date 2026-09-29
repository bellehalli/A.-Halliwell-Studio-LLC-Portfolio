import { randomUUID } from "node:crypto";
import { put, del } from "@vercel/blob";
import { NextResponse } from "next/server";
import { currentPortalClient, ensurePortalLifecycle, isPortalStudio, portalDb, portalEnabled } from "@/lib/portal";

export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store" };
const fail = (status: number, message: string) => NextResponse.json({ ok: false, message }, { status, headers });
const allowed = new Set(["application/pdf", "image/png", "image/jpeg", "image/webp"]);

export async function POST(request: Request) {
  if (!portalEnabled() || !process.env.BLOB_READ_WRITE_TOKEN) return fail(503, "Private file storage is not configured.");
  if (request.headers.get("origin") !== new URL(request.url).origin) return fail(403, "Forbidden.");
  if (!isPortalStudio(await currentPortalClient())) return fail(403, "Forbidden.");
  const length = Number(request.headers.get("content-length") || 0);
  if (length > 12_000_000) return fail(413, "File is too large.");
  try {
    const form = await request.formData();
    const projectId = String(form.get("projectId") || "");
    const title = String(form.get("title") || "").trim().slice(0, 150);
    const file = form.get("file");
    if (!/^[a-f0-9-]{36}$/.test(projectId) || !title || !(file instanceof File) || file.size > 10_000_000 || !allowed.has(file.type)) return fail(400, "Choose a PDF or image under 10 MB with a title.");
    await ensurePortalLifecycle();
    const sql = portalDb();
    const projects = await sql`SELECT p.title, c.email, c.first_name FROM portal_projects p JOIN portal_clients c ON c.id = p.client_id WHERE p.id = ${projectId} LIMIT 1`;
    if (!projects.length) return fail(404, "Project not found.");
    const rows = await sql`SELECT coalesce(max(version),0)::int + 1 AS version FROM portal_deliverables WHERE project_id = ${projectId}`;
    const version = Number(rows[0].version);
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
    const blob = await put(`portal/${projectId}/${randomUUID()}-${safeName}`, file, { access: "private", contentType: file.type, addRandomSuffix: false });
    try {
      await sql`INSERT INTO portal_deliverables(id, project_id, version, title, file_name, blob_url, shared_at)
        VALUES (${randomUUID()}, ${projectId}, ${version}, ${title}, ${safeName}, ${blob.url}, NULL)`;
    } catch (error) { await del(blob.url); throw error; }
    return NextResponse.json({ ok: true, version, notified: false }, { headers });
  } catch { return fail(500, "The review file could not be published."); }
}
