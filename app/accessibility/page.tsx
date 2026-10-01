import { studio } from "@/lib/studio-config";
import { socialMetadata } from "@/lib/seo";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Accessibility",
  description: "Accessibility information and feedback for A. Halliwell Studio.",
  alternates: { canonical: "/accessibility" },
  ...socialMetadata("/accessibility", "Accessibility", "Accessibility information and feedback for A. Halliwell Studio."),
};
export default function Accessibility() {
  return <main className="legal-page">
    <h1>Accessibility Statement</h1>
    <p className="legal-updated">Updated September 29, 2026</p>
    <p>A. Halliwell Studio aims to make this website usable with a keyboard, assistive technology, and different screen sizes. The site includes visible focus states, text alternatives for meaningful images, and a reduced-motion option that follows your device preference. We continue to review the site against WCAG 2.2 Level AA guidance; this statement does not claim full conformance.</p>
    <h2>Known limitations</h2>
    <p>Some embedded demonstrations open websites outside this studio site. Their accessibility can vary. If an interaction, image, form, or embedded preview blocks you, we can provide the information or help you complete a project inquiry by email.</p>
    <h2>Report a barrier</h2>
    <p>Email <a href={`mailto:${studio.email}?subject=Accessibility%20feedback`}>{studio.email}</a> with the page address, what you were trying to do, and any assistive technology or device details you want to share. You can also use that address to request an alternative way to access content or contact the studio.</p>
  </main>;
}
