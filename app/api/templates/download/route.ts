import Stripe from "stripe";
import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const products = {
  "beauty-booking-template": { file: "beauty-booking-template.zip", amount: 14900 },
  "protective-style-template": { file: "protective-style-template.zip", amount: 14900 },
  "nail-artist-template": { file: "nail-artist-template.zip", amount: 14900 },
  "lash-brow-template": { file: "lash-brow-template.zip", amount: 14900 },
  "skin-studio-template": { file: "skin-studio-template.zip", amount: 14900 },
  "elan-aesthetics-template": { file: "elan-aesthetics-template.zip", amount: 99900 },
  "vanta-social-template": { file: "vanta-social-template.zip", amount: 99900 },
  "northstar-home-service-template": { file: "northstar-home-service-template.zip", amount: 99900 },
} as const;

const failure = (status: number, message: string) => new NextResponse(message, { status, headers: { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id") || "";
  if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) return failure(400, "This download link is invalid.");
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) return failure(503, "Download verification is temporarily unavailable. Contact the studio for help.");

  try {
    const stripe = new Stripe(secret);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const slug = session.metadata?.productSlug;
    const product = slug && slug in products ? products[slug as keyof typeof products] : null;
    if (!product || session.mode !== "payment" || session.status !== "complete" || session.payment_status !== "paid" || session.currency !== "usd" || session.amount_total !== product.amount) {
      return failure(403, "A completed payment for this template could not be confirmed.");
    }
    const bytes = await readFile(path.join(process.cwd(), "products", "downloads", product.file));
    return new NextResponse(bytes, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${product.file}"`,
        "Content-Length": String(bytes.byteLength),
        "Cache-Control": "private, no-store, max-age=0",
        "Referrer-Policy": "no-referrer",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return failure(502, "Download verification could not complete. Contact the studio and include your Stripe receipt.");
  }
}
