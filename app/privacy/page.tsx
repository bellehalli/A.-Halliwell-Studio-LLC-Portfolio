import { socialMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How A. Halliwell Studio uses project inquiries and website analytics.",
  alternates: { canonical: "/privacy" },
  ...socialMetadata("/privacy", "Privacy Policy", "How A. Halliwell Studio uses project inquiries and website analytics."),
};

export default function Privacy(){return <main className="legal-page"><h1>Privacy Policy</h1><p>A. Halliwell Studio uses the information submitted through project inquiries to respond, prepare proposals, and provide services. Inquiry details are sent to the studio by email; a confirmation may also be sent to the address you provide.</p><p>The site uses Vercel Web Analytics to understand page visits and broad interactions such as work views, project starts, email clicks, Lab selections, and completed forms. Custom analytics events do not include the contents of your inquiry or your contact details.</p><p>We do not sell personal information. For privacy questions, email <a href="mailto:hello@ahalliwellstudio.com">hello@ahalliwellstudio.com</a>.</p></main>}
