import { get } from "@vercel/blob";
import { NextResponse } from "next/server";
import { currentPortalClient, ensurePortalLifecycle, isPortalStudio, portalDb, portalEnabled } from "@/lib/portal";

export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" };

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const url = new URL(request.url);
  if (request.headers.get("accept")?.includes("text/html") && url.searchParams.get("download") !== "1") {
    const { id } = await params;
    if (!/^[a-f0-9-]{36}$/.test(id)) return NextResponse.json({ ok: false }, { status: 404, headers });
    const query = new URLSearchParams();
    for (const key of ["version", "original"]) { const value = url.searchParams.get(key); if (value) query.set(key, value); }
    return NextResponse.redirect(new URL(`/portal/documents/${id}${query.size ? `?${query}` : ""}`, request.url));
  }
  if (!portalEnabled()) return NextResponse.json({ ok: false }, { status: 404, headers });
  const client = await currentPortalClient();
  if (!client) return NextResponse.json({ ok: false }, { status: 401, headers });
  const { id } = await params;
  if (!/^[a-f0-9-]{36}$/.test(id)) return NextResponse.json({ ok: false }, { status: 404, headers });
  await ensurePortalLifecycle();
  const rows = await portalDb()`SELECT d.file_name, d.kind, d.project_id,
    CASE WHEN ${isPortalStudio(client) && new URL(request.url).searchParams.get('original') === '1'} THEN d.blob_url ELSE coalesce(d.aligned_pdf_url, cs.signed_pdf_url, ss.signed_pdf_url, d.blob_url) END AS display_url
    FROM portal_documents d JOIN portal_projects p ON p.id = d.project_id
    LEFT JOIN portal_agreement_signatures ss ON ss.document_id = d.id AND ss.signer_role = 'studio'
    LEFT JOIN portal_agreement_signatures cs ON cs.document_id = d.id AND cs.signer_role = 'client'
    WHERE d.id = ${id} AND (d.removed_at IS NULL OR ${isPortalStudio(client)}) AND (p.client_id = ${client.id} AND p.invited_at IS NOT NULL AND p.archived_at IS NULL OR ${isPortalStudio(client)}) LIMIT 1`;
  if (!rows.length) return NextResponse.json({ ok: false }, { status: 404, headers });
  if (rows[0].kind === "invoice" && !isPortalStudio(client)) {
    const shared = await portalDb()`SELECT 1 FROM portal_invoices WHERE document_id = ${id} AND shared_at IS NOT NULL LIMIT 1`;
    if (!shared.length) return NextResponse.json({ ok: false }, { status: 403, headers });
    const samples = await portalDb()`SELECT 1 FROM portal_invoices i JOIN portal_projects p ON p.id = ${rows[0].project_id}
      WHERE i.document_id = ${id} AND i.status = 'void' AND i.invoice_number LIKE 'TEST-%' AND p.title LIKE 'TEST%' LIMIT 1`;
    const agreements = await portalDb()`SELECT cs.id FROM portal_documents d
      JOIN portal_agreement_signatures cs ON cs.document_id = d.id AND cs.signer_role = 'client'
      WHERE d.project_id = ${rows[0].project_id} AND d.kind = 'agreement'
        AND d.id = (SELECT id FROM portal_documents WHERE project_id = d.project_id AND kind = 'agreement' AND removed_at IS NULL ORDER BY created_at DESC, id DESC LIMIT 1)
      LIMIT 1`;
    if (!agreements.length && !samples.length) return NextResponse.json({ ok: false }, { status: 403, headers });
  }
  const versionId = new URL(request.url).searchParams.get("version");
  if (versionId) {
    if (!isPortalStudio(client) || !/^[a-f0-9-]{36}$/.test(versionId)) return NextResponse.json({ ok: false }, { status: 403, headers });
    const versions = await portalDb()`SELECT file_name, blob_url FROM portal_document_file_versions WHERE id = ${versionId} AND document_id = ${id} LIMIT 1`;
    if (!versions.length) return NextResponse.json({ ok: false }, { status: 404, headers });
    rows[0].display_url = versions[0].blob_url;
    rows[0].file_name = versions[0].file_name;
  }
  try {
    const blob = await get(String(rows[0].display_url), { access: "private" });
    if (!blob || blob.statusCode !== 200) return NextResponse.json({ ok: false }, { status: 404, headers });
    const filename = String(rows[0].file_name).replace(/[^a-zA-Z0-9._-]/g, "_");
    const bytes = new Uint8Array(await new Response(blob.stream).arrayBuffer());
    const download = url.searchParams.get("download") === "1";
    return new Response(bytes, { headers: { ...headers, "Content-Type": "application/pdf", "Content-Length": String(bytes.length), "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${filename}"` } });
  } catch { return NextResponse.json({ ok: false }, { status: 502, headers }); }
}
