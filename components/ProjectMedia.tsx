import type { Project } from "@/data/projects";
type Props={project:Project;previewFallback?:boolean;mode?:"all"|"screens"|"live"};
export default function ProjectMedia({project,previewFallback=false,mode="all"}:Props){
 const hasEvidence=project.evidence.length>0,previewUrl=project.embedUrl||project.url;
 return <div className="project-media-stack">
  {mode!=="screens"&&project.livePreview&&<div className="project-evidence project-live-preview" aria-label={`${project.name} live project preview`}>
   <div className="project-evidence-bar"><span>{previewFallback?"WEBSITE TOUR":"LIVE BUILD PREVIEW"}</span><a href={project.url} target={project.url.startsWith("http")?"_blank":undefined} rel={project.url.startsWith("http")?"noreferrer":undefined}>OPEN FULL SITE <span className="ahs-link-mark" aria-hidden="true">→</span></a></div>
   <div className="project-browser-bar" aria-hidden="true"><i/><i/><i/><span>{previewUrl.replace(/^https?:\/\//,"")}</span></div>
   {previewFallback?<div className="project-preview-scroll" role="region" tabIndex={0} aria-label={`Scroll through ${project.name} website tour`}>{["/case-studies/willow-lily/willow-lily-desktop-entry-screen.jpg","/case-studies/willow-lily/willow-lily-desktop-hero-entry-screen.jpg","/case-studies/willow-lily/willow-lily-desktop-digital-tour-map.jpg","/case-studies/willow-lily/willow-lily-mobile-homepage-hero.jpg","/case-studies/willow-lily/willow-lily-desktop-availability-widget.jpg"].map((src,i)=><img key={src} src={src} alt={`${project.name} website view ${i+1}`} loading={i?"lazy":"eager"}/>)}</div>:<iframe src={previewUrl} title={`${project.name} live website preview`} loading="lazy"/>}
   <p className="project-preview-note">{previewFallback?"Scroll this guided website tour, or open the full build to make your own choices.":"Scroll, click and explore the live build here. Open full site launches the standalone project."}</p>
  </div>}
  {mode!=="live"&&hasEvidence&&<div className="project-evidence" aria-label={`${project.name} project screenshots`}><div className="project-evidence-bar"><span>SELECTED SCREENS</span><span>A. HALLIWELL STUDIO</span></div><div className="project-evidence-gallery">{project.evidence.map((src,i)=><figure key={src}><img src={src} alt={`${project.name} website demonstration, screen ${i+1}`} loading={i?"lazy":"eager"}/><figcaption>{String(i+1).padStart(2,"0")} / {project.name}</figcaption></figure>)}</div></div>}
 </div>
}
