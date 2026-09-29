import { NextResponse } from "next/server";
import Stripe from "stripe";
import { currentPortalClient, ensurePortalPaymentOptions, ensurePortalLifecycle, portalDb, portalEnabled } from "@/lib/portal";

export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" };
const fail = (status: number, message: string) => NextResponse.json({ message }, { status, headers });

export async function POST(request: Request) {
  if (!portalEnabled()) return fail(503, "Portal unavailable.");
  if (request.headers.get("origin") !== new URL(request.url).origin) return fail(403, "Forbidden.");
  const client = await currentPortalClient();
  if (!client || client.role !== "client") return fail(401, "Sign in to pay this invoice.");
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY || "";
  const secretKey = process.env.STRIPE_SECRET_KEY || "";
  if (!/^pk_(live|test)_/.test(publishableKey) || !/^sk_(live|test)_/.test(secretKey) || publishableKey.slice(3, 7) !== secretKey.slice(3, 7)) return fail(503, "Embedded payment is being configured. Use the Stripe invoice link for now.");
  try {
    const raw = await request.text();
    if (raw.length > 500) return fail(413, "Request too large.");
    const documentId = String(JSON.parse(raw).documentId || "");
    if (!/^[a-f0-9-]{36}$/.test(documentId)) return fail(400, "Choose an invoice.");
    await ensurePortalPaymentOptions();
    await ensurePortalLifecycle();
    const rows = await portalDb()`SELECT i.status, i.shared_at, i.amount_cents, d.id, d.project_id, i.stripe_invoice_id, o.selected_method,
      (SELECT d2.id FROM portal_documents d2 JOIN portal_invoices i2 ON i2.document_id = d2.id
        WHERE d2.project_id = d.project_id AND d2.kind = 'invoice' AND i2.status != 'void'
        ORDER BY d2.created_at DESC, d2.id DESC LIMIT 1) AS latest_invoice_id,
      EXISTS(SELECT 1 FROM portal_agreement_signatures s JOIN portal_documents a ON a.id = s.document_id
        WHERE a.id = (SELECT id FROM portal_documents WHERE project_id = d.project_id AND kind = 'agreement' ORDER BY created_at DESC, id DESC LIMIT 1)
          AND s.signer_role = 'client') AS agreement_signed
      FROM portal_documents d JOIN portal_invoices i ON i.document_id = d.id
      JOIN portal_projects p ON p.id = d.project_id AND p.client_id = ${client.id} AND p.invited_at IS NOT NULL AND p.archived_at IS NULL
      LEFT JOIN portal_payment_options o ON o.document_id = d.id
      WHERE d.id = ${documentId} AND d.kind = 'invoice' LIMIT 1`;
    const item = rows[0];
    if (!item || item.status !== "issued" || !item.shared_at || !item.agreement_signed || item.selected_method !== "card" || !item.stripe_invoice_id) return fail(409, "This invoice is not ready for embedded payment.");
    const invoice = await new Stripe(secretKey).invoices.retrieve(String(item.stripe_invoice_id), { expand: ["confirmation_secret"] });
    if (invoice.status !== "open" || invoice.currency !== "usd" || invoice.amount_remaining !== Number(item.amount_cents) || invoice.customer_email?.toLowerCase() !== client.email.toLowerCase() || !invoice.payment_settings?.payment_method_types?.includes("card")) return fail(409, "The Stripe invoice no longer matches this payment. Refresh the page.");
    const clientSecret = invoice.confirmation_secret?.client_secret;
    if (!clientSecret) return fail(409, "Embedded payment is unavailable for this invoice. Use its secure Stripe invoice link.");
    return NextResponse.json({ publishableKey, clientSecret, projectId: item.project_id }, { headers });
  } catch { return fail(502, "Embedded payment could not open. Use the Stripe invoice link or try again."); }
}
