import type { Metadata } from "next";
import Link from "next/link";
import StartProject from "@/components/forms/StartProject";
import SceneProps from "@/components/visual/SceneProps";

export const metadata: Metadata = {
  title: "Start a Project",
  description: "Start a custom website, redesign, e-commerce, booking, portal or digital-system project with A. Halliwell Studio.",
  alternates: { canonical: "/start" },
};

export default function Page() {
  return <main className="destination-page start-route"><div className="site-background" aria-hidden="true"/><header className="case-nav shell"><Link className="logo" href="/"><span className="logo-mark">A.</span><span>HALLIWELL</span></Link><Link href="/work">Selected Work</Link></header><div className="start-route-wrap"><SceneProps scene="start"/><StartProject /></div></main>;
}
