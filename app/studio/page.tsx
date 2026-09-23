import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Studio",
  description: "Meet Arabella Halliwell, founder, designer and developer of A. Halliwell Studio, an independent studio focused on wedding venues and hospitality.",
  alternates: { canonical: "/studio" },
};

const blocks: string[][] = [
  ["THE APPROACH", "Start with the decision.", "The work begins with how couples choose a venue, what they need to understand before they inquire and where the existing digital experience creates friction."],
  ["THE STANDARD", "Personality without sacrificing usability.", "Strong art direction can coexist with accessibility, performance, security and clear inquiry paths."],
  ["THE METHOD", "Strategy before decoration.", "Every interaction, page and custom feature should have a reason to exist. Complexity has to earn its place."],
  ["THE FOCUS", "Wedding venues + hospitality.", "The studio is intentionally focused on properties and hospitality brands where the website has to communicate both atmosphere and practical decision-making information."],
];

export default function Page() {
  return (
    <main className="destination-page">
      <div className="site-background" aria-hidden="true" />

      <header className="case-nav shell">
        <Link className="logo" href="/"><span className="logo-mark">A.</span><span>HALLIWELL</span></Link>
        <nav className="destination-nav">
          <Link href="/work">Work</Link>
          <Link href="/services">Services</Link>
          <Link href="/studio">Studio</Link>
          <Link href="/lab">Lab</Link>
        </nav>
        <Link href="/start">Start a project ↗</Link>
      </header>

      <article className="destination-sheet studio-destination">
        <section className="destination-hero">
          <small>A. HALLIWELL STUDIO / DETROIT, MICHIGAN</small>
          <h1>The person behind the cursor.</h1>
          <p>An independent web design and development studio focused on wedding venues and hospitality brands that want the digital experience to feel as considered as the property itself.</p>
        </section>

        <section className="founder-profile">
          <div className="founder-profile-photo">
            <Image
              src="/assets/founder/arabella-halliwell.jpg"
              alt="Arabella Halliwell, founder, designer and developer of A. Halliwell Studio"
              fill
              sizes="(max-width: 800px) 90vw, 460px"
              priority
            />
            <span>ARABELLA HALLIWELL / FOUNDER</span>
          </div>

          <div className="founder-profile-copy">
            <small>FOUNDER / DESIGNER / DEVELOPER</small>
            <h2>Hi, I&apos;m Arabella.</h2>
            <p className="founder-lead">My background sits at the intersection of psychology, hospitality and digital design.</p>
            <p>I spent years working directly with customers before moving into web design and development. That experience shaped how I work now: I pay attention to what people need to understand, what creates trust, where they hesitate and what makes the next step feel easy.</p>
            <p>For venue websites, that means the work is never only about making a property look beautiful. The site also has to explain the experience, answer practical questions and help the right couple feel ready to inquire.</p>

            <div className="founder-facts">
              <span>DETROIT, MICHIGAN</span>
              <span>INDEPENDENT STUDIO</span>
              <span>STRATEGY + DESIGN + DEVELOPMENT</span>
            </div>

            <a className="button button-primary" href="mailto:hello@ahalliwellstudio.com">hello@ahalliwellstudio.com ↗</a>
          </div>
        </section>

        <section className="destination-grid">
          {blocks.map(([label, title, body]) => (
            <article key={label + title} className="destination-block">
              <small>{label}</small>
              <h2>{title}</h2>
              <p>{body}</p>
            </article>
          ))}
        </section>

        <section className="studio-integrity">
          <small>ABOUT THE WORK YOU SEE HERE</small>
          <h2>No borrowed credibility.</h2>
          <p>Willow Lily and Maison Rivière are original studio concepts created to demonstrate my strategy, design and development approach. They are not commissioned client projects, and I do not publish invented testimonials, logos or results.</p>
          <div>
            <Link className="button" href="/work">Inspect the work ↗</Link>
            <Link className="button button-primary" href="/start">Start a project ↗</Link>
          </div>
        </section>

        <section className="case-end">
          <small>HAVE A VENUE OR HOSPITALITY PROJECT?</small>
          <h2>Tell me what the<br />website needs to do.</h2>
          <Link className="button button-primary" href="/start">Start a project ↗</Link>
        </section>
      </article>
    </main>
  );
}
