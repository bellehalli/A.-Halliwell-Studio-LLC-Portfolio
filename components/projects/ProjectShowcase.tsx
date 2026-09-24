import Link from "next/link";
import ProjectMedia from "@/components/ProjectMedia";
import type { Project } from "@/data/projects";

const accent: Record<Project["tone"], string> = {
  willow: "The estate file",
  maison: "After dark",
  vanta: "Tonight, organized",
  elan: "Beauty with a path",
  northstar: "Urgency, simplified",
  restaurant: "Dinner starts here",
  commerce: "Browse to bag"
};

export default function ProjectShowcase({ project }: { project: Project }) {
  return (
    <article className={`project-world project-world-${project.tone}`}>
      <div className="project-world-paper">
        <div className="project-world-index">
          <span>PROJECT {project.number}</span>
          <span>{project.category}</span>
        </div>

        <div className="project-world-title">
          <span className="project-world-accent">{accent[project.tone]}</span>
          <h3>{project.name}</h3>
          <p>{project.description}</p>
          <small>{project.disclosure}</small>
        </div>

        <div className="project-world-media"><ProjectMedia project={project} /></div>

        <div className="project-world-footer">
          <div className="project-tags">{project.details.map((detail) => <span key={detail}>{detail}</span>)}</div>
          <div className="project-links">
            <Link href={`/work/${project.slug}`}>Open the case file ↗</Link>
            <a href={project.url} target={project.url.startsWith("http") ? "_blank" : undefined} rel={project.url.startsWith("http") ? "noreferrer" : undefined}>Visit live build ↗</a>
          </div>
        </div>
      </div>
    </article>
  );
}
