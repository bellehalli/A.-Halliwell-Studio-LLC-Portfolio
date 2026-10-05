import type { Metadata } from "next";
import SeoLandingPage from "@/components/seo/SeoLandingPage";
import { pageMetadata } from "@/lib/seo";
import { serviceSchema } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  path: "/industries/med-spas",
  title: "Med Spa Web Design & Patient Conversion Experiences",
  description: "Custom med spa website design and interactive patient experiences that organize treatments around concerns, education, trust and consultation.",
});

export default function Page() {
  return <SeoLandingPage
    eyebrow="MED SPA WEB DESIGN + INTERACTIVE PATIENT EXPERIENCES"
    title="Help patients choose with confidence, not guesswork."
    intro="Med spa websites often ask visitors to choose treatments before they fully understand what those treatments are for. A better experience starts with concerns, goals, education and a clear consultation path."
    sections={[
      { eyebrow: "01 / SERVICE ARCHITECTURE", title: "Organize around patient questions.", body: "Structure treatments and concerns so visitors can understand options without decoding an overwhelming service menu." },
{ eyebrow: "02 / EDUCATION", title: "Make expertise easier to understand.", body: "Clear treatment information can explain purpose, candidacy, sequencing and what belongs in a professional consultation." },
{ eyebrow: "03 / INTERACTIVE GUIDANCE", title: "Turn curiosity into a useful path.", body: "Concern-led tools and visual selectors can help visitors explore relevant information without pretending to diagnose or prescribe." },
{ eyebrow: "04 / CONSULTATION", title: "Create a confident next step.", body: "Strong qualification and consultation flows reduce friction while preserving the role of the licensed provider." }
    ]}
    proofLinks={[
      { href: "/work/elan-aesthetics", label: "Explore \u00c9lan Aesthetics" },
{ href: "/lab", label: "Try the Lab" },
{ href: "/web-design", label: "Custom web design" }
    ]}
    schema={serviceSchema({
      name: "Med Spa Web Design & Patient Conversion Experiences",
      description: "Custom med spa website design and interactive patient experiences that organize treatments around concerns, education, trust and consultation.",
      path: "/industries/med-spas",
    })}
  />;
}
