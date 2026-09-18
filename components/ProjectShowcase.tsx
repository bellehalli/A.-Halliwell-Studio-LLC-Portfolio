import type { Project } from "@/data/projects";

export default function ProjectShowcase({ project }: { project: Project }) {
  return (
    <article className={`sheet project-sheet project-${project.tone}`}>
      <div className="project-inner">
        <div className="project-meta"><span>{project.number}</span><span>{project.category}</span></div>
        <div className="project-stage">
          <div className="device-composition">
            <div className="browser-card">
              <div className="browser-top"><span/><span/><span/><div>{project.url.replace("https://", "")}</div></div>
              <div className="asset-slot" style={{ "--project-image": `url(${project.desktopAsset})` } as React.CSSProperties}>
                <div className="asset-fallback"><small>LIVE PROJECT</small><strong>{project.name}</strong><em>Built for real life.</em><span>ADD desktop.webp TO ACTIVATE LIVE PROJECT ART</span></div>
              </div>
            </div>
            <div className="phone-card" style={{ "--project-image": `url(${project.mobileAsset})` } as React.CSSProperties} aria-hidden="true"><div className="phone-notch"/><div className="phone-fallback">{project.name}<small>mobile</small></div></div>
          </div>
          <div className="project-copy">
            <span className="project-number">PROJECT {project.number}</span>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <div className="project-tags">{project.details.map((detail) => <span key={detail}>{detail}</span>)}</div>
            <a href={project.url} target="_blank" rel="noreferrer">Visit live site ↗</a>
          </div>
        </div>
      </div>
    </article>
  );
}
