import { socialMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import WorkIndex from "@/components/projects/WorkIndex";
import { commissionedProjects, conceptProjects } from "@/data/projects";
import Navigation from "@/components/navigation/Navigation";

export const metadata: Metadata = {
  title: "Selected Work",
  description: "Selected A. Halliwell Studio concept work across hospitality, nightlife, wellness and local services.",
  alternates: { canonical: "/work" },
  ...socialMetadata("/work", "Selected Work", "Selected A. Halliwell Studio concept work across hospitality, nightlife, wellness and local services."),
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
          <p>Selected studio work across hospitality, nightlife, wellness and local services, showing how strategy, design and development change around what the business actually needs the internet to do.</p>
          <p className="demo-disclosure"><strong>Transparent portfolio:</strong> Studio concepts demonstrate design, development, and digital-system thinking. Commissioned work is published only when complete and approved for display. I do not claim invented clients, testimonials or performance results.</p>
        </div>

        <div className="work-proof-strip">
          <span>LIVE BUILDS</span><span>CASE-STUDY THINKING</span><span>WORKING INTERACTIONS</span><span>NO INVENTED METRICS</span>
        </div>

        {commissionedProjects.length > 0 && <section aria-labelledby="commissioned-work-heading"><h2 id="commissioned-work-heading">Commissioned work</h2><p>Completed engagements approved for public display. Client feedback and measured outcomes are included only when available.</p><WorkIndex projects={commissionedProjects} /></section>}
        <section aria-labelledby="studio-concepts-heading"><h2 id="studio-concepts-heading">Studio concepts</h2><WorkIndex projects={conceptProjects} /></section>

        <section className="case-end">
          <small>HAVE A DIGITAL PROBLEM TO SOLVE?</small>
          <h2>Tell me what the<br />website needs to do.</h2>
          <Link className="button button-primary" href="/start">Start a project ↗</Link>
        </section>
      </section>
    </main>
  );
}
