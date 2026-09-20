import Image from "next/image";
import CapabilityPlayground from "@/components/CapabilityPlayground";
import ProjectShowcase from "@/components/ProjectShowcase";
import StartProject from "@/components/StartProject";
import Navigation from "@/components/Navigation";
import { projects } from "@/data/projects";

const services = [
  ["01", "Digital Strategy", "Clarify what the site needs to do before deciding what it should look like."],
  ["02", "Experience Design", "Customer journeys, information architecture and interfaces that feel intuitive."],
  ["03", "Custom Development", "Purpose-built websites and interactive systems instead of template-shaped businesses."],
  ["04", "Commerce + Booking", "Digital flows designed around how customers actually buy, inquire and reserve."],
  ["05", "Business Systems", "Thoughtful connections between the public website and the work happening behind it."],
  ["06", "Studio Support", "Continued refinement, maintenance and new capabilities after launch."],
];

const studioSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://ahalliwellstudio.com/#studio",
  name: "A. Halliwell Studio",
  url: "https://ahalliwellstudio.com",
  description: "Independent creative web design and development studio building custom websites, digital experiences, booking systems, e-commerce experiences, and business systems.",
  areaServed: [{ "@type": "Country", name: "United States" }],
  serviceType: ["Web Design","Web Development","Digital Strategy","Experience Design","Custom Development","E-Commerce","Booking Systems","Business Systems","Website Support"],
};

export default function Home() {
  return (
    <main id="top">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(studioSchema).replace(/</g, "\\u003c") }} />
      <div className="site-background" aria-hidden="true" />
      <Navigation />

      <section className="hero shell pretty-hero">
        <div className="eyebrow"><span className="status-dot" aria-hidden="true" />Independent creative development studio</div>
        <Image className="hero-object hero-heart" src="/jelly-heart.png" alt="" width={190} height={190} priority />
        <Image className="hero-object hero-sparkle" src="/sparkle.png" alt="" width={105} height={105} priority />
        <span className="hero-note note-one">custom means custom.</span>
        <span className="hero-note note-two">design with a job to do ♥</span>
        <h1 className="hero-title"><span>Websites</span><br/><span>With</span><span className="personality-line">Personality<span className="personality-heart">♥</span></span></h1>
        <div className="hero-bottom">
          <p className="hero-description">Custom digital experiences designed around how your business actually works.</p>
          <div className="hero-actions"><a className="button button-primary" href="#work">View the work ↘</a><a className="button" href="#start">Start a project ↗</a></div>
        </div>
      </section>

      <div className="hero-strip"><div className="hero-strip-track">WEB DESIGN ✦ DEVELOPMENT ✦ INTERACTIVE SYSTEMS ✦ COMMERCE ✦ BRAND EXPERIENCES ✦ ONGOING SUPPORT ✦ WEB DESIGN ✦ DEVELOPMENT ✦ INTERACTIVE SYSTEMS ✦ COMMERCE ✦ BRAND EXPERIENCES ✦ ONGOING SUPPORT ✦</div></div>

      <div className="page-stack pretty-stack">
        <section className="work-intro pretty-sheet pretty-sheet-blush" id="work">
          <div className="content-shell">
            <div className="section-kicker"><span>01 / SELECTED WORK</span><span>THE SITE IS THE PROOF ↗</span></div>
            <h2>Enter the<br/><em>project worlds.</em></h2>
            <div className="work-intro-bottom">
              <p>Not screenshots in a grid. Each project has its own atmosphere, logic and job to do.</p>
              <Image src="/flower-icon.png" alt="" width={76} height={76}/>
            </div>
          </div>
        </section>

        <div className="project-worlds">
          {projects.map((project) => <ProjectShowcase project={project} key={project.name}/>)}
        </div>

        <section className="proof pretty-proof">
          <div className="content-shell proof-grid">
            <div><span className="section-kicker-text">THE SITE IS THE PROOF.</span><h2>You&apos;re using<br/>the work.</h2></div>
            <p>Strategy, interface design, custom development and interaction work together as one experience. Pretty is only the beginning.</p>
          </div>
        </section>

        <section className="services pretty-services" id="services">
          <div className="content-shell">
            <div className="section-kicker"><span>02 / SERVICES</span><span>WHAT THE INTERNET NEEDS TO DO</span></div>
            <h2>Built around<br/><em>the business.</em></h2>
            <div className="service-list">
              {services.map(([number,title,description]) => (
                <article className="service-row" key={number}>
                  <span>{number}</span><h3>{title}</h3><p>{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <CapabilityPlayground />

        <section className="studio pretty-studio" id="studio">
          <div className="content-shell studio-grid">
            <div>
              <span className="section-kicker-text">04 / THE STUDIO</span>
              <h2>The person<br/>behind the <em>cursor.</em></h2>
              <span className="studio-scribble">strategy before decoration.</span>
            </div>
            <div className="studio-copy">
              <p className="studio-lead">A. Halliwell Studio is an independent creative web design and development studio for businesses that have outgrown ordinary websites.</p>
              <p>The work starts with how a business operates, how customers make decisions and what the digital experience actually needs to accomplish. Then we make it beautiful.</p>
              <div className="studio-note"><span>STRATEGY</span><span>DESIGN</span><span>CODE</span><span>PERSONALITY ♥</span></div>
            </div>
          </div>
        </section>

        <StartProject />

        <footer className="footer-sheet pretty-footer">
          <div className="content-shell footer-grid">
            <div className="footer-brand"><span className="logo-mark">A.</span><strong>A. HALLIWELL STUDIO</strong></div>
            <p>Websites with personality♥</p><a href="#top">Back to top ↑</a>
          </div>
        </footer>
      </div>
    </main>
  );
}
