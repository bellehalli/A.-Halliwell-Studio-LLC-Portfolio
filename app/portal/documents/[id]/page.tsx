import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navigation from "@/components/navigation/Navigation";
import { currentPortalClient, ensurePortalLifecycle, isPortalStudio, portalDb, portalEnabled } from "@/lib/portal";
import PortalLogin from "../../PortalLogin";
import PdfReader from "../../agreements/[id]/PdfReader";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Private document", robots: { index: false, follow: false }, referrer: "no-referrer" };
export default async function DocumentPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ version?: string; original?: string }> }) {
  if (!portalEnabled()) notFound();
  const { id } = await params;
  if (!/^[a-f0-9-]{36}$/.test(id)) notFound();
  const client = await currentPortalClient();
  if (!client) return <main className="portal-page"><div className="site-background" aria-hidden="true"/><Navigation/><section className="portal-card"><small>PRIVATE PROJECT DOCUMENT</small><h1>Sign in to view your document.</h1><p>Use the email associated with your portal. A fresh code will arrive in your inbox.</p><PortalLogin returnTo={`/portal/documents/${id}`}/></section></main>;
  const studio = isPortalStudio(client);
  await ensurePortalLifecycle();
  const docs = await portalDb()`SELECT d.title, d.project_id FROM portal_documents d JOIN portal_projects p ON p.id = d.project_id
    WHERE d.id = ${id} AND (${studio} OR (d.removed_at IS NULL AND p.client_id = ${client.id} AND p.invited_at IS NOT NULL AND p.archived_at IS NULL)) LIMIT 1`;
  if (!docs.length) notFound();
  const query = new URLSearchParams();
  const search = await searchParams;
  if (search.version) {
    if (!studio || !/^[a-f0-9-]{36}$/.test(search.version)) notFound();
    query.set("version", search.version);
  }
  if (studio && search.original === "1") query.set("original", "1");
  const api = `/api/portal/documents/${id}${query.size ? `?${query}` : ""}`;
  query.set("download", "1");
  return <main className="portal-page"><div className="site-background" aria-hidden="true"/><Navigation/>
    <section className="portal-card portal-project-detail"><small>PRIVATE PROJECT DOCUMENT</small><h1>{String(docs[0].title)}</h1>
      {search.version && <p>Previous PDF copy retained in your studio history.</p>}
      <PdfReader url={api} title={String(docs[0].title)}/>
      <p><a href={`/api/portal/documents/${id}?${query}`}>Download PDF</a></p>
      <p><Link href={studio ? "/portal/studio" : `/portal/projects/${docs[0].project_id}`}>Return to project</Link></p>
    </section>
  </main>;
}
