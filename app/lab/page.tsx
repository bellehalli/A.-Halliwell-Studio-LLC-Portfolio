import { socialMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import SceneProps from "@/components/visual/SceneProps";
import { ScopeDiscovery } from "@/components/lab/CapabilityPlayground";
import LabShowroom from "@/components/lab/LabShowroom";
import "./showroom.css";
import Navigation from "@/components/navigation/Navigation";
export const metadata: Metadata = {
  title: "Lab",
  description: "Explore interactive venue planning, product configuration, and client workflow concepts at A. Halliwell Studio.",
  alternates: { canonical: "/lab" },
  ...socialMetadata("/lab", "Lab", "Explore interactive venue planning, product configuration, and client workflow concepts at A. Halliwell Studio."),
};
export default function Page() {
 return <main className="destination-page lab-route"><div className="site-background" aria-hidden="true"/>
 <Navigation />
 <article className="destination-sheet lab-destination"><SceneProps scene="labPage"/><section className="destination-hero"><small>INTERACTIVE PROOF</small><h1>A little imagination.<br/><em>A lot of engineering.</em></h1><p>Explore a place. Shape an object. Move a project forward. Three working concepts that show how thoughtful design and custom systems belong together.</p></section>
 <LabShowroom />
 <div className="lab-scope-section"><ScopeDiscovery inHome={false}/></div>
 <section className="case-end"><small>NEXT</small><h2>Build something<br/>worth using.</h2><Link className="button button-primary" href="/start">Start a project</Link></section></article></main>;
}
