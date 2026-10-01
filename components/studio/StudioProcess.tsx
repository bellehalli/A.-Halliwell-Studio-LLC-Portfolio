const stages = [
  ["Discover", "Understand your business, customers, friction, goals, and existing setup. We identify the job the project needs to do."],
  ["Define", "Agree on scope, customer journeys, page structure, features, integrations, timeline, and deliverables before the work begins."],
  ["Design", "Shape the visual direction, content hierarchy, and interactions. Review the work together at the agreed milestones."],
  ["Build", "Develop the responsive experience and agreed integrations, then test the important flows, accessibility, and performance."],
  ["Launch & Grow", "Prepare launch and handoff, explain how to use the finished work, and scope any continued refinements or support."],
];
export default function StudioProcess() {
  return <section className="studio-commercial-section" id="process" aria-labelledby="process-heading">
    <small>THE STUDIO PROCESS</small><h2 id="process-heading">A clear path from<br/><em>idea to working experience.</em></h2>
    <p>Every project has a defined scope, review points, and a shared understanding of what happens next. Illustration projects follow the same discovery, direction, and review rhythm, with final artwork delivery in place of a website build.</p>
    <ol className="studio-process-list">{stages.map(([title, copy], i) => <li key={title}><span>{String(i + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol>
  </section>;
}
