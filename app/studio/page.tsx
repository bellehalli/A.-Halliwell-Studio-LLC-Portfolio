import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SceneProps from "@/components/visual/SceneProps";

export const metadata: Metadata = {
  title: "Studio",
  description: "Meet Arabella Halliwell, founder, designer and developer of A. Halliwell Studio, an independent web design, development and digital systems studio.",
  alternates: { canonical: "/studio" },
};

const blocks: string[][] = [
  ["THE APPROACH", "Start with the decision.", "The work begins with what the customer needs to understand or do, where they hesitate and what the business needs the website to accomplish."],
  ["THE STANDARD", "Personality without sacrificing usability.", "Strong art direction can coexist with accessibility, performance, security and clear customer paths."],
  ["THE METHOD", "Strategy before decoration.", "Every interaction, page and custom feature should have a reason to exist. Complexity has to earn its place."],
  ["THE FOCUS", "Websites with a job to do.", "Hospitality is a current specialty, but the studio works across industries when a business needs design and development to solve a real digital problem."],
];

export default function Page() {
  return (
    <main className="destination-page">
      <div className="site-background" aria-hidden="true" />
      <header className="case-nav shell"><Link className="logo" href="/"><span className="logo-mark">A.</span><span>HALLIWELL</span></Link><nav className="destination-nav"><Link href="/work">Work</Link><Link href="/services">Services</Link><Link href="/studio">Studio</Link><Link href="/lab">Lab</Link></nav><Link href="/start">Start a project ↗</Link></header>

      <article className="destination-sheet studio-destination"><SceneProps scene="studioPage"/>
        <section className="destination-hero"><small>A. HALLIWELL STUDIO / DETROIT, MICHIGAN</small><h1>The person behind the cursor.</h1><p>An independent web design, development and digital systems studio building expressive, useful websites around what each business actually needs the internet to do.</p></section>

        <section className="founder-profile">
          <div className="founder-profile-photo"><Image src="/assets/founder/arabella-halliwell.PNG" alt="Arabella Halliwell, founder, designer and developer of A. Halliwell Studio" fill sizes="(max-width: 800px) 90vw, 460px" priority/><span>ARABELLA HALLIWELL / FOUNDER</span></div>
          <div className="founder-profile-copy"><small>FOUNDER / DESIGNER / DEVELOPER</small><h2>Hi, I&apos;m Arabella.</h2><p className="founder-lead">My background sits at the intersection of psychology, hospitality and digital design.</p><p>I spent years working directly with customers before moving into web design and development. That experience shaped how I work now: I pay attention to what people need to understand, what creates trust, where they hesitate and what makes the next step feel easy.</p><p>That lens changes with the business. A venue needs a digital first tour. A med spa needs treatment discovery and booking clarity. A contractor needs urgency routing. A shop needs a clean path from product to cart.</p><div className="founder-facts"><span>DETROIT, MICHIGAN</span><span>INDEPENDENT STUDIO</span><span>STRATEGY + DESIGN + DEVELOPMENT</span></div><a className="button button-primary" href="mailto:hello@ahalliwellstudio.com">hello@ahalliwellstudio.com ↗</a></div>
        </section>

        <section className="destination-grid">{blocks.map(([label, title, body]) => <article key={label + title} className="destination-block"><small>{label}</small><h2>{title}</h2><p>{body}</p></article>)}</section>
        <section className="studio-integrity"><small>ABOUT THE WORK YOU SEE HERE</small><h2>No borrowed credibility.</h2><p>The portfolio uses original studio concepts to show strategy, design and development across industries. The brands are clearly labeled as concepts, and the studio does not publish invented testimonials, client logos or performance results.</p><div><Link className="button" href="/work">Inspect the work ↗</Link><Link className="button button-primary" href="/start">Start a project ↗</Link></div></section>
        <section className="case-end"><small>HAVE A DIGITAL PROBLEM TO SOLVE?</small><h2>Tell me what the<br />website needs to do.</h2><Link className="button button-primary" href="/start">Start a project ↗</Link></section>
      </article>
    </main>
  );
}
