import { projectStrategy } from "@/data/projectStrategy";
export default function StrategyEvidence({ slug, concept = true }: { slug: string; concept?: boolean }) {
  const strategy = projectStrategy[slug];
  if (!strategy) return null;
  return <>
    <section className="studio-commercial-section" aria-labelledby="success-measures-heading"><small>SUCCESS MEASURES</small><h2 id="success-measures-heading">What success<br/><em>would look like.</em></h2><p>{concept ? "These are business behaviors the concept is designed to influence, not measured results. A commissioned launch would establish a baseline and review these measures with the business over time." : "These are the measures the strategy is designed to influence. Measured outcomes are reported separately only when data is available."}</p><div className="case-success-grid">{strategy.measures.map(measure => <article key={measure.title}><h3>{measure.title}</h3><p>{measure.observe}</p></article>)}</div><p>Measurement belongs to the agreed scope, with consent and privacy requirements considered before analytics are enabled.</p></section>
    <section className="studio-commercial-section" aria-labelledby="strategy-artifact-heading"><small>STRATEGY / BEFORE THE FINISHED SCREEN</small><h2 id="strategy-artifact-heading">The decisions<br/><em>behind the design.</em></h2><figure className="case-strategy-artifact"><figcaption><strong>{strategy.artifact.title}</strong>{strategy.artifact.purpose}</figcaption><ol>{strategy.artifact.steps.map(step => <li key={step.title}><h3>{step.title}</h3><p>{step.decision}</p><small>{step.handoff}</small></li>)}</ol></figure></section>
  </>;
}
