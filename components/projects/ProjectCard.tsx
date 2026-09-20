import Link from "next/link";
import type { Project } from "@/data/projects";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className={`project-card project-${project.slug}`}>
      <div className="project-meta"><span>PROJECT {project.number}</span><span>{project.category}</span></div>
      <div className="project-card-grid">
        <div>
          <h2>{project.name}</h2>
          <p>{project.description}</p>
        </div>
        <div className="project-card-system">
          <small>WHAT IT PROVES</small>
          <ul>{project.disciplines.map(item => <li key={item}>{item}</li>)}</ul>
        </div>
      </div>
      <div className="project-actions">
        <Link href={`/work/${project.slug}`}>Read case study ↗</Link>
        <a href={project.url} target="_blank" rel="noreferrer">Visit live site ↗</a>
      </div>
    </article>
  );
}
