import Link from "next/link";
import Navigation from "@/components/navigation/Navigation";
import JsonLd from "@/components/seo/JsonLd";

type Section = {
  eyebrow: string;
  title: string;
  body: string;
};

export default function SeoLandingPage({
  eyebrow,
  title,
  intro,
  sections,
  proofLinks = [],
  schema,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: Section[];
  proofLinks?: { href: string; label: string }[];
  schema: object;
}) {
  return (
    <main className="destination-page">
      <JsonLd data={schema} />
      <div className="site-background" aria-hidden="true" />
      <Navigation />
      <article className="destination-sheet">
        <section className="destination-hero">
          <small>{eyebrow}</small>
          <h1>{title}</h1>
          <p>{intro}</p>
          <Link className="button button-primary" href="/start">Start a project ↗</Link>
        </section>

        <section className="destination-grid">
          {sections.map((section) => (
            <article className="destination-block" key={section.title}>
              <small>{section.eyebrow}</small>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </article>
          ))}
        </section>

        {proofLinks.length > 0 && (
          <section className="destination-block">
            <small>RELATED WORK + THINKING</small>
            <h2>See the thinking in practice.</h2>
            <p>Explore relevant case studies, live concepts and practical resources from the studio.</p>
            <div>
              {proofLinks.map((link) => (
                <p key={link.href}><Link href={link.href}>{link.label} ↗</Link></p>
              ))}
            </div>
          </section>
        )}

        <section className="case-end">
          <small>NEED MORE THAN A TEMPLATE?</small>
          <h2>Build around what<br />the business needs to do.</h2>
          <Link className="button button-primary" href="/start">Start a project ↗</Link>
        </section>
      </article>
    </main>
  );
}
