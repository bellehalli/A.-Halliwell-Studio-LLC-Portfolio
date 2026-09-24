import type { Project } from "@/data/projects";

type Props = { project: Project };

export default function ProjectMedia({ project }: Props) {
  const hasEvidence = project.evidence.length > 0;
  const previewUrl = project.embedUrl || project.url;

  return (
    <div className="project-media-stack">
      {project.livePreview && (
        <div className="project-evidence project-live-preview" aria-label={`${project.name} live project preview`}>
          <div className="project-evidence-bar">
            <span>LIVE BUILD PREVIEW</span>
            <a
              href={project.url}
              target={project.url.startsWith("http") ? "_blank" : undefined}
              rel={project.url.startsWith("http") ? "noreferrer" : undefined}
            >
              OPEN FULL SITE ↗
            </a>
          </div>

          <div className="project-browser-bar" aria-hidden="true">
            <i /><i /><i />
            <span>{previewUrl.replace(/^https?:\/\//, "")}</span>
          </div>

          <iframe
            src={previewUrl}
            title={`${project.name} live website preview`}
            loading="lazy"
          />

          <p className="project-preview-note">
            Scroll, click and explore the live build here. “Open full site” launches the standalone project.
          </p>
        </div>
      )}

      {hasEvidence && (
        <div className="project-evidence" aria-label={`${project.name} project screenshots`}>
          <div className="project-evidence-bar">
            <span>SELECTED SCREENS</span>
            <span>A. HALLIWELL STUDIO</span>
          </div>
          <div className="project-evidence-gallery">
            {project.evidence.map((src, index) => (
              <figure key={src}>
                <img
                  src={src}
                  alt={`${project.name} website demonstration, screen ${index + 1}`}
                  loading={index ? "lazy" : "eager"}
                />
                <figcaption>
                  {String(index + 1).padStart(2, "0")} / {project.name}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
