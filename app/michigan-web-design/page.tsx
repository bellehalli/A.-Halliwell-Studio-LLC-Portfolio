import type { Metadata } from "next";
import SeoLandingPage from "@/components/seo/SeoLandingPage";
import { pageMetadata } from "@/lib/seo";
import { serviceSchema } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  path: "/michigan-web-design",
  title: "Michigan Web Design & Custom Web Development",
  description: "Michigan web design and custom web development from A. Halliwell Studio, a Detroit-based independent studio creating websites, interactive experiences and digital systems.",
});

export default function Page() {
  return <SeoLandingPage
    eyebrow="MICHIGAN WEB DESIGN + DEVELOPMENT"
    title="Custom web design for Michigan businesses that need more than a template."
    intro="A. Halliwell Studio is a Detroit-based web design and development studio working with Michigan businesses and clients beyond the state. The work combines strategy, custom design, development and digital systems around what the business actually needs the website to accomplish."
    sections={[
      { eyebrow: "01 / MICHIGAN", title: "Local context without local limits.", body: "Being based in Michigan makes collaboration with Detroit-area and statewide businesses easy, while the studio remains built to work remotely with clients anywhere." },
{ eyebrow: "02 / CUSTOM WEB DESIGN", title: "Build around the business.", body: "Projects begin with the customer journey and business goal, not a preselected template or generic industry layout." },
{ eyebrow: "03 / DEVELOPMENT", title: "Go beyond brochure pages.", body: "Interactive tools, booking flows, maps, portals, integrations and custom features can be scoped when the business needs them." },
{ eyebrow: "04 / INDUSTRY RANGE", title: "Hospitality is a specialty, not a boundary.", body: "Current work explores hospitality, wedding venues, wellness, nightlife and home services, with room for the right problem in other industries." }
    ]}
    proofLinks={[
      { href: "/web-design", label: "Custom web design" },
{ href: "/work", label: "Selected work" },
{ href: "/studio", label: "Meet the studio" }
    ]}
    schema={serviceSchema({
      name: "Michigan Web Design & Custom Web Development",
      description: "Michigan web design and custom web development from A. Halliwell Studio, a Detroit-based independent studio creating websites, interactive experiences and digital systems.",
      path: "/michigan-web-design",
      areaServed: "Michigan",
    })}
  />;
}
