import Link from "next/link";
import { studio } from "@/lib/studio-config";
export default function StudioContinuity() {
  return <section className="studio-commercial-section studio-continuity" id="continuity" aria-labelledby="continuity-heading">
    <small>AFTER LAUNCH / {studio.offers.support.toUpperCase()}</small><h2 id="continuity-heading">Keep the experience<br/><em>moving with the business.</em></h2>
    <p>Come back for the next campaign, a seasonal update, a new feature, or the refinement you discover once people start using the site.</p>
    <ul><li>Landing pages, campaign experiences, and seasonal content</li><li>Design refinements and analytics-informed improvements</li><li>New features, integrations, and additional illustrations</li><li>Technical maintenance and agreed website support</li></ul>
    <p>Start with a defined request. We agree on the scope, timing, and investment before work begins. Ongoing support is a separate engagement; it is not automatically included in a website project.</p>
    <Link className="button button-primary" href="/start?service=support">Discuss ongoing support</Link>
  </section>;
}
