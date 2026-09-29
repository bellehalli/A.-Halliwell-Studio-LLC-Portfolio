import { get } from "@vercel/blob";
import { NextResponse } from "next/server";
import { currentPortalClient, ensurePortalLifecycle, isPortalStudio, portalDb, portalEnabled } from "@/lib/portal";

export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store" };

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!portalEnabled()) return NextResponse.json({ ok: false }, { status: 404, headers });
  const client = await currentPortalClient();
  if (!client) return NextResponse.json({ ok: false }, { status: 401, headers });
  const { id } = await params;
  if (!/^[a-f0-9-]{36}$/.test(id)) return NextResponse.json({ ok: false }, { status: 404, headers });
  await ensurePortalLifecycle();
  const rows = await portalDb()`SELECT d.blob_url, d.file_name FROM portal_deliverables d
    JOIN portal_projects p ON p.id = d.project_id WHERE d.id = ${id} AND ((${isPortalStudio(client)}) OR (p.client_id = ${client.id} AND p.invited_at IS NOT NULL AND d.shared_at IS NOT NULL)) LIMIT 1`;
  if (!rows.length) return NextResponse.json({ ok: false }, { status: 404, headers });
  try {
    const blob = await get(String(rows[0].blob_url), { access: "private" });
    if (!blob || blob.statusCode !== 200) return NextResponse.json({ ok: false }, { status: 404, headers });
    const filename = String(rows[0].file_name).replace(/[^a-zA-Z0-9._-]/g, "_");
    const type = /\.pdf$/i.test(filename) ? "application/pdf" : /\.png$/i.test(filename) ? "image/png" : /\.jpe?g$/i.test(filename) ? "image/jpeg" : /\.webp$/i.test(filename) ? "image/webp" : "application/octet-stream";
    return new Response(blob.stream, { headers: { ...headers, "Content-Type": type, "Content-Disposition": `inline; filename="${filename}"`, "X-Content-Type-Options": "nosniff" } });
  } catch { return NextResponse.json({ ok: false }, { status: 502, headers }); }
}
