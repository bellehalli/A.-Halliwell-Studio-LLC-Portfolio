import { socialMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import SceneProps from "@/components/visual/SceneProps";
import CapabilityPlayground from "@/components/lab/CapabilityPlayground";
import Navigation from "@/components/navigation/Navigation";
export const metadata: Metadata = {
  title: "Lab",
  description: "Test five working experiments in spatial exploration, personalization, intelligent intake, service workflows and adaptive strategy.",
  alternates: { canonical: "/lab" },
  ...socialMetadata("/lab", "Lab", "Test five working experiments in spatial exploration, personalization, intelligent intake, service workflows and adaptive strategy."),
};
export default function Page() {
 return <main className="destination-page lab-route"><div className="site-background" aria-hidden="true"/>
 <Navigation />
 <article className="destination-sheet lab-destination"><section className="destination-hero"><small>INTERACTIVE PROOF</small><h1>What could your<br/>business make possible?</h1><p>Explore spaces. Personalize experiences. Connect workflows. These are functioning studio concepts built to show the possibilities.</p></section>
 <CapabilityPlayground />
 <section className="case-end"><small>NEXT</small><h2>Build something<br/>worth using.</h2><Link className="button button-primary" href="/start">Start a project</Link></section></article></main>;
}
