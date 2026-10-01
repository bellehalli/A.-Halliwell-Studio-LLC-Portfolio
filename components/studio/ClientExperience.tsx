const journey = [
  ["Proposal", "See the scope, deliverables, investment, and review rounds."],
  ["Agreement", "Review and sign, with a copy of the completed agreement."],
  ["Payment", "Find invoices, milestone amounts, and the available payment options."],
  ["Materials", "Upload the photos, plans, logos, and other files the project needs."],
  ["Project updates", "See your stage and the next step as the work progresses."],
  ["Feedback", "Review shared versions and send a consolidated set of revision notes."],
  ["Delivery", "Access final files or the agreed handoff when the project is complete."],
];
export default function ClientExperience() {
  return <section className="studio-commercial-section" id="client-experience" aria-labelledby="client-experience-heading">
    <small>WORKING TOGETHER</small><h2 id="client-experience-heading">Your project<br/><em>has a home.</em></h2>
    <p>A private client workspace keeps your agreement, invoices, materials, review files, and next steps together. You can return with your invited email and a fresh sign-in code.</p>
    <figure className="client-experience-preview">
      <div className="client-preview-masthead"><strong>A. HALLIWELL STUDIO</strong><span>YOUR PROJECT WORKSPACE</span></div>
      <div className="client-preview-heading"><h3>Everything for the work ahead.</h3><p>Scope agreed. Next step: share your materials.</p></div>
      <ol>{journey.map(([title, copy], i) => <li key={title}><span>{String(i + 1).padStart(2, "0")}</span><div><h4>{title}</h4><p>{copy}</p></div></li>)}</ol>
      <figcaption>Illustrative workspace journey. Your project’s documents, timing, payment milestones, and delivery are defined in your agreement.</figcaption>
    </figure>
  </section>;
}
