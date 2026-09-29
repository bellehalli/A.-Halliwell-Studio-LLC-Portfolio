import { NextResponse } from "next/server";
import Stripe from "stripe";
import { projectMilestoneAmounts } from "@/lib/portal-plan";
import { currentPortalClient, ensurePortalLifecycle, isPortalStudio, portalDb, portalEnabled } from "@/lib/portal";
export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store" };
const fail = (status: number, message: string) => NextResponse.json({ ok: false, message }, { status, headers });
export async function POST(request: Request) {
  if (!portalEnabled() || request.headers.get("origin") !== new URL(request.url).origin || !isPortalStudio(await currentPortalClient())) return fail(403, "Forbidden.");
  try {
    const raw = await request.text();
    if (raw.length > 1000) return fail(413, "Request too large.");
    const { documentId, action, invoiceLink } = JSON.parse(raw);
    let suppliedUrl: URL | null = null;
    const suppliedId = /^in_[A-Za-z0-9]+$/.test(String(invoiceLink || "").trim()) ? String(invoiceLink).trim() : "";
    if (invoiceLink && !suppliedId) {
      try { suppliedUrl = new URL(String(invoiceLink)); } catch { return fail(400, "Paste the complete Stripe invoice link."); }
      if (suppliedUrl.protocol !== "https:" || suppliedUrl.hostname !== "invoice.stripe.com" || suppliedUrl.username || suppliedUrl.password || !suppliedUrl.pathname.startsWith("/i/")) return fail(400, "Use a hosted invoice link from invoice.stripe.com.");
    }
    if (!/^[a-f0-9-]{36}$/.test(documentId) || !["connect", "check", "preview"].includes(action)) return fail(400, "Choose an invoice and action.");
    const secret = process.env.STRIPE_SECRET_KEY || "";
    const publishable = process.env.STRIPE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
    if (!/^sk_(live|test)_/.test(secret)) return fail(503, "Add STRIPE_SECRET_KEY in Vercel and redeploy to connect Stripe.");
    await ensurePortalLifecycle();
    const sql = portalDb();
    const rows = await sql`SELECT i.amount_cents, i.milestone_number, p.investment_cents, p.milestone_1_cents, p.milestone_2_cents, p.milestone_3_cents, i.status, i.shared_at, i.stripe_invoice_id, d.project_id, p.invited_at, p.archived_at, c.email,
      EXISTS(SELECT 1 FROM portal_documents a JOIN portal_agreement_signatures s ON s.document_id = a.id
        WHERE a.id = (SELECT id FROM portal_documents WHERE project_id = d.project_id AND kind = 'agreement' AND removed_at IS NULL ORDER BY created_at DESC, id DESC LIMIT 1) AND s.signer_role = 'client') AS agreement_signed
      FROM portal_invoices i JOIN portal_documents d ON d.id = i.document_id JOIN portal_projects p ON p.id = d.project_id JOIN portal_clients c ON c.id = p.client_id
      WHERE d.id = ${documentId} AND d.removed_at IS NULL LIMIT 1`;
    if (!rows.length) return fail(404, "Invoice not found.");
    const item = rows[0], stripe = new Stripe(secret);
    const originalAmount = Number(item.amount_cents);
    const planAmount = projectMilestoneAmounts(item)[Number(item.milestone_number || 1) - 1];
    // Older uploads stored the full project value on the deposit payment record.
    // Repair only this recognized shape, after verifying the exact Stripe invoice.
    const repairAmount = action === "connect" && item.status === "issued" && Number(item.milestone_number || 1) === 1 && originalAmount === Number(item.investment_cents) && planAmount > 0 && planAmount < originalAmount && !item.stripe_invoice_id;
    const paymentAmount = repairAmount ? planAmount : originalAmount;
    const matches = (invoice: Stripe.Invoice) => invoice.customer_email?.trim().toLowerCase() === String(item.email).trim().toLowerCase() && invoice.currency === "usd" && invoice.amount_due === paymentAmount;
    let stripeId = action === "connect" && suppliedId ? suppliedId : String(item.stripe_invoice_id || "");
    if (action === "connect") {
      if (item.stripe_invoice_id && suppliedId && suppliedId !== item.stripe_invoice_id) return fail(409, "A different Stripe invoice is already connected. Close that payment path before replacing it.");
      if (item.status !== "issued" || item.archived_at) return fail(409, "Connect Stripe to an unpaid, active invoice.");
      if (suppliedUrl || !stripeId) {
        const candidates: Stripe.Invoice[] = [];
        let examined = 0;
        for await (const invoice of stripe.invoices.list({ status: "open", limit: 100 })) {
          const sameLink = suppliedUrl && invoice.hosted_invoice_url && new URL(invoice.hosted_invoice_url).pathname === suppliedUrl.pathname;
          if (suppliedUrl ? sameLink : matches(invoice) && invoice.amount_remaining === paymentAmount) candidates.push(invoice);
          if (++examined >= 1000) break;
        }
        if (examined >= 1000) return fail(409, "There are too many open invoices to choose safely. Enter the exact Stripe invoice ID under Edit payment details.");
        if (suppliedUrl && candidates.length === 0) return fail(409, "This link was not found among open invoices in the connected Stripe account. Check that the invoice is open and the Vercel key belongs to the same live Stripe account.");
        if (candidates.length !== 1) return fail(409, candidates.length ? "More than one Stripe invoice matches. Enter the correct invoice ID under Edit payment details." : "No open Stripe invoice matches this client's email and milestone amount. Check the recipient and amount in Stripe, then try again. You can also enter its invoice ID under Edit payment details.");
        stripeId = candidates[0].id;
      }
    }
    if (!stripeId) return fail(409, "Stripe is not connected to this invoice. Choose Connect Stripe first.");
    const invoice = await stripe.invoices.retrieve(stripeId, { expand: ["confirmation_secret"] });
    if (!matches(invoice)) return fail(409, `This Stripe invoice must match the portal recipient ${item.email} and milestone amount $${(paymentAmount / 100).toFixed(2)} USD. Stripe currently lists ${invoice.customer_email || "no recipient email"} and $${(invoice.amount_due / 100).toFixed(2)} ${invoice.currency.toUpperCase()}. Correct the recipient or amount before connecting.`);
    if (action === "connect") {
      if (invoice.status !== "open" || invoice.amount_remaining !== paymentAmount) return fail(409, "This Stripe invoice is no longer payable for the full milestone amount.");
      const used = await sql`SELECT 1 FROM portal_invoices WHERE stripe_invoice_id = ${stripeId} AND document_id != ${documentId} AND status != 'void' LIMIT 1`;
      if (used.length) return fail(409, "This Stripe invoice is already connected to another portal payment. Choose the separate invoice for this milestone.");
      const saved = await sql`UPDATE portal_invoices SET stripe_invoice_id = ${stripeId}, amount_cents = ${paymentAmount}
        WHERE document_id = ${documentId} AND status = 'issued' AND amount_cents = ${originalAmount}
        AND stripe_invoice_id IS NOT DISTINCT FROM ${item.stripe_invoice_id || null}
        RETURNING document_id`;
      if (!saved.length) return fail(409, "This payment changed while connecting. Refresh and try again.");
    }
    const keysMatch = /^pk_(live|test)_/.test(publishable) && publishable.slice(3, 7) === secret.slice(3, 7);
    const card = !invoice.payment_settings?.payment_method_types || invoice.payment_settings.payment_method_types.includes("card");
    const payable = item.status === "issued" && invoice.status === "open" && invoice.amount_remaining === paymentAmount;
    const embedded = payable && keysMatch && card && !!invoice.confirmation_secret?.client_secret;
    const issues: string[] = [];
    if (!item.invited_at) issues.push("Invite the client to release workspace access.");
    if (item.archived_at) issues.push("Restore the archived workspace.");
    if (!item.agreement_signed) issues.push("The client must sign the current agreement before payment opens.");
    if (!item.shared_at) issues.push("The invoice PDF is private. Share it after signing, or release the deposit with the invitation.");
    if (!payable) issues.push(`Stripe invoice is ${invoice.status || "unavailable"}; it is not payable for the full milestone amount.`);
    if (!card) issues.push("Enable card payments on this invoice in Stripe.");
    if (!keysMatch) issues.push("Embedded fields need matching Stripe publishable and secret keys in Vercel.");
    if (payable && card && keysMatch && !invoice.confirmation_secret?.client_secret) issues.push("This invoice supports the hosted Stripe checkout, but its embedded payment fields are unavailable.");
    if (action === "preview") {
      if (!embedded) return fail(409, issues.at(-1) || "Embedded payment preview is unavailable. Check readiness first.");
      return NextResponse.json({ publishableKey: publishable, clientSecret: invoice.confirmation_secret!.client_secret, projectId: item.project_id }, { headers });
    }
    return NextResponse.json({ ok: true, stripeId, stripeStatus: invoice.status, hostedUrl: invoice.hosted_invoice_url, embedded, hosted: payable && card && !!invoice.hosted_invoice_url, clientReady: payable && card && !!item.invited_at && !item.archived_at && !!item.agreement_signed && !!item.shared_at, issues, message: action === "connect" ? repairAmount ? "Stripe connected to the deposit milestone. The full project invoice PDF and project total are retained; only the amount due for this payment was corrected. No email was sent and no charge was made." : "Stripe connected. No email was sent and no charge was made." : "Live Stripe readiness checked. No charge was made." }, { headers });
  } catch { return fail(502, "Stripe could not be checked. Please try again. No charge was made."); }
}
