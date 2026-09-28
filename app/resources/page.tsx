import type { Metadata } from "next";
import Link from "next/link";
import SceneProps from "@/components/visual/SceneProps";
import Navigation from "@/components/navigation/Navigation";

export const metadata: Metadata = {
  title: "Resources",
  description: "Practical notes from A. Halliwell Studio about websites, digital experiences and business systems.",
  alternates: { canonical: "/resources" },
};

const resources = [
  {
    type: "GUIDE",
    title: "What should a wedding venue website include?",
    body: "A practical framework for helping prospective couples understand the property, offer and next step.",
    href: "/resources/wedding-venue-website",
  },
  {
    type: "CHECKLIST",
    title: "Website redesign checklist",
    body: "What to examine before rebuilding a website simply because it looks dated.",
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
          <small>JOURNAL + RESOURCES</small>
          <h1>Useful things for better websites.</h1>
          <p>Practical notes about custom websites, customer journeys and the systems behind them.</p>
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
        <section className="case-end"><small>NEED MORE THAN A CHECKLIST?</small><h2>Let&apos;s talk about<br />the actual project.</h2><Link className="button button-primary" href="/start">Start a project ↗</Link></section>
      </article>
    </main>
  );
}
