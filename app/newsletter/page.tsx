import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/navigation/Navigation";

export const metadata: Metadata = { title: "A. Halliwell Letters", description: "Editorial publication status for A. Halliwell Studio.", alternates: { canonical: "/newsletter" } };

export default function NewsletterPage() {
  return <main className="site-shell"><div className="moving-background background-newsletter" aria-hidden="true"/><Navigation/><section className="page-hero shell"><small>A. HALLIWELL LETTERS</small><h1>The publication is planned.<br/>The signup system is not live yet.</h1><p>The Bible requires consent, source tracking, welcome flow and legitimate unsubscribe behavior. Until those pieces exist, the public site will not display a fake subscription form.</p><Link href="/resources">Read current resources ↗</Link></section></main>;
}
