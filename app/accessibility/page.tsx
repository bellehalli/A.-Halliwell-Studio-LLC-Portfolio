import { socialMetadata } from "@/lib/seo";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Accessibility",
  description: "A. Halliwell Studio accessibility statement and contact information.",
  alternates: { canonical: "/accessibility" },
  ...socialMetadata("/accessibility", "Accessibility", "A. Halliwell Studio accessibility statement and contact information."),
};
export default function Accessibility(){return <main className="legal-page"><h1>Accessibility Statement</h1><p>A. Halliwell Studio aims to create digital experiences that are usable and accessible. If you encounter an accessibility barrier, please contact <a href="mailto:hello@ahalliwellstudio.com">hello@ahalliwellstudio.com</a> so improvements can be made.</p></main>}
