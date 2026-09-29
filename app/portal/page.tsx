import { socialMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Navigation from "@/components/navigation/Navigation";
import { currentPortalClient, isPortalStudio, portalEnabled, portalProjects } from "@/lib/portal";
import PortalLogin from "./PortalLogin";
import PortalSignOut from "./PortalSignOut";

export const metadata: Metadata = {
  title: "Client Portal",
  description: "Private client workspace access for active A. Halliwell Studio projects.",
  alternates: { canonical: "/portal" },
  robots: { index: false, follow: false },
  ...socialMetadata("/portal", "Client Portal", "Private client workspace access for active A. Halliwell Studio projects."),
};

export const dynamic = "force-dynamic";

export default async function PortalPage({ searchParams }: { searchParams: Promise<{ studio?: string; project?: string }> }){
  const query = await searchParams;
  const studioSignIn = query.studio === "1";
  const projectId = /^[a-f0-9-]{36}$/.test(query.project || "") ? query.project! : "";
  if (portalEnabled()) {
    const client = await currentPortalClient();
    const projects = client ? await portalProjects(client.id) : [];
    if (client && projectId && projects.some(project => project.id === projectId)) redirect(`/portal/projects/${projectId}`);
    return <main className="portal-page">
      <div className="site-background" aria-hidden="true"/><Navigation />
      <section className="portal-card portal-workspace">
        <div className="portal-session-bar"><Link className="portal-brand" href="/"><span className="logo-mark">A.</span><strong>A. HALLIWELL STUDIO</strong></Link>{client && <PortalSignOut />}</div>
        <small>PRIVATE CLIENT WORKSPACE</small>
        {client ? <>
          <h1>Welcome back,<br/><em>{client.first_name}.</em></h1>
          <p>Your project details live here. When a new agreement, invoice, or review file is ready, the studio will email you.</p>
          {isPortalStudio(client) && <p><Link href="/portal/studio">Manage client workspaces</Link></p>}
          <div className="portal-project-list">{projects.length ? projects.map(project => <Link key={project.id} href={`/portal/projects/${project.id}`}><span>{project.stage.replaceAll("_", " ")}</span><strong>{project.title}</strong><span>Open project</span></Link>) : !isPortalStudio(client) && <p>Your workspace is being prepared. Arabella will email when the project is ready.</p>}</div>
        </> : <>
          <h1>Your project has<br/><em>a place to live.</em></h1>
          <p>{studioSignIn ? "Sign in with your studio email to open the client desk. Your sign-in code will arrive by email." : "Enter the email address your studio invitation was sent to. We'll email a fresh sign-in code so you can open your workspace."}</p>
          <PortalLogin projectId={projectId} />
        </>}
      </section>
    </main>;
  }
  return <main className="portal-page">
    <div className="site-background" aria-hidden="true"/>
    <Navigation />
    <section className="portal-card">
      <Link className="portal-brand" href="/"><span className="logo-mark">A.</span><strong>A. HALLIWELL STUDIO</strong></Link>
      <small>CLIENT PORTAL</small>
      <h1>Your project has<br/><em>a place to live.</em></h1>
      <p>A private place for project agreements, invoices, review files, and decisions. Client workspaces are issued directly by the studio.</p>
      <div className="portal-status"><span>PRIVATE BY DEFAULT</span><p>Access is available by invitation once a workspace is ready. There is no public self-registration.</p></div>
      <a className="button button-primary" href="mailto:hello@ahalliwellstudio.com?subject=Client%20portal%20access">Request portal access</a>
      <Link className="portal-back" href="/">Return to the studio</Link>
    </section>
  </main>
}
