import Image from "next/image";
import Link from "next/link";
import { projects } from "@/data/projects";

const collections = [
  {
    number: "04 / 05",
    label: "THE VENUES + AFTER DARK",
    title: <>From the estate<br/><em>to after dark.</em></>,
    note: "Three ways a place can become a feeling—and a clear next step.",
    className: "work-gallery-one",
    items: projects.slice(0, 3),
  },
  {
    number: "05 / 05",
    label: "MORE WORLDS, MORE JOBS",
    title: <>From the appointment<br/><em>to the answer.</em></>,
    note: "Every interface has a job. Pick a window and see how it works.",
    className: "work-gallery-two",
    items: projects.slice(3, 6),
  },
];

export default function WorkWorldGallery() {
  return (
    <div className="work-gallery-collection" id="work-gallery" aria-label="Selected project windows">
      {collections.map((collection) => (
        <section className={`work-gallery ${collection.className}`} key={collection.number} aria-label={collection.label}>
          <div className="work-gallery-inner">
            <div className="work-gallery-heading">
              <p className="work-gallery-kicker"><span>{collection.number}</span><span>{collection.label}</span></p>
              <h2>{collection.title}</h2>
              <p>{collection.note}</p>
            </div>
            <div className="work-gallery-windows">
              {collection.items.map((project) => (
                <Link className={`work-gallery-window work-gallery-window-${project.tone}`} href={`/work/${project.slug}`} key={project.slug} aria-label={`Open ${project.name} case file`}>
                  <span className="work-gallery-art">
                    {project.desktopAsset ? <Image src={project.desktopAsset} alt="" fill sizes="(max-width: 700px) 70vw, 190px" /> : <span className="work-gallery-monogram" aria-hidden="true">{project.name.slice(0, 1)}</span>}
                  </span>
                  <span className="work-gallery-window-title"><strong>{project.name}</strong><small>OPEN CASE FILE ↗</small></span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
