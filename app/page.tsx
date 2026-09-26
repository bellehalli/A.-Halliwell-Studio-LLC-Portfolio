import Image from "next/image";
import CapabilityPlayground from "@/components/lab/CapabilityPlayground";
import ProjectShowcase from "@/components/projects/ProjectShowcase";
import WorkWorldGallery from "@/components/projects/WorkWorldGallery";
import StartProject from "@/components/forms/StartProject";
import Navigation from "@/components/navigation/Navigation";
import HomeOpening from "@/components/visual/HomeOpening";
import SceneProps from "@/components/visual/SceneProps";
import CompositionArt from "@/components/visual/CompositionArt";
import { projects } from "@/data/projects";

const CURSOR = "/assets/ui/Portfolio Assets A.Halliwell  - 24.PNG";

const offers=[
 ["01 / ONE PAGE","A strong place to send people.","Starting at $1,000 + scope","For a small business, launch, service or offer that needs one focused custom page."],
 ["02 / CUSTOM WEBSITE","A complete digital presence.","Starting at $5,000 + scope","Strategy, custom design and development for a multi-page customer journey."],
 ["03 / CUSTOM SCOPE","Add the thing you actually need.","Priced by scope","Booking, commerce, portals, quote builders, new funnels, integrations or improvements to an existing site."]
];

export default function Home(){
 return <main id="top" className="full-picture home-world">
  <div className="site-background" aria-hidden="true"/>
  <HomeOpening/>
  <div id="home-content"><Navigation/>
  <section className="hero home-hero" aria-labelledby="home-heading">
   <div className="home-art-stage">
    <div className="home-hero-copy">
     <p className="home-hero-index">WEB DESIGN + DEVELOPMENT + DIGITAL SYSTEMS</p>
     <h1 id="home-heading" tabIndex={-1} className="home-hero-title"><span>Websites</span><span>that actually</span><em>do things.<b aria-hidden="true">♥︎</b></em></h1>
     <p className="home-hero-tagline">PRETTY IS ONLY THE BEGINNING.</p>
     <p className="home-hero-description">A. Halliwell Studio designs and develops custom websites, interactive experiences and business tools for companies that need more than a pretty homepage. One-page projects start at $1,000 + scope. Custom multi-page websites start at $5,000 + scope.</p>
     <div className="home-hero-actions">
      <a className="button button-primary" href="#start">START A PROJECT <Image className="glitter-cursor" src={CURSOR} alt="" width={26} height={26} aria-hidden="true" /></a>
      <a className="home-hero-text-link" href="#capabilities">TRY THE LAB <Image className="glitter-cursor" src={CURSOR} alt="" width={24} height={24} aria-hidden="true" /></a>
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
  <div className="hero-strip"><div className="hero-strip-track">WEB DESIGN ✦ DEVELOPMENT ✦ E-COMMERCE ✦ BOOKING ✦ PORTALS ✦ INTERACTIVE TOOLS ✦ BUSINESS SYSTEMS ✦ SUPPORT ✦ WEB DESIGN ✦ DEVELOPMENT ✦ E-COMMERCE ✦ BOOKING ✦</div></div>

  <div className="studio-world">
   <section className="world-sheet intro-sheet" id="work" aria-labelledby="work-heading"><div className="content-shell"><div className="section-kicker"><span>01 / SELECTED WORK</span><span>RANGE WITH A REASON.</span></div><h2 id="work-heading">Different businesses.<br/><em>Different jobs.</em></h2><p className="world-lede">Hospitality, nightlife, wellness, local services, restaurants and commerce. Each concept is built around a different customer decision so the portfolio shows range without becoming a pile of unrelated mockups.</p><a className="work-intro-link" href="#work-gallery">EXPLORE THE WORK <Image className="glitter-cursor" src={CURSOR} alt="" width={24} height={24} aria-hidden="true" /></a></div></section>
   <WorkWorldGallery/>
   <div className="project-worlds" id="selected-projects">{projects.slice(2).map(p=><ProjectShowcase project={p} key={p.slug}/>)}</div>

   <section className="world-sheet proof-world"><CompositionArt scene="proof"/><div className="content-shell"><div className="section-kicker"><span>PROOF / WITHOUT THE PRETENDING</span><span>INSPECT IT YOURSELF.</span></div><div className="proof-heading"><h2>The work<br/><em>is the proof.</em></h2><p>Explore the live builds, read the strategy behind them and use the interactive Lab yourself.</p></div><div className="proof-grid"><article><span>01 / LIVE BUILDS</span><h3>Not just mockups.</h3><p>Open finished and interactive concept builds across multiple industries.</p><div className="proof-links"><a href="/work">Explore all work ↗</a></div></article><article><span>02 / CASE STUDIES</span><h3>Strategy you can read.</h3><p>See the problem, reasoning, build decisions and what each concept is designed to demonstrate.</p><a className="proof-single-link" href="/work">Read the work ↗</a></article><article><span>03 / LIVE CAPABILITIES</span><h3>The interface proves it.</h3><p>Try booking, commerce, quote, portal, events and lead-generation interfaces below.</p><a className="proof-single-link" href="#capabilities">Use the Lab ↘</a></article></div><p className="proof-disclosure">Portfolio brands shown are original studio concepts, not commissioned client work. I do not publish invented testimonials, logos or performance results.</p></div></section>

   <section className="world-sheet offer-world" id="services"><CompositionArt scene="offer"/><div className="content-shell"><div className="section-kicker"><span>02 / WAYS TO WORK TOGETHER</span><span>START WHERE THE BUSINESS IS.</span></div><div className="offer-receipt"><div className="receipt-masthead"><span className="receipt-monogram">A.</span><span>A. HALLIWELL<br/>STUDIO</span><small>INVESTMENT / 2026</small></div><div className="offer-heading"><h2>Not every business<br/>needs the <em>same size build.</em></h2><p>Start with one focused page, build a complete custom site, or add the missing piece to something you already have.</p></div><div className="receipt-columns" aria-hidden="true"><span>SERVICE</span><span>INVESTMENT</span></div><div className="offer-grid">{offers.map(o=><article key={o[0]}><small>{o[0]}</small><h3>{o[1]}</h3><strong>{o[2]}</strong><p>{o[3]}</p></article>)}</div><div className="receipt-signoff" aria-hidden="true">A. Halliwell Studio <span>✦</span> Made for the work ahead.</div></div></div></section>

   <section className="lab-world"><CompositionArt scene="lab"/><CapabilityPlayground/></section>

   <section className="world-sheet studio-section" id="studio"><SceneProps scene="studio"/><div className="content-shell founder-preview"><div className="founder-preview-copy"><span className="section-kicker-text">04 / THE STUDIO</span><h2>The person<br/>behind the <em>cursor.</em></h2><p className="studio-lead">I&apos;m Arabella Halliwell, founder, designer and developer of A. Halliwell Studio.</p><p>My background sits at the intersection of psychology, hospitality and digital design. I look at websites from both sides: how a business operates and how a person decides whether to trust, buy, book or act.</p><p>Hospitality is a current specialty, not the studio&apos;s entire identity. The work is about solving digital problems across industries.</p><div className="studio-note"><span>STRATEGY</span><span>DESIGN</span><span>CODE</span><span>SYSTEMS ♥</span></div><a className="button" href="/studio">MEET THE STUDIO ↗</a></div><div className="founder-preview-visual"><div className="founder-photo-card"><Image src="/assets/founder/arabella-halliwell.PNG" alt="Arabella Halliwell, founder of A. Halliwell Studio" fill sizes="(max-width:820px) 86vw,420px"/><span className="founder-photo-label">ARABELLA HALLIWELL / FOUNDER</span></div><aside className="founder-desk-note"><small>FROM MY DESK</small><strong>Detroit, Michigan</strong><span>Independent studio</span><span>Strategy + design + development</span><span>Websites + digital systems</span><a href="mailto:hello@ahalliwellstudio.com">hello@ahalliwellstudio.com ↗</a></aside></div></div></section>

   <section className="start-world"><SceneProps scene="start"/><StartProject/></section>
  </div>
  <footer className="world-footer"><SceneProps scene="footer"/><div className="footer-paper"><div className="footer-brand"><span className="logo-mark">A.</span><strong>A. HALLIWELL STUDIO</strong></div><p>Custom websites and digital systems built around what the business actually needs the internet to do.</p><nav className="footer-links" aria-label="Footer"><a href="/work">WORK ↗</a><a href="/services">SERVICES ↗</a><a href="/studio">STUDIO ↗</a><a href="/lab">LAB ↗</a><a href="/resources">RESOURCES ↗</a><a href="/start">START A PROJECT ↗</a><a href="mailto:hello@ahalliwellstudio.com">EMAIL THE STUDIO ↗</a><a href="/card">DIGITAL CARD ↗</a><a href="#top">BACK TO TOP ↑</a></nav></div></footer>
  </div>
 </main>
}
