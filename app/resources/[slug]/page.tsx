import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navigation from "@/components/navigation/Navigation";
import { resources } from "@/data/resources";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = resources[slug as keyof typeof resources];
  if (!article) return { title: "Resource Not Found", robots: { index: false, follow: false } };
  return { title: article.title, description: article.dek, alternates: { canonical: `/resources/${slug}` } };
}

export default async function ResourcePage({ params }: Props) {
  const { slug } = await params;
  const article = resources[slug as keyof typeof resources];
  if (!article) notFound();
  return <main className="site-shell"><div className="moving-background background-resources" aria-hidden="true"/><Navigation/><article className="article shell"><header><small>A. HALLIWELL RESOURCE</small><h1>{article.title}</h1><p>{article.dek}</p></header>{article.sections.map(([heading,body]) => <section key={heading}><h2>{heading}</h2><p>{body}</p></section>)}<footer><Link href="/resources">← Resources</Link><Link href="/start">Start a project ↗</Link></footer></article></main>;
}
