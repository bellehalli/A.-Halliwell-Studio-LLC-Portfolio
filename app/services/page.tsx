import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Wedding Venue Web Design Services",
  description: "Custom strategy, web design and development for wedding venues and hospitality brands that want clearer inquiry paths and a more distinctive digital experience.",
  alternates: { canonical: "/services" },
};

const blocks: string[][] = [
  ["01 / VENUE STRATEGY", "Start with the decision.", "Map what couples need to understand before they inquire: the property, the experience, the investment, the stay, the logistics and the next step."],
  ["02 / EXPERIENCE DESIGN", "Make the venue easy to picture.", "Shape the content, navigation and responsive experience around the emotional and practical questions couples bring to a venue website."],
  ["03 / CUSTOM DEVELOPMENT", "Custom means custom.", "Purpose-built websites for venues that have outgrown template-shaped pages and need the digital experience to match the property."],
  ["04 / INQUIRY + BOOKING UX", "Make action feel obvious.", "Tour requests, availability, inquiry, pricing and booking paths designed to reduce uncertainty and keep momentum."],
  ["05 / INTERACTIVE VENUE TOOLS", "Let the website participate.", "Interactive maps, weekend builders, planning tools, itineraries and custom features that help couples understand the experience before they arrive."],
  ["06 / LAUNCH + SUPPORT", "Launch is not the end.", "Testing, launch guidance, maintenance and continued refinement under a separate support agreement."],
];

export default function Page() {
  return (
    <main className="destination-page">
      <div className="site-background" aria-hidden="true" />
      <header className="case-nav shell">
        <Link className="logo" href="/"><span className="logo-mark">A.</span><span>HALLIWELL</span></Link>
        <nav className="destination-nav"><Link href="/work">Work</Link><Link href="/services">Services</Link><Link href="/studio">Studio</Link><Link href="/lab">Lab</Link></nav>
        <Link href="/start">Start a project ↗</Link>
      </header>

      <article className="destination-sheet">
        <section className="destination-hero">
          <small>FOR WEDDING VENUES + HOSPITALITY</small>
          <h1>The website should participate in the sale.</h1>
          <p>I combine strategy, custom design and development to help venues communicate the experience clearly, feel distinctive online and make inquiry easier.</p>
          <p><strong>Custom websites start at $5,000 + scope.</strong></p>
        </section>

        <section className="destination-grid">
          {blocks.map(([label, t, b]) => (
            <article key={label + t} className="destination-block">
              <small>{label}</small>
              <h2>{t}</h2>
              <p>{b}</p>
            </article>
          ))}
        </section>

        <section className="case-end">
          <small>YOUR VENUE, BUT EASIER TO UNDERSTAND ONLINE</small>
          <h2>Build something<br />worth booking.</h2>
          <Link className="button button-primary" href="/start">Start a project ↗</Link>
        </section>
      </article>
    </main>
  );
}
