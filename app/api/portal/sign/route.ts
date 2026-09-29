import { createHash, randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { del, get, put } from "@vercel/blob";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { currentPortalClient, isPortalStudio, portalDb, portalEnabled } from "@/lib/portal";

export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store" };
const fail = (status: number, message: string) => NextResponse.json({ ok: false, message }, { status, headers });
export const consentText = "I agree to use electronic records and signatures for this agreement. By typing my legal name and selecting Sign agreement, I intend to sign the agreement displayed above.";
const hash = (bytes: Uint8Array) => createHash("sha256").update(bytes).digest("hex");
const display = (value: string) => value.replace(/[\p{Cc}\p{Cf}]/gu, " ").slice(0, 68);

export async function POST(request: Request) {
  if (!portalEnabled() || !process.env.BLOB_READ_WRITE_TOKEN) return fail(503, "Signing is not configured.");
  if (request.headers.get("origin") !== new URL(request.url).origin) return fail(403, "Forbidden.");
  const signer = await currentPortalClient();
  if (!signer) return fail(401, "Sign in again to continue.");
  try {
    const raw = await request.text();
    if (raw.length > 2_000) return fail(413, "Request too large.");
    const data = JSON.parse(raw);
    const id = String(data.documentId || "");
    const typedName = String(data.typedName || "").trim();
    const businessName = String(data.businessName || "").trim();
    if (!/^[a-f0-9-]{36}$/.test(id) || typedName.length < 3 || typedName.length > 120 || businessName.length > 150 || data.reviewed !== true || data.consent !== true) return fail(400, "Review the agreement, enter your legal name, and consent to electronic signing.");
    const sql = portalDb();
    const docs = await sql`SELECT d.id, d.project_id, d.blob_url, d.sha256, p.client_id, c.email AS client_email,
      ss.signed_pdf_url AS studio_pdf_url, ss.signed_pdf_sha256 AS studio_pdf_hash,
      ss.signed_at AS studio_signed_at, cs.signed_at AS client_signed_at
      FROM portal_documents d JOIN portal_projects p ON p.id = d.project_id
      JOIN portal_clients c ON c.id = p.client_id
      LEFT JOIN portal_agreement_signatures ss ON ss.document_id = d.id AND ss.signer_role = 'studio'
      LEFT JOIN portal_agreement_signatures cs ON cs.document_id = d.id AND cs.signer_role = 'client'
      WHERE d.id = ${id} AND d.kind = 'agreement'
        AND d.id = (SELECT id FROM portal_documents WHERE project_id = d.project_id AND kind = 'agreement' ORDER BY created_at DESC, id DESC LIMIT 1)
      LIMIT 1`;
    if (!docs.length) return fail(404, "Agreement not found.");
    const doc = docs[0];
    const role = isPortalStudio(signer) ? "studio" : "client";
    if (role === "client" && doc.client_id !== signer.id) return fail(403, "Forbidden.");
    if ((role === "studio" && doc.studio_signed_at) || (role === "client" && (doc.client_signed_at || !doc.studio_signed_at))) return fail(409, "This agreement is not ready for your signature.");
    if (role === "client" && !businessName) return fail(400, "Enter the business you are authorized to sign for.");
    const sourceUrl = role === "studio" ? String(doc.blob_url) : String(doc.studio_pdf_url);
    const sourceHash = role === "studio" ? String(doc.sha256) : String(doc.studio_pdf_hash);
    const blob = await get(sourceUrl, { access: "private" });
    if (!blob || blob.statusCode !== 200) return fail(502, "The agreement file is unavailable.");
    const bytes = new Uint8Array(await new Response(blob.stream).arrayBuffer());
    if (hash(bytes) !== sourceHash) return fail(409, "The agreement file did not pass its integrity check.");
    const pdf = await PDFDocument.load(bytes);
    pdf.registerFontkit(fontkit);
    const page = pdf.addPage([612, 792]);
    const font = await pdf.embedFont(await readFile(join(process.cwd(), "assets", "DejaVuSans.ttf")), { subset: true });
    const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
    const at = new Date();
    page.drawText("A. HALLIWELL STUDIO / ELECTRONIC SIGNATURE RECORD", { x: 46, y: 730, size: 13, font: bold, color: rgb(.34,.21,.32) });
    page.drawText("This page is attached to the agreement identified by its source SHA-256.", { x: 46, y: 693, size: 10, font });
    const lines = [
      `Signer: ${display(typedName)}`, `Role: ${role === "studio" ? "Studio" : "Client"}`,
      `Business: ${display(role === "studio" ? "A. Halliwell Studio, LLC" : businessName)}`,
      `Authenticated email: ${display(signer.email)}`, `Signed at: ${at.toISOString()}`,
      `Source SHA-256: ${sourceHash.slice(0,32)}`, `                        ${sourceHash.slice(32)}`,
      "Method: authenticated portal session + typed name + affirmative consent"
    ];
    lines.forEach((line, index) => page.drawText(line, { x: 46, y: 645 - index * 29, size: 10, font }));
    page.drawText("The original signed PDF and signature events are retained privately by the studio.", { x: 46, y: 355, size: 9, font });
    const signed = new Uint8Array(await pdf.save());
    const signatureId = randomUUID();
    const signedBlob = await put(`portal/${doc.project_id}/signed/${id}-${role}-${signatureId}.pdf`, Buffer.from(signed), { access: "private", contentType: "application/pdf", addRandomSuffix: false });
    const ip = (request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unavailable").split(",")[0].trim().slice(0, 100);
    const agent = (request.headers.get("user-agent") || "unavailable").slice(0, 500);
    try {
      const rows = await sql`INSERT INTO portal_agreement_signatures
        (id, document_id, signer_role, signer_id, signer_email, typed_name, business_name, consent_text, signed_at, ip_address, user_agent, source_sha256, signed_pdf_url, signed_pdf_sha256)
        SELECT ${signatureId}, ${id}, ${role}, ${signer.id}, ${signer.email}, ${typedName}, ${businessName}, ${consentText}, ${at.toISOString()}, ${ip}, ${agent}, ${sourceHash}, ${signedBlob.url}, ${hash(signed)}
        WHERE NOT EXISTS (SELECT 1 FROM portal_agreement_signatures WHERE document_id = ${id} AND signer_role = ${role})
          AND ${id} = (SELECT id FROM portal_documents WHERE project_id = ${doc.project_id} AND kind = 'agreement' ORDER BY created_at DESC, id DESC LIMIT 1)
          AND (${role} = 'studio' OR EXISTS (SELECT 1 FROM portal_agreement_signatures WHERE document_id = ${id} AND signer_role = 'studio'))
        RETURNING id`;
      if (!rows.length) { await del(signedBlob.url); return fail(409, "This signature was already recorded."); }
    } catch (error) { await del(signedBlob.url).catch(() => {}); throw error; }

    const issuedInvoices = role === "client" ? await sql`SELECT 1 FROM portal_invoices i JOIN portal_documents d ON d.id = i.document_id WHERE d.project_id = ${doc.project_id} AND i.status = 'issued' LIMIT 1` : [];
    const to = role === "client" ? [String(doc.client_email), process.env.PORTAL_STUDIO_EMAIL].filter((value): value is string => !!value) : [String(doc.client_email)];
    const subject = role === "client" ? "Your agreement is signed" : "Your agreement is ready to sign";
    let notified = false;
    try { const result = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: process.env.INQUIRY_FROM_EMAIL || "A. Halliwell Studio <onboarding@resend.dev>", to,
      subject,
      text: role === "client" ? `The agreement has both signatures. You can download the signed copy${issuedInvoices.length ? " and review your issued invoice" : ""} from your private project workspace: https://www.ahalliwellstudio.com/portal\n\nArabella` : `The studio has signed your project agreement. Please review and sign it in your private workspace: https://www.ahalliwellstudio.com/portal\n\nArabella`,
    }, { idempotencyKey: `portal-signature/${id}/${role}` }); notified = !result.error; }
    catch { /* The signature is recorded even if notification fails. */ }
    return NextResponse.json({ ok: true, notified }, { headers });
  } catch { return fail(500, "The signature could not be recorded. Please try again."); }
}
