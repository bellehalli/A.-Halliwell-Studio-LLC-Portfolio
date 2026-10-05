import type { MetadataRoute } from "next";
import { publicProjects } from "@/data/projects";

const baseUrl = "https://www.ahalliwellstudio.com";

const coreRoutes = [
  { path: "", priority: 1, changeFrequency: "weekly" as const },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/web-design", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/web-development", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/interactive-experiences", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/michigan-web-design", priority: 0.85, changeFrequency: "monthly" as const },
  { path: "/detroit-web-design", priority: 0.85, changeFrequency: "monthly" as const },
  { path: "/industries/wedding-venues", priority: 0.85, changeFrequency: "monthly" as const },
  { path: "/industries/hospitality", priority: 0.85, changeFrequency: "monthly" as const },
  { path: "/industries/med-spas", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/industries/nightlife", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/industries/home-services", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/work", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/studio", priority: 0.75, changeFrequency: "monthly" as const },
  { path: "/lab", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/resources", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/resources/wedding-venue-website", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/resources/website-redesign-checklist", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/start", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/cookies", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/accessibility", priority: 0.2, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...coreRoutes.map(route => ({
      url: `${baseUrl}${route.path}`,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...publicProjects.map(project => ({
      url: `${baseUrl}/work/${project.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
  ];
}
