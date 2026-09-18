import type { MetadataRoute } from "next";

const baseUrl = "https://ahalliwellstudio.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/portal/", "/admin/", "/dashboard/", "/checkout/", "/onboarding/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
