import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = { title: "Resources", description: "A growing library about custom websites, conversion, hospitality digital experiences and the systems behind them.", alternates: { canonical: "/resources" } };
const blocks: string[][] = [["GUIDE", "What should a wedding venue website include?", "A practical framework for helping prospective couples understand the property, offer and next step."], ["CHECKLIST", "Website redesign checklist", "What to examine before replacing a site simply because it looks dated."], ["GUIDE", "Template vs. custom website", "Where templates are useful, where they become constraints and what custom development should actually buy you."], ["PLANNER", "Website budget planner", "A future interactive planning tool for connecting scope, complexity and investment without fake instant quotes."]];
export default function Page() {
 return <main className="destination-page"><div className="site-background" aria-hidden="true"/>
 <header className="case-nav shell"><Link className="logo" href="/"><span className="logo-mark">A.</span><span>HALLIWELL</span></Link><nav className="destination-nav"><Link href="/work">Work</Link><Link href="/services">Services</Link><Link href="/studio">Studio</Link><Link href="/lab">Lab</Link></nav><Link href="/start">Start a project ↗</Link></header>
 <article className="destination-sheet"><section className="destination-hero"><small>JOURNAL + TOOLS</small><h1>Useful things for better websites.</h1><p>A growing library about custom websites, conversion, hospitality digital experiences and the systems behind them.</p></section>
 <section className="destination-grid">{blocks.map(([label,t,b])=><article key={label+t} className="destination-block"><small>{label}</small><h2>{t}</h2><p>{b}</p></article>)}</section>
 <section className="case-end"><small>NEXT</small><h2>Build something<br/>worth using.</h2><Link className="button button-primary" href="/start">Start a project ↗</Link></section></article></main>;
}
