"use client";

import { ArrowUpRight } from "@/components/ui/StudioIcons";
import { useEffect, useState } from "react";
import WillowPreview from "@/components/projects/WillowPreview";

export default function ResponsivePreview({ url, title, willow = false }: { url: string; title: string; willow?: boolean }) {
  const [mobile, setMobile] = useState<boolean | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 700px)");
    const update = () => setMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  if (mobile === null || (mobile && !loaded)) {
    return <div className="project-preview-facade">
      <span>INTERACTIVE WEBSITE PREVIEW</span>
      {mobile === null ? <p>Loading preview options…</p> : <button type="button" onClick={() => setLoaded(true)}>Load interactive preview <ArrowUpRight /></button>}
      <a href={url} target={url.startsWith("http") ? "_blank" : undefined} rel={url.startsWith("http") ? "noopener noreferrer" : undefined}>Open full site <ArrowUpRight /></a>
    </div>;
  }

  return willow ? <WillowPreview url={url} /> : <iframe src={url} title={title} loading="lazy" />;
}
