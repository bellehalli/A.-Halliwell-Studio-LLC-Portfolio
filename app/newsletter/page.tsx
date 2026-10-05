import { ArrowUpRight } from "@/components/ui/StudioIcons";
import { socialMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/navigation/Navigation";

export const metadata: Metadata = {
  title: "A. Halliwell Letters",
  description: "A. Halliwell Studio editorial letters. Subscription is not yet open.",
  alternates: { canonical: "/newsletter" },
  robots: { index: false, follow: true },
  ...socialMetadata("/newsletter", "A. Halliwell Letters", "A. Halliwell Studio editorial letters. Subscription is not yet open."),
};

export default function NewsletterPage() {
  return (
    <main className="destination-page">
      <div className="site-background" aria-hidden="true" />
      <Navigation />

      <article className="destination-sheet">
        <section className="destination-hero">
          <small>A. HALLIWELL LETTERS / IN DEVELOPMENT</small>
          <h1>Notes from inside the internet.</h1>
          <p>A future editorial publication about websites, digital experiences, systems and the business behind them.</p>
          <p><strong>Subscriptions are not open yet.</strong> When the actual publication workflow is ready, this page becomes the front door. Until then, there is no fake signup form and no dead promise.</p>
          <div className="case-actions">
            <Link className="button" href="/resources">Read current resources <ArrowUpRight /></Link>
            <Link className="button button-primary" href="/start">Start a project <ArrowUpRight /></Link>
          </div>
        </section>
      </article>
    </main>
  );
}
