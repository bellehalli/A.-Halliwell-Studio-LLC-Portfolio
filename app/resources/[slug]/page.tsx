import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/navigation/Navigation";
import { notFound } from "next/navigation";
import SceneProps from "@/components/visual/SceneProps";
import JsonLd from "@/components/seo/JsonLd";
import { articleSchema } from "@/lib/schema";

const articles = {
  "wedding-venue-website": {
    title: "What Should a Wedding Venue Website Include?",
    dek: "A practical framework for designing a wedding venue website that helps couples understand the property, offering, investment and next step.",
    sections: [
      ["Start with the decision couples are trying to make", "A venue website should help a prospective couple decide whether the property belongs on their shortlist. Before asking for an inquiry, make the essentials easy to understand: location, capacity, overall experience, ceremony and reception possibilities, meaningful inclusions and what happens next."],
      ["Show the property as a connected experience", "A gallery creates desire, but couples also need orientation. Explain how arrival, ceremony, cocktail hour, reception, portraits, parking and any overnight stay fit together. A property map or guided venue experience can make a complex estate much easier to understand."],
      ["Make capacity and spaces easy to compare", "Do not bury guest counts in scattered paragraphs. Connect each important space to its purpose, capacity and possible layouts so couples can picture how their event might work."],
      ["Give enough investment context to establish fit", "You do not have to publish every line item, but hiding all pricing can create unnecessary friction. Starting investment, package ranges or clear inclusions can help qualified couples understand whether the venue fits before they spend time on an inquiry."],
      ["Explain the full wedding experience", "If the venue offers weekend access, lodging, rehearsal events, getting-ready spaces, planning support or preferred vendors, show how those pieces connect. The website should communicate the experience being purchased, not merely the building being rented."],
      ["Make inquiry feel like progress", "A strong inquiry form collects useful context without becoming homework. Ask only what helps the next conversation, then explain what happens after submission: response timing, tour scheduling, availability checks or the next planning step."],
      ["Build for mobile planning", "A large share of early research happens on phones. Capacity, pricing context, maps, galleries, buttons and inquiry paths should remain easy to use without tiny text, overloaded menus or interactions that depend on hover."],
      ["Connect inspiration to action", "Every major page should have a logical next step. A couple exploring the estate might move to weddings, investment or a tour. Someone reviewing investment might move directly to inquiry. Calls to action work best when they match the visitor's stage rather than repeating the same button everywhere."],
    ],
  },
  "website-redesign-checklist": {
    title: "Website Redesign Checklist: What to Audit Before You Rebuild",
    dek: "A practical website redesign checklist covering business goals, customer journey, SEO, content, integrations, performance and conversion before you replace what already works.",
    sections: [
      ["Define the business job first", "Write down what the website is expected to accomplish. Generate qualified inquiries? Sell? Book appointments? Explain a complex service? Reduce repetitive questions? A redesign without a defined job can produce a prettier version of the same problems."],
      ["Map the current customer journey", "Identify how people enter the site, what they need to know, where they hesitate and which pages lead to action. Look for missing information, dead ends and moments where the visitor has to work too hard."],
      ["Protect existing SEO equity", "Before changing URLs or deleting pages, document which pages receive organic traffic, backlinks or impressions. Preserve useful URLs where possible and plan permanent redirects when a URL truly needs to change."],
      ["Audit content before rewriting everything", "Separate content that is outdated from content that is merely poorly presented. Strong information can often be reorganized instead of discarded."],
      ["Inventory forms, tools and integrations", "List every form, calendar, payment flow, CRM connection, email automation, analytics tool, portal and third-party service the current site relies on. A redesign should not accidentally break the parts of the business that already work."],
      ["Check performance and accessibility", "Review mobile behavior, image weight, loading performance, heading structure, keyboard access, color contrast, labels and interactive controls. Visual polish should not come at the cost of usability."],
      ["Review conversion paths", "Every important page should make the next useful action clear. Calls to action should reflect visitor intent instead of forcing every person into the same generic contact form."],
      ["Measure the new site against the old problem", "After launch, evaluate whether the redesign improved the thing that justified the project: clearer inquiries, better engagement, fewer support questions, stronger search visibility or another defined business outcome."],
    ],
  },
} as const;

export const dynamicParams = false;
export function generateStaticParams() {
  return Object.keys(articles).map(slug => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = articles[slug as keyof typeof articles];

  if (!article) {
    return { title: "Resource Not Found", robots: { index: false, follow: true } };
  }

  const canonical = `/resources/${slug}`;

  return {
    title: article.title,
    description: article.dek,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      title: article.title,
      description: article.dek,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "A. Halliwell Studio resources" }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.dek,
      images: ["/og-image.png"],
    },
  };
}

export default async function ResourcePage({ params }: Props) {
  const { slug } = await params;
  const article = articles[slug as keyof typeof articles];
  if (!article) notFound();

  const canonical = `/resources/${slug}`;

  return (
    <main className="destination-page">
      <JsonLd data={articleSchema({ title: article.title, description: article.dek, path: canonical })} />
      <div className="site-background" aria-hidden="true" />
      <Navigation />
      <article className="destination-sheet article-sheet">
        <SceneProps scene="resources" />
        <section className="destination-hero">
          <small>A. HALLIWELL STUDIO / RESOURCES</small>
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
        <section className="case-end">
          <small>KEEP EXPLORING</small>
          <h2>Bring the idea<br />into the studio.</h2>
          <Link className="button" href="/resources">More resources ↗</Link>
          <Link className="button button-primary" href="/start">Start a project ↗</Link>
        </section>
      </article>
    </main>
  );
}
