type Props = { name: string; url?: string };

export default function ProjectMedia({ name, url }: Props) {
  return (
    <div className="project-evidence" aria-label={`${name} project evidence`}>
      <div className="project-evidence-bar">
        <span>LIVE PROJECT</span>
        <span>A. HALLIWELL STUDIO</span>
      </div>
      <div className="project-evidence-body">
        <small>PROJECT / {name.toUpperCase()}</small>
        <strong>{name}</strong>
        <p>The live website is the primary proof of the work.</p>
        {url ? (
          <a href={url} target="_blank" rel="noreferrer">
            Open live website ↗
          </a>
        ) : null}
      </div>
    </div>
  );
}
