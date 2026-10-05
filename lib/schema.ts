import { SITE_URL, STUDIO_NAME } from "@/lib/seo";

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: STUDIO_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.svg`,
  description:
    "Independent web design and development studio creating custom websites, interactive digital experiences and digital systems for experience-driven businesses.",
  founder: {
    "@type": "Person",
    name: "Arabella Payton-Halliwell",
    jobTitle: "Founder & Creative Developer",
  },
  areaServed: [
    { "@type": "State", name: "Michigan" },
    { "@type": "Country", name: "United States" },
    "Worldwide",
  ],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: STUDIO_NAME,
  publisher: { "@id": `${SITE_URL}/#organization` },
};

export function serviceSchema({
  name,
  description,
  path,
  areaServed = "Worldwide",
}: {
  name: string;
  description: string;
  path: string;
  areaServed?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: `${SITE_URL}${path}`,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed,
  };
}

export function articleSchema({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    mainEntityOfPage: `${SITE_URL}${path}`,
    author: {
      "@type": "Person",
      name: "Arabella Payton-Halliwell",
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}
