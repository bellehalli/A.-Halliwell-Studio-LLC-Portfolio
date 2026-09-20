import CapabilityPlayground from "@/components/lab/CapabilityPlayground";
import ProjectShowcase from "@/components/projects/ProjectShowcase";
import StartProject from "@/components/forms/StartProject";
import Navigation from "@/components/navigation/Navigation";
import VisualUniverse from "@/components/visual/VisualUniverse";
import { projects } from "@/data/projects";

const services = [
  ["01", "Digital Strategy", "Clarify what the site needs to do before deciding what it should look like."],
  ["02", "Experience Design", "Customer journeys, information architecture and interfaces that feel intuitive."],
  ["03", "Custom Development", "Purpose-built websites and interactive systems instead of template-shaped businesses."],
  ["04", "Commerce + Booking", "Digital flows designed around how customers actually buy, inquire and reserve."],
  ["05", "Business Systems", "Thoughtful connections between the public website and the work happening behind it."],
  ["06", "Studio Support", "Continued refinement, maintenance and new capabilities after launch."],
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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />

      <div className="site-background" aria-hidden="true" />
      <Navigation />

      <section className="hero shell universe-hero">
        <VisualUniverse zone="hero" />
        <div className="eyebrow">
          <span className="status-dot" />
          INDEPENDENT CREATIVE DEVELOPMENT STUDIO
        </div>

        <div className="hero-title-wrap">
          <h1 className="hero-title">
            <span className="hero-editorial">Websites</span>
            <span className="hero-editorial hero-with">With</span>
            <span className="personality-line">
              Personality
              <span className="personality-heart">♥</span>
            </span>
          </h1>
        </div>

        <div className="hero-bottom">
          <p className="hero-description">
            Custom digital experiences designed around how your business
            actually works.
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href="#work">
              EXPLORE THE STUDIO ↘
            </a>
            <a className="button" href="#start">
              START A PROJECT ↗
            </a>
          </div>
        </div>
      </section>

      <div className="hero-strip">
        <div className="hero-strip-track">
          WEB DESIGN ✦ DEVELOPMENT ✦ INTERACTIVE SYSTEMS ✦ COMMERCE ✦ BRAND
          EXPERIENCES ✦ ONGOING SUPPORT ✦ WEB DESIGN ✦ DEVELOPMENT ✦
          INTERACTIVE SYSTEMS ✦ COMMERCE ✦ BRAND EXPERIENCES ✦ ONGOING SUPPORT ✦
        </div>
      </div>

      <div className="studio-world">
        <section className="world-sheet intro-sheet" id="work">
          <VisualUniverse zone="work" />
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
              A. Halliwell Studio builds digital experiences around the business
              itself. The portfolio is evidence, not the entire story.
            </p>
          </div>
        </section>

        <div className="project-worlds">
          {projects.map((project) => (
            <ProjectShowcase project={project} key={project.slug} />
          ))}
        </div>

        <section className="world-sheet service-world" id="services">
          <VisualUniverse zone="services" />
          <div className="content-shell">
            <div className="section-kicker">
              <span>02 / SERVICES</span>
              <span>WHAT DOES THE BUSINESS NEED THE INTERNET TO DO?</span>
            </div>
            <h2>
              Beautiful enough to remember.
              <br />
              <em>Useful enough to become infrastructure.</em>
            </h2>

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
          <VisualUniverse zone="lab" />
          <CapabilityPlayground />
        </section>

        <section className="world-sheet studio-section" id="studio">
          <VisualUniverse zone="studio" />
          <div className="content-shell studio-grid">
            <div>
              <span className="section-kicker-text">04 / THE STUDIO</span>
              <h2>
                The person
                <br />
                behind the <em>cursor.</em>
              </h2>
              <span className="studio-scribble">
                strategy before decoration.
              </span>
            </div>

            <div className="studio-copy">
              <p className="studio-lead">
                A. Halliwell Studio is an independent creative web design and
                development studio for businesses that have outgrown ordinary
                websites.
              </p>
              <p>
                The work starts with how a business operates, how customers make
                decisions and what the digital experience actually needs to
                accomplish. Then we make it beautiful.
              </p>
              <div className="studio-note">
                <span>STRATEGY</span>
                <span>DESIGN</span>
                <span>CODE</span>
                <span>PERSONALITY ♥</span>
              </div>
            </div>
          </div>
        </section>

        <section className="start-world">
          <VisualUniverse zone="start" />
          <StartProject />
        </section>
      </div>

      <footer className="world-footer">
        <div className="content-shell footer-grid">
          <div className="footer-brand">
            <span className="logo-mark">A.</span>
            <strong>A. HALLIWELL STUDIO</strong>
          </div>
          <p>The website is the storefront. The platform is the machinery.</p>
          <a href="#top">BACK TO TOP ↑</a>
        </div>
      </footer>
    </main>
  );
}
