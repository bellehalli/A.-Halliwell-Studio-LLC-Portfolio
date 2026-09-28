"use client";

import { useState } from "react";
import Link from "next/link";
import ProjectMedia from "@/components/ProjectMedia";
import type { Project } from "@/data/projects";

const filters = ["All", "Hospitality", "Wellness", "Service", "Commerce", "Experiments"] as const;
type Filter = typeof filters[number];

function matches(project: Project, filter: Filter) {
  if (filter === "All") return true;
  if (filter === "Experiments") return Boolean(project.inDevelopment);
  if (filter === "Hospitality") return ["willow", "maison", "vanta", "restaurant"].includes(project.tone);
  if (filter === "Wellness") return project.tone === "elan";
  if (filter === "Service") return project.tone === "northstar";
  return project.tone === "commerce";
}

export default function WorkIndex({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("All");
  const visible = projects.filter(project => matches(project, filter));

  return <>
    <div className="work-filters" role="group" aria-label="Filter projects">
      {filters.map(option => <button key={option} type="button" aria-pressed={filter === option} onClick={() => setFilter(option)}>{option}</button>)}
    </div>
    <p className="work-filter-count" role="status">Showing {visible.length} {visible.length === 1 ? "project" : "projects"}</p>
    <div className="case-story">
      {visible.map(project => <article key={project.slug} className="work-index-project">
        <small>PROJECT {project.number} / {project.category}</small>
        <h2>{project.name}</h2>
        <p>{project.description}</p>
        {!project.inDevelopment && <div className="work-index-context">
          <p><span>Business problem</span>{project.challenge}</p>
          <p><span>Experience built</span>{project.approach.slice(0, 3).join(" · ")}</p>
          <p><span>Deliverables</span>{project.details.join(" · ")}</p>
        </div>}
        <ProjectMedia project={project} />
        {project.inDevelopment ? <p className="work-index-pending">Coming soon · The full case file and site are in development.</p> : <div className="case-actions">
          <Link className="button button-primary" href={`/work/${project.slug}`}>View case study ↗</Link>
          <a className="button" href={project.url} target={project.url.startsWith("http") ? "_blank" : undefined} rel={project.url.startsWith("http") ? "noopener noreferrer" : undefined}>Visit live build ↗</a>
        </div>}
      </article>)}
    </div>
  </>;
}
