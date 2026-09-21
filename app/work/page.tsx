import type { Metadata } from "next";
import Link from "next/link";
import ProjectMedia from "@/components/ProjectMedia";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Selected Work",
  description: "Selected custom websites and digital experiences by A. Halliwell Studio.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <main className="case-page">
      <div className="site-background" aria-hidden="true" />
      <header className="case-nav shell">
        <Link className="logo" href="/"><span className="logo-mark">A.</span><span>HALLIWELL</span></Link>
        <Link href="/#start">Start a project ↗</Link>
      </header>
      <section className="case-sheet">
        <div className="case-hero">
          <div className="case-index"><span>SELECTED WORK</span><span>A. HALLIWELL STUDIO</span></div>
          <h1>Built to be<br/>used.</h1>
          <p>Custom digital experiences designed around what each business actually needs the internet to do.</p>
        </div>
        <div className="case-story">
          {projects.map((project) => (
            <article key={project.slug} className="work-index-project">
              <small>PROJECT {project.number} / {project.category}</small>
              <h2>{project.name}</h2>
              <p>{project.description}</p>
              <ProjectMedia name={project.name} url={project.url} />
              <div className="case-actions">
                <Link className="button button-primary" href={`/work/${project.slug}`}>View case study ↗</Link>
                <a className="button" href={project.url} target="_blank" rel="noreferrer">Visit live site ↗</a>
              </div>
            </article>
          ))}
        </div>
        <section className="case-end"><small>HAVE A PROJECT IN MIND?</small><h2>Let's build something<br/>worth clicking.</h2><Link className="button button-primary" href="/#start">Start a project ↗</Link></section>
      </section>
    </main>
  );
}
