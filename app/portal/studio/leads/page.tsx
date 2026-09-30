import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Navigation from "@/components/navigation/Navigation";
import PortalSignOut from "@/app/portal/PortalSignOut";
import { currentPortalClient, isPortalStudio, portalEnabled } from "@/lib/portal";
import { studioLeads } from "@/lib/leads";
import LeadsDesk from "./LeadsDesk";
import "./leads.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Studio leads", robots: { index: false, follow: false } };

export default async function LeadsPage() {
  if (!portalEnabled() || !isPortalStudio(await currentPortalClient())) redirect("/portal?studio=1");
  const leads = await studioLeads();
  return <main className="portal-page"><div className="site-background" aria-hidden="true" /><Navigation />
    <section className="portal-card portal-project-detail portal-studio-shell">
      <div className="portal-session-bar"><Link href="/portal/studio">Back to the client desk</Link><PortalSignOut /></div>
      <small>STUDIO WORKSPACE</small><h1>The conversation starts here.</h1>
      <p>Inquiries, thoughtful follow-ups, and the next project waiting to happen.</p>
      <LeadsDesk leads={leads} />
    </section>
  </main>;
}
