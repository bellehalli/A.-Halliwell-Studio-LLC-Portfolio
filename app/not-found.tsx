import Link from "next/link";

export default function NotFound() {
  return (
    <main className="destination-page">
      <div className="site-background" aria-hidden="true" />

      <header className="case-nav shell">
        <Link className="logo" href="/">
          <span className="logo-mark">A.</span>
          <span>HALLIWELL</span>
        </Link>
        <Link href="/work">Selected Work</Link>
      </header>

      <article className="destination-sheet">
        <section className="destination-hero">
          <small>404 / WRONG TURN</small>
          <h1>This page wandered off.</h1>
          <p>The internet did a little too much. The page you were looking for does not exist, moved, or was never meant to be public.</p>

          <div className="case-actions">
            <Link className="button button-primary" href="/">Go home ↗</Link>
            <Link className="button" href="/work">Explore the work ↗</Link>
          </div>
        </section>
      </article>
    </main>
  );
}
