import Image from "next/image";
import CapabilityPlayground from "@/components/lab/CapabilityPlayground";
import ProjectShowcase from "@/components/projects/ProjectShowcase";
import StartProject from "@/components/forms/StartProject";
import Navigation from "@/components/navigation/Navigation";
import { projects } from "@/data/projects";

const services = [
  ["01", "Venue Strategy", "Clarify what couples need to understand before they feel ready to inquire or book a tour."],
  ["02", "Experience Design", "Turn the venue, the stay and the celebration into a digital journey that feels as considered as the property itself."],
  ["03", "Custom Development", "Build around the real venue experience instead of forcing it into a template."],
  ["04", "Inquiry + Booking UX", "Make pricing, availability, tours and inquiry feel connected instead of scattered across the site."],
  ["05", "Interactive Venue Tools", "Maps, wedding builders, itineraries, planning tools and other custom features that help guests picture the experience."],
  ["06", "Launch + Studio Support", "Test, launch, maintain and keep improving the site after it goes live."],
];

const schema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://ahalliwellstudio.com/#studio",
  name: "A. Halliwell Studio",
  url: "https://ahalliwellstudio.com",
  email: "mailto:hello@ahalliwellstudio.com",
  description:
    "Independent web design and development studio creating custom websites and digital experiences for wedding venues and hospitality brands.",
  areaServed: [{ "@type": "Country", name: "United States" }],
  serviceType: [
    "Wedding Venue Web Design",
    "Hospitality Web Design",
    "Web Development",
    "Digital Strategy",
    "Experience Design",
    "Booking and Inquiry UX",
    "Interactive Venue Tools",
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
          CUSTOM WEBSITES FOR WEDDING VENUES + HOSPITALITY
        </div>

        <div className="hero-title-wrap">
          <h1 className="hero-title">
            <span>Venue websites</span>
            <span>built to</span>
            <em>be remembered.♥</em>
          </h1>
          <p className="hero-margin-note">PRETTY IS ONLY THE BEGINNING.</p>
        </div>

        <div className="hero-bottom">
          <p className="hero-description">
            I design and develop custom websites for wedding venues and hospitality brands that need the digital experience to feel as considered as the property itself. Custom sites start at $5,000 + scope.
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href="#start">START A PROJECT ↗</a>
            <a className="button" href="#work">VIEW SELECTED WORK ↘</a>
          </div>
        </div>
      </section>

      <div className="hero-strip" aria-hidden="true">
        <div className="hero-strip-track">
          VENUE STRATEGY ✦ WEB DESIGN ✦ CUSTOM DEVELOPMENT ✦ INQUIRY UX ✦ INTERACTIVE TOOLS ✦ STUDIO SUPPORT ✦ VENUE STRATEGY ✦ WEB DESIGN ✦ CUSTOM DEVELOPMENT ✦ INQUIRY UX ✦ INTERACTIVE TOOLS ✦ STUDIO SUPPORT ✦
        </div>
      </div>

      <div className="studio-world">
        <section className="world-sheet intro-sheet" id="work">
          <div className="content-shell">
            <div className="section-kicker">
              <span>01 / SELECTED WORK</span>
              <span>THE SITE IS THE PROOF ↗</span>
            </div>
            <h2>
              Work that becomes
              <br />
              <em>a world of its own.</em>
            </h2>
            <p className="world-lede">
              Two original venue concepts showing how strategy, design and custom development can move a couple from first impression to a confident inquiry.
            </p>
          </div>
        </section>

        <div className="project-worlds">
          {projects.map((project) => (
            <ProjectShowcase project={project} key={project.slug} />
          ))}
        </div>

        <section className="world-sheet proof-world" aria-labelledby="proof-title">
          <div className="content-shell">
            <div className="section-kicker">
              <span>PROOF / WITHOUT THE PRETENDING</span>
              <span>INSPECT THE WORK YOURSELF.</span>
            </div>

            <div className="proof-heading">
              <h2 id="proof-title">
                Don&apos;t take
                <br />
                <em>my word for it.</em>
              </h2>
              <p>
                I do not have a wall of client logos to manufacture. What I can show you is the work itself, the thinking behind it and the interactions running live.
              </p>
            </div>

            <div className="proof-grid">
              <article>
                <span>01 / WALK THROUGH THE WORK</span>
                <h3>Live builds, not mockups.</h3>
                <p>Open the venue concepts in a browser and experience the responsive sites as a prospective couple would.</p>
                <div className="proof-links">
                  <a href="https://willowlilyestate.com" target="_blank" rel="noreferrer">Willow Lily ↗</a>
                  <a href="https://www.maisonrivieredetroit.com" target="_blank" rel="noreferrer">Maison Rivière ↗</a>
                </div>
              </article>

              <article>
                <span>02 / SEE THE THINKING</span>
                <h3>Strategy you can read.</h3>
                <p>Each case study documents the challenge, strategy, build decisions and what the concept is designed to demonstrate.</p>
                <div className="proof-links">
                  <a href="/work/willow-lily">Read Willow Lily ↗</a>
                  <a href="/work/maison-riviere">Read Maison Rivière ↗</a>
                </div>
              </article>

              <article>
                <span>03 / TRY THE INTERACTIONS</span>
                <h3>The details actually work.</h3>
                <p>Maps, builders, inquiry paths, planning moments and responsive behavior are there to be clicked, not described in a pitch deck.</p>
                <a className="proof-single-link" href="/work">Explore selected work ↗</a>
              </article>
            </div>

            <p className="proof-disclosure">
              These are original studio concept projects, not commissioned client work. I do not publish invented testimonials, logos or performance results.
            </p>
          </div>
        </section>

        <section className="world-sheet service-world" id="services">
          <div className="content-shell">
            <div className="section-kicker">
              <span>02 / THE OFFER</span>
              <span>DESIGNED AROUND HOW VENUES SELL.</span>
            </div>

            <div className="services-heading-grid">
              <h2>
                Make the venue
                <br />
                easier to imagine.
                <br />
                <em>Make the next step easier to take.</em>
              </h2>
              <p className="service-question">
                WHAT DOES A COUPLE NEED TO SEE BEFORE THEY FEEL READY?
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

            <div className="launch-process">
              <h3>From first conversation to launch</h3>
              <p>We start with the property, your ideal couple, the questions they ask before touring and the places the current website creates friction. You receive a defined scope, timeline and deliverables before design begins. I then design, build and test the experience, guide launch, and offer ongoing maintenance and improvements under a separate support agreement.</p>
              <p>Custom venue websites start at $5,000 + scope. The final quote depends on pages, content, integrations and custom features.</p>
            </div>
          </div>
        </section>

        <section className="lab-world">
          <CapabilityPlayground />
        </section>

        <section className="world-sheet studio-section" id="studio">
          <div className="content-shell founder-preview">
            <div className="founder-preview-copy">
              <span className="section-kicker-text">04 / THE STUDIO</span>
              <h2>
                The person
                <br />
                behind the <em>cursor.</em>
              </h2>

              <p className="studio-lead">
                I&apos;m Arabella Halliwell, founder, designer and developer of A. Halliwell Studio.
              </p>
              <p>
                My background sits at the intersection of psychology, hospitality and digital design. I spent years working directly with customers before moving into web design and development, so I tend to look at websites from both sides: how the business operates and how a person decides whether to trust it.
              </p>
              <p>
                Today the studio focuses on wedding venues and hospitality brands that want the digital experience to feel as considered as the one they create in person.
              </p>

              <div className="studio-note">
                <span>STRATEGY</span>
                <span>DESIGN</span>
                <span>CODE</span>
                <span>PERSONALITY ♥</span>
              </div>

              <a className="button" href="/studio">MEET THE STUDIO ↗</a>
            </div>

            <div className="founder-preview-visual">
              <div className="founder-photo-card">
                <Image
                  src="/assets/founder/arabella-halliwell.jpg"
                  alt="Arabella Halliwell, founder, designer and developer of A. Halliwell Studio"
                  fill
                  sizes="(max-width: 820px) 86vw, 420px"
                />
                <span className="founder-photo-label">ARABELLA HALLIWELL / FOUNDER</span>
              </div>

              <aside className="founder-desk-note">
                <small>FROM MY DESK</small>
                <strong>Detroit, Michigan</strong>
                <span>Independent studio</span>
                <span>Strategy + design + development</span>
                <span>Booking select venue + hospitality projects</span>
                <a href="mailto:hello@ahalliwellstudio.com">hello@ahalliwellstudio.com ↗</a>
              </aside>
            </div>
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
          <p>Strategy, design and development for venues that want the website to participate in the sale.</p>
          <div className="footer-links">
            <a href="mailto:hello@ahalliwellstudio.com?subject=Website%20inquiry">EMAIL THE STUDIO ↗</a>
            <a href="#top">BACK TO TOP ↑</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
