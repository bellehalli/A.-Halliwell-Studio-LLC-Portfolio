import Link from "next/link";
import type { Project } from "@/data/projects";
import ProjectMedia from "@/components/ProjectMedia";

export default function ProjectShowcase({ project }: { project: Project }) {
  return (
    <article className={`project-world project-world-${project.slug === "willow-lily" ? "willow" : "maison"}`}>
      <div className="project-world-paper">
        <div className="project-world-index"><span>PROJECT {project.number}</span><span>{project.category}</span></div>
        <div className="project-world-title"><span className="project-world-accent">selected work</span><h3>{project.name}</h3><p>{project.description}</p></div>
        <div className="project-world-media"><ProjectMedia desktop={project.desktopAsset} mobile={project.mobileAsset} name={project.name}/></div>
        <div className="project-world-footer">
          <div className="project-tags">{project.build.slice(0,3).map(item => <span key={item}>{item}</span>)}</div>
          <div className="project-links"><Link href={`/work/${project.slug}`}>READ CASE STUDY ↗</Link><a href={project.url} target="_blank" rel="noreferrer">VISIT LIVE SITE ↗</a></div>
        </div>
      </div>
    </article>
  );
}
