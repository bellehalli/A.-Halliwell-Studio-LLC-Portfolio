import { randomUUID } from "node:crypto";
import { del, put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { currentPortalClient, ensurePortalLifecycle, isPortalStudio, portalDb } from "@/lib/portal";
import { validSignatureLayout } from "@/lib/portal-signature-layout";
import { alignedSignedCopy, pdfHash, privatePdf } from "@/lib/portal-signed-copy";
const headers = { "Cache-Control": "private, no-store" };
const fail = (status: number, message: string) => NextResponse.json({ ok: false, message }, { status, headers });
export const runtime = "nodejs";
export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin || !isPortalStudio(await currentPortalClient())) return fail(403, "Forbidden.");
  try {
    const raw = await request.text();
    if (raw.length > 6000) return fail(413, "Request too large.");
    const { documentId, layout, emailCopy } = JSON.parse(raw);
    if (!/^[a-f0-9-]{36}$/.test(documentId) || !validSignatureLayout(layout)) return fail(400, "Place all four signature and date fields.");
    await ensurePortalLifecycle();
    const sql = portalDb();
    const docs = await sql`SELECT id, project_id, blob_url, sha256, title FROM portal_documents WHERE id = ${documentId} AND kind = 'agreement' LIMIT 1`;
    if (!docs.length) return fail(404, "Agreement not found.");
    const doc = docs[0];
    const rows = await sql`SELECT signer_role, signed_pdf_url, signed_pdf_sha256, signed_at FROM portal_agreement_signatures WHERE document_id = ${documentId} ORDER BY signed_at`;
    const records = await Promise.all(rows.map(async row => ({ role: row.signer_role as "studio" | "client", signedAt: new Date(String(row.signed_at)).toISOString(), bytes: await privatePdf(String(row.signed_pdf_url), String(row.signed_pdf_sha256)) })));
    const bytes = await alignedSignedCopy(await privatePdf(String(doc.blob_url), String(doc.sha256)), layout, records);
    const blob = await put(`portal/${doc.project_id}/signed/${documentId}-aligned-${randomUUID()}.pdf`, Buffer.from(bytes), { access: "private", contentType: "application/pdf", addRandomSuffix: false });
    const updated = await sql`UPDATE portal_documents SET signature_layout = ${JSON.stringify(layout)}::jsonb, aligned_pdf_url = ${blob.url}, aligned_pdf_sha256 = ${pdfHash(bytes)} WHERE id = ${documentId}
      AND (SELECT count(*) FROM portal_agreement_signatures WHERE document_id = ${documentId}) = ${records.length} RETURNING id`;
    if (!updated.length) { await del(blob.url); return fail(409, "A signature was recorded while you saved. Reload the agreement and save placement again."); }
    let emailed = false;
    if (emailCopy === true) {
      if (records.length !== 2) return NextResponse.json({ ok: true, emailed: false, message: "Placement saved. The completed copy can be emailed after both parties sign." }, { headers });
      if (!process.env.PORTAL_STUDIO_EMAIL) return fail(503, "Placement saved, but the studio email is not configured.");
      const result = await new Resend(process.env.RESEND_API_KEY).emails.send({
        from: process.env.INQUIRY_FROM_EMAIL || "A. Halliwell Studio <onboarding@resend.dev>", to: [process.env.PORTAL_STUDIO_EMAIL],
        subject: "Your completed signed agreement",
        text: `Both signatures and signing dates appear on the agreement lines. The attached PDF includes each party's timestamped electronic signature record.\n\n${doc.title}\n\nKeep this copy with your project records.`,
        attachments: [{ filename: "completed-signed-agreement.pdf", content: Buffer.from(bytes) }],
      });
      emailed = !result.error && !!result.data?.id;
      if (emailed) await sql`UPDATE portal_documents SET completed_email_id = ${result.data!.id} WHERE id = ${documentId}`;
    }
    return NextResponse.json({ ok: true, emailed, message: emailCopy ? emailed ? "Completed signed PDF emailed to the studio." : "Placement saved. Email failed; try Email completed copy again." : "Placement saved. Open the signed copy below to check alignment." }, { headers });
  } catch (error) { return fail(500, error instanceof Error && /field|placement|integrity/.test(error.message) ? error.message : "The signature placement could not be saved. Try again."); }
}
