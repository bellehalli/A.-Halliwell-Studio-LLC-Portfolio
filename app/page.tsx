import BusinessValue from "@/components/studio/BusinessValue";
import { studio, websiteStartingPrice, refinementStartingPrice } from "@/lib/studio-config";
import Image from "next/image";
import ConsultationLink from "@/components/ConsultationLink";
import CapabilityPlayground from "@/components/lab/CapabilityPlayground";
import ProjectShowcase from "@/components/projects/ProjectShowcase";
import WorkWorldGallery from "@/components/projects/WorkWorldGallery";
import StartProject from "@/components/forms/StartProject";
import Navigation from "@/components/navigation/Navigation";
import HomeOpening from "@/components/visual/HomeOpening";
import SceneProps from "@/components/visual/SceneProps";
import { publicProjects } from "@/data/projects";

const CURSOR = "/assets/ui/Portfolio Assets A.Halliwell  - 24.webp";

const offers = [
  [studio.offers.website, "Give the whole story room.", websiteStartingPrice, "Custom website strategy, design and development for a complete journey through your business."],
  [studio.offers.custom, "Make the missing piece happen.", "Priced by scope", "Interactive tools, booking, commerce, portals, quote builders, maps, integrations and business-specific digital systems."],
  [studio.offers.refinement, "Make what you have work harder.", refinementStartingPrice, "Focused website redesign and improvements to usability, content structure, conversion paths and customer experience."],
];

export default function Home() {
  return <main id="top" className="full-picture home-world">
    <div className="site-background" aria-hidden="true" />
    <HomeOpening />
    <div id="home-content"><Navigation />

      <section className="hero home-hero" aria-labelledby="home-heading">
        <div className="home-art-stage">
          <div className="home-hero-copy">
            <p className="home-hero-index">CUSTOM WEB DESIGN + DEVELOPMENT<br/>DETROIT BASED · WORKING WORLDWIDE</p>
            <h1 id="home-heading" tabIndex={-1} className="home-hero-title">
              <span>Websites</span><span>that actually</span><em>do things.<b aria-hidden="true">♥︎</b></em>
            </h1>
            <p className="home-hero-description">
              A. Halliwell Studio creates custom websites, interactive digital experiences and digital systems for businesses that need more than a beautiful template.
            </p>
            <div className="home-hero-actions">
              <a className="button button-primary" href="#start">START A PROJECT <Image className="glitter-cursor" src={CURSOR} alt="" width={26} height={26} aria-hidden="true" /></a>
              <a className="home-hero-text-link" href="#work">VIEW SELECTED WORK <Image className="glitter-cursor" src={CURSOR} alt="" width={24} height={24} aria-hidden="true" /></a>
            </div>
            <div className="home-hero-specialty">
              <p><span>CURRENT SPECIALTY</span><strong>Hospitality + experience-driven businesses</strong></p>
              <p>Specialty, not exclusivity. If your business needs the web to sell, book, organize, explain, qualify or automate, the site should be designed around that job.</p>
            </div>
          </div>
          <div className="home-monitor-logo" aria-hidden="true"><span>A.</span></div>
          <a className="home-star-link" href="#work" aria-label="View the work"><span>VIEW <span className="home-star-optional">THE </span>WORK</span><Image className="glitter-cursor" src={CURSOR} alt="" width={30} height={30} aria-hidden="true" /></a>
        </div>
      </section>

      <div className="hero-strip"><div className="hero-strip-track">STRATEGY ✦ WEB DESIGN ✦ DEVELOPMENT ✦ INTERACTIVE EXPERIENCES ✦ DIGITAL SYSTEMS ✦</div></div>

      <div className="studio-world">
        <section className="world-sheet intro-sheet" id="work" aria-labelledby="work-heading">
          <div className="content-shell">
            <div className="section-kicker"><span>01 — Selected Work</span><span>Range with a reason.</span></div>
            <h2 id="work-heading">Custom digital experiences<br/><em>built around the business.</em></h2>
            <p className="world-lede">Hospitality, nightlife, wellness and local services. Each concept explores a different customer decision, from choosing a venue to understanding a treatment, planning a night out or requesting home service.</p>
            <a className="work-intro-link" href="#work-gallery">EXPLORE THE WORK <Image className="glitter-cursor" src={CURSOR} alt="" width={24} height={24} aria-hidden="true" /></a>
          </div>
        </section>

        <WorkWorldGallery />
        <div className="project-worlds" id="selected-projects">{publicProjects.slice(2).map(p => <ProjectShowcase project={p} key={p.slug} />)}</div>

        <section className="world-sheet proof-world">
          <div className="content-shell">
            <div className="section-kicker"><span>Proof — without the pretending</span><span>Inspect it yourself.</span></div>
            <div className="proof-heading"><h2>The work<br/><em>is the proof.</em></h2><p>Explore the strategy, live builds and interactive systems behind the portfolio, not just screenshots.</p></div>
            <div className="proof-grid">
              <article><span>01 — Live Builds</span><h3>Not just mockups.</h3><p>Open finished and interactive concept websites across multiple industries.</p><div className="proof-links"><a href="/work">Explore all work</a></div></article>
              <article><span>02 — Case Studies</span><h3>Strategy you can read.</h3><p>See the problem, reasoning, customer journey and digital decisions behind each concept.</p><a className="proof-single-link" href="/work">Read the work</a></article>
              <article><span>03 — Interactive Capabilities</span><h3>The interface proves it.</h3><p>Try custom maps, booking flows, personalization, portals and conversion tools in the Lab.</p><a className="proof-single-link" href="/lab">Use the Lab</a></article>
            </div>
            <p className="proof-disclosure">Portfolio brands shown are original studio concepts, not commissioned client work. I do not publish invented testimonials, logos or performance results.</p>
          </div>
        </section>

        <BusinessValue />

        <section className="world-sheet offer-world" id="services">
          <div className="content-shell">
            <div className="section-kicker"><span>02 — Custom Web Design + Development</span><span>Start where the business is.</span></div>
            <div className="offer-receipt">
              <div className="receipt-masthead"><span className="receipt-monogram">A.</span><span>A. HALLIWELL<br/>STUDIO</span><small>Investment · 2026</small></div>
              <div className="offer-heading"><h2>For the next version<br/>of <em>your business.</em></h2><p>Website design, development and digital systems shaped around the customer journey and the job the business needs the internet to do.</p></div>
              <p className="offer-price-note">Custom websites: {websiteStartingPrice.toLowerCase()}.</p>
              <div className="receipt-columns" aria-hidden="true"><span>THE POSSIBILITIES</span><span>INVESTMENT</span></div>
              <div className="offer-grid">{offers.map(o => <article key={o[0]}><small>{o[0]}</small><h3>{o[1]}</h3><strong>{o[2]}</strong><p>{o[3]}</p></article>)}</div>
              <div className="receipt-signoff" aria-hidden="true">A. Halliwell Studio <span>✦</span> Made for the work ahead.</div>
            </div>
            <div className="offer-card" aria-hidden="true"><div className="offer-card-chip"/><span className="offer-card-monogram">A<span>h</span></span><span className="offer-card-number">A. HALLIWELL STUDIO</span><span className="offer-card-circles"/></div>
          </div>
        </section>

        <section className="lab-world"><CapabilityPlayground inHome /></section>

        <section className="world-sheet studio-section" id="studio">
          <SceneProps scene="studio"/>
          <div className="content-shell founder-preview">
            <div className="founder-preview-copy">
              <span className="section-kicker-text">04 — The Studio</span>
              <h2>The person<br/>behind the <em>cursor.</em></h2>
              <p className="studio-lead">Hello, I&apos;m Arabella. I design and develop custom websites with personality and a real job to do.</p>
              <p>My background in psychology and hospitality shapes how I think about digital experiences: what people need to understand, where they hesitate, what builds trust and what makes the next step feel easy.</p>
              <p>A. Halliwell Studio is based in Detroit, Michigan and works with businesses wherever the right project happens to be.</p>
              <div className="studio-note"><span>STRATEGY</span><span>DESIGN</span><span>CODE</span><span>SYSTEMS ♥</span></div>
              <a className="button" href="/studio">MEET THE STUDIO</a>
            </div>
            <div className="founder-preview-visual">
              <div className="founder-photo-card"><Image src="/assets/founder/arabella-halliwell.webp" alt="Arabella Halliwell, founder of A. Halliwell Studio" fill sizes="(max-width:820px) 86vw,420px"/></div>
              <aside className="founder-desk-note"><small>FROM MY DESK</small><strong>Detroit,<br/>Michigan</strong><span>Independent studio</span><span>Working worldwide.</span><a href={`mailto:${studio.email}`}>Say hello</a></aside>
            </div>
          </div>
        </section>

        <ConsultationLink />
        <section className="start-world"><SceneProps scene="start"/><StartProject inHome /></section>
      </div>
    </div>
  </main>
}
