import { NextResponse } from "next/server";
import Stripe from "stripe";
import { currentPortalClient, ensurePortalPaymentOptions, ensurePortalLifecycle, portalDb, portalEnabled } from "@/lib/portal";

export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store" };
const fail = (status: number, message: string) => NextResponse.json({ message }, { status, headers });

export async function POST(request: Request) {
  if (!portalEnabled()) return fail(503, "Portal unavailable.");
  if (request.headers.get("origin") !== new URL(request.url).origin) return fail(403, "Forbidden.");
  const client = await currentPortalClient();
  if (!client || client.role !== "client") return fail(401, "Sign in to choose a payment method.");
  try {
    const raw = await request.text();
    if (raw.length > 1000) return fail(413, "Request too large.");
    const data = JSON.parse(raw);
    const documentId = String(data.documentId || "");
    const method = String(data.method || "");
    if (!/^[a-f0-9-]{36}$/.test(documentId) || !["zelle", "ach", "chase", "card", "check"].includes(method)) return fail(400, "Choose a payment method.");
    await ensurePortalPaymentOptions();
    await ensurePortalLifecycle();
    const sql = portalDb();
    const rows = await sql`SELECT i.status, i.shared_at, i.invoice_number, i.amount_cents, i.zelle_id, i.payment_url, i.check_address, p.title, i.stripe_invoice_id,
      o.ach_url, d.id AS document_id, d.project_id, d.kind,
      EXISTS(SELECT 1 FROM portal_agreement_signatures s JOIN portal_documents a ON a.id = s.document_id
        WHERE a.id = (SELECT id FROM portal_documents WHERE project_id = d.project_id AND kind = 'agreement' AND removed_at IS NULL ORDER BY created_at DESC, id DESC LIMIT 1)
        AND s.signer_role = 'client') AS agreement_signed,
      (SELECT d2.id FROM portal_documents d2 JOIN portal_invoices i2 ON i2.document_id = d2.id
        WHERE d2.project_id = d.project_id AND d2.kind = 'invoice' AND i2.status != 'void'
        ORDER BY d2.created_at DESC, d2.id DESC LIMIT 1) AS latest_invoice_id
      FROM portal_documents d JOIN portal_invoices i ON i.document_id = d.id
      JOIN portal_projects p ON p.id = d.project_id AND p.client_id = ${client.id} AND p.invited_at IS NOT NULL AND p.archived_at IS NULL
      LEFT JOIN portal_payment_options o ON o.document_id = d.id
      WHERE d.id = ${documentId} LIMIT 1`;
    if (!rows.length) return fail(404, "Invoice not found.");
    const item = rows[0];
    if (item) {
      const settled = await portalDb()`SELECT 1 FROM portal_invoices other JOIN portal_documents od ON od.id = other.document_id
        JOIN portal_invoices current ON current.document_id = ${documentId}
        WHERE od.project_id = ${item.project_id} AND (other.status = 'paid' OR other.submitted_at IS NOT NULL)
          AND (other.milestone_number = 0 OR current.milestone_number = 0) LIMIT 1`;
      if (settled.length) return fail(409, "An alternative payment was submitted or received. Refresh your workspace to see the remaining balance.");
    }
    const preview = String(item.title).startsWith("TEST") && String(item.invoice_number).startsWith("TEST-") && item.status === "void";
    if (!preview && (item.status !== "issued" || !item.shared_at || !item.agreement_signed)) return fail(409, "This invoice is not ready for payment selection.");
    if (!preview) {
      if (method === "zelle" && !item.zelle_id) return fail(409, "Zelle is not available for this invoice.");
      if (method === "ach" && !item.ach_url) {
        if (!item.stripe_invoice_id || !process.env.STRIPE_SECRET_KEY) return fail(409, "ACH is not available for this invoice.");
        const invoice = await new Stripe(process.env.STRIPE_SECRET_KEY).invoices.retrieve(String(item.stripe_invoice_id));
        if (invoice.status !== "open" || invoice.amount_remaining !== Number(item.amount_cents) || invoice.customer_email?.toLowerCase() !== client.email.toLowerCase() || !invoice.hosted_invoice_url || !invoice.payment_settings?.payment_method_types?.includes("us_bank_account")) return fail(409, "ACH is not available for this invoice.");
      }
      if (method === "chase" && !item.payment_url) return fail(409, "Chase payment is not available for this invoice.");
      if (method === "check" && !item.check_address) return fail(409, "Check payment is not available for this invoice.");
      if (method === "card") {
        if (!item.stripe_invoice_id || !process.env.STRIPE_SECRET_KEY) return fail(409, "Card payment is not available for this invoice.");
        const invoice = await new Stripe(process.env.STRIPE_SECRET_KEY).invoices.retrieve(String(item.stripe_invoice_id));
        if (invoice.status !== "open" || invoice.amount_remaining !== Number(item.amount_cents) || invoice.customer_email?.toLowerCase() !== client.email.toLowerCase() || !invoice.hosted_invoice_url) return fail(409, "Card payment is not available for this invoice.");
      }
    }
    if (data.action === "reportPayment") {
      if (preview || method === "card") return fail(409, "Stripe reports card payments securely. This action is for payments sent through your bank or by check.");
      await sql`UPDATE portal_invoices SET submitted_at = coalesce(submitted_at, now()) WHERE document_id = ${documentId} AND status = 'issued'`;
      return NextResponse.json({ ok: true, message: "Payment reported. The studio will verify receipt before approving it." }, { headers });
    }
    await sql`INSERT INTO portal_payment_options(document_id, client_id, selected_method, selected_at)
      VALUES (${documentId}, ${client.id}, ${method}, now())
      ON CONFLICT (document_id) DO UPDATE SET client_id = EXCLUDED.client_id, selected_method = EXCLUDED.selected_method, selected_at = EXCLUDED.selected_at`;
    return NextResponse.json({ ok: true, method }, { headers });
  } catch { return fail(500, "The payment choice could not be saved. Please try again."); }
}
