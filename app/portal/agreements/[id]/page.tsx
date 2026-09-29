import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Navigation from "@/components/navigation/Navigation";
import { currentPortalClient, isPortalStudio, portalDb, portalEnabled } from "@/lib/portal";
import SignAgreement from "./SignAgreement";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Private agreement", robots: { index: false, follow: false }, referrer: "no-referrer" };

export default async function AgreementPage({ params }: { params: Promise<{ id: string }> }) {
  if (!portalEnabled()) notFound();
  const client = await currentPortalClient();
  if (!client) redirect("/portal");
  const { id } = await params;
  if (!/^[a-f0-9-]{36}$/.test(id)) notFound();
  const studio = isPortalStudio(client);
  const rows = await portalDb()`SELECT d.id, d.title, d.project_id, p.title AS project_title, p.client_id,
    ss.signed_at AS studio_signed_at, cs.signed_at AS client_signed_at,
    (SELECT id FROM portal_documents WHERE project_id = p.id AND kind = 'agreement' ORDER BY created_at DESC, id DESC LIMIT 1) AS latest_id
    FROM portal_documents d JOIN portal_projects p ON p.id = d.project_id
    LEFT JOIN portal_agreement_signatures ss ON ss.document_id = d.id AND ss.signer_role = 'studio'
    LEFT JOIN portal_agreement_signatures cs ON cs.document_id = d.id AND cs.signer_role = 'client'
    WHERE d.id = ${id} AND d.kind = 'agreement' LIMIT 1`;
  const doc = rows[0];
  if (!doc || (!studio && doc.client_id !== client.id)) notFound();
  const canSign = doc.latest_id === doc.id && (studio ? !doc.studio_signed_at : !!doc.studio_signed_at && !doc.client_signed_at);
  return <main className="portal-page"><div className="site-background" aria-hidden="true"/><Navigation />
    <section className="portal-card portal-project-detail"><Link className="portal-brand" href="/portal"><span className="logo-mark">A.</span><strong>A. HALLIWELL STUDIO</strong></Link>
      <small>PRIVATE AGREEMENT {doc.project_title}</small><h1>{doc.title}</h1>
      <p>Review every page before signing. The signed PDF will remain available here for both parties.</p>
      <p><strong>Studio</strong> {doc.studio_signed_at ? "signed" : "awaiting signature"} &nbsp; <strong>Client</strong> {doc.client_signed_at ? "signed" : "awaiting signature"}</p>
      <div className="portal-pdf-viewer"><iframe title={`Agreement: ${doc.title}`} src={`/api/portal/documents/${id}#toolbar=1`}/></div>
      <p><a href={`/api/portal/documents/${id}`} target="_blank" rel="noopener noreferrer">Open or download the agreement PDF</a></p>
      {canSign ? <SignAgreement documentId={id} email={client.email} studio={studio}/> : <p>{doc.client_signed_at ? "Both signatures are recorded. Download the completed copy above." : studio ? "You have signed this version. Valerie can sign after opening her private link." : "The studio is preparing this agreement for signing."}</p>}
      <p><Link href={studio ? "/portal/studio" : `/portal/projects/${doc.project_id}`}>Return to project</Link></p>
    </section>
  </main>;
}
