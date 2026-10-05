import type { Metadata } from "next";
import "./globals.css";
import "./credibility.css";
import "./reposition.css";
import "./final-pass.css";
import "./visual-polish.css";
import "./home-world.css";
import "./editorial-type.css";
import "./lab-refinement.css";
import "./work-refinement.css";
import "./case-study-world.css";
import "./destination-world.css";
import "./destination-finish.css";
import "./conversion-polish.css";
import "./production-polish.css";
import "./studio-commercial.css";
import "./lab-experiments.css";
import SiteFooter from "@/components/navigation/SiteFooter";
import SiteAnalytics from "@/components/system/SiteAnalytics";
import SkipToContent from "@/components/navigation/SkipToContent";
import JsonLd from "@/components/seo/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/schema";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ahalliwellstudio.com"),
  icons: { icon: "/favicon.svg" },
  title: {
    default: "A. Halliwell Studio | Custom Web Design, Development & Digital Experiences",
    template: "%s | A. Halliwell Studio",
  },
  description:
    "A. Halliwell Studio creates custom websites, interactive digital experiences and digital systems for businesses worldwide. Custom web design and development, wherever you are based.",
  applicationName: "A. Halliwell Studio",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "A. Halliwell Studio",
    title: "A. Halliwell Studio | Custom Web Design, Development & Digital Experiences",
    description:
      "Custom websites, interactive experiences and digital systems for businesses worldwide, built around what your business needs the internet to do.",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "A. Halliwell Studio — custom web design, development and digital systems",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "A. Halliwell Studio | Custom Web Design, Development & Digital Experiences",
    description:
      "Custom websites, interactive experiences and digital systems for experience-driven businesses worldwide.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <JsonLd data={[organizationSchema, websiteSchema]} />
        <SkipToContent />
        {children}
        <SiteFooter />
        <SiteAnalytics />
      </body>
    </html>
  );
}
