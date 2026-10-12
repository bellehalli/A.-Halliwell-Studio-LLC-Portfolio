import Link from "next/link";
import { redirect } from "next/navigation";
import { currentPortalClient, isPortalStudio } from "@/lib/portal";
import { outreachClickRows, outreachDestinations, outreachOpenRows } from "@/lib/outreach";

export const dynamic = "force-dynamic";
export default async function Outreach() {
  const client = await currentPortalClient();
  if (!isPortalStudio(client)) redirect("/portal");
  const rows = await outreachOpenRows();
  const clicks = await outreachClickRows();
  return <main className="portal-page"><section className="portal-card">
    <small>STUDIO WORKSPACE</small><h1>Outreach engagement.</h1>
    <p>Open counts are estimates from image requests, not verified people or inbox delivery. Image blocking can hide opens; privacy services can fetch images automatically. Clicks can also be caused by link scanners, so treat them as interest signals, not proof a person read the message. Obvious automated requests are excluded and repeats within five minutes are combined.</p>
    <p>Tracking stores only the random “Outreach Ref,” message step, destination, and timestamps. It does not store IP addresses or browser fingerprints. Match a reference to the “Outreach Ref” in the spreadsheet’s Lead History. A tracked click means the redirect was requested; it does not prove the visitor explored the site or submitted an inquiry. Rates need confirmed send and bounce totals from the outreach workbook.</p>
    <h2>Estimated email opens</h2>
    <div style={{ overflowX: "auto" }}><table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}><thead><tr><th>Prospect link reference</th><th>Message</th><th>Image requests</th><th>Last request (Detroit)</th></tr></thead>
      <tbody>{rows.map(row => <tr key={`${row.ref}-${row.step}`}><td style={{ padding: "12px 8px" }}><code>{String(row.ref)}</code></td><td>{String(row.step)}</td><td>{Number(row.request_count)}</td><td>{new Date(String(row.last_at)).toLocaleString("en-US", { timeZone: "America/Detroit" })}</td></tr>)}</tbody></table></div>
    {!rows.length && <p>No open estimates recorded yet. This does not mean every email was unread.</p>}
    <h2>Portfolio link clicks</h2>
    <div style={{ overflowX: "auto" }}><table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}><thead><tr><th>Prospect link reference</th><th>Message</th><th>Destination</th><th>Click requests</th><th>Last request (Detroit)</th></tr></thead>
      <tbody>{clicks.map(row => <tr key={`${row.ref}-${row.step}-${row.destination}`}><td style={{ padding: "12px 8px" }}><code>{String(row.ref)}</code></td><td>{String(row.step)}</td><td>{String(row.destination in outreachDestinations ? row.destination : "unknown")}</td><td>{Number(row.request_count)}</td><td>{new Date(String(row.last_at)).toLocaleString("en-US", { timeZone: "America/Detroit" })}</td></tr>)}</tbody></table></div>
    {!clicks.length && <p>No portfolio link clicks recorded yet.</p>}
    <p><Link href="/portal/studio">Back to the client desk</Link></p>
  </section></main>;
}
