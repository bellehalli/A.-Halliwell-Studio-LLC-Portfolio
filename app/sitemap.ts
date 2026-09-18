import type { MetadataRoute } from "next";

const baseUrl = "https://ahalliwellstudio.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/work`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/work/willow-lily`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/work/maison-riviere`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];
}
