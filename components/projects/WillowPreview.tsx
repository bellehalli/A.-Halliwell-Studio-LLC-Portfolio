"use client";

import { useEffect, useState } from "react";

const tour = [
  "/case-studies/willow-lily/willow-lily-desktop-hero-entry-screen.jpg",
  "/case-studies/willow-lily/willow-lily-desktop-digital-tour-map.jpg",
  "/case-studies/willow-lily/willow-lily-mobile-homepage-hero.jpg",
  "/case-studies/willow-lily/willow-lily-desktop-availability-widget.jpg",
  "/case-studies/willow-lily/willow-lily-mobile-wedding-builder-start.jpg",
];

export default function WillowPreview({ url }: { url: string }) {
  const [canEmbed, setCanEmbed] = useState(false);

  useEffect(() => {
    // Willow Lily permits the studio's public domain as a frame ancestor.
    setCanEmbed(["ahalliwellstudio.com", "www.ahalliwellstudio.com"].includes(window.location.hostname));
  }, []);

  return canEmbed ? <iframe src={url} title="Explore the Willow Lily live website" loading="lazy" /> : <div className="project-preview-scroll" role="region" tabIndex={0} aria-label="Scroll through the Willow Lily website tour">
    {tour.map((src, index) => <img key={src} src={src} alt={`Willow Lily website view ${index + 1}`} loading={index ? "lazy" : "eager"} />)}
  </div>;
}
