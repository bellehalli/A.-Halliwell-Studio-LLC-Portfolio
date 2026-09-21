import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const articles = {
  "wedding-venue-website": {
    title: "What should a wedding venue website include?",
    dek: "A practical framework for turning a venue website into a useful decision-making experience.",
    sections: [
      ["Start with the decision", "A venue site should help a prospective couple understand fit before asking them to inquire. Capacity, location, the shape of the experience, meaningful inclusions and the next step should not require detective work."],
      ["Show the experience, not only the gallery", "Photography matters, but the site should also explain how the event experience fits together, including arrival, ceremony, reception and any overnight stay the venue actually offers."],
      ["Make inquiry feel like progress", "The inquiry flow should preserve useful context and explain what happens next instead of ending at a generic form-submitted screen."],
    ],
  },
  "website-redesign-checklist": {
    title: "Website redesign checklist",
    dek: "What to examine before rebuilding a site simply because it looks dated.",
    sections: [
      ["Business job", "Write down what the website is expected to accomplish and where the current experience fails that job."],
      ["Customer journey", "Identify the questions a visitor needs answered before they can confidently take the next step."],
      ["Technical reality", "Audit content, integrations, forms, analytics, SEO equity, performance and accessibility before replacing working infrastructure."],
    ],
  },
} as const;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = articles[slug as keyof typeof articles];
  return article ? { title: article.title, description: article.dek } : { title: "Resource Not Found" };
}

export default async function ResourcePage({ params }: Props) {
  const { slug } = await params;
  const article = articles[slug as keyof typeof articles];
  if (!article) notFound();

  return (
    <main className="destination-page">
      <div className="site-background" aria-hidden="true" />
      <header className="case-nav shell">
        <Link className="logo" href="/"><span className="logo-mark">A.</span><span>HALLIWELL</span></Link>
        <Link href="/resources">← Resources</Link>
      </header>
      <article className="destination-sheet article-sheet">
        <section className="destination-hero">
          <small>A. HALLIWELL JOURNAL</small>
          <h1>{article.title}</h1>
          <p>{article.dek}</p>
        </section>
        <div className="article-body">
          {article.sections.map(([heading, body]) => (
            <section key={heading}>
              <h2>{heading}</h2>
              <p>{body}</p>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
