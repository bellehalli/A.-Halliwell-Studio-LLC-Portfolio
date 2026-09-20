import type { Metadata } from "next";
import Navigation from "@/components/navigation/Navigation";
import StartProject from "@/components/forms/StartProject";

export const metadata: Metadata = { title: "Start a Project", description: "Create a project brief and send a real inquiry to A. Halliwell Studio.", alternates: { canonical: "/start" } };

export default function StartPage() {
  return <main className="site-shell"><div className="moving-background background-start" aria-hidden="true"/><Navigation/><section className="page-hero shell"><small>START A PROJECT / SALES SYSTEM</small><h1>One useful brief.<br/>No dead contact form.</h1><p>Answer the questions once. The submission goes through the real inquiry endpoint and arrives in the studio inbox.</p></section><div className="shell"><StartProject/></div></main>;
}
