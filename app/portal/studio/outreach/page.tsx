import Link from "next/link";
import { redirect } from "next/navigation";
import { currentPortalClient, isPortalStudio } from "@/lib/portal";
import { outreachOpenRows } from "@/lib/outreach";

export const dynamic = "force-dynamic";
export default async function Outreach() {
  const client = await currentPortalClient();
  if (!isPortalStudio(client)) redirect("/portal");
  const rows = await outreachOpenRows();
  return <main className="portal-page"><section className="portal-card">
    <small>STUDIO WORKSPACE</small><h1>Outreach engagement.</h1>
    <p>These are estimated email opens from image requests, not verified people or inbox delivery. Image blocking can hide opens; privacy services can fetch images automatically. Obvious automated requests are excluded and repeats within five minutes are combined.</p>
    <p>Match a reference to the “Outreach Ref” in the spreadsheet’s Lead History. Portfolio visits and actions use the same reference in Vercel Web Analytics. Rates need the confirmed send and bounce totals from the outreach workbook.</p>
    <div style={{ overflowX: "auto" }}><table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}><thead><tr><th>Prospect link reference</th><th>Message</th><th>Image requests</th><th>Last request (Detroit)</th></tr></thead>
      <tbody>{rows.map(row => <tr key={`${row.ref}-${row.step}`}><td style={{ padding: "12px 8px" }}><code>{String(row.ref)}</code></td><td>{String(row.step)}</td><td>{Number(row.request_count)}</td><td>{new Date(String(row.last_at)).toLocaleString("en-US", { timeZone: "America/Detroit" })}</td></tr>)}</tbody></table></div>
    {!rows.length && <p>No open estimates recorded yet. This does not mean every email was unread.</p>}
    <p><Link href="/portal/studio">Back to the client desk</Link></p>
  </section></main>;
}
