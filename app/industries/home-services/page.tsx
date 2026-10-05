import type { Metadata } from "next";
import SeoLandingPage from "@/components/seo/SeoLandingPage";
import { pageMetadata } from "@/lib/seo";
import { serviceSchema } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  path: "/industries/home-services",
  title: "Home Service Web Design & Lead Generation Systems",
  description: "Custom home service website design and digital systems that help homeowners understand services, build trust and request the right next step.",
});

export default function Page() {
  return <SeoLandingPage
    eyebrow="HOME SERVICE WEB DESIGN + DIGITAL SYSTEMS"
    title="Make it easy to understand what happens next."
    intro="Home service customers often arrive with urgency and uncertainty. The website should quickly establish fit, service area, expertise and the clearest path to request help."
    sections={[
      { eyebrow: "01 / SERVICE CLARITY", title: "Answer the immediate question.", body: "Organize services around the problems homeowners recognize, then connect them to the right solution and next step." },
{ eyebrow: "02 / LOCAL TRUST", title: "Make credibility visible.", body: "Service areas, process, expertise and useful information should be easy to understand without relying on generic claims." },
{ eyebrow: "03 / LEAD QUALIFICATION", title: "Collect useful context.", body: "Thoughtful forms and tools can capture the information the business actually needs before follow-up." },
{ eyebrow: "04 / DIGITAL SYSTEMS", title: "Reduce repetitive work.", body: "Quote tools, scheduling flows, service selectors and integrations can make the website useful to the team as well as the customer." }
    ]}
    proofLinks={[
      { href: "/work/northstar-heating-home", label: "Explore Northstar Heating & Home" },
{ href: "/web-development", label: "Custom web development" },
{ href: "/services", label: "View services" }
    ]}
    schema={serviceSchema({
      name: "Home Service Web Design & Lead Generation Systems",
      description: "Custom home service website design and digital systems that help homeowners understand services, build trust and request the right next step.",
      path: "/industries/home-services",
    })}
  />;
}
