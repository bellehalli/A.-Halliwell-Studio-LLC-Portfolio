import type { Metadata } from "next";
import Link from "next/link";

import ProjectMedia from "@/components/ProjectMedia";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Selected Work",
  description:
    "Explore selected web design and development projects by A. Halliwell Studio, including custom websites and digital experiences built around how each business actually works.",

  alternates: {
    canonical: "/work",
  },

  openGraph: {
    type: "website",
    url: "/work",
    siteName: "A. Halliwell Studio",
    title: "Selected Work | A. Halliwell Studio",
    description:
      "Explore selected custom websites and digital experiences designed and developed by A. Halliwell Studio.",
  },

  twitter: {
    card: "summary_large_image",
    title: "Selected Work | A. Halliwell Studio",
    description:
      "Explore selected custom websites and digital experiences designed and developed by A. Halliwell Studio.",
  },
};

export default function WorkPage() {
  return (
    <main className="case-page">
      <div className="site-background" aria-hidden="true" />

      <header className="case-nav shell">
        <Link
          className="logo"
          href="/"
          aria-label="A. Halliwell Studio home"
        >
          <span className="logo-mark">A.</span>
          <span>HALLIWELL</span>
        </Link>

        <Link href="/#start">Start a project ↗</Link>
      </header>

      <section className="case-sheet">
        <div className="case-hero">
          <div className="case-index">
            <span>SELECTED WORK</span>
            <span>A. HALLIWELL STUDIO</span>
          </div>

          <h1>
            Built to be
            <br />
            used.
          </h1>

          <p>
            Custom digital experiences designed around what each
            business actually needs the internet to do.
          </p>
        </div>

        <div className="case-story">
          {projects.map((project) => (
            <article key={project.slug}>
              <small>
                PROJECT {project.number} / {project.category}
              </small>

              <h2>{project.name}</h2>

              <p>{project.description}</p>

              <ProjectMedia
                desktop={project.desktopAsset}
                mobile={project.mobileAsset}
                name={project.name}
              />

              <div style={{ marginTop: "24px" }}>
                <Link
                  className="button button-primary"
                  href={`/work/${project.slug}`}
                >
                  View case study ↗
                </Link>
              </div>
            </article>
          ))}
        </div>

        <section className="case-end">
          <small>HAVE A PROJECT IN MIND?</small>

          <h2>
            Let&apos;s build something
            <br />
            worth clicking.
          </h2>

          <Link
            className="button button-primary"
            href="/#start"
          >
            Start a project ↗
          </Link>
        </section>
      </section>
    </main>
  );
}
