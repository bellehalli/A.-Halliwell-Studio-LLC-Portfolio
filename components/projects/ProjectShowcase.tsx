import Link from "next/link";
import ProjectMedia from "@/components/ProjectMedia";
import type { Project } from "@/data/projects";

const direction: Record<Project["tone"], { line: string; purpose: string }> = {
  willow: { line: "The estate file", purpose: "A digital first tour" },
  maison: { line: "After dark", purpose: "Hospitality, with a point of view" },
  vanta: { line: "After dark in Detroit", purpose: "Events · guest list · VIP" },
  elan: { line: "A quieter kind of luxury", purpose: "Discover · decide · book" },
  northstar: { line: "Made for the place you call home", purpose: "Service · trust · the next step" },
  restaurant: { line: "An evening at the table", purpose: "Menu · mood · reservations" },
  commerce: { line: "The creative shopping room", purpose: "Browse · choose · add to bag" },
};

export default function ProjectShowcase({ project }: { project: Project }) {
  const comingSoon = project.inDevelopment || !project.livePreview;
  const external = project.url.startsWith("http");
  const world = direction[project.tone];
  // The first two featured worlds are Willow (01) and Maison (02).
  // Continue that visual rhythm through the rest of the archive.
  const galleryTone = Number(project.number) % 2 ? "willow" : "maison";

  return (
    <article className={`project-world project-world-${project.tone} work-gallery work-gallery-${galleryTone} project-gallery`} aria-labelledby={`world-${project.slug}`}>
      <div className="project-world-paper">
        <div className="project-world-title work-gallery-heading">
          <p className="work-gallery-kicker">{project.number} — Selected Work <span aria-hidden="true">✦</span> {project.category}</p>
          <span className="project-world-accent">{world.line}</span>
          <h3 id={`world-${project.slug}`}>{project.name}</h3>
          <p>{project.description}</p>
          <div className="project-links work-gallery-links">
            {!comingSoon && <Link href={`/work/${project.slug}`}>Explore the case file <span aria-hidden="true">↗︎</span></Link>}
            {!comingSoon && <a href={project.url} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>Open the full site <span aria-hidden="true">↗︎</span></a>}
          </div>
        </div>

        <div className="project-world-media work-gallery-media">
          {!project.livePreview ? (
            <div className="project-coming-soon" role="status">
              <div><span>Concept in development</span><strong>Coming Soon</strong><p>The full experience is taking shape.</p></div>
            </div>
          ) : <ProjectMedia project={project} />}
        </div>

        <div className="project-world-footer work-gallery-details">
          <div className="project-world-colophon">
            <span>{world.purpose}</span>
            <div className="project-tags" aria-label="Project capabilities">{project.details.map(detail => <span key={detail}>{detail}</span>)}</div>
            <small>{project.disclosure}</small>
          </div>
        </div>
      </div>
    </article>
  );
}
