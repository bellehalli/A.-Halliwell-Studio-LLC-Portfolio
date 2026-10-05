import type { Metadata } from "next";
import SeoLandingPage from "@/components/seo/SeoLandingPage";
import { pageMetadata } from "@/lib/seo";
import { serviceSchema } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  path: "/industries/wedding-venues",
  title: "Wedding Venue Website Design & Interactive Venue Experiences",
  description: "Custom wedding venue website design, interactive property maps and inquiry experiences that help couples understand the venue and move confidently toward a tour.",
});

export default function Page() {
  return <SeoLandingPage
    eyebrow="WEDDING VENUE WEB DESIGN + DIGITAL EXPERIENCES"
    title="Wedding venue websites should help couples picture the day."
    intro="Couples are not only looking for pretty photographs. They are trying to understand capacity, spaces, ceremony options, guest flow, accommodations, pricing context and whether the venue feels right before they inquire."
    sections={[
      { eyebrow: "01 / PROPERTY STORY", title: "Make the venue understandable.", body: "Connect photography, property information, spaces and the overall experience so couples can understand how a wedding actually unfolds." },
{ eyebrow: "02 / INTERACTIVE MAPS", title: "Let couples explore before the tour.", body: "Interactive property experiences can reveal ceremony locations, reception spaces, guest counts, parking, overnight stays and other planning information." },
{ eyebrow: "03 / INVESTMENT CLARITY", title: "Reduce avoidable inquiry friction.", body: "Clear inclusions, starting investment and meaningful package context help qualified couples understand fit without turning the site into a spreadsheet." },
{ eyebrow: "04 / TOUR + INQUIRY PATH", title: "Make the next step feel like progress.", body: "The inquiry experience should preserve useful context and clearly explain what happens after a couple reaches out." }
    ]}
    proofLinks={[
      { href: "/work/willow-lily", label: "Willow Lily hospitality case study" },
{ href: "/work/maison-riviere", label: "Maison Rivi\u00e8re venue case study" },
{ href: "/resources/wedding-venue-website", label: "Wedding venue website guide" }
    ]}
    schema={serviceSchema({
      name: "Wedding Venue Website Design & Interactive Venue Experiences",
      description: "Custom wedding venue website design, interactive property maps and inquiry experiences that help couples understand the venue and move confidently toward a tour.",
      path: "/industries/wedding-venues",
    })}
  />;
}
