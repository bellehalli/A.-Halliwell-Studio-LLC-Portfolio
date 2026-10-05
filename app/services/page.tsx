import StudioProcess from "@/components/studio/StudioProcess";
import ClientExperience from "@/components/studio/ClientExperience";
import StudioContinuity from "@/components/studio/StudioContinuity";
import { pricingSummary } from "@/lib/studio-config";
import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import ConsultationLink from "@/components/ConsultationLink";
import StudioFaq from "@/components/StudioFaq";
import SceneProps from "@/components/visual/SceneProps";
import Navigation from "@/components/navigation/Navigation";
import JsonLd from "@/components/seo/JsonLd";
import { serviceSchema } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  path: "/services",
  title: "Custom Web Design, Development & Digital Systems",
  description: "Custom web design, development, interactive experiences, property maps and digital systems for businesses that need the website to do more.",
});

const blocks = [
  ["01 / WEB STRATEGY", "Start with the job.", "Define what customers need to understand, decide or do, then shape the website around that path instead of forcing the business into a template."],
  ["02 / CUSTOM WEB DESIGN", "Make the experience unmistakably yours.", "Original responsive design, information architecture and user experience shaped around the brand, offer and customer journey."],
  ["03 / WEB DEVELOPMENT", "Build the thing properly.", "Custom front-end development and modern web applications for focused launches, multi-page websites and interactive digital experiences."],
  ["04 / COMMERCE + BOOKING", "Turn browsing into action.", "Products, appointments, reservations, memberships, tickets and inquiry paths designed around the decision instead of bolted on afterward."],
  ["05 / INTERACTIVE DIGITAL SYSTEMS", "Let the website participate.", "Quote builders, portals, interactive maps, filters, calculators, planning tools and business-specific features that make complex experiences easier to use."],
  ["06 / REDESIGN + REFINEMENT", "Make what already exists work harder.", "Strategic redesigns and focused improvements to usability, content hierarchy, conversion paths, accessibility and customer experience."],
];

export default function Page() {
  return (
    <main className="destination-page services-route">
      <JsonLd data={serviceSchema({
        name: "Custom Web Design, Development & Digital Systems",
        description: "Custom websites, interactive digital experiences and digital systems for experience-driven businesses.",
        path: "/services",
      })} />
      <div className="site-background" aria-hidden="true" />
      <Navigation />
      <article className="destination-sheet services-destination"><SceneProps scene="services"/>
        <section className="destination-hero">
          <small>CUSTOM WEB DESIGN + DEVELOPMENT + INTERACTIVE DIGITAL EXPERIENCES</small>
          <h1>The website should participate in the business.</h1>
          <p>A. Halliwell Studio combines strategy, custom web design and development to build digital experiences that help people understand, choose, buy, book, inquire, plan or get something done.</p>
          <p><strong>{pricingSummary}</strong></p>
        </section>

        <section className="destination-grid">{blocks.map(([label, t, b]) => <article key={label + t} className="destination-block"><small>{label}</small><h2>{t}</h2><p>{b}</p></article>)}</section>

        <section className="destination-block">
          <small>EXPLORE BY SERVICE</small>
          <h2>Choose the problem you need solved.</h2>
          <p><Link href="/web-design">Custom web design ↗</Link></p>
          <p><Link href="/web-development">Custom web development ↗</Link></p>
          <p><Link href="/interactive-experiences">Interactive digital experiences ↗</Link></p>
        </section>

        <section className="destination-block" id="illustration">
          <small>ILLUSTRATION / PROPERTY + VENUE MAPS</small>
          <h2>Let people picture the place.</h2>
          <div>
            <p>Custom illustrations and property maps that help guests understand a venue, explore the grounds and imagine being there. Built for websites, brochures, welcome guides and other agreed uses.</p>
            <p>A standalone illustration and an interactive website map are separate scopes. Interactive maps can add clickable spaces, layouts, guest counts, journeys and planning information.</p>
            <p><strong>Priced by scope.</strong> Your agreement defines the commercial usage license for final artwork and any additional uses.</p>
            <Link className="button button-primary" href="/start">Discuss your project ↗</Link>
          </div>
        </section>

        <StudioProcess />
        <ClientExperience />
        <StudioContinuity />
        <StudioFaq />
        <ConsultationLink />
        <section className="case-end"><small>THE BUSINESS TELLS US WHAT TO BUILD</small><h2>Start with the<br />problem, not the template.</h2><Link className="button button-primary" href="/start">Start a project ↗</Link></section>
      </article>
    </main>
  );
}
