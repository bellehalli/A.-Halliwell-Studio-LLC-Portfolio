import type { Metadata } from "next";
import SeoLandingPage from "@/components/seo/SeoLandingPage";
import { pageMetadata } from "@/lib/seo";
import { serviceSchema } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  path: "/interactive-experiences",
  title: "Interactive Digital Experiences & Custom Web Tools",
  description: "Interactive digital experiences, maps, planners, configurators and custom web tools for businesses worldwide that help customers explore, understand and act.",
});

export default function Page() {
  return <SeoLandingPage
    eyebrow="INTERACTIVE DIGITAL EXPERIENCES + CUSTOM WEB TOOLS"
    title="Give people something useful to do."
    intro="For businesses worldwide, A. Halliwell Studio creates interactive experiences that help customers explore a property, compare options, plan a visit, understand a service or build a personalized path. The goal is not interaction for its own sake. The interaction should make the decision easier."
    sections={[
      { eyebrow: "01 / INTERACTIVE MAPS", title: "Turn space into an experience.", body: "Property and venue maps can reveal spaces, layouts, guest counts, amenities and event journeys without forcing visitors to hunt through disconnected pages." },
{ eyebrow: "02 / GUIDED JOURNEYS", title: "Personalize the path.", body: "Question-led tools can translate needs, goals or preferences into relevant information and a clearer next step." },
{ eyebrow: "03 / CONFIGURATORS + PLANNERS", title: "Let customers explore possibilities.", body: "Builders and planners can make packages, schedules, services and options easier to understand before an inquiry." },
{ eyebrow: "04 / BUSINESS-SPECIFIC TOOLS", title: "Solve the weird little digital problem.", body: "If the business needs a tool that does not fit a standard website component, that is exactly where custom development becomes valuable." }
    ]}
    proofLinks={[
      { href: "/lab", label: "Try live capability experiments" },
{ href: "/work/willow-lily", label: "Explore Willow Lily" },
{ href: "/work/elan-aesthetics", label: "Explore \u00c9lan Aesthetics" }
    ]}
    schema={serviceSchema({
      name: "Interactive Digital Experiences & Custom Web Tools",
      description: "Interactive digital experiences, maps, planners, configurators and custom web tools for businesses worldwide that help customers explore, understand and act.",
      path: "/interactive-experiences",
    })}
  />;
}
