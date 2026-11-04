"use client";

import { ArrowUpRight } from "@/components/ui/StudioIcons";
import { useEffect, useState } from "react";
import WillowPreview from "@/components/projects/WillowPreview";

export default function ResponsivePreview({ url, title, willow = false, mobileTour = false, screenshots = [] }: { url: string; title: string; willow?: boolean; mobileTour?: boolean; screenshots?: string[] }) {
  const [mobile, setMobile] = useState<boolean | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 700px)");
    const update = () => setMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  if (mobile && mobileTour && !loaded) {
    return <div className="project-mobile-tour" aria-label={`${title} mobile-friendly preview`}>
      <div className="project-mobile-tour-gallery" role="region" aria-label="Swipe to explore project screenshots" tabIndex={0}>
        {screenshots.map((src, index) => <figure key={src}><img src={src} alt={`${title}, project screen ${index + 1}`} loading="lazy" /><figcaption>{String(index + 1).padStart(2, "0")} / {title}</figcaption></figure>)}
      </div>
      <div className="project-mobile-tour-actions"><span>Swipe through the site</span><button type="button" onClick={() => setLoaded(true)}>Try live preview <ArrowUpRight /></button><a href={url} target="_blank" rel="noopener noreferrer">Open full site <ArrowUpRight /></a></div>
    </div>;
  }

  if (mobile === null || (mobile && !loaded)) {
    return <div className="project-preview-facade">
      <span>INTERACTIVE WEBSITE PREVIEW</span>
      {mobile === null ? <p>Loading preview options…</p> : <button type="button" onClick={() => setLoaded(true)}>Load interactive preview <ArrowUpRight /></button>}
      <a href={url} target={url.startsWith("http") ? "_blank" : undefined} rel={url.startsWith("http") ? "noopener noreferrer" : undefined}>Open full site <ArrowUpRight /></a>
    </div>;
  }

  return willow ? <WillowPreview url={url} /> : <iframe src={url} title={title} loading="lazy" />;
}
