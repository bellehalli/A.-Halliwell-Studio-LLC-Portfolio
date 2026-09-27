import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectMedia from "@/components/ProjectMedia";
import CaseStudyWorld from "@/components/projects/CaseStudyWorld";
import { caseStudies } from "@/data/caseStudies";
import { getProject, projects } from "@/data/projects";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return projects.map((p) => ({ slug: p.slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project Not Found", robots: { index: false, follow: false } };
  return { title: `${project.name} Case Study`, description: project.description, alternates: { canonical: `/work/${project.slug}` } };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <main className={`case-page ${caseStudies[project.slug] ? "case-page-editorial" : ""}`}>
      <div className="site-background" aria-hidden="true" />
      <header className="case-nav shell"><Link className="logo" href="/"><span className="logo-mark">A.</span><span>HALLIWELL</span></Link><Link href="/work">← Selected Work</Link></header>

      {caseStudies[project.slug] ? <CaseStudyWorld project={project} study={caseStudies[project.slug]} /> : <article className={`case-sheet project-${project.tone}`}>
        <section className="case-hero">
          <div className="case-index"><span>PROJECT {project.number}</span><span>{project.category}</span></div>
          <h1>{project.name}</h1>
          <p>{project.description}</p>
          <p className="demo-disclosure">{project.disclosure}</p>
          <div className="project-links"><a href={project.url} target={project.url.startsWith("http") ? "_blank" : undefined} rel={project.url.startsWith("http") ? "noopener noreferrer" : undefined}>Visit live build ↗</a></div>
        </section>

        <ProjectMedia project={project} />

        {project.slug === "willow-lily" && <section className="case-journey" aria-label="The couple's journey">
          <span>THE GUEST JOURNEY</span>
          <ol>
            <li><b>01</b><strong>Discover the estate</strong><p>Meet the setting and the feeling of a weekend here.</p></li>
            <li><b>02</b><strong>Imagine the celebration</strong><p>Explore the spaces, stay and ceremony possibilities.</p></li>
            <li><b>03</b><strong>Understand the offering</strong><p>Find planning details and investment before reaching out.</p></li>
            <li><b>04</b><strong>Request a tour</strong><p>Move from inspiration to a clear inquiry path.</p></li>
          </ol>
        </section>}

        <section className="case-story">
          <div><small>01 / THE BRIEF</small><h2>Start with<br />the real job.</h2></div><div><p>{project.brief}</p></div>
          <div><small>02 / THE PROBLEM</small><h2>Find the<br />friction.</h2></div><div><p>{project.challenge}</p></div>
          <div><small>03 / THE STRATEGY</small><h2>Design the<br />decision.</h2></div><div><p>{project.strategy}</p></div>
          <div><small>04 / THE DIGITAL EXPERIENCE</small><h2>Make the site<br />participate.</h2></div>
          <div className="case-approach">{project.approach.map((item, i) => <div key={item}><span>{String(i + 1).padStart(2, "0")}</span><strong>{item}</strong></div>)}</div>
          <div><small>05 / THE BUSINESS PURPOSE</small><h2>What the concept<br />proves.</h2></div><div><p>{project.outcome}</p></div>
          <div className="case-capabilities"><small>06 / CAPABILITIES</small><div>{project.details.map((d) => <span key={d}>{d}</span>)}</div></div>
        </section>

        <section className="case-end"><small>NEED A SITE WITH A JOB TO DO?</small><h2>Build around the<br />business problem.</h2><Link className="button button-primary" href="/start">Start a project ↗</Link></section>
      </article>}
    </main>
  );
}
