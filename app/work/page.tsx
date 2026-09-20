import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/navigation/Navigation";
import ProjectCard from "@/components/projects/ProjectCard";
import { projects } from "@/data/projects";

export const metadata: Metadata = { title: "Selected Work", description: "Real live digital projects by A. Halliwell Studio.", alternates: { canonical: "/work" } };

export default function WorkPage() {
  return <main className="site-shell"><div className="moving-background background-work" aria-hidden="true"/><Navigation/><section className="page-hero shell"><small>SELECTED WORK / REAL LIVE PROJECTS ONLY</small><h1>Work is evidence.</h1><p>Each case study documents the brief, the problem, the strategy, the system, the build and the verifiable public result.</p></section><section className="shell project-stack">{projects.map(project => <ProjectCard project={project} key={project.slug}/>)}</section><section className="page-cta shell"><h2>Need a system of your own?</h2><Link className="primary-action" href="/start">Start a project ↗</Link></section></main>;
}
