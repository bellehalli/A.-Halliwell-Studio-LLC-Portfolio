import Image from "next/image";
import CapabilityPlayground from "@/components/CapabilityPlayground";
import ProjectShowcase from "@/components/ProjectShowcase";
import StartProject from "@/components/StartProject";
import { projects } from "@/data/projects";

const services = [
  ["01", "Digital Strategy", "Clarify what the site needs to do before deciding what it should look like."],
  ["02", "Experience Design", "Customer journeys, information architecture and interfaces that feel intuitive."],
  ["03", "Custom Development", "Purpose-built websites and interactive systems instead of template-shaped businesses."],
  ["04", "Commerce + Booking", "Digital flows designed around how customers actually buy, inquire and reserve."],
  ["05", "Business Systems", "Thoughtful connections between the public website and the work happening behind it."],
  ["06", "Studio Support", "Continued refinement, maintenance and new capabilities after launch."],
];

export default function Home() {
  return (
    <main id="top">
      <div className="site-background" aria-hidden="true" />
      <header className="site-nav shell">
        <a className="logo" href="#top" aria-label="A. Halliwell Studio home"><span className="logo-mark">A.</span><span>HALLIWELL</span></a>
        <nav className="nav-links" aria-label="Primary navigation"><a href="#work">Work</a><a href="#services">Services</a><a href="#studio">Studio</a><a className="nav-cta" href="#start">Start a project ↗</a></nav>
      </header>

      <section className="hero shell">
        <div className="eyebrow"><span className="status-dot" aria-hidden="true" />Independent creative development studio</div>
        <Image className="hero-object hero-heart" src="/jelly-heart.png" alt="" width={190} height={190} priority />
        <Image className="hero-object hero-sparkle" src="/sparkle.png" alt="" width={105} height={105} priority />
        <h1 className="hero-title"><span>Websites</span><br/><span>With</span><span className="personality-line">Personality<span className="personality-heart">♥</span></span></h1>
        <div className="hero-bottom"><p className="hero-description">Custom digital experiences designed around how your business actually works.</p><div className="hero-actions"><a className="button button-primary" href="#work">View the work ↘</a><a className="button" href="#start">Start a project ↗</a></div></div>
      </section>

      <div className="hero-strip"><div className="hero-strip-track">WEB DESIGN ✦ DEVELOPMENT ✦ INTERACTIVE SYSTEMS ✦ COMMERCE ✦ BRAND EXPERIENCES ✦ ONGOING SUPPORT ✦ WEB DESIGN ✦ DEVELOPMENT ✦ INTERACTIVE SYSTEMS ✦ COMMERCE ✦ BRAND EXPERIENCES ✦ ONGOING SUPPORT ✦</div></div>

      <div className="page-stack">
        <section className="sheet sheet-blush work-intro" id="work"><div className="content-shell"><div className="section-kicker"><span>01 / SELECTED WORK</span><span>↗</span></div><h2>The good stuff.</h2><div className="work-intro-bottom"><p>A curated look at recent projects, creative solutions and digital experiences that work in real life.</p><Image src="/flower-icon.png" alt="" width={76} height={76}/></div></div></section>

        {projects.map((project) => <ProjectShowcase project={project} key={project.name}/>) }

        <section className="sheet sheet-lavender proof"><div className="content-shell proof-grid"><div><span className="section-kicker-text">THE SITE IS THE PROOF.</span><h2>You&apos;re using<br/>the work.</h2></div><p>Strategy, interface design, custom development and interaction are not separate decorations here. They work together as one experience.</p></div></section>

        <section className="sheet sheet-cream services" id="services"><div className="content-shell"><div className="section-kicker"><span>02 / SERVICES</span><span>WHAT I BUILD</span></div><h2>Pretty is only<br/><em>the beginning.</em></h2><div className="service-list">{services.map(([number,title,description]) => <article className="service-row" key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></article>)}</div></div></section>

        <CapabilityPlayground />

        <section className="sheet sheet-pink studio" id="studio"><div className="content-shell studio-grid"><div><span className="section-kicker-text">04 / THE STUDIO</span><h2>The person<br/>behind the <em>cursor.</em></h2></div><div className="studio-copy"><p className="studio-lead">A. Halliwell Studio is an independent creative web design and development studio for businesses that have outgrown ordinary websites.</p><p>The work starts with how a business operates, how customers make decisions and what the digital experience actually needs to accomplish. Then we make it beautiful.</p><div className="studio-note"><span>STRATEGY</span><span>DESIGN</span><span>CODE</span><span>PERSONALITY ♥</span></div></div></div></section>

        <StartProject />

        <footer className="sheet footer-sheet"><div className="content-shell footer-grid"><div className="footer-brand"><span className="logo-mark">A.</span><strong>A. HALLIWELL STUDIO</strong></div><p>Websites with personality♥</p><a href="#top">Back to top ↑</a></div></footer>
      </div>
    </main>
  );
}
