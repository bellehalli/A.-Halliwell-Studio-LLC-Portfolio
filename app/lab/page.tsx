import type { Metadata } from "next";
import Navigation from "@/components/navigation/Navigation";
import CapabilityPlayground from "@/components/lab/CapabilityPlayground";

export const metadata: Metadata = { title: "Lab", description: "Interactive proof and reusable capability demonstrations by A. Halliwell Studio.", alternates: { canonical: "/lab" } };

export default function LabPage() {
  return <main className="site-shell"><div className="moving-background background-lab" aria-hidden="true"/><Navigation/><section className="page-hero shell"><small>LAB / INTERACTIVE PROOF</small><h1>You are not reading a capability list.<br/>You are using it.</h1><p>The Lab turns reusable capabilities into small working demonstrations. Nothing here pretends to be a live client system.</p></section><div className="shell"><CapabilityPlayground/></div><section className="lab-registry shell"><h2>Capability registry</h2><div><span>Booking</span><span>Package builders</span><span>Lead qualification</span><span>Events</span><span>Interactive maps</span><span>Dashboards</span><span>Calculators</span><span>Creative coding</span><span>Something Weird</span></div></section></main>;
}
