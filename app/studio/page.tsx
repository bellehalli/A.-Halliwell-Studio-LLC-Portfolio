import { studio } from "@/lib/studio-config";
import { socialMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SceneProps from "@/components/visual/SceneProps";
import Navigation from "@/components/navigation/Navigation";

export const metadata: Metadata = {
  title: "Studio",
  description: "Meet Arabella Halliwell, founder, creative director and full-stack designer of A. Halliwell Studio, an independent web design, development and digital systems studio.",
  alternates: { canonical: "/studio" },
  ...socialMetadata("/studio", "Studio", "Meet Arabella Halliwell, founder, creative director and full-stack designer of A. Halliwell Studio, an independent web design, development and digital systems studio."),
};

const blocks: string[][] = [
  ["THE APPROACH", "Start with the decision.", "The work begins with what the customer needs to understand or do, where they hesitate and what the business needs the website to accomplish."],
  ["THE STANDARD", "Personality without sacrificing usability.", "Strong art direction can coexist with accessibility, performance, security and clear customer paths."],
  ["THE METHOD", "Strategy before decoration.", "Every interaction, page and custom feature should have a reason to exist. Complexity has to earn its place."],
  ["THE FOCUS", "Websites with a job to do.", "Hospitality is a current specialty, but the studio works across industries when a business needs design and development to solve a real digital problem."],
];

export default function Page() {
  return (
    <main className="destination-page studio-route">
      <div className="site-background" aria-hidden="true" />
      <Navigation />

      <article className="destination-sheet studio-destination"><SceneProps scene="studioPage"/>
        <section className="destination-hero"><small>A. HALLIWELL STUDIO / DETROIT, MICHIGAN</small><h1>The person behind the cursor.</h1><p>Good design should make you feel something. Good development should make the whole thing work.</p><div className="founder-profile-photo"><Image src="/assets/founder/arabella-halliwell.webp" alt="Arabella Payton-Halliwell, founder, creative director and full-stack designer of A. Halliwell Studio" fill sizes="(max-width: 800px) 90vw, 460px" priority/><span>ARABELLA PAYTON-HALLIWELL / FOUNDER</span></div></section>

        <section className="founder-profile">
          <div className="founder-profile-copy">
            <small>FOUNDER / CREATIVE DIRECTOR / FULL-STACK DESIGNER</small>
            <h2>Hi, I&apos;m Arabella.</h2>
            <p className="founder-lead">I build digital experiences where strategy, storytelling, and technology meet.</p>
            <p>With a bachelor&apos;s degree in psychology and years of experience in hospitality and customer-facing industries, I&apos;ve always been fascinated by the moments that influence decisions: what makes someone trust a brand, stay longer, explore further, or finally click “inquire.”</p>
            <p>That curiosity became the foundation of A. Halliwell Studio.</p>
            <p>I design and develop custom websites using modern web technologies, combining thoughtful user experience design with clean, intentional code. From responsive layouts and interactive experiences to custom components built with HTML, CSS, JavaScript, and modern development frameworks, every detail is created to look beautiful <strong>and work beautifully.</strong></p>
            <p>My approach sits between creative direction and problem-solving. I believe a website should guide people, communicate value, and create an experience that feels unmistakably yours.</p>
            <p>A. Halliwell Studio began with original concept builds because I believe the best way to show what&apos;s possible is to create it. Explore the work, interact with the experiences, and see the strategy behind every decision.</p>
            <div className="founder-facts"><span>DETROIT, MICHIGAN</span><span>INDEPENDENT DIGITAL STUDIO</span><span>STRATEGY + DESIGN + DEVELOPMENT</span></div>
            <a className="button button-primary" href={`mailto:${studio.email}`}>{studio.email}</a>
          </div>
        </section>

        <section className="destination-grid">{blocks.map(([label, title, body]) => <article key={label + title} className="destination-block"><small>{label}</small><h2>{title}</h2><p>{body}</p></article>)}</section>
        <section className="studio-commercial-section studio-capabilities" aria-labelledby="capabilities-heading"><small>CAPABILITIES / THE TOOLS BEHIND THE EXPERIENCE</small><h2 id="capabilities-heading">Designed with intention.<br/><em>Engineered to work.</em></h2><p>I connect the visible experience to the systems it needs, from a responsive interface to the payment, data, and email flows behind it. The technology follows the scope.</p><ul><li>Front-end development with HTML, CSS, JavaScript, and TypeScript</li><li>React / Next.js and custom interaction systems</li><li>APIs, integrations, and database-backed workflows</li><li>Stripe payments, private file delivery, and transactional email</li></ul></section>
        <section className="studio-integrity"><small>ABOUT THE WORK YOU SEE HERE</small><h2>No borrowed credibility.</h2><p>The portfolio uses original studio concepts to show strategy, design and development across industries. The brands are clearly labeled as concepts, and the studio does not publish invented testimonials, client logos or performance results.</p><div><Link className="button" href="/work">Inspect the work ↗</Link><Link className="button button-primary" href="/start">Start a project ↗</Link></div></section>
        <section className="case-end"><small>HAVE A DIGITAL PROBLEM TO SOLVE?</small><h2>Tell me what the<br />website needs to do.</h2><Link className="button button-primary" href="/start">Start a project ↗</Link></section>
      </article>
    </main>
  );
}
