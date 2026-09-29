import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Navigation from "@/components/navigation/Navigation";
import { currentPortalClient, ensurePortalPaymentOptions, ensurePortalProposals, ensurePortalLifecycle, isPortalStudio, portalDb, portalEnabled } from "@/lib/portal";
import StudioWorkspace from "./StudioWorkspace";
import { liveStripeStatus } from "@/lib/portal-payments";
import type { PortalInvoice } from "@/lib/portal";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Studio workspace", robots: { index: false, follow: false } };

export default async function StudioPage() {
  if (!portalEnabled() || !isPortalStudio(await currentPortalClient())) redirect("/portal?studio=1");
  await ensurePortalPaymentOptions();
  await ensurePortalProposals();
  await ensurePortalLifecycle();
  const rows = await portalDb()`SELECT p.id, p.title, p.summary, p.stage, p.agreement_url, p.stripe_invoice_id, p.payment_instructions, p.client_business, p.investment_cents, p.invited_at, p.archived_at, c.first_name, c.email
    FROM portal_projects p JOIN portal_clients c ON c.id = p.client_id ORDER BY p.created_at DESC`;
  const documents = await portalDb()`SELECT d.id, d.project_id, d.kind, d.title, d.created_at, i.invoice_number, i.amount_cents, i.status, i.shared_at, i.notification_status, i.notification_attempted_at, i.notification_email_id, i.chase_closed_at, i.milestone_number, i.stripe_invoice_id AS invoice_stripe_id, i.payment_url, i.zelle_id, i.check_address,
    o.ach_url, o.selected_method, o.selected_at,
    ss.signed_at AS studio_signed_at, cs.signed_at AS client_signed_at
    FROM portal_documents d
    LEFT JOIN portal_invoices i ON i.document_id = d.id
    LEFT JOIN portal_payment_options o ON o.document_id = d.id
    LEFT JOIN portal_agreement_signatures ss ON ss.document_id = d.id AND ss.signer_role = 'studio'
    LEFT JOIN portal_agreement_signatures cs ON cs.document_id = d.id AND cs.signer_role = 'client'
    ORDER BY d.created_at DESC, d.id DESC`;
  const materials = await portalDb()`SELECT id, project_id, category, file_name, note FROM portal_materials ORDER BY created_at DESC`;
  const proposals = await portalDb()`SELECT id, project_id, title, file_name FROM portal_proposals ORDER BY created_at DESC`;
  const deliverables = await portalDb()`SELECT d.id, d.project_id, d.version, d.title, d.file_name, d.status, d.shared_at, d.notification_status, d.notification_attempted_at, d.notification_email_id, f.decision, f.note, f.created_at AS decision_at
    FROM portal_deliverables d LEFT JOIN portal_feedback f ON f.deliverable_id = d.id ORDER BY d.created_at DESC`;
  const stripeStatuses = new Map(await Promise.all(documents.filter(doc => doc.invoice_stripe_id).map(async doc => [doc.id, await liveStripeStatus({ document_id: String(doc.id), stripe_invoice_id: String(doc.invoice_stripe_id), amount_cents: Number(doc.amount_cents) } as PortalInvoice)] as const)));
  const projects = rows.map(row => ({ id: String(row.id), title: String(row.title), summary: String(row.summary), stage: String(row.stage), agreementUrl: String(row.agreement_url || ""), invoiceId: String(row.stripe_invoice_id || ""), paymentInstructions: String(row.payment_instructions || ""), firstName: String(row.first_name), email: String(row.email), clientBusiness: String(row.client_business || ""), investmentCents: Number(row.investment_cents || 0), invited: !!row.invited_at, archived: !!row.archived_at, reviews: deliverables.filter(item => item.project_id === row.id).map(item => ({ id: String(item.id), version: Number(item.version), title: String(item.title), fileName: String(item.file_name), status: String(item.status), shared: !!item.shared_at, notificationStatus: String(item.notification_status || "unknown"), notificationAttemptedAt: item.notification_attempted_at ? new Date(String(item.notification_attempted_at)).toISOString() : "", notificationEmailId: String(item.notification_email_id || ""), decision: String(item.decision || ""), note: String(item.note || ""), decisionAt: item.decision_at ? new Date(String(item.decision_at)).toISOString() : "" })), materials: materials.filter(item => item.project_id === row.id).map(item => ({ id: String(item.id), category: String(item.category), fileName: String(item.file_name), note: String(item.note) })), proposals: proposals.filter(doc => doc.project_id === row.id).map(doc => ({ id: String(doc.id), title: String(doc.title), fileName: String(doc.file_name) })), documents: documents.filter(doc => doc.project_id === row.id).map(doc => ({ id: String(doc.id), kind: String(doc.kind), title: String(doc.title), invoiceNumber: String(doc.invoice_number || ""), amountCents: Number(doc.amount_cents || 0), status: stripeStatuses.get(doc.id) === "paid" ? "paid" : String(doc.status || ""), shared: !!doc.shared_at, notificationStatus: String(doc.notification_status || "unknown"), notificationAttemptedAt: doc.notification_attempted_at ? new Date(String(doc.notification_attempted_at)).toISOString() : "", notificationEmailId: String(doc.notification_email_id || ""), chaseClosed: !!doc.chase_closed_at, milestoneNumber: Number(doc.milestone_number || 1), stripeInvoiceId: String(doc.invoice_stripe_id || ""), stripeStatus: String(stripeStatuses.get(doc.id) || "not connected"), paymentUrl: String(doc.payment_url || ""), achUrl: String(doc.ach_url || ""), selectedMethod: String(doc.selected_method || ""), selectedAt: doc.selected_at ? new Date(String(doc.selected_at)).toISOString() : "", zelleId: String(doc.zelle_id || ""), checkAddress: String(doc.check_address || ""), studioSigned: !!doc.studio_signed_at, clientSigned: !!doc.client_signed_at })) }));
  return <main className="portal-page"><div className="site-background" aria-hidden="true"/><Navigation />
    <section className="portal-card portal-project-detail portal-studio-shell"><small>STUDIO WORKSPACE</small><h1>The client desk.</h1><p>Prepare the documents, sign your side, and welcome your client into a considered project experience.</p><StudioWorkspace projects={projects}/><p><Link href="/portal">Back to portal</Link></p></section>
  </main>;
}
