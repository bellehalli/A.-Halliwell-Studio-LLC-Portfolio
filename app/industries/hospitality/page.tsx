import type { Metadata } from "next";
import SeoLandingPage from "@/components/seo/SeoLandingPage";
import { pageMetadata } from "@/lib/seo";
import { serviceSchema } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  path: "/industries/hospitality",
  title: "Hospitality Web Design & Digital Guest Experiences",
  description: "Custom hospitality website design and interactive digital experiences for venues, estates and experience-driven hospitality businesses.",
});

export default function Page() {
  return <SeoLandingPage
    eyebrow="HOSPITALITY WEB DESIGN + DIGITAL GUEST EXPERIENCES"
    title="Build the experience before the guest arrives."
    intro="Hospitality websites have to communicate atmosphere and logistics at the same time. A. Halliwell Studio designs digital experiences that help guests understand the place, imagine themselves there and move toward booking or inquiry."
    sections={[
      { eyebrow: "01 / EXPERIENCE", title: "Translate the feeling into a usable website.", body: "Art direction creates desire while clear structure helps visitors understand the actual offer." },
{ eyebrow: "02 / PROPERTY EXPLORATION", title: "Help people understand the place.", body: "Maps, space guides, itineraries and interactive property experiences can make physical environments easier to explore online." },
{ eyebrow: "03 / BOOKING + INQUIRY", title: "Design around intent.", body: "The path to reserve, inquire or schedule a tour should feel like a natural continuation of the experience." },
{ eyebrow: "04 / GUEST INFORMATION", title: "Answer the questions that block action.", body: "Location, capacity, accommodations, amenities, schedules and planning details should be easy to find when they matter." }
    ]}
    proofLinks={[
      { href: "/work/willow-lily", label: "Explore Willow Lily" },
{ href: "/work/maison-riviere", label: "Explore Maison Rivi\u00e8re" },
{ href: "/interactive-experiences", label: "Interactive digital experiences" }
    ]}
    schema={serviceSchema({
      name: "Hospitality Web Design & Digital Guest Experiences",
      description: "Custom hospitality website design and interactive digital experiences for venues, estates and experience-driven hospitality businesses.",
      path: "/industries/hospitality",
    })}
  />;
}
