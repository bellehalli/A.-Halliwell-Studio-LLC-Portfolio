import "server-only";
import Stripe from "stripe";
import { portalDb, type PortalInvoice } from "./portal";

export async function liveStripeStatus(invoice: PortalInvoice) {
  if (!invoice.stripe_invoice_id || !process.env.STRIPE_SECRET_KEY) return null;
  try {
    const live = await new Stripe(process.env.STRIPE_SECRET_KEY).invoices.retrieve(invoice.stripe_invoice_id);
    if (live.currency !== "usd" || live.amount_due !== invoice.amount_cents) return "mismatch";
    if (live.status === "paid" && live.amount_paid === invoice.amount_cents) {
      await portalDb()`UPDATE portal_invoices SET status = 'paid', paid_at = coalesce(paid_at, now())
        WHERE document_id = ${invoice.document_id} AND status = 'issued'`;
    }
    return live.status ?? "unknown";
  } catch { return "unavailable"; }
}
