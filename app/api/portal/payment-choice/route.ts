import { NextResponse } from "next/server";
import Stripe from "stripe";
import { currentPortalClient, ensurePortalPaymentOptions, portalDb, portalEnabled } from "@/lib/portal";

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
    const sql = portalDb();
    const rows = await sql`SELECT i.status, i.invoice_number, i.amount_cents, i.zelle_id, i.payment_url, i.check_address, p.title, p.stripe_invoice_id,
      o.ach_url, d.id AS document_id, d.project_id, d.kind,
      EXISTS(SELECT 1 FROM portal_agreement_signatures s JOIN portal_documents a ON a.id = s.document_id
        WHERE a.id = (SELECT id FROM portal_documents WHERE project_id = d.project_id AND kind = 'agreement' ORDER BY created_at DESC, id DESC LIMIT 1)
        AND s.signer_role = 'client') AS agreement_signed,
      (SELECT d2.id FROM portal_documents d2 JOIN portal_invoices i2 ON i2.document_id = d2.id
        WHERE d2.project_id = d.project_id AND d2.kind = 'invoice' AND i2.status != 'void'
        ORDER BY d2.created_at DESC, d2.id DESC LIMIT 1) AS latest_invoice_id
      FROM portal_documents d JOIN portal_invoices i ON i.document_id = d.id
      JOIN portal_projects p ON p.id = d.project_id AND p.client_id = ${client.id}
      LEFT JOIN portal_payment_options o ON o.document_id = d.id
      WHERE d.id = ${documentId} LIMIT 1`;
    if (!rows.length) return fail(404, "Invoice not found.");
    const item = rows[0];
    const preview = String(item.title).startsWith("TEST") && String(item.invoice_number).startsWith("TEST-") && item.status === "void";
    if (!preview && (item.status !== "issued" || !item.agreement_signed)) return fail(409, "This invoice is not ready for payment selection.");
    if (!preview) {
      if (method === "zelle" && !item.zelle_id) return fail(409, "Zelle is not available for this invoice.");
      if (method === "ach" && !item.ach_url) {
        if (item.document_id !== item.latest_invoice_id || !item.stripe_invoice_id || !process.env.STRIPE_SECRET_KEY) return fail(409, "ACH is not available for this invoice.");
        const invoice = await new Stripe(process.env.STRIPE_SECRET_KEY).invoices.retrieve(String(item.stripe_invoice_id));
        if (invoice.status !== "open" || invoice.amount_remaining !== Number(item.amount_cents) || invoice.customer_email?.toLowerCase() !== client.email.toLowerCase() || !invoice.hosted_invoice_url || !invoice.payment_settings?.payment_method_types?.includes("us_bank_account")) return fail(409, "ACH is not available for this invoice.");
      }
      if (method === "chase" && !item.payment_url) return fail(409, "Chase payment is not available for this invoice.");
      if (method === "check" && !item.check_address) return fail(409, "Check payment is not available for this invoice.");
      if (method === "card") {
        if (item.document_id !== item.latest_invoice_id || !item.stripe_invoice_id || !process.env.STRIPE_SECRET_KEY) return fail(409, "Card payment is not available for this invoice.");
        const invoice = await new Stripe(process.env.STRIPE_SECRET_KEY).invoices.retrieve(String(item.stripe_invoice_id));
        if (invoice.status !== "open" || invoice.amount_remaining !== Number(item.amount_cents) || invoice.customer_email?.toLowerCase() !== client.email.toLowerCase() || !invoice.hosted_invoice_url) return fail(409, "Card payment is not available for this invoice.");
      }
    }
    await sql`INSERT INTO portal_payment_options(document_id, client_id, selected_method, selected_at)
      VALUES (${documentId}, ${client.id}, ${method}, now())
      ON CONFLICT (document_id) DO UPDATE SET client_id = EXCLUDED.client_id, selected_method = EXCLUDED.selected_method, selected_at = EXCLUDED.selected_at`;
    return NextResponse.json({ ok: true, method }, { headers });
  } catch { return fail(500, "The payment choice could not be saved. Please try again."); }
}
