import Stripe from "stripe";
import { NextResponse } from "next/server";
import { ensurePortalLifecycle, portalDb, type PortalInvoice } from "@/lib/portal";
import { liveStripeStatus } from "@/lib/portal-payments";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const signingSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !signingSecret) return NextResponse.json({ ok: false }, { status: 503 });
  const stripe = new Stripe(secret);
  let event: Stripe.Event;
  try { event = stripe.webhooks.constructEvent(await request.text(), request.headers.get("stripe-signature") || "", signingSecret); }
  catch { return NextResponse.json({ ok: false }, { status: 400 }); }
  if (!["invoice.paid", "invoice.payment_succeeded"].includes(event.type)) return NextResponse.json({ received: true });
  try {
    await ensurePortalLifecycle();
    const invoice = event.data.object as Stripe.Invoice;
    const rows = await portalDb()`SELECT i.* FROM portal_invoices i WHERE stripe_invoice_id = ${invoice.id} AND status != 'void'`;
    for (const row of rows) {
      const status = await liveStripeStatus(row as PortalInvoice);
      if (status !== "paid" && status !== "received, awaiting approval") throw Error("Receipt could not be reconciled.");
    }
    return NextResponse.json({ received: true });
  } catch { console.error("portal-payment: webhook reconciliation failed"); return NextResponse.json({ ok: false }, { status: 500 }); }
}
