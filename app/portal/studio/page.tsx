import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navigation from "@/components/navigation/Navigation";
import { currentPortalClient, isPortalStudio, portalDb, portalEnabled } from "@/lib/portal";
import StudioWorkspace from "./StudioWorkspace";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Studio workspace", robots: { index: false, follow: false } };

export default async function StudioPage() {
  if (!portalEnabled() || !isPortalStudio(await currentPortalClient())) notFound();
  const rows = await portalDb()`SELECT p.id, p.title, p.summary, p.stage, p.agreement_url, p.stripe_invoice_id, p.payment_instructions, c.first_name, c.email
    FROM portal_projects p JOIN portal_clients c ON c.id = p.client_id ORDER BY p.created_at DESC`;
  const projects = rows.map(row => ({ id: String(row.id), title: String(row.title), summary: String(row.summary), stage: String(row.stage), agreementUrl: String(row.agreement_url || ""), invoiceId: String(row.stripe_invoice_id || ""), paymentInstructions: String(row.payment_instructions || ""), firstName: String(row.first_name), email: String(row.email) }));
  return <main className="portal-page"><div className="site-background" aria-hidden="true"/><Navigation />
    <section className="portal-card portal-project-detail"><small>STUDIO ONLY</small><h1>Client workspaces.</h1><p>Create a private project, attach the approved agreement and Stripe invoice, then share a review version when it is ready.</p><StudioWorkspace projects={projects}/><p><Link href="/portal">← Back to portal</Link></p></section>
  </main>;
}
