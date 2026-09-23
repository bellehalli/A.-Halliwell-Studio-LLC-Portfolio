import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectMedia from "@/components/ProjectMedia";
import { getProject, projects } from "@/data/projects";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams(){ return projects.map(p => ({slug:p.slug})); }
export async function generateMetadata({params}:Props):Promise<Metadata>{
  const {slug}=await params; const project=getProject(slug);
  if(!project) return {title:"Project Not Found",robots:{index:false,follow:false}};
  return {title:`${project.name} Case Study`,description:project.description,alternates:{canonical:`/work/${project.slug}`}};
}
export default async function ProjectPage({params}:Props){
  const {slug}=await params; const project=getProject(slug); if(!project) notFound();
  return <main className="case-page">
    <div className="site-background" aria-hidden="true"/>
    <header className="case-nav shell"><Link className="logo" href="/"><span className="logo-mark">A.</span><span>HALLIWELL</span></Link><Link href="/work">← Selected Work</Link></header>
    <article className={`case-sheet project-${project.tone}`}>
      <section className="case-hero">
        <div className="case-index"><span>PROJECT {project.number}</span><span>{project.category}</span></div>
        <h1>{project.name}</h1><p>{project.description}</p>
        <p className="demo-disclosure">Original studio demonstration. This is a fictional venue concept, not a commissioned client project or a claim of measured booking results.</p>
        <div className="project-links"><a href={project.url} target="_blank" rel="noopener noreferrer">Visit live site ↗</a></div>
      </section>
      <ProjectMedia project={project} />
      <section className="case-story">
        <div><small>01 / THE BRIEF</small><h2>Built around<br/>the real job.</h2></div><div><p>{project.brief}</p></div>
        <div><small>02 / THE APPROACH</small><h2>Strategy before<br/>decoration.</h2></div>
        <div className="case-approach">{project.approach.map((item,i)=><div key={item}><span>{String(i+1).padStart(2,"0")}</span><strong>{item}</strong></div>)}</div>
        <div className="case-capabilities"><small>03 / CAPABILITIES</small><div>{project.details.map(d=><span key={d}>{d}</span>)}</div></div>
      </section>
      <section className="case-end"><small>LIKE WHAT YOU SEE?</small><h2>Your website could<br/>work harder too.</h2><Link className="button button-primary" href="/#start">Start a project ↗</Link></section>
    </article>
  </main>;
}
