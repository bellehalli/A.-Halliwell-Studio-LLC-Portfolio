import type { Metadata } from "next";
import SeoLandingPage from "@/components/seo/SeoLandingPage";
import { pageMetadata } from "@/lib/seo";
import { serviceSchema } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  path: "/web-design",
  title: "Custom Web Design for Experience-Driven Businesses",
  description: "Custom web design by A. Halliwell Studio for businesses worldwide that need strategy, distinctive visual direction and a customer journey built beyond the template.",
});

export default function Page() {
  return <SeoLandingPage
    theme="design"
    lead="A website should feel like your brand and make the next step obvious."
    outcomes={["Distinctive visual direction, not a recycled theme","Thoughtful layouts for desktop, tablet and mobile","Clear service pages, navigation and inquiry journeys","Design that makes the business easier to understand"]}
    pricingNote="One-page launches start at $1,200. Websites up to three pages start at $2,500; up to five pages at $5,000; and six or more pages at $7,000. Final pricing depends on scope."
    eyebrow="CUSTOM WEB DESIGN · WORKING WORLDWIDE"
    title="Custom web design built around the decision."
    intro="A beautiful website is only useful when people can understand the business, trust the offer and know what to do next. A. Halliwell Studio designs custom websites around that entire journey for businesses worldwide. Remote collaboration brings the studio to your project wherever you are based."
    sections={[
      { eyebrow: "01 / STRATEGY", title: "Before the visuals, define the job.", body: "We start with the business goal, customer questions, decision points and friction. That gives every page, interaction and call to action a reason to exist." },
{ eyebrow: "02 / EXPERIENCE DESIGN", title: "Make complicated things feel easy.", body: "Information architecture, page hierarchy, navigation and responsive behavior are shaped around how a real person explores the offer." },
{ eyebrow: "03 / ART DIRECTION", title: "Look like yourself, not your template.", body: "Custom visual systems create a distinct digital world without sacrificing usability, accessibility or clarity." },
{ eyebrow: "04 / CONVERSION", title: "Design the next step into the experience.", body: "Inquiry, booking, purchasing and consultation paths are considered from the beginning rather than added after the design is finished." }
    ]}
    proofLinks={[
      { href: "/work", label: "Explore selected work" },
{ href: "/lab", label: "Try the interactive Lab" },
{ href: "/services", label: "View all services" }
    ]}
    schema={serviceSchema({
      name: "Custom Web Design for Experience-Driven Businesses",
      description: "Custom web design by A. Halliwell Studio for businesses worldwide that need strategy, distinctive visual direction and a customer journey built beyond the template.",
      path: "/web-design",
    })}
  />;
}
