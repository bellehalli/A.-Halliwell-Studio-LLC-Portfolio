import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/navigation/Navigation";
import { services } from "@/data/services";

export const metadata: Metadata = { title: "Services", description: "Digital strategy, experience design, custom development, commerce, booking, business systems and studio support.", alternates: { canonical: "/services" } };

export default function ServicesPage() {
  return <main className="site-shell"><div className="moving-background background-services" aria-hidden="true"/><Navigation/>
    <section className="page-hero shell"><small>SERVICES / BUSINESS MODE</small><h1>Design with a job to do.</h1><p>Premium custom work starts with the business problem, not a page count.</p></section>
    <section className="service-system shell">{services.map(service => <article className="service-detail" key={service.slug}><div><span>{service.number}</span><h2>{service.title}</h2><p>{service.purpose}</p></div><ul>{service.includes.map(item => <li key={item}>{item}</li>)}</ul></article>)}</section>
    <section className="process shell"><h2>How an engagement moves</h2><ol><li>Discovery and qualification</li><li>Strategy and scope</li><li>Experience design</li><li>Development</li><li>QA and client review</li><li>Launch</li><li>Support or expansion</li></ol></section>
    <section className="page-cta shell"><p>Scope, ownership and recurring fees stay explicit. No fake urgency and no hidden requirements.</p><Link className="primary-action" href="/start">Build the project brief ↗</Link></section>
  </main>;
}
