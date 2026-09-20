import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/navigation/Navigation";

export const metadata: Metadata = { title: "Studio", description: "The operating philosophy behind A. Halliwell Studio.", alternates: { canonical: "/studio" } };

export default function StudioPage() {
  const principles = [
    ["Business first", "The site is designed around how the business operates, how customers behave and what the internet actually needs to accomplish."],
    ["Controlled chaos", "Personality can be expressive. Structure, accessibility, performance and conversion cannot be chaotic."],
    ["Evidence over theater", "No fake clients, results, bookings, scarcity, counters or security claims."],
    ["Reusable leverage", "Every project should leave behind stronger patterns, systems and reusable knowledge when rights allow."],
    ["Owner agency", "Software can surface evidence and automate repetitive work. Consequential decisions still belong to the business owner."],
    ["Complexity earns rent", "Custom does not mean complicated for its own sake. Every dependency and interaction needs a reason to exist."]
  ];

  return <main className="site-shell"><div className="moving-background background-studio" aria-hidden="true"/><Navigation/>
    <section className="page-hero shell"><small>THE STUDIO / OPERATING DOCTRINE</small><h1>Distinctive on the surface.<br/>Disciplined underneath.</h1><p>A. Halliwell Studio is an independent digital design, development and systems company.</p></section>
    <section className="principles shell">{principles.map(([title,body],index) => <article key={title}><span>{String(index+1).padStart(2,"0")}</span><h2>{title}</h2><p>{body}</p></article>)}</section>
    <section className="north-star shell"><small>NORTH STAR</small><h2>Beautiful enough to be remembered. Useful enough to become infrastructure.</h2><p>Sometimes the deliverable is a website. Sometimes it is commerce, booking, software, a publication or infrastructure. The underlying question stays the same: what does this business actually need the internet to do?</p><Link className="primary-action" href="/start">Start a project ↗</Link></section>
  </main>;
}
