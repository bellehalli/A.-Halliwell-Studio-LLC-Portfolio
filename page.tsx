import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <div className="backdrop" aria-hidden="true" />
      <header className="nav shell">
        <Link href="/" className="brand"><span>A.</span> HALLIWELL</Link>
        <nav aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#services">Services</a>
          <a href="#studio">Studio</a>
          <a href="#contact" className="navCta">Start a project ↗</a>
        </nav>
      </header>

      <section className="hero shell">
        <div className="status"><i /> INDEPENDENT CREATIVE DEVELOPMENT STUDIO</div>
        <Image className="deco heart" src="/jelly-heart.png" alt="" width={180} height={180} priority />
        <Image className="deco flower" src="/flower-icon.png" alt="" width={150} height={150} priority />
        <Image className="deco sparkle" src="/sparkle.png" alt="" width={100} height={100} priority />
        <h1>WEBSITES<br/>WITH <em>PERSONALITY.</em></h1>
        <div className="heroFoot">
          <p>Custom digital experiences designed around how your business actually works.</p>
          <div className="buttons"><a href="#work" className="btn dark">View the work</a><a href="#contact" className="btn">Start a project</a></div>
        </div>
      </section>

      <div className="ticker"><div>STRATEGY ✦ UX ✦ WEB DESIGN ✦ DEVELOPMENT ✦ INTERACTIVE SYSTEMS ✦ COMMERCE ✦ BOOKING ✦ HOSPITALITY ✦</div></div>

      <section id="work" className="section shell">
        <div className="sectionTitle"><span>01 / SELECTED WORK</span><p>Digital experiences where design, customer journey and business logic work together.</p></div>
        <div className="workGrid">
          <article className="work willow"><small>LUXURY HOSPITALITY / WEDDINGS</small><h2>Willow<br/>Lily</h2><p>A conversion-led venue experience built around discovery, packages, planning and inquiry.</p><a href="https://willowlilyestate.com" target="_blank" rel="noreferrer">Visit live site ↗</a></article>
          <article className="work maison"><small>RESTAURANT / HOSPITALITY</small><h2>Maison<br/><em>Rivière</em></h2><p>A refined hospitality experience pairing atmosphere, information architecture and reservation intent.</p><a href="https://www.maisonrivieredetroit.com" target="_blank" rel="noreferrer">Visit live site ↗</a></article>
        </div>
      </section>

      <section className="proof">
        <div className="shell">
          <span>THE SITE IS THE PROOF.</span>
          <h2>YOU AREN'T READING<br/>A LIST OF WHAT I CAN BUILD.<br/><em>YOU'RE USING IT.</em></h2>
          <div className="chips"><b>RESPONSIVE SYSTEMS ✓</b><b>CUSTOM INTERACTION ✓</b><b>CONVERSION THINKING ✓</b><b>BUSINESS LOGIC ✓</b></div>
        </div>
      </section>

      <section id="services" className="section shell">
        <div className="sectionTitle"><span>02 / CAPABILITIES</span><p>Strategy, experience design and custom development considered as one system.</p></div>
        <div className="services">
          {["Digital Strategy","Experience Design","Custom Development","Commerce + Booking","Business Systems","Continued Studio Support"].map((x,i)=><div key={x}><small>0{i+1}</small><h3>{x}</h3><span>↗</span></div>)}
        </div>
      </section>

      <section id="studio" className="studio shell">
        <div><span>03 / THE STUDIO</span><h2>BUILT FOR BUSINESSES<br/>THAT HAVE OUTGROWN<br/><em>ORDINARY WEBSITES.</em></h2></div>
        <p>A. Halliwell Studio approaches the website as part of the business itself. Customer experience, operations, conversion and visual identity are designed to work together rather than live in separate boxes.</p>
      </section>

      <section id="contact" className="contact shell">
        <div><small>HAVE A PROJECT IN MIND?</small><h2>LET'S MAKE THE<br/>INTERNET <em>LESS BORING.</em></h2><p>The full project inquiry and booking system comes in a later production stage. For Stage 1, this section establishes the final conversion destination without pretending the infrastructure is already connected.</p></div>
      </section>

      <footer className="shell"><div className="brand"><span>A.</span> HALLIWELL</div><p>DESIGN + DEVELOPMENT<br/>DETROIT / AVAILABLE WORLDWIDE</p><p>© 2026 A. HALLIWELL STUDIO LLC</p></footer>
    </main>
  );
}
