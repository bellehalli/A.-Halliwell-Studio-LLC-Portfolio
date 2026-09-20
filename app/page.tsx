import Link from "next/link";
import Navigation from "@/components/navigation/Navigation";
import ProjectCard from "@/components/projects/ProjectCard";
import SectionHeader from "@/components/system/SectionHeader";
import { projects } from "@/data/projects";
import { services } from "@/data/services";

export default function Home() {
  return (
    <main className="site-shell">
      <div className="moving-background" aria-hidden="true" />
      <Navigation />

      <section className="home-hero shell">
        <small>INDEPENDENT DIGITAL DESIGN, DEVELOPMENT + SYSTEMS STUDIO</small>
        <h1>Websites are the storefront.<br/><em>The system is the work.</em></h1>
        <p>A. Halliwell Studio creates distinctive internet experiences around how businesses actually operate, how customers actually behave and what the internet actually needs to accomplish.</p>
        <div className="actions"><Link className="primary-action" href="/work">Explore selected work ↗</Link><Link href="/start">Start a project ↗</Link></div>
      </section>

      <section className="home-system shell">
        <div className="system-statement"><span>PUBLIC EXPERIENCE</span><strong>SHOW MODE</strong><p>Portfolio, case studies, Lab and editorial proof.</p></div>
        <div className="system-statement"><span>SALES EXPERIENCE</span><strong>BUSINESS MODE</strong><p>Inquiry, qualification and project brief creation.</p></div>
        <div className="system-statement"><span>PRIVATE EXPERIENCE</span><strong>SYSTEM MODE</strong><p>Client delivery and operations stay private until the real infrastructure is connected.</p></div>
      </section>

      <section className="home-section shell">
        <SectionHeader eyebrow="01 / SELECTED WORK" title="Work is evidence." lede="Only real live public projects belong here." />
        <div className="project-stack">{projects.map(project => <ProjectCard project={project} key={project.slug} />)}</div>
        <Link className="section-link" href="/work">Open the complete work index ↗</Link>
      </section>

      <section className="home-section shell">
        <SectionHeader eyebrow="02 / SERVICES" title="What does the business need the internet to do?" />
        <div className="service-index">{services.map(service => <article key={service.slug}><span>{service.number}</span><h3>{service.title}</h3><p>{service.purpose}</p></article>)}</div>
        <Link className="section-link" href="/services">Explore services and process ↗</Link>
      </section>

      <section className="home-section shell">
        <SectionHeader eyebrow="03 / LAB" title="You are not reading a list of what I can build. You are using it." lede="The dedicated Lab contains working interaction demos and prototypes." />
        <Link className="primary-action" href="/lab">Enter the Lab ↗</Link>
      </section>

      <section className="home-section shell">
        <SectionHeader eyebrow="04 / START" title="Turn the idea into a useful brief." lede="The project builder creates an actual inquiry and sends it directly to the studio." />
        <Link className="primary-action" href="/start">Start a project ↗</Link>
      </section>
    </main>
  );
}
