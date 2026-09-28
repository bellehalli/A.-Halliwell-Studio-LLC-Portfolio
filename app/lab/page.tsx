import { socialMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import SceneProps from "@/components/visual/SceneProps";
import CapabilityPlayground from "@/components/lab/CapabilityPlayground";
import Navigation from "@/components/navigation/Navigation";
export const metadata: Metadata = {
  title: "Lab",
  description: "Try interactive concept demos for booking, commerce, packages, events and lead capture at A. Halliwell Studio.",
  alternates: { canonical: "/lab" },
  ...socialMetadata("/lab", "Lab", "Try interactive concept demos for booking, commerce, packages, events and lead capture at A. Halliwell Studio."),
};
export default function Page() {
 return <main className="destination-page lab-route"><div className="site-background" aria-hidden="true"/>
 <Navigation />
 <article className="destination-sheet lab-destination"><SceneProps scene="labPage"/><section className="destination-hero"><small>INTERACTIVE PROOF</small><h1>Don't read the capability list. Use it.</h1><p>Try a short concept and see how your choices change the result. These are demonstrations, not connected to live inventory or payments.</p></section>
 <CapabilityPlayground />
 <section className="case-end"><small>NEXT</small><h2>Build something<br/>worth using.</h2><Link className="button button-primary" href="/start">Start a project</Link></section></article></main>;
}
