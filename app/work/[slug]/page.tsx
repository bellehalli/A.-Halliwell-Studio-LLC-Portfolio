import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import ProjectMedia from "@/components/ProjectMedia";
import { getProject, projects } from "@/data/projects";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

/*
 * Pre-build the case-study routes for every real project
 * listed in data/projects.ts.
 */
export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

/*
 * Give each project its own title and description.
 */
export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.name} Case Study`,
    description: project.description,
  };
}

export default async function ProjectPage({
  params,
}: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="case-page">
      <div className="site-background" aria-hidden="true" />

      {/* CASE STUDY NAVIGATION */}
      <header className="case-nav shell">
        <Link
          className="logo"
          href="/"
          aria-label="A. Halliwell Studio home"
        >
          <span className="logo-mark">A.</span>
          <span>HALLIWELL</span>
        </Link>

        <Link href="/#work">
          ← Selected Work
        </Link>
      </header>

      {/* PROJECT CASE STUDY */}
      <article
        className={`case-sheet project-${project.tone}`}
      >
        {/* HERO */}
        <section className="case-hero">
          <div className="case-index">
            <span>
              PROJECT {project.number}
            </span>

            <span>
              {project.category}
            </span>
          </div>

          <h1>{project.name}</h1>

          <p>{project.description}</p>

          <div className="project-links">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit live site ↗
            </a>
          </div>
        </section>

        {/* REAL PROJECT MEDIA / FALLBACK */}
        <ProjectMedia
          desktop={project.desktopAsset}
          mobile={project.mobileAsset}
          name={project.name}
        />

        {/* STORY */}
        <section className="case-story">
          <div>
            <small>01 / THE BRIEF</small>

            <h2>
              Built around
              <br />
              the real job.
            </h2>
          </div>

          <div>
            <p>{project.brief}</p>
          </div>

          <div>
            <small>02 / THE APPROACH</small>

            <h2>
              Strategy before
              <br />
              decoration.
            </h2>
          </div>

          <div className="case-approach">
            {project.approach.map((item, index) => (
              <div key={item}>
                <span>
                  {String(index + 1).padStart(2, "0")}
                </span>

                <strong>{item}</strong>
              </div>
            ))}
          </div>

          {/* CAPABILITIES */}
          <div className="case-capabilities">
            <small>03 / CAPABILITIES</small>

            <div>
              {project.details.map((detail) => (
                <span key={detail}>
                  {detail}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* END CTA */}
        <section className="case-end">
          <Image
            src="/flower-icon.png"
            alt=""
            width={70}
            height={70}
          />

          <small>LIKE WHAT YOU SEE?</small>

          <h2>
            Your website could
            <br />
            work harder too.
          </h2>

          <Link
            className="button button-primary"
            href="/#start"
          >
            Start a project ↗
          </Link>
        </section>
      </article>

      {/* BACK TO WORK */}
      <div
        className="shell"
        style={{
          padding: "32px 0 64px",
          textAlign: "center",
        }}
      >
        <Link className="button" href="/#work">
          ← Back to selected work
        </Link>
      </div>
    </main>
  );
}
