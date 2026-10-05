import type { Metadata } from "next";
import SeoLandingPage from "@/components/seo/SeoLandingPage";
import { pageMetadata } from "@/lib/seo";
import { serviceSchema } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  path: "/web-development",
  title: "Custom Web Development & Interactive Websites",
  description: "Custom web development for responsive websites, interactive tools, booking flows, portals, integrations and business-specific digital systems.",
});

export default function Page() {
  return <SeoLandingPage
    eyebrow="CUSTOM WEB DEVELOPMENT · FRONT-END + INTERACTIVE SYSTEMS"
    title="Development for websites with a real job to do."
    intro="A. Halliwell Studio develops custom web experiences that go beyond static pages, from responsive marketing sites to interactive maps, planning tools, portals, booking flows and business-specific systems."
    sections={[
      { eyebrow: "01 / FRONT-END DEVELOPMENT", title: "Build the interface intentionally.", body: "Responsive interfaces are developed with modern web technologies and structured around performance, accessibility and maintainability." },
{ eyebrow: "02 / INTERACTIVE FEATURES", title: "Make the site participate.", body: "Interactive maps, filters, builders, calculators, personalized journeys and custom components turn passive browsing into useful action." },
{ eyebrow: "03 / INTEGRATIONS", title: "Connect the experience to the business.", body: "Payments, email, forms, APIs, databases and third-party services can be integrated when the project needs them." },
{ eyebrow: "04 / SYSTEM THINKING", title: "Build what the workflow actually needs.", body: "The technology follows the business problem. Complexity is added only when it earns its place." }
    ]}
    proofLinks={[
      { href: "/lab", label: "Use the interactive Lab" },
{ href: "/work", label: "Explore case studies" },
{ href: "/services", label: "View all services" }
    ]}
    schema={serviceSchema({
      name: "Custom Web Development & Interactive Websites",
      description: "Custom web development for responsive websites, interactive tools, booking flows, portals, integrations and business-specific digital systems.",
      path: "/web-development",
    })}
  />;
}
