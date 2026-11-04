import { ArrowUpRight } from "@/components/ui/StudioIcons";
import Link from "next/link";
import Navigation from "@/components/navigation/Navigation";
import JsonLd from "@/components/seo/JsonLd";
import "./service-editorial.css";

type Section = { eyebrow: string; title: string; body: string };
type ProofLink = { href: string; label: string };
type Theme = "design" | "development" | "interactive";

export default function SeoLandingPage({
  eyebrow, title, intro, sections, proofLinks = [], schema, theme = "design",
  lead, outcomes = [], pricingNote,
}: {
  eyebrow: string; title: string; intro: string; sections: Section[];
  proofLinks?: ProofLink[]; schema: object; theme?: Theme;
  lead?: string; outcomes?: string[]; pricingNote?: string;
}) {
  return (
    <main className={`destination-page service-editorial service-editorial--${theme}`}>
      <JsonLd data={schema} />
      <div className="site-background" aria-hidden="true" />
      <Navigation />
      <article className="destination-sheet service-editorial-sheet">
        <header className="service-editorial-hero">
          <div className="service-editorial-kicker"><span>A. HALLIWELL STUDIO</span><span>{eyebrow}</span></div>
          <div className="service-editorial-hero-grid">
            <div>
              <p className="service-editorial-overline">AN EXPERIENCE BUILT AROUND YOUR BUSINESS</p>
              <h1>{title}</h1>
            </div>
            <aside className="service-editorial-intro">
              <p>{intro}</p>
              <Link className="button button-primary" href="/start">Discuss your project <ArrowUpRight /></Link>
              <Link className="service-editorial-back" href="/services">Explore all services <ArrowUpRight /></Link>
            </aside>
          </div>
          <div className="service-editorial-art" aria-hidden="true"><span>✦</span><span>✧</span><span>✦</span></div>
        </header>

        <section className="service-editorial-overview" aria-labelledby="service-editorial-overview">
          <small>THE APPROACH / 01</small>
          <h2 id="service-editorial-overview">{lead || "A better digital experience begins with a clearer purpose."}</h2>
        </section>

        <section className="service-editorial-details" aria-label="What goes into the work">
          {sections.map((section, index) => (
            <article className="service-editorial-detail" key={section.title}>
              <span className="service-editorial-number">{String(index + 1).padStart(2, "0")}</span>
              <div><small>{section.eyebrow}</small><h3>{section.title}</h3></div>
              <p>{section.body}</p>
            </article>
          ))}
        </section>

        {outcomes.length > 0 && <section className="service-editorial-outcomes">
          <div><small>WHAT THIS CAN LOOK LIKE / 02</small><h2>Built for the way people actually use your business.</h2></div>
          <ul>{outcomes.map(outcome => <li key={outcome}>{outcome}</li>)}</ul>
        </section>}

        {proofLinks.length > 0 && <section className="service-editorial-proof">
          <small>EXPLORE THE STUDIO / 03</small>
          <h2>See what the studio can build.</h2>
          <div className="service-editorial-proof-links">{proofLinks.map(link => <Link key={link.href} href={link.href}><span>{link.label}</span><ArrowUpRight /></Link>)}</div>
        </section>}

        <section className="service-editorial-close">
          <div><small>YOUR PROJECT, YOUR SCOPE</small><h2>Let's make it work beautifully.</h2>
            <p>{pricingNote || "Every project is scoped around its actual requirements. You'll receive a written proposal before work begins."}</p>
          </div>
          <Link className="button button-primary" href="/start">Start a project <ArrowUpRight /></Link>
        </section>
      </article>
    </main>
  );
}
