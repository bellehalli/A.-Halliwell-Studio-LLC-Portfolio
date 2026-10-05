import type { Metadata } from "next";
import SeoLandingPage from "@/components/seo/SeoLandingPage";
import { pageMetadata } from "@/lib/seo";
import { serviceSchema } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  path: "/detroit-web-design",
  title: "Detroit Web Design & Custom Website Development",
  description: "Detroit web design and custom website development from A. Halliwell Studio, an independent Detroit studio building custom websites and interactive digital experiences.",
});

export default function Page() {
  return <SeoLandingPage
    eyebrow="DETROIT WEB DESIGN + DEVELOPMENT"
    title="Detroit web design with a bigger point of view."
    intro="A. Halliwell Studio is an independent Detroit web design and development studio creating custom websites, interactive digital experiences and business-specific systems. Local businesses get the advantage of a nearby creative partner without being pushed into a cookie-cutter local-business website."
    sections={[
      { eyebrow: "01 / DETROIT BASED", title: "A local studio with worldwide capability.", body: "A. Halliwell Studio is based in Detroit, Michigan and works across location when the project is a strong fit." },
{ eyebrow: "02 / STRATEGY", title: "Design around how people decide.", body: "The website structure begins with what customers need to understand, where they hesitate and what action the business needs them to take." },
{ eyebrow: "03 / CUSTOM DESIGN + CODE", title: "Skip the interchangeable template.", body: "Distinct art direction and custom development create an experience that belongs to the business rather than the platform." },
{ eyebrow: "04 / DIGITAL SYSTEMS", title: "Let the website do more.", body: "Interactive maps, planners, booking flows, quote tools, portals and integrations can turn the site into part of the operation." }
    ]}
    proofLinks={[
      { href: "/michigan-web-design", label: "Michigan web design" },
{ href: "/work", label: "Selected work" },
{ href: "/services", label: "View services" }
    ]}
    schema={serviceSchema({
      name: "Detroit Web Design & Custom Website Development",
      description: "Detroit web design and custom website development from A. Halliwell Studio, an independent Detroit studio building custom websites and interactive digital experiences.",
      path: "/detroit-web-design",
      areaServed: "Detroit, Michigan",
    })}
  />;
}
