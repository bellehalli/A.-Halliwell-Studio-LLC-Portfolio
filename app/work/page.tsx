import type { Metadata } from "next";
import Link from "next/link";
import ProjectMedia from "@/components/ProjectMedia";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Selected Work",
  description: "Original wedding venue and hospitality concept websites by A. Halliwell Studio, shown with live builds and transparent case-study thinking.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <main className="case-page work-page">
      <div className="site-background" aria-hidden="true" />
      <header className="case-nav shell">
        <Link className="logo" href="/"><span className="logo-mark">A.</span><span>HALLIWELL</span></Link>
        <Link href="/#start">Start a project ↗</Link>
      </header>

      <section className="case-sheet">
        <div className="case-hero">
          <div className="case-index"><span>SELECTED WORK</span><span>A. HALLIWELL STUDIO</span></div>
          <h1>Built to be<br />used.</h1>
          <p>Working venue concepts that show how I think about storytelling, decision-making, inquiry and custom interaction.</p>
          <p className="demo-disclosure"><strong>Original studio work:</strong> Willow Lily and Maison Rivière were created independently to demonstrate my approach. They are fictional venue brands, not commissioned client projects, and I do not claim invented results.</p>
        </div>

        <div className="work-proof-strip">
          <span>LIVE BUILDS</span>
          <span>CASE-STUDY THINKING</span>
          <span>WORKING INTERACTIONS</span>
          <span>NO INVENTED METRICS</span>
        </div>

        <div className="case-story">
          {projects.map((project) => (
            <article key={project.slug} className="work-index-project">
              <small>PROJECT {project.number} / {project.category}</small>
              <h2>{project.name}</h2>
              <p>{project.description}</p>
              <ProjectMedia project={project} />
              <div className="case-actions">
                <Link className="button button-primary" href={`/work/${project.slug}`}>View case study ↗</Link>
                <a className="button" href={project.url} target="_blank" rel="noreferrer">Visit live site ↗</a>
              </div>
            </article>
          ))}
        </div>

        <section className="case-end">
          <small>HAVE A VENUE PROJECT IN MIND?</small>
          <h2>Let&apos;s build something<br />worth clicking.</h2>
          <Link className="button button-primary" href="/#start">Start a project ↗</Link>
        </section>
      </section>
    </main>
  );
}
