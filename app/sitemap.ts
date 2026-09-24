import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";

const baseUrl = "https://www.ahalliwellstudio.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/work",
    "/services",
    "/studio",
    "/lab",
    "/resources",
    "/resources/wedding-venue-website",
    "/resources/website-redesign-checklist",
    "/start",
    "/concepts/restaurant",
    "/concepts/commerce",
  ];

  return [
    ...routes.map((path, index) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: (index === 0 ? "weekly" : "monthly") as "weekly" | "monthly",
      priority:
        index === 0
          ? 1
          : path.startsWith("/work/")
            ? 0.9
            : path.startsWith("/resources/")
              ? 0.7
              : path.startsWith("/concepts/")
                ? 0.7
                : 0.8,
    })),
    ...projects.map((project) => ({
      url: `${baseUrl}/work/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
