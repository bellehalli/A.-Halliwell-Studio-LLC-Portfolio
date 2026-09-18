import Image from "next/image";

export default function Home() {
  return (
    <main>
      <div className="site-background" aria-hidden="true" />

      <header className="site-nav shell">
        <a className="logo" href="/" aria-label="A. Halliwell Studio home">
          <span className="logo-mark">A.</span>
          <span>HALLIWELL</span>
        </a>

        <nav className="nav-links" aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#services">Services</a>
          <a href="#studio">Studio</a>
          <a className="nav-cta" href="#start">
            Start a project ↗
          </a>
        </nav>
      </header>

      <section className="hero shell">
        <div className="eyebrow">
          <span className="status-dot" aria-hidden="true" />
          Independent creative development studio
        </div>

        <Image
          className="hero-object hero-heart"
          src="/jelly-heart.png"
          alt=""
          width={190}
          height={190}
          priority
        />

        <Image
          className="hero-object hero-flower"
          src="/flower-icon.png"
          alt=""
          width={150}
          height={150}
          priority
        />

        <Image
          className="hero-object hero-sparkle"
          src="/sparkle.png"
          alt=""
          width={105}
          height={105}
          priority
        />

        <h1 className="hero-title">
          WEBSITES
          <br />
          WITH <em>PERSONALITY.</em>
        </h1>

        <div className="hero-bottom">
          <p className="hero-description">
            Custom digital experiences designed around how your business
            actually works.
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href="#work">
              View the work ↘
            </a>

            <a className="button" href="#start">
              Start a project ↗
            </a>
          </div>
        </div>
      </section>

      <div className="hero-strip" aria-label="Studio capabilities">
        <div className="hero-strip-track">
          STRATEGY ✦ UX ✦ WEB DESIGN ✦ DEVELOPMENT ✦ INTERACTIVE SYSTEMS ✦
          COMMERCE ✦ BOOKING ✦ HOSPITALITY ✦ STRATEGY ✦ UX ✦ WEB DESIGN ✦
          DEVELOPMENT ✦ INTERACTIVE SYSTEMS ✦ COMMERCE ✦ BOOKING ✦
          HOSPITALITY ✦
        </div>
      </div>

      <div id="work" />
      <div id="services" />
      <div id="studio" />
      <div id="start" />
    </main>
  );
}
