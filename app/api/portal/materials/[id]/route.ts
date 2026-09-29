import { get } from "@vercel/blob";
import { NextResponse } from "next/server";
import { currentPortalClient, isPortalStudio, portalDb, portalEnabled } from "@/lib/portal";

export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" };

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!portalEnabled()) return NextResponse.json({ ok: false }, { status: 404, headers });
  const client = await currentPortalClient();
  if (!client) return NextResponse.json({ ok: false }, { status: 401, headers });
  const { id } = await params;
  if (!/^[a-f0-9-]{36}$/.test(id)) return NextResponse.json({ ok: false }, { status: 404, headers });
  const rows = await portalDb()`SELECT m.blob_url, m.file_name, m.content_type FROM portal_materials m
    JOIN portal_projects p ON p.id = m.project_id WHERE m.id = ${id} AND (p.client_id = ${client.id} OR ${isPortalStudio(client)}) LIMIT 1`;
  if (!rows.length) return NextResponse.json({ ok: false }, { status: 404, headers });
  try {
    const blob = await get(String(rows[0].blob_url), { access: "private" });
    if (!blob || blob.statusCode !== 200) return NextResponse.json({ ok: false }, { status: 404, headers });
    const filename = String(rows[0].file_name).replace(/[^a-zA-Z0-9._-]/g, "_");
    return new Response(blob.stream, { headers: { ...headers, "Content-Type": String(rows[0].content_type), "Content-Disposition": `attachment; filename="${filename}"` } });
  } catch { return NextResponse.json({ ok: false }, { status: 502, headers }); }
}
