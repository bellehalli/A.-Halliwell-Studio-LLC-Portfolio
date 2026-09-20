import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navigation from "@/components/navigation/Navigation";
import { getProject, projects } from "@/data/projects";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return projects.map(project => ({ slug: project.slug })); }

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

  const sections = [
    ["01 / CONTEXT", "The brief", project.brief],
    ["02 / PROBLEM", "What needed to change", project.problem],
  ];

  return <main className={`site-shell case-${project.slug}`}><div className="moving-background background-case" aria-hidden="true"/><Navigation/>
    <article className="case-study shell">
      <header className="case-hero"><div className="case-meta"><span>PROJECT {project.number}</span><span>{project.category}</span></div><h1>{project.name}</h1><p>{project.description}</p><a className="primary-action" href={project.url} target="_blank" rel="noreferrer">Visit live website ↗</a></header>
      {sections.map(([label,title,body]) => <section className="case-section" key={label}><small>{label}</small><div><h2>{title}</h2><p>{body}</p></div></section>)}
      <section className="case-section"><small>03 / STRATEGY</small><div><h2>How the experience was shaped</h2><ol>{project.strategy.map(item => <li key={item}>{item}</li>)}</ol></div></section>
      <section className="case-section"><small>04 / SYSTEM</small><div><h2>What the website needed to do</h2><ul>{project.system.map(item => <li key={item}>{item}</li>)}</ul></div></section>
      <section className="case-section"><small>05 / BUILD</small><div><h2>What was built</h2><ul>{project.build.map(item => <li key={item}>{item}</li>)}</ul></div></section>
      <section className="case-section"><small>06 / VERIFIED RESULT</small><div><h2>Evidence, not invented metrics</h2><p>{project.verifiedResult}</p><a href={project.url} target="_blank" rel="noreferrer">Open the live project ↗</a></div></section>
      <footer className="case-footer"><Link href="/work">← Selected Work</Link><Link href="/start">Start a project ↗</Link></footer>
    </article>
  </main>;
}
