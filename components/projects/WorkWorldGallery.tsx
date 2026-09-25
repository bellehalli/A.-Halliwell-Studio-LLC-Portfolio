import Link from "next/link";
import VenueMedia from "@/components/projects/VenueMedia";
import { projects } from "@/data/projects";

const venues = [projects[0], projects[1]];

export default function WorkWorldGallery() {
  return (
    <div className="work-gallery-collection" id="work-gallery" aria-label="Featured venue work">
      {venues.map((project, index) => (
        <section className={`work-gallery work-gallery-${project.tone}`} key={project.slug} aria-labelledby={`work-gallery-${project.slug}`}>
          <div className="work-gallery-heading">
            <p className="work-gallery-kicker">{String(index + 4).padStart(2, "0")} / FEATURED WORK <span aria-hidden="true">✦</span> {project.category}</p>
            <h2 id={`work-gallery-${project.slug}`}>{project.name}</h2>
            <p className="work-gallery-description">{project.description}</p>
            <div className="work-gallery-links">
              <Link href={`/work/${project.slug}`}>EXPLORE THE CASE FILE ↗</Link>
              <a href={project.url} target="_blank" rel="noreferrer">OPEN THE FULL SITE ↗</a>
            </div>
          </div>
          <div className="work-gallery-media"><VenueMedia project={project} /></div>
          <div className="work-gallery-details">
            <span>ORIGINAL STUDIO CONCEPT / {project.number}</span>
            <div className="project-tags">{project.details.map((detail) => <span key={detail}>{detail}</span>)}</div>
            <p>{project.disclosure}</p>
          </div>
        </section>
      ))}
    </div>
  );
}
