import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Web Design, Development & Digital Systems",
  description: "Custom web design, development and digital systems for businesses that need the website to sell, book, explain, organize or automate.",
  alternates: { canonical: "/services" },
};

const blocks: string[][] = [
  ["01 / STRATEGY", "Start with the job.", "Map what customers need to understand, decide or do, then build the site around that path instead of forcing the business into a template."],
  ["02 / EXPERIENCE DESIGN", "Make the next step obvious.", "Structure content, navigation and responsive interactions around real customer questions, hesitation and intent."],
  ["03 / CUSTOM DEVELOPMENT", "Custom means useful.", "Purpose-built websites for businesses that need more than a styled homepage, from focused one-page launches to complete multi-page systems."],
  ["04 / COMMERCE + BOOKING", "Turn browsing into action.", "Products, appointments, reservations, memberships, tickets and inquiry paths designed around the decision instead of bolted on afterward."],
  ["05 / CUSTOM DIGITAL TOOLS", "Let the website participate.", "Quote builders, portals, interactive maps, filters, calculators, event systems, planning tools and business-specific features."],
  ["06 / LAUNCH + SUPPORT", "Launch is not the end.", "Testing, launch guidance, maintenance and continued refinement can be scoped around what the business actually needs after go-live."],
];

export default function Page() {
  return (
    <main className="destination-page">
      <div className="site-background" aria-hidden="true" />
      <header className="case-nav shell"><Link className="logo" href="/"><span className="logo-mark">A.</span><span>HALLIWELL</span></Link><nav className="destination-nav"><Link href="/work">Work</Link><Link href="/services">Services</Link><Link href="/studio">Studio</Link><Link href="/lab">Lab</Link></nav><Link href="/start">Start a project ↗</Link></header>

      <article className="destination-sheet">
        <section className="destination-hero">
          <small>WEB DESIGN + DEVELOPMENT + DIGITAL SYSTEMS</small>
          <h1>The website should participate in the business.</h1>
          <p>I combine strategy, custom design and development to build websites that help people understand, choose, buy, book, inquire or get something done.</p>
          <p><strong>One-page projects start at $1,000 + scope. Custom multi-page websites start at $5,000 + scope.</strong></p>
        </section>
        <section className="destination-grid">{blocks.map(([label, t, b]) => <article key={label + t} className="destination-block"><small>{label}</small><h2>{t}</h2><p>{b}</p></article>)}</section>
        <section className="case-end"><small>THE BUSINESS TELLS US WHAT TO BUILD</small><h2>Start with the<br />problem, not the template.</h2><Link className="button button-primary" href="/start">Start a project ↗</Link></section>
      </article>
    </main>
  );
}
