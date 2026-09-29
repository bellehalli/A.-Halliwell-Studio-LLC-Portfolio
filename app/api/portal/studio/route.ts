import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { del } from "@vercel/blob";
import Stripe from "stripe";
import { currentPortalClient, ensurePortalPaymentOptions, isPortalStudio, newToken, portalDb, portalEnabled, tokenHash } from "@/lib/portal";

export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store" };
const fail = (status: number, message: string) => NextResponse.json({ ok: false, message }, { status, headers });
const stages = ["proposal", "agreement", "invoice", "in_progress", "review", "complete"];

export async function POST(request: Request) {
  if (!portalEnabled()) return fail(503, "Portal unavailable.");
  if (request.headers.get("origin") !== new URL(request.url).origin) return fail(403, "Forbidden.");
  const studio = await currentPortalClient();
  if (!isPortalStudio(studio)) return fail(403, "Forbidden.");
  try {
    const raw = await request.text();
    if (raw.length > 8_000) return fail(413, "Request too large.");
    const data = JSON.parse(raw);
    const sql = portalDb();
    if (data.action === "create") {
      const email = String(data.email || "").trim().toLowerCase();
      const firstName = String(data.firstName || "").trim().slice(0, 80);
      const rawTitle = String(data.title || "").trim();
      const title = (data.isTest === "on" ? `TEST ${rawTitle}` : rawTitle).slice(0, 150);
      const summary = String(data.summary || "").trim().slice(0, 1000);
      const clientBusiness = String(data.clientBusiness || "").trim().slice(0, 150);
      const investment = String(data.investment || "").trim();
      if (investment && !/^\d{1,7}(\.\d{1,2})?$/.test(investment)) return fail(400, "Check the project investment.");
      const [dollars, cents = ""] = investment.split(".");
      const investmentCents = investment ? Number(dollars) * 100 + Number(cents.padEnd(2, "0")) : null;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !firstName || !rawTitle) return fail(400, "Client email, name, and project title are required.");
      await sql`INSERT INTO portal_clients(id, email, first_name) VALUES (${randomUUID()}, ${email}, ${firstName}) ON CONFLICT (email) DO NOTHING`;
      const clients = await sql`SELECT id, role FROM portal_clients WHERE email = ${email} LIMIT 1`;
      if (clients[0]?.role !== "client") return fail(400, "Use a client email address.");
      const id = randomUUID();
      await sql`INSERT INTO portal_projects(id, client_id, title, summary, client_business, investment_cents) VALUES (${id}, ${clients[0].id}, ${title}, ${summary}, ${clientBusiness}, ${investmentCents})`;
      return NextResponse.json({ ok: true, id }, { headers });
    }
    if (data.action === "deleteTest") {
      const id = String(data.projectId || "");
      if (!/^[a-f0-9-]{36}$/.test(id)) return fail(400, "Choose a test workspace.");
      const rows = await sql`SELECT p.id, p.client_id, p.title, c.email FROM portal_projects p
        JOIN portal_clients c ON c.id = p.client_id WHERE p.id = ${id} LIMIT 1`;
      if (!rows.length) return fail(404, "Test workspace not found.");
      const target = rows[0];
      if (!String(target.title).startsWith("TEST") || String(target.email).toLowerCase() === studio?.email) return fail(403, "Only test client workspaces can be removed here.");
      const actualInvoice = await sql`SELECT 1 FROM portal_invoices i JOIN portal_documents d ON d.id = i.document_id
        WHERE d.project_id = ${id} AND (i.status = 'paid' OR i.invoice_number NOT LIKE 'TEST-%') LIMIT 1`;
      if (actualInvoice.length) return fail(409, "This project contains a real invoice and cannot be removed as a test.");
      const blobs = await sql`SELECT blob_url AS url FROM portal_documents WHERE project_id = ${id}
        UNION SELECT blob_url AS url FROM portal_materials WHERE project_id = ${id}
        UNION SELECT blob_url AS url FROM portal_deliverables WHERE project_id = ${id}
        UNION SELECT signed_pdf_url AS url FROM portal_agreement_signatures s JOIN portal_documents d ON d.id = s.document_id WHERE d.project_id = ${id}`;
      await sql`DELETE FROM portal_projects WHERE id = ${id}`;
      const remaining = await sql`SELECT 1 FROM portal_projects WHERE client_id = ${target.client_id} LIMIT 1`;
      if (!remaining.length) await sql`DELETE FROM portal_clients WHERE id = ${target.client_id}`;
      const urls = blobs.map(blob => String(blob.url)).filter(url => url.startsWith("https://"));
      if (urls.length) await del(urls).catch(() => { /* The database removal remains authoritative. */ });
      return NextResponse.json({ ok: true, email: target.email, clientRemoved: !remaining.length }, { headers });
    }
    if (data.action === "update") {
      const id = String(data.projectId || "");
      const stage = String(data.stage || "");
      const agreementUrl = String(data.agreementUrl || "").trim();
      const invoiceId = String(data.invoiceId || "").trim();
      const paymentInstructions = String(data.paymentInstructions || "").trim();
      if (!/^[a-f0-9-]{36}$/.test(id) || !stages.includes(stage) || (agreementUrl && !agreementUrl.startsWith("https://")) || (invoiceId && !/^in_[A-Za-z0-9]+$/.test(invoiceId)) || paymentInstructions.length > 1000) return fail(400, "Check the project, stage, agreement URL, invoice ID, and payment instructions.");
      const project = await sql`SELECT p.id, c.email FROM portal_projects p JOIN portal_clients c ON c.id = p.client_id WHERE p.id = ${id} LIMIT 1`;
      if (!project.length) return fail(404, "Project not found.");
      if (invoiceId) {
        if (!process.env.STRIPE_SECRET_KEY) return fail(503, "Stripe is not configured.");
        const invoice = await new Stripe(process.env.STRIPE_SECRET_KEY).invoices.retrieve(invoiceId);
        if (invoice.customer_email?.toLowerCase() !== String(project[0].email).toLowerCase()) return fail(400, "The Stripe invoice must belong to this client email.");
        const amounts = await sql`SELECT i.amount_cents FROM portal_invoices i JOIN portal_documents d ON d.id = i.document_id
          WHERE d.project_id = ${id} AND i.status = 'issued' ORDER BY d.created_at DESC, d.id DESC LIMIT 1`;
        if (!amounts.length || invoice.currency !== "usd" || invoice.amount_due !== Number(amounts[0].amount_cents) || !["open", "paid"].includes(invoice.status ?? "")) return fail(400, "The Stripe invoice must be issued in USD for the same amount as the current Chase invoice.");
      }
      await sql`UPDATE portal_projects SET stage = ${stage}, agreement_url = ${agreementUrl || null}, stripe_invoice_id = ${invoiceId || null}, payment_instructions = ${paymentInstructions} WHERE id = ${id}`;
      return NextResponse.json({ ok: true }, { headers });
    }
    if (data.action === "invite") {
      const id = String(data.projectId || "");
      if (!/^[a-f0-9-]{36}$/.test(id)) return fail(400, "Choose a project.");
      const rows = await sql`SELECT c.id, c.email, c.first_name, p.title FROM portal_projects p JOIN portal_clients c ON c.id = p.client_id WHERE p.id = ${id} LIMIT 1`;
      if (!rows.length) return fail(404, "Project not found.");
      const signed = await sql`SELECT 1 FROM portal_documents d JOIN portal_agreement_signatures s ON s.document_id = d.id AND s.signer_role = 'studio'
        WHERE d.project_id = ${id} AND d.kind = 'agreement'
          AND d.id = (SELECT id FROM portal_documents WHERE project_id = ${id} AND kind = 'agreement' ORDER BY created_at DESC, id DESC LIMIT 1) LIMIT 1`;
      if (!signed.length) return fail(409, "Sign the current agreement as the studio before inviting the client.");
      const readyInvoice = await sql`SELECT 1 FROM portal_invoices i JOIN portal_documents d ON d.id = i.document_id
        WHERE d.project_id = ${id} AND i.status = 'issued' LIMIT 1`;
      const sample = await sql`SELECT 1 FROM portal_invoices i JOIN portal_documents d ON d.id = i.document_id
        WHERE d.project_id = ${id} AND i.status = 'void' AND i.invoice_number LIKE 'TEST-%' LIMIT 1`;
      if (!readyInvoice.length && !(String(rows[0].title).startsWith("TEST") && sample.length)) return fail(409, "Attach an issued invoice before inviting the client.");
      const client = rows[0];
      const recent = await sql`SELECT count(*)::int AS count FROM portal_login_links WHERE client_id = ${client.id} AND created_at > now() - interval '1 hour'`;
      if (Number(recent[0]?.count) >= 3) return fail(429, "Please wait before sending another invitation.");
      const token = newToken(), hash = tokenHash(token);
      await sql`INSERT INTO portal_login_links(token_hash, client_id, expires_at) VALUES (${hash}, ${client.id}, now() + interval '15 minutes')`;
      const { data: sent, error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
        from: process.env.INQUIRY_FROM_EMAIL || "A. Halliwell Studio <onboarding@resend.dev>", to: [String(client.email)],
        subject: "Your A. Halliwell Studio project workspace",
        text: `Hi ${client.first_name},\n\nYour private project workspace is ready. The agreement is signed by the studio and waiting for your review. Open your private link to sign and see the next steps:\n\nhttps://www.ahalliwellstudio.com/portal/claim#token=${token}\n\nThis link expires in 15 minutes. You can request a fresh link any time at https://www.ahalliwellstudio.com/portal.\n\nArabella`,
      });
      if (error || !sent?.id) { await sql`DELETE FROM portal_login_links WHERE token_hash = ${hash}`; return fail(502, "The email provider did not accept the invitation. Check the sender configuration and try again."); }
      return NextResponse.json({ ok: true, recipient: String(client.email), emailId: sent.id, status: "accepted" }, { headers });
    }
    if (data.action === "updateInvoice") {
      const projectId = String(data.projectId || "");
      const documentId = String(data.documentId || "");
      const paymentUrl = String(data.paymentUrl || "").trim();
      const achUrl = String(data.achUrl || "").trim();
      const zelleId = String(data.zelleId || "").trim();
      const checkAddress = String(data.checkAddress || "").trim();
      if (!/^[a-f0-9-]{36}$/.test(projectId) || !/^[a-f0-9-]{36}$/.test(documentId) || (paymentUrl && (!paymentUrl.startsWith("https://") || paymentUrl.length > 1000)) || (achUrl && (!achUrl.startsWith("https://") || achUrl.length > 1000)) || zelleId.length > 254 || checkAddress.length > 500) return fail(400, "Check the invoice payment details.");
      const rows = await sql`UPDATE portal_invoices i SET payment_url = ${paymentUrl || null}, zelle_id = ${zelleId}, check_address = ${checkAddress}
        FROM portal_documents d WHERE i.document_id = d.id AND d.id = ${documentId} AND d.project_id = ${projectId} AND i.status = 'issued' RETURNING i.document_id`;
      if (!rows.length) return fail(404, "Issued invoice not found.");
      await ensurePortalPaymentOptions();
      await sql`INSERT INTO portal_payment_options(document_id, ach_url) VALUES (${documentId}, ${achUrl})
        ON CONFLICT (document_id) DO UPDATE SET ach_url = EXCLUDED.ach_url`;
      return NextResponse.json({ ok: true }, { headers });
    }
    if (data.action === "invoiceStatus") {
      const documentId = String(data.documentId || "");
      const status = String(data.status || "");
      if (!/^[a-f0-9-]{36}$/.test(documentId) || !["paid", "void"].includes(status)) return fail(400, "Check the invoice and status.");
      const rows = await sql`UPDATE portal_invoices SET status = ${status}, paid_at = CASE WHEN ${status} = 'paid' THEN now() ELSE NULL END
        WHERE document_id = ${documentId} AND status = 'issued' RETURNING document_id`;
      if (!rows.length) return fail(409, "Only an issued invoice can be marked paid or void.");
      if (status === "paid") {
        const recipient = await sql`SELECT c.email, c.first_name, i.invoice_number FROM portal_invoices i JOIN portal_documents d ON d.id = i.document_id
          JOIN portal_projects p ON p.id = d.project_id JOIN portal_clients c ON c.id = p.client_id WHERE i.document_id = ${documentId} LIMIT 1`;
        if (recipient.length) {
          try { await new Resend(process.env.RESEND_API_KEY).emails.send({
            from: process.env.INQUIRY_FROM_EMAIL || "A. Halliwell Studio <onboarding@resend.dev>", to: [String(recipient[0].email)],
            subject: "Your project payment is confirmed",
            text: `Hi ${recipient[0].first_name},\n\nYour payment for invoice ${recipient[0].invoice_number} has been confirmed by the studio. Your project workspace now shows it as paid.\n\nhttps://www.ahalliwellstudio.com/portal\n\nArabella`,
          }, { idempotencyKey: `portal-payment-confirmed/${documentId}` }); } catch { /* The paid status remains authoritative. */ }
        }
      }
      return NextResponse.json({ ok: true }, { headers });
    }
    return fail(400, "Unknown action.");
  } catch {
    return fail(500, "The studio action could not be completed.");
  }
}
