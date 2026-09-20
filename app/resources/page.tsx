import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/navigation/Navigation";
import { resources } from "@/data/resources";

export const metadata: Metadata = { title: "Resources", description: "Practical writing about custom websites, hospitality digital experiences and business systems.", alternates: { canonical: "/resources" } };

export default function ResourcesPage() {
  return <main className="site-shell"><div className="moving-background background-resources" aria-hidden="true"/><Navigation/><section className="page-hero shell"><small>RESOURCES / SEARCH + CONTENT</small><h1>Useful things for better websites.</h1><p>Real guidance, tools and articles designed to earn authority through usefulness rather than thin SEO pages.</p></section><section className="resource-index shell">{Object.entries(resources).map(([slug,article],index) => <Link href={`/resources/${slug}`} key={slug}><span>{String(index+1).padStart(2,"0")}</span><div><small>RESOURCE</small><h2>{article.title}</h2><p>{article.dek}</p></div><b>READ ↗</b></Link>)}</section></main>;
}
