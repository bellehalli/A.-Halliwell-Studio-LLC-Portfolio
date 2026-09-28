import type { Metadata } from "next";
import Link from "next/link";
import ProjectMedia from "@/components/ProjectMedia";
import { projects } from "@/data/projects";
import { caseStudies } from "@/data/caseStudies";
import Navigation from "@/components/navigation/Navigation";

export const metadata: Metadata = {
  title: "Selected Work",
  description: "Selected A. Halliwell Studio concept work across hospitality, nightlife, wellness, local services, restaurants and e-commerce.",
  alternates: { canonical: "/work" },
};

const businessPurposes: Record<string, string> = {
  "willow-lily": "Turn venue discovery into a prepared tour inquiry.",
  "maison-riviere": "Move couples from a romantic first impression to an informed visit.",
  "vanta-social": "Connect event interest with guest-list and VIP action.",
  "elan-aesthetics": "Build confidence before a consultation request.",
  "northstar-heating-home": "Help homeowners choose the right service or estimate path.",
};

export default function WorkPage() {
  return (
    <main className="case-page work-page">
      <div className="site-background" aria-hidden="true" />
      <Navigation />

      <section className="case-sheet">
        <div className="case-hero">
          <div className="case-index"><span>SELECTED WORK</span><span>A. HALLIWELL STUDIO</span></div>
          <h1>Different businesses.<br />Different jobs.</h1>
          <p>Selected studio work across hospitality, nightlife, wellness, local services, restaurants and commerce, showing how strategy, design and development change around what the business actually needs the internet to do.</p>
          <p className="demo-disclosure"><strong>Transparent portfolio:</strong> The brands shown here are original studio concepts created to demonstrate design, development and digital-system thinking. I do not claim invented clients, testimonials or performance results.</p>
        </div>

        <div className="work-proof-strip">
          <span>LIVE BUILDS</span><span>CASE-STUDY THINKING</span><span>WORKING INTERACTIONS</span><span>NO INVENTED METRICS</span>
        </div>

        <div className="case-story">
          {projects.map((project) => (
            <article key={project.slug} className="work-index-project">
              <small>PROJECT {project.number} / {project.category}</small>
              <h2>{project.name}</h2>
              <p>{project.description}</p>
              {!project.inDevelopment && <div className="work-index-context">
                <p><span>Industry</span>{project.category.split(" / ")[0]}</p>
                <p><span>Project type</span>{caseStudies[project.slug]?.positioning ?? project.category}</p>
                <p><span>Business purpose</span>{businessPurposes[project.slug] ?? project.outcome}</p>
                <p><span>Core systems</span>{project.approach.slice(0, 3).join(" · ")}</p>
              </div>}
              <ProjectMedia project={project} />
              {project.inDevelopment ? <p className="work-index-pending">Coming soon · The full case file and site are in development.</p> : <div className="case-actions">
                <Link className="button button-primary" href={`/work/${project.slug}`}>View case study ↗</Link>
                <a className="button" href={project.url} target={project.url.startsWith("http") ? "_blank" : undefined} rel={project.url.startsWith("http") ? "noreferrer" : undefined}>Visit live build ↗</a>
              </div>}
            </article>
          ))}
        </div>

        <section className="case-end">
          <small>HAVE A DIGITAL PROBLEM TO SOLVE?</small>
          <h2>Tell me what the<br />website needs to do.</h2>
          <Link className="button button-primary" href="/start">Start a project ↗</Link>
        </section>
      </section>
    </main>
  );
}
