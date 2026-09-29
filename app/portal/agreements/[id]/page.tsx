import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Navigation from "@/components/navigation/Navigation";
import { currentPortalClient, ensurePortalLifecycle, isPortalStudio, portalDb, portalEnabled } from "@/lib/portal";
import { SignatureLayout, validSignatureLayout } from "@/lib/portal-signature-layout";
import SignAgreement from "./SignAgreement";
import PdfReader from "./PdfReader";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Private agreement", robots: { index: false, follow: false }, referrer: "no-referrer" };

export default async function AgreementPage({ params }: { params: Promise<{ id: string }> }) {
  if (!portalEnabled()) notFound();
  const client = await currentPortalClient();
  if (!client) redirect("/portal");
  const { id } = await params;
  if (!/^[a-f0-9-]{36}$/.test(id)) notFound();
  const studio = isPortalStudio(client);
  await ensurePortalLifecycle();
  const rows = await portalDb()`SELECT d.id, d.title, d.project_id, d.signature_layout, p.title AS project_title, p.client_business, p.client_id, p.invited_at, p.archived_at,
    ss.signed_at AS studio_signed_at, cs.signed_at AS client_signed_at,
    (SELECT id FROM portal_documents WHERE project_id = p.id AND kind = 'agreement' ORDER BY created_at DESC, id DESC LIMIT 1) AS latest_id
    FROM portal_documents d JOIN portal_projects p ON p.id = d.project_id
    LEFT JOIN portal_agreement_signatures ss ON ss.document_id = d.id AND ss.signer_role = 'studio'
    LEFT JOIN portal_agreement_signatures cs ON cs.document_id = d.id AND cs.signer_role = 'client'
    WHERE d.id = ${id} AND d.kind = 'agreement' LIMIT 1`;
  const doc = rows[0];
  if (!doc || (!studio && (doc.client_id !== client.id || !doc.invited_at || doc.archived_at))) notFound();
  const canSign = (studio || validSignatureLayout(doc.signature_layout)) && doc.latest_id === doc.id && (studio ? !doc.studio_signed_at : !!doc.studio_signed_at && !doc.client_signed_at);
  return <main className="portal-page"><div className="site-background" aria-hidden="true"/><Navigation />
    <section className="portal-card portal-project-detail"><Link className="portal-brand" href="/portal"><span className="logo-mark">A.</span><strong>A. HALLIWELL STUDIO</strong></Link>
      <div className="portal-agreement-heading"><small>PRIVATE PROJECT AGREEMENT</small><p>{doc.client_business || doc.project_title} <span aria-hidden="true">×</span> A. Halliwell Studio</p></div><h1>{doc.title}</h1>
      <p>Review every page before signing. The signed PDF will remain available here for both parties.</p>
      <p><strong>Studio</strong> {doc.studio_signed_at ? `signed ${new Date(String(doc.studio_signed_at)).toLocaleString("en-US", { timeZone: "America/Detroit", timeZoneName: "short" })}` : "awaiting signature"}<br/><strong>Client</strong> {doc.client_signed_at ? `signed ${new Date(String(doc.client_signed_at)).toLocaleString("en-US", { timeZone: "America/Detroit", timeZoneName: "short" })}` : "awaiting signature"}</p>
      {(canSign || (!studio && !doc.studio_signed_at && !doc.client_signed_at && doc.latest_id === doc.id)) && <p><a href="#signature">View the electronic signature field</a></p>}
      <PdfReader url={`/api/portal/documents/${id}${studio ? "?original=1" : ""}`} title={`Agreement: ${doc.title}`} placement={studio ? { documentId: id, initialLayout: doc.signature_layout as SignatureLayout | null } : undefined}/>
      <p><a href={`/api/portal/documents/${id}`} target="_blank" rel="noopener noreferrer">Open or download the agreement PDF</a></p>
      {canSign ? <SignAgreement documentId={id} email={client.email} studio={studio}/> : !studio && !doc.studio_signed_at && !doc.client_signed_at && doc.latest_id === doc.id ? <SignAgreement documentId={id} email={client.email} studio={false} pending/> : <p>{doc.client_signed_at ? "Both signatures are recorded. Download the completed copy above." : studio ? "You have signed this version. The client can sign after opening their private link." : "The studio is preparing this agreement for signing."}</p>}
      <p><Link href={studio ? "/portal/studio" : `/portal/projects/${doc.project_id}`}>Return to project</Link></p>
    </section>
  </main>;
}
