import type { Metadata } from "next";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import Stripe from "stripe";
import { liveStripeStatus } from "@/lib/portal-payments";
import { milestoneLabels, projectMilestoneAmounts } from "@/lib/portal-plan";
import PaymentJourney from "./PaymentJourney";
import ClientVisitTracker from "./ClientVisitTracker";
import { currentPortalClient, ensurePortalPaymentOptions, ensurePortalProposals, isPortalStudio, portalDb, portalDeliverables, portalDocuments, portalEnabled, portalInvoices, portalProject } from "@/lib/portal";
import Navigation from "@/components/navigation/Navigation";
import PortalFeedback from "./PortalFeedback";
import MaterialUpload from "./MaterialUpload";
import PaymentOptions from "./PaymentOptions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Private client project", robots: { index: false, follow: false }, referrer: "no-referrer" };

export default async function ProjectPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ studioPreview?: string }> }) {
  if (!portalEnabled()) notFound();
  const { id } = await params;
  const client = await currentPortalClient();
  if (!client) redirect(`/portal?project=${encodeURIComponent(id)}`);
  const studioPreview = (await searchParams).studioPreview === "1" && isPortalStudio(client);
  const target = studioPreview && /^[a-f0-9-]{36}$/.test(id) ? await portalDb()`SELECT c.id, c.first_name, c.email FROM portal_projects p
    JOIN portal_clients c ON c.id = p.client_id WHERE p.id = ${id} LIMIT 1` : [];
  const projectClient = studioPreview ? target[0] : client;
  const project = projectClient ? await portalProject(String(projectClient.id), id) : null;
  if (!project || (!studioPreview && (!project.invited_at || project.archived_at))) notFound();
  await ensurePortalPaymentOptions();
  await ensurePortalProposals();
  const [allDeliverables, documents, allInvoices, materials] = await Promise.all([portalDeliverables(project.id), portalDocuments(project.id), portalInvoices(project.id), portalDb()`SELECT id, category, note, file_name, created_at FROM portal_materials WHERE project_id = ${project.id} ORDER BY created_at DESC`]);
  const deliverables = studioPreview ? allDeliverables : allDeliverables.filter(item => item.shared_at);
  const invoices = studioPreview ? allInvoices : allInvoices.filter(item => item.shared_at);
  const stripeStatuses = new Map(await Promise.all(invoices.map(async item => [item.document_id, await liveStripeStatus(item)] as const)));
  const invoiceAttachments = await portalDb()`SELECT a.id, a.document_id, a.title FROM portal_invoice_attachments a JOIN portal_documents d ON d.id = a.document_id WHERE d.project_id = ${project.id} AND (${studioPreview} OR a.shared_at IS NOT NULL) ORDER BY a.created_at DESC`;
  const proposals = await portalDb()`SELECT id, title FROM portal_proposals WHERE project_id = ${project.id} ORDER BY created_at DESC LIMIT 1`;
  const proposal = proposals[0];
  const paymentOptions = await portalDb()`SELECT o.document_id, o.ach_url, o.selected_method FROM portal_payment_options o
    JOIN portal_documents d ON d.id = o.document_id WHERE d.project_id = ${project.id}`;
  const paymentOption = (documentId: string) => paymentOptions.find(option => option.document_id === documentId);
  const agreement = documents.find(doc => doc.kind === "agreement");
  const visibleInvoiceIds = new Set(invoices.filter(item => item.status !== "void").map(item => item.document_id));
  const chaseInvoices = documents.filter(doc => doc.kind === "invoice" && visibleInvoiceIds.has(doc.id));
  const sampleDocument = project.title.startsWith("TEST") ? documents.find(doc => doc.kind === "invoice" && invoices.some(item => item.document_id === doc.id && item.status === "void" && item.invoice_number.startsWith("TEST-"))) : undefined;
  const sampleInvoice = sampleDocument ? invoices.find(item => item.document_id === sampleDocument.id) : undefined;
  const stripeInvoices = new Map<string, Stripe.Invoice>();
  if (process.env.STRIPE_SECRET_KEY) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    await Promise.all(invoices.filter(item => item.stripe_invoice_id).map(async item => {
      try { stripeInvoices.set(item.document_id, await stripe.invoices.retrieve(String(item.stripe_invoice_id))); }
      catch { /* The invoice remains readable if Stripe is temporarily unavailable. */ }
    }));
  }
  const invoice = stripeInvoices.values().next().value as Stripe.Invoice | undefined;
  const agreementUrl = project.agreement_url?.startsWith("https://") ? project.agreement_url : null;
  const money = (cents: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
  const fullyPaid = invoices.some(item => Number(item.milestone_number) === 0 && (item.status === "paid" || stripeStatuses.get(item.document_id) === "paid"));
  const fullPending = invoices.some(item => Number(item.milestone_number) === 0 && (!!item.submitted_at || stripeStatuses.get(item.document_id) === "received, awaiting approval"));
  const milestonePending = invoices.some(item => Number(item.milestone_number) !== 0 && (!!item.submitted_at || stripeStatuses.get(item.document_id) === "received, awaiting approval"));
  const milestonePaid = invoices.some(item => Number(item.milestone_number) !== 0 && (item.status === "paid" || stripeStatuses.get(item.document_id) === "paid"));
  const paid = invoices.some(item => item.status === "paid" || stripeStatuses.get(item.document_id) === "paid");
  const started = ["in_progress", "review", "complete"].includes(project.stage);
  const isVenueMap = project.client_business.toLowerCase() === "vale royal barn" && project.title.toLowerCase().includes("map");
  return <main className="portal-page">
    {!studioPreview && !isPortalStudio(client) && <ClientVisitTracker projectId={project.id}/>}
    <div className="site-background" aria-hidden="true"/><Navigation />
    <section className="portal-card portal-project-detail">
      <Link className="portal-brand" href="/portal"><span className="logo-mark">A.</span><strong>A. HALLIWELL STUDIO</strong></Link>
      <small>PRIVATE PROJECT {project.stage.toUpperCase().replaceAll("_", " ")}</small>
      <h1>{project.title}</h1>
      {studioPreview && <div className="portal-preview-safety"><strong>Studio preview</strong><p>This is read only. Previewing the workspace does not send an email or change the client&apos;s project.</p><Link href="/portal/studio">Return to manager portal</Link></div>}
      <div className="portal-welcome"><h2>Welcome, {projectClient.first_name}.</h2><p>{isVenueMap ? "We’re excited to create a custom illustrated experience map for Vale Royal Barn. The piece is designed to showcase your property, guide guests through the experience, and become part of your venue’s story." : `Welcome to your private workspace for ${project.client_business || project.title}.`}</p><p>Your project dashboard houses your agreement, payments, updates, and final deliverables throughout the creative process.</p></div>
      {project.summary && <p>{project.summary}</p>}
      {project.investment_cents && <p className="portal-investment"><span>PROJECT INVESTMENT</span><strong>{money(project.investment_cents)}</strong></p>}
      {isVenueMap && <PaymentJourney projectId={project.id} milestones={projectMilestoneAmounts(project).map((amount, index) => {
        const item = invoices.find(invoice => Number(invoice.milestone_number) === index + 1 && invoice.status !== "void");
        return { amount, label: milestoneLabels[index], paid: fullyPaid || !!item && (item.status === "paid" || stripeStatuses.get(item.document_id) === "paid"), issued: !!item && item.status === "issued" };
      })} />}
      <div className="portal-step-grid">
        {(proposal || studioPreview) && <article><h2>Project proposal</h2>{proposal ? <><p>Review the project scope, investment, and payment milestones.</p><a href={`/api/portal/proposals/${proposal.id}`} target="_blank" rel="noopener noreferrer">View {String(proposal.title)}</a></> : <p>Your approved proposal will appear here when the studio attaches it.</p>}</article>}
        <article><h2>01 Agreement</h2>{agreement ? <><p>{agreement.client_signed_at ? "Signed by both parties. Your signed copy is ready." : agreement.studio_signed_at ? "The studio has signed. Read the complete agreement and add your signature." : "The agreement is being prepared for your signature."}</p><Link href={`/portal/agreements/${agreement.id}`}>{agreement.client_signed_at ? "View signed agreement" : "Review agreement"}</Link></> : <><p>{agreementUrl ? "Review and sign your project agreement using the secure link." : "The agreement will appear here after we settle the scope and terms."}</p>{agreementUrl && <a href={agreementUrl} target="_blank" rel="noopener noreferrer">Review agreement</a>}</>}</article>
        <article><h2>02 Investment &amp; payment</h2>{chaseInvoices.length && !agreement?.client_signed_at ? <p>Your Chase invoice is prepared. Its details will appear here after you sign the agreement.</p> : chaseInvoices.length ? <div className="portal-invoice-list">{chaseInvoices.map(doc => { const item = invoices.find(entry => entry.document_id === doc.id)!; const stripeInvoice = stripeInvoices.get(doc.id); const stripeForThisInvoice = stripeInvoice?.customer_email?.toLowerCase() === String(projectClient.email).toLowerCase() && stripeInvoice?.amount_due === item.amount_cents; return <section className="portal-invoice-card" key={doc.id}><small>{Number(item.milestone_number) === 0 ? "PAY IN FULL" : "MILESTONE PAYMENT"} · INVOICE {item.invoice_number}</small><h3>{doc.title}</h3><div className="portal-invoice-row"><span>Business</span><strong>A. Halliwell Studio, LLC</strong></div><div className="portal-invoice-row"><span>Customer</span><strong>{projectClient.first_name}</strong></div><div className="portal-invoice-row"><span>Amount due</span><strong>{money(fullyPaid || item.status === "paid" || stripeStatuses.get(item.document_id) === "paid" ? 0 : item.amount_cents)}</strong></div><div className="portal-invoice-row"><span>Status</span><strong>{(item.status === "paid" || stripeStatuses.get(item.document_id) === "paid") ? "Paid" : "Issued"}</strong></div>{item.due_on && <div className="portal-invoice-row"><span>Due</span><strong>{String(item.due_on).slice(0, 10)}</strong></div>}<a href={`/portal/documents/${doc.id}`} target="_blank" rel="noopener noreferrer">View invoice PDF</a>{(item.submitted_at || stripeStatuses.get(item.document_id) === "received, awaiting approval") && item.status !== "paid" && <p>Payment submitted. Awaiting studio approval.</p>}{invoiceAttachments.filter(a => a.document_id === doc.id).map(a => <p key={String(a.id)}><a href={`/portal/documents/${doc.id}?attachment=${a.id}`} target="_blank" rel="noopener noreferrer">View {String(a.title)}</a></p>)}{!fullyPaid && !fullPending && !(Number(item.milestone_number) === 0 && (milestonePaid || milestonePending)) && item.status !== "paid" && stripeStatuses.get(item.document_id) !== "paid" && stripeStatuses.get(item.document_id) !== "received, awaiting approval" && <PaymentOptions submitted={!!item.submitted_at} readonly={studioPreview} documentId={doc.id} amount={money(item.amount_cents)} invoiceNumber={item.invoice_number} zelleId={item.zelle_id} bankLink={item.payment_url} achUrl={String(paymentOption(doc.id)?.ach_url || (stripeForThisInvoice && stripeInvoice?.status === "open" && stripeInvoice.amount_remaining === item.amount_cents && stripeInvoice.payment_settings?.payment_method_types?.includes("us_bank_account") ? stripeInvoice.hosted_invoice_url : "") || "")} selectedMethod={String(paymentOption(doc.id)?.selected_method || "")} checkAddress={item.check_address} stripeUrl={stripeForThisInvoice && stripeInvoice?.status === "open" && stripeInvoice.amount_remaining === item.amount_cents ? stripeInvoice.hosted_invoice_url ?? null : null} />}</section> })}</div> : sampleDocument && sampleInvoice ? <div className="portal-invoice-list"><section className="portal-invoice-card"><small>SAMPLE CHASE INVOICE</small><h3>Project deposit preview</h3><div className="portal-invoice-row"><span>Business</span><strong>A. Halliwell Studio, LLC</strong></div><div className="portal-invoice-row"><span>Customer</span><strong>{projectClient.first_name}</strong></div><div className="portal-invoice-row"><span>Sample deposit</span><strong>{money(sampleInvoice.amount_cents)}</strong></div><div className="portal-invoice-row"><span>Payment due</span><strong>None. Test only.</strong></div><p><a href={`/portal/documents/${sampleDocument.id}`} target="_blank" rel="noopener noreferrer">View sample invoice PDF</a></p><PaymentOptions readonly={studioPreview} documentId={sampleDocument.id} amount={money(sampleInvoice.amount_cents)} invoiceNumber={sampleInvoice.invoice_number} zelleId="" bankLink={null} achUrl="" selectedMethod={String(paymentOption(sampleDocument.id)?.selected_method || "")} stripeUrl={null} checkAddress="" preview/></section></div> : invoice && agreement?.client_signed_at && invoice.status !== "draft" && invoice.status !== "void" ? <><p>{invoice.status === "paid" ? "Payment received. Thank you!" : `Invoice ${invoice.number || ""}. ${new Intl.NumberFormat("en-US", { style: "currency", currency: invoice.currency }).format(invoice.amount_remaining / 100)} remaining.`}</p>{invoice.hosted_invoice_url && <a href={invoice.hosted_invoice_url} target="_blank" rel="noopener noreferrer">{invoice.status === "paid" ? "View receipt" : "View invoice and pay by card"}</a>}{invoice.status !== "paid" && project.payment_instructions && <><h3>Pay by Zelle or check</h3><p className="portal-payment-instructions">{project.payment_instructions}</p><p>Let us know when you send payment. Your invoice updates after it arrives and is confirmed.</p></>}</> : <p>Your invoice and payment options are being prepared. No payment is due yet.</p>}</article>
      </div>
      <section className="portal-materials"><h2>03 Upload project materials</h2><p>Share the aerial imagery, site plan, floor plan, property photography, logo or branding, and any inspiration you already have. Upload what is ready now; you can return for the rest.</p>
        {agreement?.client_signed_at ? (studioPreview ? <p>The client upload folder opens after signing.</p> : <MaterialUpload projectId={project.id}/>) : sampleInvoice ? <div className="portal-material-form"><p>This is how the asset folder will appear after signing. Uploading opens after both signatures are recorded.</p><label>What are you sharing?<select disabled><option>Aerial imagery</option><option>Site plan</option><option>Floor plan</option><option>Property photography</option></select></label><label>Choose files<input type="file" disabled /></label><label>Optional note<textarea disabled placeholder="Any details especially meaningful to your guests?" /></label><button disabled>Upload project materials</button></div> : <p>The upload folder opens once the agreement is signed.</p>}
        {materials.length > 0 && <div className="portal-material-list"><h3>Shared materials</h3>{materials.map(item => <p key={String(item.id)}><a href={`/api/portal/materials/${item.id}`}>{String(item.file_name)}</a>. {String(item.category).replaceAll("_", " ")}</p>)}</div>}
      </section>
      <section className="portal-journey"><h2>Project journey</h2><ol>
        <li><strong>01 Project confirmed</strong><span>Agreement {agreement?.client_signed_at ? "signed" : "awaiting signature"}. Deposit {paid ? "received" : "awaiting payment"}</span></li>
        <li><strong>02 Creative development</strong><span>{started ? "In progress" : "Source review + illustration planning"}</span></li>
        <li><strong>03 First concept review</strong><span>{deliverables.length ? "Initial concept available" : "Initial map presentation"}</span></li>
        <li><strong>04 Refinement</strong><span>Final adjustments</span></li>
        <li><strong>05 Final delivery</strong><span>{project.stage === "complete" ? "Delivered" : "Website + print-ready files"}</span></li>
      </ol></section>
      <section className="portal-review"><h2>Review &amp; revisions</h2><p>When a version is ready, you&apos;ll receive an email and can view it here. Leave one clear set of revision notes or approve that version.</p>
        {deliverables.length ? deliverables.map(item => <article className="portal-review-item" key={item.id}>
          <strong>Version {item.version}. {item.title}</strong><p>Status {item.status.replaceAll("_", " ")}</p>
          <a href={`/api/portal/files/${item.id}`} target="_blank" rel="noopener noreferrer">View {item.file_name}</a>
          {item.status === "review" && (studioPreview ? <p>Client feedback controls open in the client workspace.</p> : <PortalFeedback deliverableId={item.id} />)}
        </article>) : sampleInvoice ? <article className="portal-review-item"><strong>First concept review preview</strong><p>When the first proof is shared, its PDF appears here. You can then request revisions or approve that version.</p><label>Revision notes<textarea disabled placeholder="What would you like adjusted?" /></label><div className="portal-feedback"><button type="button" disabled>Request revisions</button><button type="button" disabled>Approve this version</button></div><p>No review file has been shared in this test project.</p></article> : <p>No review files have been shared yet.</p>}
      </section>
      <p><Link href={studioPreview ? "/portal/studio" : "/portal"}>{studioPreview ? "Manager portal" : "All projects"}</Link>. Questions? <a href="mailto:hello@ahalliwellstudio.com">Email Arabella</a>.</p>
    </section>
  </main>;
}
