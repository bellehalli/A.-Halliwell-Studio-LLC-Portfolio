import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import SceneProps from "@/components/visual/SceneProps";
import Navigation from "@/components/navigation/Navigation";

export const metadata: Metadata = pageMetadata({
  path: "/resources",
  title: "Web Design Resources & Guides",
  description: "Practical web design guides from A. Halliwell Studio about website strategy, customer journeys, redesigns, hospitality websites and digital experiences.",
});

const resources = [
  {
    type: "WEDDING VENUE GUIDE",
    title: "What should a wedding venue website include?",
    body: "A practical framework for helping prospective couples understand the property, offering, investment and next step.",
    href: "/resources/wedding-venue-website",
  },
  {
    type: "REDESIGN CHECKLIST",
    title: "Website redesign checklist",
    body: "What to audit before rebuilding a website, including SEO equity, customer journey, integrations, accessibility and conversion paths.",
    href: "/resources/website-redesign-checklist",
  },
];

export default function ResourcesPage() {
  return (
    <main className="destination-page">
      <div className="site-background" aria-hidden="true" />
      <Navigation />
      <article className="destination-sheet resources-destination"><SceneProps scene="resources"/>
        <section className="destination-hero">
          <small>WEB DESIGN RESOURCES + GUIDES</small>
          <h1>Useful thinking for better websites.</h1>
          <p>Practical guides about custom web design, customer journeys, digital experiences and the systems behind them.</p>
        </section>
        <section className="destination-grid">
          {resources.map(item => (
            <Link className="destination-block resource-link" href={item.href} key={item.href}>
              <small>{item.type}</small>
              <h2>{item.title}</h2>
              <p>{item.body}</p>
              <strong>Read ↗</strong>
            </Link>
          ))}
        </section>
        <section className="destination-block">
          <small>LOOKING FOR THE STUDIO?</small>
          <h2>Explore services and proof.</h2>
          <p><Link href="/services">Custom web design + development services ↗</Link></p>
          <p><Link href="/work">Selected work + case studies ↗</Link></p>
          <p><Link href="/lab">Interactive capability Lab ↗</Link></p>
        </section>
        <section className="case-end"><small>NEED MORE THAN A CHECKLIST?</small><h2>Let&apos;s talk about<br />the actual project.</h2><Link className="button button-primary" href="/start">Start a project ↗</Link></section>
      </article>
    </main>
  );
}
