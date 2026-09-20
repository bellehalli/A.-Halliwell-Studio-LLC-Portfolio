import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/navigation/Navigation";

export const metadata: Metadata = { title: "Client Portal", description: "Private client workspace status.", robots: { index: false, follow: false } };

export default function PortalPage() {
  return <main className="site-shell"><div className="moving-background background-portal" aria-hidden="true"/><Navigation/><section className="portal shell"><small>CLIENT PORTAL / PRIVATE EXPERIENCE</small><h1>The portal will become real only when the infrastructure is real.</h1><p>The target system includes project status, milestones, files, approvals, invoices, payments, requests, contracts, updates and support. Those features require authenticated users, server-side organization isolation, storage and real client records.</p><div className="portal-state"><strong>CURRENT STATE</strong><span>Private portal architecture planned</span><span>No fake accounts</span><span>No fake invoices</span><span>No fake client data</span></div><a className="primary-action" href="mailto:arabellakhalliwell@gmail.com?subject=Client%20portal%20access">Contact the studio ↗</a><Link href="/">Return home</Link></section></main>;
}
