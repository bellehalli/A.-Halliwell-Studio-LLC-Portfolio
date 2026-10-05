import type { Metadata } from "next";
import SeoLandingPage from "@/components/seo/SeoLandingPage";
import { pageMetadata } from "@/lib/seo";
import { serviceSchema } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  path: "/industries/nightlife",
  title: "Nightlife & Hospitality Website Design",
  description: "Custom nightlife website design and interactive digital experiences for venues, lounges and entertainment concepts built around discovery, events and revenue.",
});

export default function Page() {
  return <SeoLandingPage
    eyebrow="NIGHTLIFE WEB DESIGN + INTERACTIVE EXPERIENCES"
    title="Make the night feel like it starts on the website."
    intro="Nightlife websites can do more than list hours and post flyers. They can help guests understand the atmosphere, discover events, choose how they want to spend the night and move toward tickets, tables or reservations."
    sections={[
      { eyebrow: "01 / BRAND EXPERIENCE", title: "Translate energy into interaction.", body: "Motion, art direction and responsive design can make the digital experience feel connected to the venue itself." },
{ eyebrow: "02 / EVENT DISCOVERY", title: "Make what is happening easy to find.", body: "Event systems should help visitors understand dates, formats, talent and the action they can take next." },
{ eyebrow: "03 / REVENUE PATHS", title: "Connect attention to action.", body: "Tickets, reservations, VIP tables and inquiries should be integrated into the journey instead of hidden behind generic buttons." },
{ eyebrow: "04 / PERSONALIZATION", title: "Help guests build their night.", body: "Interactive planning can turn mood, party size, timing and preferences into a more useful path through the offer." }
    ]}
    proofLinks={[
      { href: "/work/vanta-social", label: "Explore Vanta Social" },
{ href: "/lab", label: "Try the Lab" },
{ href: "/interactive-experiences", label: "Interactive digital experiences" }
    ]}
    schema={serviceSchema({
      name: "Nightlife & Hospitality Website Design",
      description: "Custom nightlife website design and interactive digital experiences for venues, lounges and entertainment concepts built around discovery, events and revenue.",
      path: "/industries/nightlife",
    })}
  />;
}
