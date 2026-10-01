# Publishing commissioned work

Keep the five approved studio concepts. Do not create fictional testimonials,
client logos, or metrics to fill the commissioned section.

Add a completed project in `data/projects.ts` with `workKind: "commissioned"`,
the real need, scope, deliverables, and disclosure. Add its case file in
`data/caseStudies.ts` with the actual decisions, review journey, and approved
screens. Until `proof.completed` and `proof.publicationApproved` are both true,
the project is excluded from the public archive and its case-study route.

The Work page renders a separate Commissioned work section only when an
eligible record exists. Optional `proof.clientFeedback` requires the client's
provided quote and approved attribution. Optional `proof.outcomes` requires an
observation, measurement period, and source. Do not describe correlation as
proven causation. If outcomes cannot yet be measured, keep them as objectives.
Use `data/projectStrategy.ts` for project-specific success measures and a
strategy artifact derived from the actual flow.

Before publishing: confirm project completion, public-display permission,
accurate scope, redacted client details, rights to screenshots, and written
approval for any quote. Keep contracts, invoices, email addresses, client files,
and private portal data out of public images and records.
