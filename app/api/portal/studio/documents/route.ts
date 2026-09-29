import { createHash, randomUUID } from "node:crypto";
import { del, put } from "@vercel/blob";
import { PDFDocument } from "pdf-lib";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { currentPortalClient, isPortalStudio, portalDb, portalEnabled } from "@/lib/portal";

export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store" };
const fail = (status: number, message: string) => NextResponse.json({ ok: false, message }, { status, headers });

export async function POST(request: Request) {
  if (!portalEnabled() || !process.env.BLOB_READ_WRITE_TOKEN) return fail(503, "Private file storage is not configured.");
  if (request.headers.get("origin") !== new URL(request.url).origin) return fail(403, "Forbidden.");
  if (!isPortalStudio(await currentPortalClient())) return fail(403, "Forbidden.");
  if (Number(request.headers.get("content-length") || 0) > 12_000_000) return fail(413, "PDF is too large.");
  try {
    const form = await request.formData();
    const projectId = String(form.get("projectId") || "");
    const kind = String(form.get("kind") || "");
    const title = String(form.get("title") || "").trim();
    const file = form.get("file");
    if (!/^[a-f0-9-]{36}$/.test(projectId) || !["agreement", "invoice"].includes(kind) || !title || title.length > 150 || !(file instanceof File) || file.size > 10_000_000 || file.size < 100 || file.type !== "application/pdf") return fail(400, "Choose a titled PDF under 10 MB.");
    const bytes = new Uint8Array(await file.arrayBuffer());
    try { await PDFDocument.load(bytes); } catch { return fail(400, "The PDF could not be read. Export an unencrypted PDF."); }
    const sql = portalDb();
    const project = await sql`SELECT p.id, c.email, c.first_name FROM portal_projects p JOIN portal_clients c ON c.id = p.client_id WHERE p.id = ${projectId} LIMIT 1`;
    if (!project.length) return fail(404, "Project not found.");

    let invoiceNumber = "", amountCents = 0, dueOn: string | null = null;
    let paymentUrl: string | null = null, zelleId = "", checkAddress = "";
    if (kind === "invoice") {
      invoiceNumber = String(form.get("invoiceNumber") || "").trim();
      const amount = String(form.get("amount") || "").trim();
      const due = String(form.get("dueOn") || "").trim();
      zelleId = String(form.get("zelleId") || "").trim();
      checkAddress = String(form.get("checkAddress") || "").trim();
      const rawUrl = String(form.get("paymentUrl") || "").trim();
      if (!invoiceNumber || invoiceNumber.length > 80 || !/^\d{1,7}(\.\d{1,2})?$/.test(amount) || zelleId.length > 254 || checkAddress.length > 500 || (due && !/^\d{4}-\d{2}-\d{2}$/.test(due)) || (rawUrl && !rawUrl.startsWith("https://"))) return fail(400, "Check invoice number, amount, due date, and payment details.");
      const [dollars, cents = ""] = amount.split(".");
      amountCents = Number(dollars) * 100 + Number(cents.padEnd(2, "0"));
      const parsedDue = due ? new Date(`${due}T12:00:00Z`) : null;
      if (amountCents < 1 || (parsedDue && (Number.isNaN(parsedDue.getTime()) || parsedDue.toISOString().slice(0, 10) !== due))) return fail(400, "Check the amount and due date.");
      dueOn = due || null;
      paymentUrl = rawUrl || null;
    }
    const id = randomUUID();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
    const digest = createHash("sha256").update(bytes).digest("hex");
    const blob = await put(`portal/${projectId}/documents/${id}-${safeName}`, Buffer.from(bytes), { access: "private", contentType: "application/pdf", addRandomSuffix: false });
    try {
      await sql`INSERT INTO portal_documents(id, project_id, kind, title, file_name, blob_url, sha256)
        VALUES (${id}, ${projectId}, ${kind}, ${title}, ${safeName}, ${blob.url}, ${digest})`;
      if (kind === "invoice") await sql`INSERT INTO portal_invoices(document_id, invoice_number, amount_cents, due_on, payment_url, zelle_id, check_address)
        VALUES (${id}, ${invoiceNumber}, ${amountCents}, ${dueOn}, ${paymentUrl}, ${zelleId}, ${checkAddress})`;
    } catch (error) {
      await sql`DELETE FROM portal_documents WHERE id = ${id}`.catch(() => {});
      await del(blob.url).catch(() => {});
      throw error;
    }
    let notified = false;
    if (kind === "invoice") {
      const signed = await sql`SELECT 1 FROM portal_documents d JOIN portal_agreement_signatures s ON s.document_id = d.id AND s.signer_role = 'client'
        WHERE d.project_id = ${projectId} AND d.kind = 'agreement'
          AND d.id = (SELECT id FROM portal_documents WHERE project_id = d.project_id AND kind = 'agreement' ORDER BY created_at DESC, id DESC LIMIT 1) LIMIT 1`;
      if (signed.length) {
        try {
          const result = await new Resend(process.env.RESEND_API_KEY).emails.send({
            from: process.env.INQUIRY_FROM_EMAIL || "A. Halliwell Studio <onboarding@resend.dev>", to: [String(project[0].email)],
            subject: `Your project invoice ${invoiceNumber} is ready`,
            text: `Hi ${project[0].first_name},\n\nYour issued invoice is available in your private project workspace: https://www.ahalliwellstudio.com/portal\n\nPlease review the original Chase invoice PDF and its payment details there.\n\nArabella`,
          }, { idempotencyKey: `portal-invoice/${id}` });
          notified = !result.error;
        } catch { /* The invoice remains available if the email service fails. */ }
      }
    }
    return NextResponse.json({ ok: true, id, notified }, { headers });
  } catch { return fail(500, "The document could not be published."); }
}
