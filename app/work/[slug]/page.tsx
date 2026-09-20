import { notFound } from "next/navigation";
import Link from "next/link";
import { getProject, projects } from "@/data/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <main>
      <h1>{project.name}</h1>
      <p>{project.description}</p>
      {[
        ["Context", project.context],
        ["Problem", project.problem],
        ["Verified Result", project.verifiedResult],
        ["Next Action", project.nextAction],
      ].map(([title, value]) => (
        <section key={title}>
          <h2>{title}</h2>
          <p>{value}</p>
        </section>
      ))}
      <Link href="/work">Back to work</Link>
    </main>
  );
}
