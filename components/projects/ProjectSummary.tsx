import type { Project } from "@/data/projects";
import type { CaseStudy } from "@/data/caseStudies";

export default function ProjectSummary({ project, study }: { project: Project; study: CaseStudy }) {
  return <section className="case-world-summary" aria-labelledby="case-summary-heading">
    <p>01 / Project summary</p>
    <h2 id="case-summary-heading">More than a<br /><em>pretty homepage.</em></h2>
    <div className="case-world-summary-details">
      <dl>
        <div><dt>Industry</dt><dd>{project.category.split(" / ")[0]}</dd></div>
        <div><dt>Project type</dt><dd>{study.positioning}</dd></div>
        <div><dt>Services included</dt><dd>Creative Direction · Experience Design · Interactive Systems · Development</dd></div>
      </dl>
      <p>{study.summary}</p>
    </div>
  </section>;
}
