import Link from "next/link";
import ProjectMedia from "@/components/ProjectMedia";
import type { Project } from "@/data/projects";
import type { CaseStudy } from "@/data/caseStudies";

function ArrowMark({ direction = "up" }: { direction?: "up" | "down" }) {
  return <svg className="case-world-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {direction === "up" ? <path d="M5 19 19 5M8 5h11v11" /> : <path d="M12 4v16m-6-6 6 6 6-6" />}
  </svg>;
}

export default function CaseStudyWorld({ project, study }: { project: Project; study: CaseStudy }) {
  const external = project.url.startsWith("http");

  return <article className={`case-sheet case-study-world project-${project.tone}`}>
    <section className="case-world-hero" aria-labelledby="case-title">
      <div className="case-world-overline"><span>A. Halliwell Studio / Case file {project.number}</span><span>{project.category}</span></div>
      <div className="case-world-hero-grid">
        <div className="case-world-hero-copy">
          <p className="case-world-eyebrow">An original studio concept</p>
          <h1 id="case-title">{project.name}</h1>
          <p className="case-world-positioning">{study.positioning}</p>
          <p className="case-world-statement">{study.statement}</p>
          <div className="case-world-actions">
            <a href="#live-experience">Explore the website <ArrowMark direction="down" /></a>
            <a href={project.url} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>Open full build <ArrowMark /></a>
          </div>
        </div>
        <figure className="case-world-hero-art">
          <img src={study.heroImage} alt={study.heroImageAlt} />
          <figcaption>{project.name} <span>Website / Studio concept</span></figcaption>
        </figure>
      </div>
      <p className="case-world-disclosure">{project.disclosure}</p>
    </section>

    <section className="case-world-live" id="live-experience" aria-labelledby="live-heading">
      <div className="case-world-section-heading"><p>01 / The website</p><h2 id="live-heading">Step inside {project.name}.</h2><span>{study.liveIntro}</span></div>
      <ProjectMedia project={project} mode="live" previewFallback={project.slug === "willow-lily"} />
    </section>

    <section className="case-world-screens" id="selected-screens" aria-labelledby="screens-heading">
      <div className="case-world-section-heading"><p>02 / Inside the experience</p><h2 id="screens-heading">A closer look.</h2><span>{study.screensIntro}</span></div>
      {study.screenChapters ? <div className="case-world-screen-archive">
        {study.screenChapters.map((chapter, chapterIndex) => <section className="case-world-screen-chapter" key={chapter.title} aria-labelledby={`case-chapter-${chapterIndex}`}>
          <div className="case-world-screen-chapter-intro"><span>{String(chapterIndex + 1).padStart(2,"0")}</span><h3 id={`case-chapter-${chapterIndex}`}>{chapter.title}</h3><p>{chapter.description}</p></div>
          <div className="case-world-screen-grid">{chapter.screens.map((screen, screenIndex) => {
            const src = `/case-studies/${project.slug}/${screen.file}`;
            return <figure className={screenIndex === 0 ? "case-world-screen-feature" : ""} key={screen.file}>
              <a href={src} target="_blank" rel="noopener noreferrer" aria-label={`Open full-size image: ${screen.caption}`}><img src={src} alt={`${project.name}: ${screen.caption}`} loading="lazy" /><span>View full size <ArrowMark /></span></a>
              <figcaption><span>{String(screenIndex + 1).padStart(2,"0")}</span>{screen.caption}</figcaption>
            </figure>;
          })}</div>
        </section>)}
        <p className="case-world-screen-disclosure">These are screens from a fictional venue demonstration. Venue prices, leads, analytics and payments shown in the build are illustrative; checkout uses test mode.</p>
      </div> : <ProjectMedia project={project} mode="screens" />}
    </section>

    <section className="case-world-story" aria-label="The thinking behind the project">
      {([
        ["03", "The Brief", study.brief],
        ["04", "The Problem", study.problem],
        ["05", "The Strategy", study.strategy],
      ] as const).map(([number, title, copy]) => <div className="case-world-story-row" key={number}>
        <p className="case-world-number">{number} / {title}</p>
        <h2>{title}</h2>
        <p>{copy}</p>
      </div>)}
    </section>

    <section className="case-world-journey" aria-labelledby="journey-heading">
      <div className="case-world-section-heading"><p>06 / The visitor journey</p><h2 id="journey-heading">From first look<br />to first visit.</h2><span>A couple&apos;s path through the site</span></div>
      <ol>{study.journey.map((step, index) => <li key={step.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol>
    </section>

    <section className="case-world-end" aria-labelledby="case-end-heading">
      <p>07 / Your next project</p><h2 id="case-end-heading">A beautiful site can<br /><em>do real work.</em></h2>
      <span>Let&apos;s shape the experience your business needs.</span>
      <Link href="/start">Start a project <ArrowMark /></Link>
      <small>Original studio concept, not a commissioned client result.</small>
    </section>
  </article>;
}
