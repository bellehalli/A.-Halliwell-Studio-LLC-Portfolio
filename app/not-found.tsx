import Link from "next/link";
import Navigation from "@/components/navigation/Navigation";

export default function NotFound() {
  return (
    <main className="destination-page">
      <div className="site-background" aria-hidden="true" />
      <Navigation />
      <article className="destination-sheet">
        <section className="destination-hero">
          <small>404 / WRONG TURN</small>
          <h1>This page wandered off.</h1>
          <p>The experience you were looking for is not available. Return to the studio and explore the work, services, or start a project.</p>
          <div className="case-actions">
            <Link className="button button-primary" href="/">Return home ↗</Link>
            <Link className="button" href="/start">Start a project ↗</Link>
          </div>
        </section>
      </article>
    </main>
  );
}
