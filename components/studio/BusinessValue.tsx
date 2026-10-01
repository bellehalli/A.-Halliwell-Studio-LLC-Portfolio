const roles = [
  ["Get discovered", "Search-ready structure and useful content help the right people understand what you offer."],
  ["Help people decide", "Clear information, thoughtful journeys, and trust cues make the next decision easier."],
  ["Turn interest into action", "Inquiries, booking, commerce, and custom tools give curiosity somewhere useful to go."],
  ["Support what happens afterward", "Portals, planning tools, and integrations carry the experience into the work behind the scenes."],
];
export default function BusinessValue() {
  return <section className="world-sheet business-value-world" aria-labelledby="business-value-heading"><div className="content-shell">
    <div className="section-kicker"><span>THE WEBSITE IS PART OF THE BUSINESS.</span><span>Every part has a job.</span></div>
    <h2 id="business-value-heading">Beautiful to meet.<br/><em>Useful to keep.</em></h2>
    <div className="business-value-grid">{roles.map(([title, copy], i) => <article key={title}><small>{String(i + 1).padStart(2, "0")}</small><h3>{title}</h3><p>{copy}</p></article>)}</div>
    <a className="proof-single-link" href="/services#process">See how we shape the work</a>
  </div></section>;
}
