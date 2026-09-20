import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Client Portal",
  description: "Private client workspace access for active A. Halliwell Studio projects.",
  robots: { index: false, follow: false },
};

export default function PortalPage(){
  return <main className="portal-page">
    <div className="site-background" aria-hidden="true"/>
    <section className="portal-card">
      <Link className="portal-brand" href="/"><span className="logo-mark">A.</span><strong>A. HALLIWELL STUDIO</strong></Link>
      <small>CLIENT PORTAL</small>
      <h1>Your project has<br/><em>a place to live.</em></h1>
      <p>Active clients receive a private project workspace for approved project materials, milestones, decisions and next steps.</p>
      <div className="portal-status"><span>PRIVATE BY DEFAULT</span><p>Portal access is issued directly by the studio. There is no public self-registration.</p></div>
      <a className="button button-primary" href="mailto:arabellakhalliwell@gmail.com?subject=Client%20portal%20access">Request portal access ↗</a>
      <Link className="portal-back" href="/">← Return to the studio</Link>
    </section>
  </main>
}
