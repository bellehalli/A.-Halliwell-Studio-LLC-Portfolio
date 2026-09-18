import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectMedia from "@/components/ProjectMedia";
import { getProject, projects } from "@/data/projects";

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return {
      title: "Project Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonicalPath = `/work/${project.slug}`;

  return {
    title: `${project.name} Case Study`,
    description: project.description,

    alternates: {
      canonical: canonicalPath,
    },

    openGraph: {
      type: "website",
      url: canonicalPath,
      siteName: "A. Halliwell Studio",
      title: `${project.name} Case Study | A. Halliwell Studio`,
      description: project.description,
    },

    twitter: {
      card: "summary_large_image",
      title: `${project.name} Case Study | A. Halliwell Studio`,
      description: project.description,
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return <main className="case-page">
    <div className="site-background" aria-hidden="true" />
    <header className="case-nav shell"><Link href="/#work">← Selected work</Link><Link className="logo" href="/"><span className="logo-mark">A.</span><span>HALLIWELL</span></Link><a href={project.url} target="_blank" rel="noreferrer">Live site ↗</a></header>
    <article className={`case-sheet project-${project.tone}`}>
      <div className="case-hero">
        <div className="case-index"><span>PROJECT {project.number}</span><span>{project.category}</span></div>
        <h1>{project.name}</h1>
        <p>{project.description}</p>
      </div>
      <ProjectMedia desktop={project.desktopAsset} mobile={project.mobileAsset} name={project.name}/>
      <div className="case-story">
        <section><small>THE BRIEF</small><h2>Built around the business.</h2><p>{project.brief}</p></section>
        <section><small>THE APPROACH</small><div className="case-approach">{project.approach.map((item, i)=><div key={item}><span>0{i+1}</span><strong>{item}</strong></div>)}</div></section>
        <section className="case-capabilities"><small>CAPABILITIES</small><div>{project.details.map(item=><span key={item}>{item}</span>)}</div></section>
      </div>
      <div className="case-end"><Image src="/flower-icon.png" alt="" width={70} height={70}/><h2>See it in the wild.</h2><a className="button button-primary" href={project.url} target="_blank" rel="noreferrer">Visit {project.name} ↗</a></div>
    </article>
  </main>;
}
