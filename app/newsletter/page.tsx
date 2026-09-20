import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = { title: "A. Halliwell Letters", description: "Occasional writing about design, development, digital business, hospitality experiences and building things that deserve to exist.", alternates: { canonical: "/newsletter" } };
const blocks: string[][] = [["WHAT TO EXPECT", "Useful, not noisy.", "Studio notes, new work, practical breakdowns and experiments. No manufactured urgency."], ["COMING SOON", "The publication is being built.", "The subscription system will launch when consent, delivery and unsubscribe behavior are production-ready."]];
export default function Page() {
 return <main className="destination-page"><div className="site-background" aria-hidden="true"/>
 <header className="case-nav shell"><Link className="logo" href="/"><span className="logo-mark">A.</span><span>HALLIWELL</span></Link><nav className="destination-nav"><Link href="/work">Work</Link><Link href="/services">Services</Link><Link href="/studio">Studio</Link><Link href="/lab">Lab</Link></nav><Link href="/start">Start a project ↗</Link></header>
 <article className="destination-sheet"><section className="destination-hero"><small>EDITORIAL LETTERS</small><h1>Notes from inside the internet.</h1><p>Occasional writing about design, development, digital business, hospitality experiences and building things that deserve to exist.</p></section>
 <section className="destination-grid">{blocks.map(([label,t,b])=><article key={label+t} className="destination-block"><small>{label}</small><h2>{t}</h2><p>{b}</p></article>)}</section>
 <section className="case-end"><small>NEXT</small><h2>Build something<br/>worth using.</h2><Link className="button button-primary" href="/start">Start a project ↗</Link></section></article></main>;
}
