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
  const rows = await portalDb()`SELECT p.id, p.title, p.summary, p.stage, p.agreement_url, p.stripe_invoice_id, p.payment_instructions, p.client_business, p.investment_cents, c.first_name, c.email
    FROM portal_projects p JOIN portal_clients c ON c.id = p.client_id ORDER BY p.created_at DESC`;
  const documents = await portalDb()`SELECT d.id, d.project_id, d.kind, d.title, d.created_at, i.invoice_number, i.amount_cents, i.status, i.payment_url, i.zelle_id, i.check_address,
    ss.signed_at AS studio_signed_at, cs.signed_at AS client_signed_at
    FROM portal_documents d
    LEFT JOIN portal_invoices i ON i.document_id = d.id
    LEFT JOIN portal_agreement_signatures ss ON ss.document_id = d.id AND ss.signer_role = 'studio'
    LEFT JOIN portal_agreement_signatures cs ON cs.document_id = d.id AND cs.signer_role = 'client'
    ORDER BY d.created_at DESC, d.id DESC`;
  const materials = await portalDb()`SELECT id, project_id, category, file_name, note FROM portal_materials ORDER BY created_at DESC`;
  const projects = rows.map(row => ({ id: String(row.id), title: String(row.title), summary: String(row.summary), stage: String(row.stage), agreementUrl: String(row.agreement_url || ""), invoiceId: String(row.stripe_invoice_id || ""), paymentInstructions: String(row.payment_instructions || ""), firstName: String(row.first_name), email: String(row.email), clientBusiness: String(row.client_business || ""), investmentCents: Number(row.investment_cents || 0), materials: materials.filter(item => item.project_id === row.id).map(item => ({ id: String(item.id), category: String(item.category), fileName: String(item.file_name), note: String(item.note) })), documents: documents.filter(doc => doc.project_id === row.id).map(doc => ({ id: String(doc.id), kind: String(doc.kind), title: String(doc.title), invoiceNumber: String(doc.invoice_number || ""), amountCents: Number(doc.amount_cents || 0), status: String(doc.status || ""), paymentUrl: String(doc.payment_url || ""), zelleId: String(doc.zelle_id || ""), checkAddress: String(doc.check_address || ""), studioSigned: !!doc.studio_signed_at, clientSigned: !!doc.client_signed_at })) }));
  return <main className="portal-page"><div className="site-background" aria-hidden="true"/><Navigation />
    <section className="portal-card portal-project-detail"><small>STUDIO ONLY</small><h1>Client workspaces.</h1><p>Create a private project, attach the approved agreement and issued invoice, then share a review version when it is ready.</p><StudioWorkspace projects={projects}/><p><Link href="/portal">Back to portal</Link></p></section>
  </main>;
}
