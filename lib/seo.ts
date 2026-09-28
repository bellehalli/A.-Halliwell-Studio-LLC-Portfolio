import type { Metadata } from "next";

const studioName = "A. Halliwell Studio";
const image = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "A. Halliwell Studio — websites that actually do things",
};

export function socialMetadata(path: string, title: string, description: string): Metadata {
  const fullTitle = `${title} | ${studioName}`;
  return {
    openGraph: {
      type: "website",
      siteName: studioName,
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
