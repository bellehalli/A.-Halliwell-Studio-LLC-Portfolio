import type { Metadata } from "next";

export const SITE_URL = "https://www.ahalliwellstudio.com";
export const STUDIO_NAME = "A. Halliwell Studio";
export const DEFAULT_OG_IMAGE = "/og-image.png";

const image = {
  url: DEFAULT_OG_IMAGE,
  width: 1200,
  height: 630,
  alt: "A. Halliwell Studio — custom web design, development and digital systems",
};

export function socialMetadata(path: string, title: string, description: string): Metadata {
  const fullTitle = `${title} | ${STUDIO_NAME}`;
  return {
    openGraph: {
      type: "website",
      siteName: STUDIO_NAME,
      url: path,
      title: fullTitle,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image.url],
    },
  };
}

export function pageMetadata({
  path,
  title,
  description,
}: {
  path: string;
  title: string;
  description: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    ...socialMetadata(path, title, description),
  };
}
