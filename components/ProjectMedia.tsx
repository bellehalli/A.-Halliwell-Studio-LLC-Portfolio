import type { Project } from "@/data/projects";
import WillowPreview from "@/components/projects/WillowPreview";
type Props={project:Project;previewFallback?:boolean;mode?:"all"|"screens"|"live"};
export default function ProjectMedia({project,previewFallback=false,mode="all"}:Props){
 const hasEvidence=project.evidence.length>0,previewUrl=project.embedUrl||project.url;
 // Willow's older preview subdomain refuses framing. The public build permits
 // the studio domain; the image tour keeps protected previews usable as well.
 const useWillowTour=previewFallback||project.slug==="willow-lily";
 return <div className="project-media-stack">
  {mode!=="screens"&&project.livePreview&&<div className="project-evidence project-live-preview" aria-label={`${project.name} live project preview`}>
   <div className="project-evidence-bar"><span>{project.inDevelopment?"CONCEPT PREVIEW":useWillowTour?"WEBSITE TOUR":"LIVE BUILD PREVIEW"}</span>{project.inDevelopment?<span>IN DEVELOPMENT</span>:<a href={project.url} target={project.url.startsWith("http")?"_blank":undefined} rel={project.url.startsWith("http")?"noreferrer":undefined}>OPEN FULL SITE <span className="ahs-link-mark" aria-hidden="true">→</span></a>}</div>
   <div className="project-browser-bar" aria-hidden="true"><i/><i/><i/><span>{(useWillowTour?project.url:previewUrl).replace(/^https?:\/\//,"")}</span></div>
   <div className={`project-preview-window${project.inDevelopment?" project-preview-window-pending":""}`} inert={project.inDevelopment || undefined}>
    {useWillowTour?<WillowPreview url={project.url} />:<iframe src={previewUrl} title={`${project.name} ${project.inDevelopment?"concept":"live website"} preview`} loading="lazy" tabIndex={project.inDevelopment?-1:undefined}/>}
   </div>
   {project.inDevelopment&&<div className="project-preview-coming-soon" role="status"><span>Studio concept · in development</span><strong>Coming soon.</strong><span>The full case file and site will open when the build is ready.</span></div>}
   <p className="project-preview-note">{project.inDevelopment?"A first look at the visual direction. The working site and case study are still in development.":useWillowTour?"Explore Willow Lily here, or open the complete build in a new tab.":"Scroll, click and explore the live build here. Open full site launches the standalone project."}</p>
  </div>}
  {mode!=="live"&&hasEvidence&&<div className="project-evidence" aria-label={`${project.name} project screenshots`}><div className="project-evidence-bar"><span>SELECTED SCREENS</span><span>A. HALLIWELL STUDIO</span></div><div className="project-evidence-gallery">{project.evidence.map((src,i)=><figure key={src}><img src={src} alt={`${project.name} website demonstration, screen ${i+1}`} loading={i?"lazy":"eager"}/><figcaption>{String(i+1).padStart(2,"0")} / {project.name}</figcaption></figure>)}</div></div>}
 </div>
}
