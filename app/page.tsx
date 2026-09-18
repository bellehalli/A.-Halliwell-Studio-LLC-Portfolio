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
          <span>Independent creative<br />development studio</span>
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
          className="hero-object hero-sparkle"
          src="/sparkle.png"
          alt=""
          width={105}
          height={105}
          priority
        />

        <div className="hero-title-wrap">
          <h1 className="hero-title">
            <span className="hero-editorial">Websites</span>
            <span className="hero-editorial hero-with">With</span>
            <span className="hero-princess">
              Personality<span className="title-heart" aria-hidden="true">♥</span>
            </span>
          </h1>
        </div>

        <div className="hero-bottom">
          <p className="hero-description">
            Custom digital experiences designed around how your business actually works.
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href="#work">
              View the work ↗
            </a>
            <a className="button" href="#start">
              Start a project ↗
            </a>
          </div>
        </div>
      </section>

      <div className="hero-strip" aria-label="Studio capabilities">
        <div className="hero-strip-track">
          <span>WEB DESIGN</span><b>✦</b>
          <span>DEVELOPMENT</span><b>✦</b>
          <span>INTERACTIVE SYSTEMS</span><b>✦</b>
          <span>COMMERCE</span><b>✦</b>
          <span>BRAND EXPERIENCES</span><b>✦</b>
          <span>ONGOING SUPPORT</span><b>✦</b>
          <span>WEB DESIGN</span><b>✦</b>
          <span>DEVELOPMENT</span><b>✦</b>
          <span>INTERACTIVE SYSTEMS</span><b>✦</b>
          <span>COMMERCE</span><b>✦</b>
          <span>BRAND EXPERIENCES</span><b>✦</b>
          <span>ONGOING SUPPORT</span><b>✦</b>
        </div>
      </div>

      <div id="work" />
      <div id="services" />
      <div id="studio" />
      <div id="start" />
    </main>
  );
}
