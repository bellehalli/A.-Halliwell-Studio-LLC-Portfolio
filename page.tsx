import CapabilityPlayground from "@/components/lab/CapabilityPlayground";
import ProjectShowcase from "@/components/projects/ProjectShowcase";
import StartProject from "@/components/forms/StartProject";
import Navigation from "@/components/navigation/Navigation";
import { projects } from "@/data/projects";

const services = [
  ["01", "Digital Strategy", "Define the job before decorating the interface."],
  ["02", "Experience Design", "Shape customer journeys that feel intuitive, distinctive and intentional."],
  ["03", "Custom Development", "Build the experience around the business instead of forcing the business into a template."],
  ["04", "Commerce + Booking", "Turn buying, booking and inquiry into designed customer experiences."],
  ["05", "Business Systems", "Connect the public-facing experience to the machinery behind the business."],
  ["06", "Studio Support", "Keep refining, maintaining and extending the work after launch."],
];

const schema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://ahalliwellstudio.com/#studio",
  name: "A. Halliwell Studio",
  url: "https://ahalliwellstudio.com",
  description:
    "Independent creative web design and development studio building custom websites, digital experiences, booking systems, e-commerce experiences, and business systems.",
  areaServed: [{ "@type": "Country", name: "United States" }],
  serviceType: [
    "Web Design",
    "Web Development",
    "Digital Strategy",
    "Experience Design",
    "Custom Development",
    "E-Commerce",
    "Booking Systems",
    "Business Systems",
    "Website Support",
  ],
};

export default function Home() {
  return (
    <main id="top" className="full-picture">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
      />

      <div className="site-background" aria-hidden="true" />
      <Navigation />

      <section className="hero shell">

        <div className="eyebrow">
          <span className="status-dot" />
          INDEPENDENT CREATIVE DEVELOPMENT STUDIO
        </div>

        <div className="hero-title-wrap">
          <h1 className="hero-title">
            <span>Websites</span>
            <span>With</span>
            <em>Personality♥</em>
          </h1>
          <p className="hero-margin-note">PRETTY IS ONLY THE BEGINNING.</p>
        </div>

        <div className="hero-bottom">
          <p className="hero-description">
            Custom digital experiences designed around how your business actually works.
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href="#work">EXPLORE THE STUDIO ↘</a>
            <a className="button" href="#start">START A PROJECT ↗</a>
          </div>
        </div>
      </section>

      <div className="hero-strip" aria-hidden="true">
        <div className="hero-strip-track">
          WEB DESIGN ✦ DEVELOPMENT ✦ INTERACTIVE SYSTEMS ✦ COMMERCE ✦ BRAND EXPERIENCES ✦ ONGOING SUPPORT ✦ WEB DESIGN ✦ DEVELOPMENT ✦ INTERACTIVE SYSTEMS ✦ COMMERCE ✦ BRAND EXPERIENCES ✦ ONGOING SUPPORT ✦
        </div>
      </div>

      <div className="studio-world">
        <section className="world-sheet intro-sheet" id="work">
          <div className="content-shell">
            <div className="section-kicker">
              <span>01 / PROJECTS</span>
              <span>THE SITE IS THE PROOF ↗</span>
            </div>
            <h2>
              Work that becomes
              <br />
              <em>a world of its own.</em>
            </h2>
            <p className="world-lede">
              Each project gets its own visual language, customer journey and system.
              The portfolio is evidence, not the entire story.
            </p>
          </div>
        </section>

        <div className="project-worlds">
          {projects.map((project) => (
            <ProjectShowcase project={project} key={project.slug} />
          ))}
        </div>

        <section className="world-sheet service-world" id="services">
          <div className="content-shell">
            <div className="section-kicker">
              <span>02 / SERVICES</span>
              <span>DESIGN WITH A JOB TO DO.</span>
            </div>

            <div className="services-heading-grid">
              <h2>
                Beautiful enough
                <br />
                to remember.
                <br />
                <em>Useful enough to become infrastructure.</em>
              </h2>
              <p className="service-question">
                WHAT DOES THE BUSINESS NEED THE INTERNET TO DO?
              </p>
            </div>

            <div className="service-list">
              {services.map(([number, title, description]) => (
                <article className="service-row" key={number}>
                  <span>{number}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="lab-world">
          <CapabilityPlayground />
        </section>

        <section className="world-sheet studio-section" id="studio">
          <div className="content-shell studio-grid">
            <div className="studio-heading">
              <span className="section-kicker-text">04 / THE STUDIO</span>
              <h2>
                The person
                <br />
                behind the <em>cursor.</em>
              </h2>
              <span className="studio-scribble">strategy before decoration.</span>
            </div>

            <div className="studio-copy">
              <p className="studio-lead">
                A. Halliwell Studio is an independent creative web design and development
                studio for businesses that have outgrown ordinary websites.
              </p>
              <p>
                The work starts with how a business operates, how customers make decisions
                and what the digital experience actually needs to accomplish. Then we make it beautiful.
              </p>
              <div className="studio-note">
                <span>STRATEGY</span>
                <span>DESIGN</span>
                <span>CODE</span>
                <span>PERSONALITY ♥</span>
              </div>
            </div>

            <aside className="studio-desk-note">
              <small>DESK NOTE / 001</small>
              <strong>Custom means custom.</strong>
              <p>No template-shaped businesses.</p>
            </aside>
          </div>
        </section>

        <section className="start-world">
          <StartProject />
        </section>
      </div>

      <footer className="world-footer">
        <div className="footer-paper">
          <div className="footer-brand">
            <span className="logo-mark">A.</span>
            <strong>A. HALLIWELL STUDIO</strong>
          </div>
          <p>The website is the storefront. The platform is the machinery.</p>
          <div className="footer-links"><a href="/portal">CLIENT PORTAL ↗</a><a href="#top">BACK TO TOP ↑</a></div>
        </div>
      </footer>
    </main>
  );
}
