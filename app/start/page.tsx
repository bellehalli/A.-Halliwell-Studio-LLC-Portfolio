import type { Metadata } from "next";
import Link from "next/link";
import StartProject from "@/components/forms/StartProject";

export const metadata: Metadata = {
  title: "Start a Project",
  description: "Start a custom wedding venue or hospitality website project with A. Halliwell Studio.",
  alternates: { canonical: "/start" },
};

export default function Page() {
  return (
    <main className="destination-page start-route">
      <div className="site-background" aria-hidden="true" />
      <header className="case-nav shell">
        <Link className="logo" href="/"><span className="logo-mark">A.</span><span>HALLIWELL</span></Link>
        <Link href="/work">Selected Work</Link>
      </header>
      <StartProject />
    </main>
  );
}
