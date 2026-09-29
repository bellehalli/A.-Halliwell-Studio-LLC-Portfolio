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
  const rows = await portalDb()`SELECT d.file_name, d.kind, d.project_id,
    coalesce(cs.signed_pdf_url, ss.signed_pdf_url, d.blob_url) AS display_url
    FROM portal_documents d JOIN portal_projects p ON p.id = d.project_id
    LEFT JOIN portal_agreement_signatures ss ON ss.document_id = d.id AND ss.signer_role = 'studio'
    LEFT JOIN portal_agreement_signatures cs ON cs.document_id = d.id AND cs.signer_role = 'client'
    WHERE d.id = ${id} AND (p.client_id = ${client.id} OR ${isPortalStudio(client)}) LIMIT 1`;
  if (!rows.length) return NextResponse.json({ ok: false }, { status: 404, headers });
  if (rows[0].kind === "invoice" && !isPortalStudio(client)) {
    const agreements = await portalDb()`SELECT cs.id FROM portal_documents d
      JOIN portal_agreement_signatures cs ON cs.document_id = d.id AND cs.signer_role = 'client'
      WHERE d.project_id = ${rows[0].project_id} AND d.kind = 'agreement'
        AND d.id = (SELECT id FROM portal_documents WHERE project_id = d.project_id AND kind = 'agreement' ORDER BY created_at DESC, id DESC LIMIT 1)
      LIMIT 1`;
    if (!agreements.length) return NextResponse.json({ ok: false }, { status: 403, headers });
  }
  try {
    const blob = await get(String(rows[0].display_url), { access: "private" });
    if (!blob || blob.statusCode !== 200) return NextResponse.json({ ok: false }, { status: 404, headers });
    const filename = String(rows[0].file_name).replace(/[^a-zA-Z0-9._-]/g, "_");
    return new Response(blob.stream, { headers: { ...headers, "Content-Type": "application/pdf", "Content-Disposition": `inline; filename="${filename}"` } });
  } catch { return NextResponse.json({ ok: false }, { status: 502, headers }); }
}
