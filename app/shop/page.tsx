import type { Metadata } from "next";
import Navigation from "@/components/navigation/Navigation";
import { studio } from "@/lib/studio-config";

export const metadata: Metadata = {
  title: "Ready-to-Launch Websites | A. Halliwell Studio",
  description: "Explore existing A. Halliwell Studio concept websites available as the starting point for a paid, scoped website installation and customization.",
  alternates: { canonical: "/shop" },
};

const products = [
  { industry: "AESTHETICS + WELLNESS", title: "Élan-inspired website launch", amount: "$999", description: "An expressive starting point for an independent med spa or aesthetics practice. Adapt the existing visual direction, service content and consultation path to your brand.", preview: "https://elan.ahalliwellstudio.com", slug: "elan" },
  { industry: "HOME SERVICES", title: "Northstar-inspired website launch", amount: "$999", description: "A practical starting point for an HVAC or home-service business, with clear service navigation, a contact path and mobile-ready layouts.", preview: "https://northstar.ahalliwellstudio.com", slug: "northstar" },
];
const inquiry = (title: string) => `mailto:${studio.email}?subject=${encodeURIComponent("Ready-to-launch inquiry: " + title)}&body=${encodeURIComponent("Hello A. Halliwell Studio, I'm interested in the " + title + " offer. My business name, existing domain and ideal launch timeline are: ")}`;

export default function ShopPage() {
  return <main className="full-picture" style={{ minHeight: "100vh", background: "linear-gradient(145deg,#f8f2ff 0%,#f6e9f1 52%,#fff9fc 100%)", color: "#33223a" }}>
    <Navigation />
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(100px,12vw,160px) 24px 96px" }}>
      <p style={{ fontSize: 12, letterSpacing: ".24em", fontWeight: 700 }}>A. HALLIWELL STUDIO / READY-TO-LAUNCH</p>
      <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(48px,7.5vw,92px)", letterSpacing: "-.06em", lineHeight: 1.04, margin: "22px 0" }}>Good design.<br/><em>Less starting over.</em></h1>
      <p style={{ maxWidth: 670, fontSize: "clamp(17px,2vw,21px)", lineHeight: 1.6 }}>Choose an existing studio concept as the starting point for your next website. We customize and launch it for your business, with clear scope and a straightforward inquiry process.</p>
      <p style={{ maxWidth: 680, fontSize: 14, lineHeight: 1.7, opacity: .75 }}>These are paid implementation offers, not instant downloadable purchases. The portfolio demos are fictional studio concepts. A branded production website, project specifics and delivery schedule are confirmed before payment.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,320px),1fr))", gap: 22, marginTop: 45 }}>
        {products.map(product => <article key={product.slug} style={{ background: "rgba(255,255,255,.84)", border: "1px solid #dfc8e3", borderRadius: 22, padding: "clamp(24px,3vw,36px)", boxShadow: "0 12px 42px rgba(95,45,105,.07)" }}>
          <p style={{ fontSize: 11, letterSpacing: ".16em", fontWeight: 700 }}>{product.industry}</p>
          <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(27px,3vw,37px)", lineHeight: 1.16, margin: "19px 0" }}>{product.title}</h2>
          <p style={{ fontSize: 30, fontFamily: "Georgia,serif", margin: "0 0 14px" }}>From {product.amount}</p>
          <p style={{ lineHeight: 1.7, minHeight: 110 }}>{product.description}</p>
          <a href={product.preview} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", textDecoration: "underline", textUnderlineOffset: 4, margin: "8px 20px 16px 0", color: "#5b3366" }}>Explore live concept →</a>
          <a href={inquiry(product.title)} style={{ display: "inline-block", padding: "13px 19px", background: "#5a3564", color: "white", borderRadius: 100, fontWeight: 700, textDecoration: "none", marginBottom: 14 }}>Ask about this launch →</a>
        </article>)}
      </div>
      <section style={{ marginTop: 44, borderTop: "1px solid #cfbdd2", paddingTop: 32 }}>
        <h2 style={{ fontFamily: "Georgia,serif", fontSize: 32 }}>Prefer something entirely your own?</h2>
        <p style={{ lineHeight: 1.7, maxWidth: 700 }}>Our bespoke websites and advanced interactive systems remain available as separately scoped studio engagements. These ready-to-launch offerings are deliberately more limited.</p>
        <a href="/start" style={{ color: "#5b3366", fontWeight: 700, textUnderlineOffset: 4 }}>Discuss a custom project →</a>
      </section>
      <p style={{ fontSize: 13, lineHeight: 1.7, marginTop: 55, opacity: .75 }}>Launch package inclusions, hosting, third-party costs, licensing, revisions and timelines are defined in the written proposal before purchase. No medical claims, business credentials, sample ratings or demo contact details are transferred as factual client information.</p>
    </div>
  </main>;
}
