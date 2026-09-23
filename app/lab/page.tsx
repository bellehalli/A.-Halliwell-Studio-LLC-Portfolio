import type { Metadata } from "next";
import Link from "next/link";
import CapabilityPlayground from "@/components/lab/CapabilityPlayground";
export const metadata: Metadata = { title: "Lab", description: "Try interactive concept demos for booking, commerce, packages, events and lead capture at A. Halliwell Studio.", alternates: { canonical: "/lab" } };
export default function Page() {
 return <main className="destination-page"><div className="site-background" aria-hidden="true"/>
 <header className="case-nav shell"><Link className="logo" href="/"><span className="logo-mark">A.</span><span>HALLIWELL</span></Link><nav className="destination-nav"><Link href="/work">Work</Link><Link href="/services">Services</Link><Link href="/studio">Studio</Link><Link href="/lab">Lab</Link></nav><Link href="/start">Start a project ↗</Link></header>
 <article className="destination-sheet"><section className="destination-hero"><small>INTERACTIVE PROOF</small><h1>Don't read the capability list. Use it.</h1><p>Try a short concept and see how your choices change the result. These are demonstrations, not connected to live inventory or payments.</p></section>
 <CapabilityPlayground />
 <section className="case-end"><small>NEXT</small><h2>Build something<br/>worth using.</h2><Link className="button button-primary" href="/start">Start a project ↗</Link></section></article></main>;
}
