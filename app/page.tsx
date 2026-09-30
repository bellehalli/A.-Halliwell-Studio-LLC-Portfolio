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

const offers=[
 ["Custom Website","Give the whole story room.","Starting at $5,000 + scope","Strategy, design, and development for a complete journey through your business."],
 ["Custom Scope","Make the missing piece happen.","Priced by scope","Booking, commerce, portals, quote builders, integrations, or a smarter path through the site you already have."],
 ["One Page","Make one page work harder.","Starting at $1,000 + scope","A focused home for a launch, service, or offer—built to give people a clear next step."]
];

export default function Home(){
 return <main id="top" className="full-picture home-world">
  <div className="site-background" aria-hidden="true"/>
  <HomeOpening/>
  <div id="home-content"><Navigation/>
  <section className="hero home-hero" aria-labelledby="home-heading">
   <div className="home-art-stage">
    <div className="home-hero-copy">
     <p className="home-hero-index">Custom websites + digital systems<br/>for experience-driven businesses</p>
     <h1 id="home-heading" tabIndex={-1} className="home-hero-title"><span>Websites</span><span>that actually</span><em>do things.<b aria-hidden="true">♥︎</b></em></h1>
     <p className="home-hero-description">Pretty is only the beginning. Custom websites, interactive experiences, and digital systems designed to help businesses grow.</p>
     <div className="home-hero-actions">
      <a className="button button-primary" href="#start">START A PROJECT <Image className="glitter-cursor" src={CURSOR} alt="" width={26} height={26} aria-hidden="true" /></a>
      <a className="home-hero-text-link" href="#work">VIEW SELECTED WORK <Image className="glitter-cursor" src={CURSOR} alt="" width={24} height={24} aria-hidden="true" /></a>
     </div>
     <div className="home-hero-specialty">
      <p><span>CURRENT SPECIALTY</span><strong>Hospitality + experience-driven businesses</strong></p>
      <p>Specialty, not exclusivity. If your business needs the web to sell, book, organize, explain or automate, I want to hear about it.</p>
     </div>
    </div>
    <div className="home-monitor-logo" aria-hidden="true"><span>A.</span></div>
    <a className="home-star-link" href="#work" aria-label="View the work"><span>VIEW <span className="home-star-optional">THE </span>WORK</span><Image className="glitter-cursor" src={CURSOR} alt="" width={30} height={30} aria-hidden="true" /></a>
   </div>
  </section>
  <div className="hero-strip"><div className="hero-strip-track">STRATEGY ✦ DESIGN ✦ DEVELOPMENT ✦ DIGITAL SYSTEMS ✦ STRATEGY ✦ DESIGN ✦ DEVELOPMENT ✦ DIGITAL SYSTEMS ✦</div></div>

  <div className="studio-world">
   <section className="world-sheet intro-sheet" id="work" aria-labelledby="work-heading"><div className="content-shell"><div className="section-kicker"><span>01 — Selected Work</span><span>Range with a reason.</span></div><h2 id="work-heading">Different businesses.<br/><em>Different jobs.</em></h2><p className="world-lede">Hospitality, nightlife, wellness and local services. Each concept is built around a different customer decision so the portfolio shows range without becoming a pile of unrelated mockups.</p><a className="work-intro-link" href="#work-gallery">EXPLORE THE WORK <Image className="glitter-cursor" src={CURSOR} alt="" width={24} height={24} aria-hidden="true" /></a></div></section>
   <WorkWorldGallery/>
   <div className="project-worlds" id="selected-projects">{publicProjects.slice(2).map(p=><ProjectShowcase project={p} key={p.slug}/>)}</div>

   <section className="world-sheet proof-world"><div className="content-shell"><div className="section-kicker"><span>Proof — without the pretending</span><span>Inspect it yourself.</span></div><div className="proof-heading"><h2>The work<br/><em>is the proof.</em></h2><p>Explore the strategy, not just the screenshots. Read the thinking behind each build and use the interactive Lab yourself.</p></div><div className="proof-grid"><article><span>01 — Live Builds</span><h3>Not just mockups.</h3><p>Open finished and interactive concept builds across multiple industries.</p><div className="proof-links"><a href="/work">Explore all work</a></div></article><article><span>02 — Case Studies</span><h3>Strategy you can read.</h3><p>See the problem, reasoning, build decisions and what each concept is designed to demonstrate.</p><a className="proof-single-link" href="/work">Read the work</a></article><article><span>03 — Live Capabilities</span><h3>The interface proves it.</h3><p>Try booking, commerce, quote, portal, events and lead-generation interfaces below.</p><a className="proof-single-link" href="/lab">Use the Lab</a></article></div><p className="proof-disclosure">Portfolio brands shown are original studio concepts, not commissioned client work. I do not publish invented testimonials, logos or performance results.</p></div></section>

   <section className="world-sheet offer-world" id="services"><div className="content-shell"><div className="section-kicker"><span>02 — Ways to Work Together</span><span>Start where the business is.</span></div><div className="offer-receipt"><div className="receipt-masthead"><span className="receipt-monogram">A.</span><span>A. HALLIWELL<br/>STUDIO</span><small>Investment · 2026</small></div><div className="offer-heading"><h2>For the next version<br/>of <em>your business.</em></h2><p>One magnetic page. A fully realized site. Or the one thing your current setup can&apos;t do yet. We build to fit the ambition, not a preset package.</p></div><p className="offer-price-note">Most custom websites begin at $5,000 + scope.</p><div className="receipt-columns" aria-hidden="true"><span>THE POSSIBILITIES</span><span>INVESTMENT</span></div><div className="offer-grid">{offers.map(o=><article key={o[0]}><small>{o[0]}</small><h3>{o[1]}</h3><strong>{o[2]}</strong><p>{o[3]}</p></article>)}</div><div className="receipt-signoff" aria-hidden="true">A. Halliwell Studio <span>✦</span> Made for the work ahead.</div></div><div className="offer-card" aria-hidden="true"><div className="offer-card-chip"/><span className="offer-card-monogram">A<span>h</span></span><span className="offer-card-number">A. HALLIWELL STUDIO</span><span className="offer-card-circles"/></div></div></section>

   <section className="lab-world"><CapabilityPlayground inHome/></section>

   <section className="world-sheet studio-section" id="studio"><SceneProps scene="studio"/><div className="content-shell founder-preview"><div className="founder-preview-copy"><span className="section-kicker-text">04 — The Studio</span><h2>The person<br/>behind the <em>cursor.</em></h2><p className="studio-lead">Hello, I&apos;m Arabella. I make websites with personality and a real job to do.</p><p>I have a B.A. in Psychology and experience working with people face to face in hospitality and events. I pay attention to the moment someone gets curious, the place they hesitate, and the little details that make them feel ready to move forward.</p><p>That&apos;s the eye I bring to design and code. A site can have a whole personality and still make booking, buying, or getting an answer feel easy. I love hospitality, but I&apos;m just as interested in the odd little digital problem another business needs solved.</p><div className="studio-note"><span>STRATEGY</span><span>DESIGN</span><span>CODE</span><span>SYSTEMS ♥</span></div><a className="button" href="/studio">MEET THE STUDIO</a></div><div className="founder-preview-visual"><div className="founder-photo-card"><Image src="/assets/founder/arabella-halliwell.webp" alt="Arabella Halliwell, founder of A. Halliwell Studio" fill sizes="(max-width:820px) 86vw,420px"/></div><aside className="founder-desk-note"><small>FROM MY DESK</small><strong>Detroit,<br/>Michigan</strong><span>Independent studio</span><span>Design with a pulse.</span><a href="mailto:hello@ahalliwellstudio.com">Say hello</a></aside></div></div></section>

   <ConsultationLink />
   <section className="start-world"><SceneProps scene="start"/><StartProject inHome/></section>
  </div>
  </div>
 </main>
}
