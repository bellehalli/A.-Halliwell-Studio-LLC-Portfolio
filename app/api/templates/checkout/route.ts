import Stripe from "stripe";
import { NextResponse } from "next/server";
import { checkRequestLimit } from "@/lib/request-rate-limit";

export const runtime = "nodejs";

const products = {
  "custom-order-tracker": { name: "Custom Order Tracker & Production Planner", amount: 1999 },
  "beauty-booking-template": { name: "Beauty, Booked. — Hair Studio", amount: 14900 },
  "protective-style-template": { name: "Rooted Rituals — Protective Styles", amount: 14900 },
  "nail-artist-template": { name: "Nail Theory — Nail Artist", amount: 14900 },
  "lash-brow-template": { name: "Set & Stare — Lash + Brow Artist", amount: 14900 },
  "skin-studio-template": { name: "Stillwater Skin — Skincare Studio", amount: 14900 },
  "elan-aesthetics-template": { name: "Élan Aesthetics", amount: 99900 },
  "vanta-social-template": { name: "Vanta Social — Nightlife + Events", amount: 99900 },
  "northstar-home-service-template": { name: "Northstar Heating & Home — 12-Page HVAC Website + 10 Photos", amount: 39900 },
} as const;

const headers = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" };
const fail = (status: number, message: string) => NextResponse.json({ message }, { status, headers });

export async function POST(request: Request) {
  const appOrigin = process.env.VERCEL_ENV === "production"
    ? "https://www.ahalliwellstudio.com"
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : new URL(request.url).origin;
  const origin = request.headers.get("origin");
  if (origin && origin !== appOrigin) return fail(403, "Checkout request was not accepted.");
  if (!(request.headers.get("content-type") || "").toLowerCase().includes("application/json")) return fail(415, "Checkout request was not accepted.");

  let body: { slug?: unknown };
  try {
    const raw = await request.text();
    if (Buffer.byteLength(raw, "utf8") > 1000) return fail(413, "Checkout request was too large.");
    body = JSON.parse(raw);
  } catch { return fail(400, "Choose a template to continue."); }

  const slug = typeof body.slug === "string" && body.slug in products ? body.slug as keyof typeof products : null;
  if (!slug) return fail(400, "Choose a template to continue.");
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret || !/^sk_(live|test)_/.test(secret)) return fail(503, "Secure checkout is being configured. Please email the studio for help.");
  if (process.env.VERCEL_ENV === "production" && !secret.startsWith("sk_live_")) return fail(503, "Live checkout is being configured. Please email the studio for help.");
  if (process.env.VERCEL_ENV === "preview" && !secret.startsWith("sk_test_")) return fail(503, "Preview checkout is disabled until a Stripe test key is configured.");

  try {
    const limit = await checkRequestLimit(request, "template-checkout", 12, 15 * 60 * 1000);
    if (limit.limited) return NextResponse.json({ message: "Too many checkout attempts. Please wait a few minutes and try again." }, { status: 429, headers: { ...headers, "Retry-After": String(limit.retryAfter) } });
    const product = products[slug];
    const stripe = new Stripe(secret);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_creation: "always",
      line_items: [{
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: product.amount,
          product_data: {
            name: product.name,
            description: slug === "custom-order-tracker" ? "Editable Excel workbook for handmade and made-to-order shops. Track orders, due dates, payments, attention items, and weekly production capacity. Manual entry; no Etsy sync." : slug === "northstar-home-service-template" ? "Complete 12-page HVAC website template with 10 included project photos, setup guides, and a single-business license. Demo service-request form requires a buyer-connected form service to deliver submissions." : "One-time coded website template. Includes a niche-specific setup guide and a single-business use license.",
            metadata: { productSlug: slug },
          },
        },
      }],
      metadata: { productSlug: slug },
      payment_intent_data: { metadata: { productSlug: slug } },
      success_url: `${appOrigin}/template-purchase/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appOrigin}/${slug === "custom-order-tracker" ? "custom-order-tracker" : "beauty-booking-template"}?checkout=cancelled`,
      custom_text: {
        submit: { message: "Digital download delivered after successful payment. One purchase covers one business and one website; see the AHS template license and terms on the product page." },
      },
    });
    if (!session.url) return fail(502, "Secure checkout could not open. Please try again.");
    return NextResponse.json({ url: session.url }, { headers });
  } catch {
    return fail(502, "Secure checkout could not open. Please try again or email the studio.");
  }
}
