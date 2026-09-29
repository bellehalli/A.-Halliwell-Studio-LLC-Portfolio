import { createHash, randomUUID } from "node:crypto";
import { del, get, put } from "@vercel/blob";
import { PDFDocument } from "pdf-lib";
import { NextResponse } from "next/server";
import { currentPortalClient, ensurePortalPaymentOptions, ensurePortalProposals, ensurePortalLifecycle, isPortalStudio, portalDb, portalEnabled } from "@/lib/portal";

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
    const field = (name: string) => direct ? data?.[name] : form?.get(name);
    const projectId = String(field("projectId") || "");
    const kind = String(field("kind") || "");
    const title = String(field("title") || "").trim();
    const file = field("file");
    const blobUrl = String(field("blobUrl") || "");
    if (!/^[a-f0-9-]{36}$/.test(projectId) || !["proposal", "agreement", "invoice"].includes(kind) || !title || title.length > 150) return fail(400, "Choose a project and document title.");
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
    const project = await sql`SELECT p.id, c.email, c.first_name FROM portal_projects p JOIN portal_clients c ON c.id = p.client_id WHERE p.id = ${projectId} LIMIT 1`;
    if (!project.length) return fail(404, "Project not found.");

    let invoiceNumber = "", amountCents = 0, dueOn: string | null = null;
    let paymentUrl: string | null = null, achUrl = "", zelleId = "", checkAddress = "", milestone = 1;
    if (kind === "invoice") {
      invoiceNumber = String(field("invoiceNumber") || "").trim();
      milestone = Number(field("milestoneNumber") || 1);
      const amount = String(field("amount") || "").trim();
      const due = String(field("dueOn") || "").trim();
      zelleId = String(field("zelleId") || "").trim();
      checkAddress = String(field("checkAddress") || "").trim();
      const rawUrl = String(field("paymentUrl") || "").trim();
      achUrl = String(field("achUrl") || "").trim();
      if (![1, 2, 3].includes(milestone) || !invoiceNumber || invoiceNumber.length > 80 || !/^\d{1,7}(\.\d{1,2})?$/.test(amount) || zelleId.length > 254 || checkAddress.length > 500 || (due && !/^\d{4}-\d{2}-\d{2}$/.test(due)) || (rawUrl && !rawUrl.startsWith("https://")) || (achUrl && (!achUrl.startsWith("https://") || achUrl.length > 1000))) return fail(400, "Check invoice number, amount, due date, and payment details.");
      const [dollars, cents = ""] = amount.split(".");
      amountCents = Number(dollars) * 100 + Number(cents.padEnd(2, "0"));
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
