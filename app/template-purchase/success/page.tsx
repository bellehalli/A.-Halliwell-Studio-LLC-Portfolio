import type { Metadata } from "next";
import Link from "next/link";
import Stripe from "stripe";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your AHS Template Download", robots: { index: false, follow: false } };

const products: Record<string, { name: string; amount: number }> = {
  "beauty-booking-template": { name: "Beauty, Booked.", amount: 14900 },
  "protective-style-template": { name: "Rooted Rituals", amount: 14900 },
  "nail-artist-template": { name: "Nail Theory", amount: 14900 },
  "lash-brow-template": { name: "Set & Stare", amount: 14900 },
  "skin-studio-template": { name: "Stillwater Skin", amount: 14900 },
  "elan-aesthetics-template": { name: "Élan Aesthetics", amount: 99900 },
  "vanta-social-template": { name: "Vanta Social", amount: 99900 },
  "northstar-home-service-template": { name: "Northstar Heating & Home", amount: 39900 },
};

export default async function TemplatePurchaseSuccess({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id: sessionId = "" } = await searchParams;
  let product: { name: string; amount: number } | null = null;
  if (/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId) && process.env.STRIPE_SECRET_KEY) {
    try {
      const session = await new Stripe(process.env.STRIPE_SECRET_KEY).checkout.sessions.retrieve(sessionId);
      const candidate = session.metadata?.productSlug ? products[session.metadata.productSlug] : null;
      if (candidate && session.mode === "payment" && session.status === "complete" && session.payment_status === "paid" && session.currency === "usd" && session.amount_total === candidate.amount) product = candidate;
    } catch { /* Show the recovery message below if Stripe cannot verify the session. */ }
  }

  return <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "#fbf7f5", color: "#321425" }}>
    <section style={{ width: "min(100%,620px)", padding: "clamp(28px,6vw,56px)", border: "1px solid #ddc8d3", borderRadius: 24, background: "white", textAlign: "center", boxShadow: "0 20px 65px #32142512" }}>
      <p style={{ fontSize: 11, letterSpacing: ".18em", fontWeight: 800 }}>A. HALLIWELL STUDIO / TEMPLATE EDIT</p>
      {product ? <>
        <h1 style={{ margin: "20px 0 12px", font: "400 clamp(36px,8vw,58px)/1.05 Georgia,serif" }}>Your template<br/><em>is ready.</em></h1>
        <p style={{ lineHeight: 1.7 }}>Payment confirmed for <strong>{product.name}</strong>. Download your ZIP below. Your setup guides, customization instructions, and included project files are inside the ZIP.</p>
        <a href={`/api/templates/download?session_id=${encodeURIComponent(sessionId)}`} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: 52, margin: "18px 0 10px", padding: "0 24px", borderRadius: 999, background: "#5b2344", color: "white", textDecoration: "none", fontSize: 11, fontWeight: 800, letterSpacing: ".12em" }}>DOWNLOAD YOUR TEMPLATE</a>
        <p style={{ fontSize: 13, lineHeight: 1.6 }}>Keep your Stripe receipt. This purchase license covers one business and one website. Questions? <a href="mailto:hello@ahalliwellstudio.com">Email the studio</a>.</p>
      </> : <>
        <h1 style={{ margin: "20px 0 12px", font: "400 clamp(36px,8vw,58px)/1.05 Georgia,serif" }}>We couldn’t<br/><em>verify payment.</em></h1>
        <p style={{ lineHeight: 1.7 }}>No download was released. If you completed checkout, keep your Stripe receipt and <a href="mailto:hello@ahalliwellstudio.com">contact the studio</a> so we can help.</p>
      </>}
      <Link href="/beauty-booking-template" style={{ display: "inline-block", marginTop: 16, color: "#5b2344", textUnderlineOffset: 4 }}>Back to the template collection</Link>
    </section>
  </main>;
}
