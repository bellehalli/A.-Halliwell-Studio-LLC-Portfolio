import "server-only";
import Stripe from "stripe";
import { portalDb, type PortalInvoice } from "./portal";

// After confirmed receipt, close the alternate full-payment / milestone paths.
// Chase links need manual bank closeout; retain that task in the manager portal.
export async function closeAlternativeInvoices(documentId: string) {
  const sql = portalDb();
  const alternatives = await sql`SELECT other.document_id, other.stripe_invoice_id FROM portal_invoices paid
    JOIN portal_documents source ON source.id = paid.document_id
    JOIN portal_documents d ON d.project_id = source.project_id
    JOIN portal_invoices other ON other.document_id = d.id
    WHERE paid.document_id = ${documentId} AND paid.status = 'paid' AND other.status = 'issued'
      AND other.document_id != paid.document_id AND (paid.milestone_number = 0 OR other.milestone_number = 0)`;
  for (const other of alternatives) {
    if (other.stripe_invoice_id) {
      if (!process.env.STRIPE_SECRET_KEY) throw Error("Stripe closeout is unavailable.");
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const live = await stripe.invoices.retrieve(String(other.stripe_invoice_id));
      if (live.amount_paid > 0 || live.status === "paid") throw Error("The alternative Stripe invoice also has a payment. Review both receipts.");
      if (live.status === "open") await stripe.invoices.voidInvoice(live.id);
      else if (live.status !== "void") throw Error("The alternative Stripe invoice cannot be closed yet.");
    }
    await sql`UPDATE portal_invoices SET status = 'void' WHERE document_id = ${other.document_id} AND status = 'issued'`;
  }
}

export async function liveStripeStatus(invoice: PortalInvoice) {
  if (!invoice.stripe_invoice_id || !process.env.STRIPE_SECRET_KEY) return null;
  try {
    const live = await new Stripe(process.env.STRIPE_SECRET_KEY).invoices.retrieve(invoice.stripe_invoice_id);
    if (live.currency !== "usd" || live.amount_due !== invoice.amount_cents) return "mismatch";
    if (live.status === "paid" && live.amount_paid === invoice.amount_cents) {
      if (invoice.status !== "paid") {
        await portalDb()`UPDATE portal_invoices SET submitted_at = coalesce(submitted_at, now())
          WHERE document_id = ${invoice.document_id} AND status = 'issued'`;
        return "received, awaiting approval";
      }
    }
    return live.status ?? "unknown";
  } catch { return "unavailable"; }
}
