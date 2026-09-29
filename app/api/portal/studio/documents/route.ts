import { createHash, randomUUID } from "node:crypto";
import { del, get, put } from "@vercel/blob";
import { PDFDocument } from "pdf-lib";
import { NextResponse } from "next/server";
import { currentPortalClient, ensurePortalPaymentOptions, ensurePortalProposals, ensurePortalLifecycle, isPortalStudio, portalDb, portalEnabled } from "@/lib/portal";
import { liveStripeStatus } from "@/lib/portal-payments";
import type { PortalInvoice } from "@/lib/portal";
import { projectMilestoneAmounts } from "@/lib/portal-plan";

export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store" };
const fail = (status: number, message: string) => NextResponse.json({ ok: false, message }, { status, headers });

export async function POST(request: Request) {
  if (!portalEnabled() || !process.env.BLOB_READ_WRITE_TOKEN) return fail(503, "Private file storage is not configured.");
  if (request.headers.get("origin") !== new URL(request.url).origin) return fail(403, "Forbidden.");
  if (!isPortalStudio(await currentPortalClient())) return fail(403, "Forbidden.");
  if (Number(request.headers.get("content-length") || 0) > 12_000_000) return fail(413, "This file is too large for the older upload path. Refresh the page and try again.");
  try {
    const direct = request.headers.get("content-type")?.includes("application/json");
    const form = direct ? null : await request.formData();
    const data = direct ? await request.json() : null;
    if (direct && data?.action === "shareInvoiceAttachment") {
      const attachmentId = String(data.attachmentId || "");
      if (!/^[a-f0-9-]{36}$/.test(attachmentId)) return fail(400, "Choose an invoice document.");
      await ensurePortalLifecycle();
      const updated = await portalDb()`UPDATE portal_invoice_attachments a SET shared_at = coalesce(a.shared_at, now())
        FROM portal_documents d JOIN portal_invoices i ON i.document_id = d.id JOIN portal_projects p ON p.id = d.project_id
        WHERE a.id = ${attachmentId} AND a.document_id = d.id AND d.removed_at IS NULL AND i.status != 'void' AND p.archived_at IS NULL RETURNING a.id`;
      if (!updated.length) return fail(409, "This invoice document cannot be shared.");
      return NextResponse.json({ ok: true, notified: false }, { headers });
    }
    const field = (name: string) => direct ? data?.[name] : form?.get(name);
    const projectId = String(field("projectId") || "");
    const kind = String(field("kind") || "");
    const title = String(field("title") || "").trim();
    const file = field("file");
    const blobUrl = String(field("blobUrl") || "");
    if (!/^[a-f0-9-]{36}$/.test(projectId) || !["proposal", "agreement", "invoice", "invoice_attachment"].includes(kind) || !title || title.length > 150) return fail(400, "Choose a project and document title.");
    let bytes: Uint8Array;
    let safeName: string;
    if (direct) {
      const result = blobUrl && await get(blobUrl, { access: "private", useCache: false });
      if (!result || result.statusCode !== 200 || result.blob.contentType !== "application/pdf" || result.blob.size < 100 || result.blob.size > 25_000_000 ||
        !new RegExp(`^portal/${projectId}/documents/[a-f0-9-]{36}-[A-Za-z0-9._-]{1,120}\\.pdf$`, "i").test(result.blob.pathname)) return fail(400, "The private PDF upload could not be verified. Try uploading again.");
      bytes = new Uint8Array(await new Response(result.stream).arrayBuffer());
      safeName = result.blob.pathname.split("/").at(-1)!.replace(/^[a-f0-9-]{37}/, "");
    } else {
      if (!(file instanceof File) || file.size > 10_000_000 || file.size < 100 || file.type !== "application/pdf") return fail(400, "Choose a PDF under 10 MB.");
      bytes = new Uint8Array(await file.arrayBuffer());
      safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
    }
    if (new TextDecoder().decode(bytes.subarray(0, 5)) !== "%PDF-") return fail(400, "This file is not a PDF. Export a PDF and try again.");
    if (kind === "agreement") {
      try { await PDFDocument.load(bytes); } catch { return fail(400, "The agreement PDF could not be read for signing. Export an unencrypted PDF."); }
    }
    await ensurePortalLifecycle();
    const sql = portalDb();
    const project = await sql`SELECT p.id, p.investment_cents, p.milestone_1_cents, p.milestone_2_cents, p.milestone_3_cents, c.email, c.first_name FROM portal_projects p JOIN portal_clients c ON c.id = p.client_id WHERE p.id = ${projectId} LIMIT 1`;
    if (!project.length) return fail(404, "Project not found.");

    if (kind === "invoice_attachment") {
      const parentId = String(field("documentId") || "");
      if (!/^[a-f0-9-]{36}$/.test(parentId)) return fail(400, "Choose the invoice this PDF belongs to.");
      const parent = await sql`SELECT 1 FROM portal_documents d JOIN portal_invoices i ON i.document_id = d.id
        WHERE d.id = ${parentId} AND d.project_id = ${projectId} AND d.removed_at IS NULL AND i.status != 'void' LIMIT 1`;
      if (!parent.length) return fail(404, "Invoice not found.");
      const attachmentId = randomUUID();
      const blob = direct ? { url: blobUrl } : await put(`portal/${projectId}/documents/${attachmentId}-${safeName}`, Buffer.from(bytes), { access: "private", contentType: "application/pdf", addRandomSuffix: false });
      await sql`INSERT INTO portal_invoice_attachments(id, document_id, title, file_name, blob_url, sha256)
        VALUES (${attachmentId}, ${parentId}, ${title}, ${safeName}, ${blob.url}, ${createHash("sha256").update(bytes).digest("hex")})`;
      return NextResponse.json({ ok: true, id: attachmentId, notified: false }, { headers });
    }
    const replaceId = String(field("replaceDocumentId") || "");
    if (replaceId && !/^[a-f0-9-]{36}$/.test(replaceId)) return fail(400, "Choose the document to replace.");
    if (replaceId && kind === "invoice") {
      const previous = await sql`SELECT d.*, i.status, i.stripe_invoice_id, i.amount_cents FROM portal_documents d JOIN portal_invoices i ON i.document_id = d.id
        WHERE d.id = ${replaceId} AND d.project_id = ${projectId} AND d.kind = 'invoice' AND d.removed_at IS NULL LIMIT 1`;
      if (!previous.length || previous[0].status !== "issued") return fail(409, "Only an unpaid issued invoice PDF can be replaced. Paid and void records are retained.");
      const old = previous[0];
      if (old.stripe_invoice_id && await liveStripeStatus({ document_id: replaceId, stripe_invoice_id: String(old.stripe_invoice_id), amount_cents: Number(old.amount_cents) } as PortalInvoice) !== "open") return fail(409, "Check Stripe's actual invoice status before replacing this PDF.");
      const digest = createHash("sha256").update(bytes).digest("hex");
      const blob = direct ? { url: blobUrl } : await put(`portal/${projectId}/documents/${randomUUID()}-${safeName}`, Buffer.from(bytes), { access: "private", contentType: "application/pdf", addRandomSuffix: false });
      if (blob.url === old.blob_url) return fail(409, "Choose a new PDF to replace this file.");
      const duplicate = await sql`SELECT 1 FROM portal_documents WHERE blob_url = ${blob.url} LIMIT 1`;
      if (duplicate.length) return fail(409, "That PDF is already attached. Upload a new copy.");
      await sql.transaction([
        sql`INSERT INTO portal_document_file_versions(id, document_id, title, file_name, blob_url, sha256)
          VALUES (${randomUUID()}, ${replaceId}, ${old.title}, ${old.file_name}, ${old.blob_url}, ${old.sha256})`,
        sql`UPDATE portal_documents SET title = ${title}, file_name = ${safeName}, blob_url = ${blob.url}, sha256 = ${digest} WHERE id = ${replaceId}`,
        sql`UPDATE portal_invoices SET shared_at = NULL, notification_status = 'unknown', notification_email_id = NULL, notification_attempted_at = NULL WHERE document_id = ${replaceId}`,
      ]);
      return NextResponse.json({ ok: true, id: replaceId, notified: false, replaced: true }, { headers });
    }
    if (replaceId && kind === "agreement") {
      const old = await sql`SELECT 1 FROM portal_documents WHERE id = ${replaceId} AND project_id = ${projectId} AND kind = 'agreement' LIMIT 1`;
      if (!old.length) return fail(404, "The agreement to replace was not found in this project.");
    }
    let invoiceNumber = "", amountCents = 0, dueOn: string | null = null;
    let paymentUrl: string | null = null, achUrl = "", zelleId = "", checkAddress = "", milestone = 1;
    if (kind === "invoice") {
      invoiceNumber = String(field("invoiceNumber") || "").trim();
      milestone = Number(field("milestoneNumber") ?? 1);
      const amount = String(field("amount") || "").trim();
      const due = String(field("dueOn") || "").trim();
      zelleId = String(field("zelleId") || "").trim();
      checkAddress = String(field("checkAddress") || "").trim();
      const rawUrl = String(field("paymentUrl") || "").trim();
      achUrl = String(field("achUrl") || "").trim();
      if (![0, 1, 2, 3].includes(milestone) || !invoiceNumber || invoiceNumber.length > 80 || !/^\d{1,7}(\.\d{1,2})?$/.test(amount) || zelleId.length > 254 || checkAddress.length > 500 || (due && !/^\d{4}-\d{2}-\d{2}$/.test(due)) || (rawUrl && !rawUrl.startsWith("https://")) || (achUrl && (!achUrl.startsWith("https://") || achUrl.length > 1000))) return fail(400, "Check invoice number, amount, due date, and payment details.");
      const [dollars, cents = ""] = amount.split(".");
      amountCents = Number(dollars) * 100 + Number(cents.padEnd(2, "0"));
      const planned = projectMilestoneAmounts(project[0]);
      if (!(milestone === 0 ? Number(project[0].investment_cents) : planned[milestone - 1]) || amountCents !== (milestone === 0 ? Number(project[0].investment_cents) : planned[milestone - 1])) return fail(409, "This invoice must match its saved milestone amount. Set the project payment plan first.");
      const conflictingPayment = await sql`SELECT 1 FROM portal_invoices i JOIN portal_documents d ON d.id = i.document_id
        WHERE d.project_id = ${projectId} AND i.status = 'paid' AND (${milestone} = 0 OR i.milestone_number = 0) LIMIT 1`;
      if (conflictingPayment.length) return fail(409, "A payment was already received on the alternative plan. Use the remaining milestone invoices rather than adding a full-total invoice.");
      const alreadyAttached = await sql`SELECT 1 FROM portal_invoices i JOIN portal_documents d ON d.id = i.document_id
        WHERE d.project_id = ${projectId} AND i.milestone_number = ${milestone} AND i.status != 'void' LIMIT 1`;
      if (alreadyAttached.length) return fail(409, "This milestone already has an active invoice. Void it before attaching a replacement.");
      const parsedDue = due ? new Date(`${due}T12:00:00Z`) : null;
      if (amountCents < 1 || (parsedDue && (Number.isNaN(parsedDue.getTime()) || parsedDue.toISOString().slice(0, 10) !== due))) return fail(400, "Check the amount and due date.");
      dueOn = due || null;
      paymentUrl = rawUrl || null;
    }
    if (direct) {
      if (kind === "proposal") await ensurePortalProposals();
      const existing = kind === "proposal" ? await sql`SELECT id FROM portal_proposals WHERE blob_url = ${blobUrl} LIMIT 1` : await sql`SELECT id FROM portal_documents WHERE blob_url = ${blobUrl} LIMIT 1`;
      if (existing.length) return fail(409, "This document is already attached to a project.");
    }
    const id = randomUUID();
    const digest = createHash("sha256").update(bytes).digest("hex");
    const blob = direct ? { url: blobUrl } : await put(`portal/${projectId}/documents/${id}-${safeName}`, Buffer.from(bytes), { access: "private", contentType: "application/pdf", addRandomSuffix: false });
    try {
      if (kind === "proposal") {
        await ensurePortalProposals();
        await sql`INSERT INTO portal_proposals(id, project_id, title, file_name, blob_url, sha256)
          VALUES (${id}, ${projectId}, ${title}, ${safeName}, ${blob.url}, ${digest})`;
        return NextResponse.json({ ok: true, id, notified: false }, { headers });
      }
      if (kind === "invoice") await ensurePortalPaymentOptions();
      await sql`INSERT INTO portal_documents(id, project_id, kind, title, file_name, blob_url, sha256)
        VALUES (${id}, ${projectId}, ${kind}, ${title}, ${safeName}, ${blob.url}, ${digest})`;
      if (kind === "invoice") await sql`INSERT INTO portal_invoices(document_id, invoice_number, amount_cents, due_on, payment_url, zelle_id, check_address, milestone_number, shared_at)
        VALUES (${id}, ${invoiceNumber}, ${amountCents}, ${dueOn}, ${paymentUrl}, ${zelleId}, ${checkAddress}, ${milestone}, NULL)`;
      if (kind === "invoice" && achUrl) await sql`INSERT INTO portal_payment_options(document_id, ach_url) VALUES (${id}, ${achUrl})`;
    } catch (error) {
      await sql`DELETE FROM portal_documents WHERE id = ${id}`.catch(() => {});
      await del(blob.url).catch(() => {});
      throw error;
    }
    return NextResponse.json({ ok: true, id, notified: false }, { headers });
  } catch { return fail(500, "The document could not be published."); }
}
