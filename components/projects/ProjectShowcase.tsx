import Link from "next/link";
import ProjectMedia from "@/components/ProjectMedia";
import type { Project } from "@/data/projects";
const accent:Record<Project["tone"],string>={willow:"The estate file",maison:"After dark",vanta:"Tonight, organized",elan:"Beauty with a path",northstar:"Urgency, simplified",restaurant:"Dinner starts here",commerce:"Browse to bag"};
const Mark=()=> <span className="ahs-link-mark" aria-hidden="true">→</span>;
export default function ProjectShowcase({project}:{project:Project}){
 const comingSoon=!project.livePreview || project.url.startsWith("/concepts/");
 return <article className={`project-world project-world-${project.tone}`}>
  <div className="project-world-paper">
   <div className="project-world-index"><span>PROJECT {project.number}</span><span>{project.category}</span></div>
   <div className="project-world-title"><span className="project-world-accent">{accent[project.tone]}</span><h3>{project.name}</h3><p>{project.description}</p><small>{project.disclosure}</small>{comingSoon&&<span className="project-status">Coming Soon</span>}</div>
   <div className="project-world-media">{comingSoon?<div className="project-coming-soon"><div><strong>Coming Soon</strong><span>This project world is still being built.</span></div></div>:<ProjectMedia project={project}/>}</div>
   <div className="project-world-footer"><div className="project-tags">{project.details.map(d=><span key={d}>{d}</span>)}</div><div className="project-links"><Link href={`/work/${project.slug}`}>Open the case file<Mark/></Link>{!comingSoon&&<a href={project.url} target={project.url.startsWith("http")?"_blank":undefined} rel={project.url.startsWith("http")?"noreferrer":undefined}>Visit live build<Mark/></a>}</div></div>
  </div>
 </article>
}
