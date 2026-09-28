import type { CaseStudy } from "@/data/caseStudies";

export default function ExperienceMap({ study }: { study: CaseStudy }) {
  return <section className="case-world-journey" aria-labelledby="journey-heading">
    <div className="case-world-section-heading">
      <p>05 / Experience map</p>
      <h2 id="journey-heading">{study.journeyHeading ?? <>From first look<br />to first visit.</>}</h2>
      <span>{study.journeyIntro ?? "A couple's path through the site"}</span>
    </div>
    <ol>{study.journey.map((step, index) => <li key={step.title}>
      <span>{String(index + 1).padStart(2, "0")}</span><h3>{step.title}</h3><p>{step.description}</p>
    </li>)}</ol>
  </section>;
}
