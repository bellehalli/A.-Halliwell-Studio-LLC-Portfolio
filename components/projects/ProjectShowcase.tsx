import Link from "next/link";
import ProjectMedia from "@/components/ProjectMedia";
import type { Project } from "@/data/projects";

export default function ProjectShowcase({ project }: { project: Project }) {
  const willow = project.tone === "willow";

  return (
    <article className={`project-world project-world-${project.tone}`}>
      <div className="project-world-paper">
        <div className="project-world-index">
          <span>PROJECT {project.number}</span>
          <span>{project.category}</span>
        </div>

        <div className="project-world-title">
          <span className="project-world-accent">
            {willow ? "The estate file" : "After dark"}
          </span>
          <h3>{project.name}</h3>
          <p>{project.description}</p>
        </div>

        <div className="project-world-media">
          <ProjectMedia name={project.name} url={project.url} />
          <span className="tape tape-one" aria-hidden="true" />
          <span className="tape tape-two" aria-hidden="true" />
        </div>

        <div className="project-world-footer">
          <div className="project-tags">
            {project.details.map((detail) => <span key={detail}>{detail}</span>)}
          </div>
          <div className="project-links">
            <Link href={`/work/${project.slug}`}>Open the case file ↗</Link>
            <a href={project.url} target="_blank" rel="noreferrer">Visit live site ↗</a>
          </div>
        </div>
      </div>

      <span className="project-world-mark" aria-hidden="true">
        {willow ? "✿" : "♥"}
      </span>
    </article>
  );
}
