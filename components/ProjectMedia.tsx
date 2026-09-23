import type { Project } from "@/data/projects";

type Props = { project: Project };

export default function ProjectMedia({ project }: Props) {
  return (
    <div className="project-evidence" aria-label={`${project.name} project screenshots`}>
      <div className="project-evidence-bar">
        <span>DESIGN DEMONSTRATION</span>
        <span>A. HALLIWELL STUDIO</span>
      </div>
      <div className="project-evidence-gallery">
        {project.evidence.map((src, index) => (
          <figure key={src}>
            <img src={src} alt={`${project.name} website demonstration, screen ${index + 1}`} loading={index ? "lazy" : "eager"} />
            <figcaption>{String(index + 1).padStart(2, "0")} / {project.name}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
