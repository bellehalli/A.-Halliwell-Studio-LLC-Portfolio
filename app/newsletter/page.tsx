import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "A. Halliwell Letters",
  description: "A. Halliwell Studio editorial letters. Subscription is not yet open.",
  alternates: { canonical: "/newsletter" },
};

export default function NewsletterPage() {
  return (
    <main className="destination-page">
      <div className="site-background" aria-hidden="true" />
      <header className="case-nav shell">
        <Link className="logo" href="/"><span className="logo-mark">A.</span><span>HALLIWELL</span></Link>
        <Link href="/">Return home</Link>
      </header>
      <article className="destination-sheet">
        <section className="destination-hero">
          <small>A. HALLIWELL LETTERS</small>
          <h1>Notes from inside the internet.</h1>
          <p>The publication is planned, but subscriptions are not open yet. No fake signup form and no dead workflow.</p>
        </section>
      </article>
    </main>
  );
}
