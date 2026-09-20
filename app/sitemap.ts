import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { resources } from "@/data/resources";
const baseUrl = "https://ahalliwellstudio.com";
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/work", "/services", "/studio", "/lab", "/resources", "/newsletter", "/start"];
  return [
    ...staticRoutes.map((path, index) => ({ url: `${baseUrl}${path}`, lastModified: new Date(), changeFrequency: (index === 0 ? "weekly" : "monthly") as "weekly" | "monthly", priority: index === 0 ? 1 : .8 })),
    ...projects.map(project => ({ url: `${baseUrl}/work/${project.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: .9 })),
    ...Object.keys(resources).map(slug => ({ url: `${baseUrl}/resources/${slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: .7 }))
  ];
}
