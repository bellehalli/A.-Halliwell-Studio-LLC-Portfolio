"use client";

import { useEffect, useState } from "react";
import ProjectMedia from "@/components/ProjectMedia";
import type { Project } from "@/data/projects";

export default function VenueMedia({ project }: { project: Project }) {
  const [previewFallback, setPreviewFallback] = useState(false);

  useEffect(() => {
    setPreviewFallback(project.tone === "willow" && window.location.hostname.endsWith(".vercel.app"));
  }, [project.tone]);

  return <ProjectMedia project={project} previewFallback={previewFallback} />;
}
