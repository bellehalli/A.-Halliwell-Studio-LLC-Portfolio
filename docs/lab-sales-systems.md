# Lab sales systems

## Existing implementation audited before edits

The codebase already contained Experience Atlas, Night Mode, Treatment Architect, Service Command and Conversion Engine. Élan supported multiple selected face/body concerns, independent FDA service education, discussion topics, timeline/downtime and a local intake preview. Northstar already simulated appointments, conflict-aware technician assignment, customer updates, estimates, approvals and completion records. Shared Lab links already prefilled Start Project using a query payload and a same-page event/session handoff. The inquiry API already saved leads and sent studio notifications.

The missing pieces were homeowner service routing, reusable consultation/service routing, private-event qualification, addressable experiments and independent inquiry attribution. These are extensions to those components, not a replacement application.

## Implemented

- Home Intelligence: observation → interactive house/system selection → urgency → trade/service conversation → repair/replace/upgrade/unsure → structured service brief. Unknown systems go to staff triage. Immediate safety concerns stop the demo progression. Existing Service Command remains available in an expandable section.
- Reusable Routing Engine: configurable single/multiple-answer steps, downstream answer invalidation, exclusive unknown/none choices, step focus, structured summaries, preview and inquiry handoff. The Élan demo retains its visual selectors and education and adds surgical/non-surgical discussion, service line, location, provider and visit preferences. Multiple face/body goals and service interests travel together without diagnosing or recommending a treatment.
- Private Event Architect: event type, guest-count band, format, multiple spaces, production/AV, food/beverage, privacy and optional lodging. It uses the shared engine and generic industry language.
- Deep links: experiment selections update the URL; browser back/forward restores the capability; each experiment displays a direct link.
- Context handoff: experiment and final page CTAs carry the selected brief. Start Project shows the originating capability, preserves it in the draft and submits it separately from editable goal text. The API includes it in the existing lead source and studio notification, without a database migration.
- Existing demos: Atlas carries the selected event or lodging context; Night Mode carries the selected experience, group, section, extras and illustrative estimate; the existing Conversion Engine already carried journey context and now publishes that context to the final page CTA. Dispatch handoffs include appointment/status/estimate context.
- Accessibility/responsive fixes: 44px hotspot/removal targets, matching visible/accessible hotspot and reset labels, named preview dialogs, keyboard focus between steps and house controls kept within the diagram at narrow widths.

## Cold-prospect paths

| Capability | Path |
| --- | --- |
| Experience Atlas | `/lab?capability=experience-atlas#capabilities` |
| Night Mode | `/lab?capability=night-mode#capabilities` |
| Routing Engine / Élan | `/lab?capability=routing-engine#capabilities` |
| Home Intelligence | `/lab?capability=home-intelligence#capabilities` |
| Conversion Engine | `/lab?capability=conversion-engine#capabilities` |
| Private Event Architect | `/lab?capability=private-event-architect#capabilities` |

These paths are available when this branch is deployed. The homepage uses the same components and same-page Start Project handoff.

## Scope and integration

All routing output is an intake/discussion brief. Demo availability, capacities, provider/location preferences, clinical suitability and service work require the business's own confirmation. The Lab does not connect a new clinical scheduling service or reserve event inventory. Installing the reusable engine for a client requires their approved service, location and provider configuration and an agreed integration. Existing AHS inquiry and portal infrastructure remains in place.

## Validation

- Production build, TypeScript, existing tests and asset checks.
- New routing regression tests for trade/staff-triage paths, downstream invalidation, mutually exclusive choices and complete event/consultation briefs.
- API regression for capability attribution in the saved lead and studio email.
- Browser journeys at 1440px and 390px: all six deep links, accessibility scans of the Lab, no document overflow, new routing handoffs, reset/history, dialog Escape, existing demo handoffs and dispatch-through-completion.
- Homepage journeys at 320px, 768px and 1440px: house controls remain within the scene, keyboard step focus, same-page handoff and mocked final submission retaining capability and selections. No live test inquiry or email was sent.

SEO metadata/canonicals, global branding, approved case studies, portal routes, payment infrastructure and existing assets were retained. Lab page copy now correctly counts six experiments.
