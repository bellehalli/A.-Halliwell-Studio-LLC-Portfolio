import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import ProjectMedia from "@/components/ProjectMedia";
import CaseStudyWorld from "@/components/projects/CaseStudyWorld";
import { caseStudies } from "@/data/caseStudies";
import { getProject, publicProjects } from "@/data/projects";
import Navigation from "@/components/navigation/Navigation";

type Props = { params: Promise<{ slug: string }> };

const aliases: Record<string, string> = { vanta: "vanta-social", elan: "elan-aesthetics", northstar: "northstar-heating-home" };
export function generateStaticParams() { return [...publicProjects.map((p) => ({ slug: p.slug })), ...Object.keys(aliases).map(slug => ({ slug }))]; }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(aliases[slug] ?? slug);
  if (!project || project.inDevelopment) return { title: "Project Not Found", robots: { index: false, follow: false } };
  return { title: project.inDevelopment?`${project.name} · Coming Soon`:`${project.name} Case Study`, description: project.description, robots: project.inDevelopment?{index:false,follow:true}:undefined, alternates: { canonical: `/work/${project.slug}` }, openGraph: { title: `${project.name} | A. Halliwell Studio`, description: project.description, url: `/work/${project.slug}`, images: [{url:"/og-image.png",width:1200,height:630,alt:"A. Halliwell Studio portfolio case study"}] }, twitter: {card:"summary_large_image",title:`${project.name} | A. Halliwell Studio`,description:project.description,images:["/og-image.png"]} };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  if (aliases[slug]) permanentRedirect(`/work/${aliases[slug]}`);
  const project = getProject(slug);
  if (!project || project.inDevelopment) notFound();

  return (
    <main className={`case-page ${caseStudies[project.slug] ? "case-page-editorial" : ""}`}>
      <div className="site-background" aria-hidden="true" />
      <Navigation />

      {project.inDevelopment ? <article className={`case-sheet project-${project.tone}`}>
        <section className="case-hero"><div className="case-index"><span>PROJECT {project.number}</span><span>{project.category}</span></div><h1>{project.name}</h1><p>{project.description}</p><p className="demo-disclosure">Concept in development · The complete website and case file are coming soon.</p></section>
        <ProjectMedia project={project} mode="live" />
        <section className="case-end"><small>MORE OF THE STUDIO</small><h2>See what is<br />ready to explore.</h2><Link className="button" href="/work">Explore the work ↗</Link><Link className="button button-primary" href="/start">Start a project ↗</Link></section>
      </article> : caseStudies[project.slug] ? <CaseStudyWorld project={project} study={caseStudies[project.slug]} /> : <article className={`case-sheet project-${project.tone}`}>
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
