import type { Metadata } from "next";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import Stripe from "stripe";
import { currentPortalClient, portalDeliverables, portalEnabled, portalProject } from "@/lib/portal";
import Navigation from "@/components/navigation/Navigation";
import PortalFeedback from "./PortalFeedback";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Private client project", robots: { index: false, follow: false }, referrer: "no-referrer" };

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  if (!portalEnabled()) notFound();
  const client = await currentPortalClient();
  if (!client) redirect("/portal");
  const { id } = await params;
  const project = await portalProject(client.id, id);
  if (!project) notFound();
  const deliverables = await portalDeliverables(project.id);
  let invoice: Stripe.Invoice | null = null;
  if (project.stripe_invoice_id && process.env.STRIPE_SECRET_KEY) {
    try { invoice = await new Stripe(process.env.STRIPE_SECRET_KEY).invoices.retrieve(project.stripe_invoice_id); }
    catch { /* Keep the portal usable if Stripe is temporarily unavailable. */ }
  }
  const agreementUrl = project.agreement_url?.startsWith("https://") ? project.agreement_url : null;
  return <main className="portal-page">
    <div className="site-background" aria-hidden="true"/><Navigation />
    <section className="portal-card portal-project-detail">
      <Link className="portal-brand" href="/portal"><span className="logo-mark">A.</span><strong>A. HALLIWELL STUDIO</strong></Link>
      <small>PRIVATE PROJECT / {project.stage.toUpperCase().replaceAll("_", " ")}</small>
      <h1>{project.title}</h1>
      {project.summary && <p>{project.summary}</p>}
      <div className="portal-step-grid">
        <article><h2>01 / Agreement</h2><p>{agreementUrl ? "Review and sign your project agreement using the secure link." : "The agreement will appear here after we settle the scope and terms."}</p>{agreementUrl && <a href={agreementUrl} target="_blank" rel="noopener noreferrer">Review agreement ↗</a>}</article>
        <article><h2>02 / Invoice</h2>{invoice && invoice.status !== "draft" && invoice.status !== "void" ? <><p>{invoice.status === "paid" ? "Payment received. Thank you!" : `Invoice ${invoice.number || ""} · ${new Intl.NumberFormat("en-US", { style: "currency", currency: invoice.currency }).format(invoice.amount_remaining / 100)} remaining.`}</p>{invoice.hosted_invoice_url && <a href={invoice.hosted_invoice_url} target="_blank" rel="noopener noreferrer">{invoice.status === "paid" ? "View receipt" : "View invoice and pay by card"} ↗</a>}{invoice.status !== "paid" && project.payment_instructions && <><h3>Pay by Zelle or check</h3><p className="portal-payment-instructions">{project.payment_instructions}</p><p>Let us know when you send payment. Your invoice updates after it arrives and is confirmed.</p></>}</> : <p>Your invoice and payment options will appear after the project price is agreed. No payment is due yet.</p>}</article>
      </div>
      <section className="portal-review"><h2>03 / Review &amp; revisions</h2><p>When a version is ready, you&apos;ll receive an email and can view it here. Leave one clear set of revision notes or approve that version.</p>
        {deliverables.length ? deliverables.map(item => <article className="portal-review-item" key={item.id}>
          <strong>Version {item.version} · {item.title}</strong><p>Status: {item.status.replaceAll("_", " ")}</p>
          <a href={`/api/portal/files/${item.id}`} target="_blank" rel="noopener noreferrer">View {item.file_name} ↗</a>
          {item.status === "review" && <PortalFeedback deliverableId={item.id} />}
        </article>) : <p>No review files have been shared yet.</p>}
      </section>
      <p><Link href="/portal">← All projects</Link> · Questions? <a href="mailto:hello@ahalliwellstudio.com">Email Arabella</a>.</p>
    </section>
  </main>;
}
