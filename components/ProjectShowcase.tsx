import Link from "next/link";
import type { Project } from "@/data/projects";
import ProjectMedia from "@/components/ProjectMedia";

export default function ProjectShowcase({ project }: { project: Project }) {
  return (
    <article className={`sheet project-sheet project-${project.tone}`}>
      <div className="project-inner">
        <div className="project-meta"><span>{project.number}</span><span>{project.category}</span></div>
        <div className="project-stage">
          <ProjectMedia desktop={project.desktopAsset} mobile={project.mobileAsset} name={project.name} />
          <div className="project-copy">
            <span className="project-number">PROJECT {project.number}</span>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <div className="project-tags">{project.details.map((detail) => <span key={detail}>{detail}</span>)}</div>
            <div className="project-links">
              <Link href={`/work/${project.slug}`}>View case study →</Link>
              <a href={project.url} target="_blank" rel="noreferrer">Visit live site ↗</a>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
