import { socialMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How A. Halliwell Studio handles project inquiries, browser storage, and website analytics.",
  alternates: { canonical: "/privacy" },
  ...socialMetadata("/privacy", "Privacy Policy", "How A. Halliwell Studio handles project inquiries, browser storage, and website analytics."),
};

export default function Privacy() {
  return <main className="legal-page">
    <h1>Privacy Policy</h1>
    <p className="legal-updated">Updated September 29, 2026</p>
    <p>This policy describes the information handled by ahalliwellstudio.com. For questions or requests about your information, email <a href="mailto:hello@ahalliwellstudio.com">hello@ahalliwellstudio.com</a>.</p>
    <h2>Project inquiries</h2>
    <p>When you submit the Start Project form, the studio receives the name, email address, business details, website URL, goals, and other answers you choose to provide. We use these details to review your project, reply, prepare a proposal, and communicate about potential or agreed services. A confirmation email may be sent to your address. The form uses Resend to deliver these emails. Do not include passwords, payment card details, or other sensitive information in an inquiry.</p>
    <p>While you fill out the form, a draft is saved in your browser on that device. It is removed after a successful submission. You can remove it sooner by clearing this site&apos;s browser storage. See <a href="/cookies">Cookies &amp; storage</a> for details.</p>
    <h2>Analytics</h2>
    <p>Vercel Web Analytics helps us understand page visits and broad actions, including work views, project-start clicks, email-link clicks, Lab selections, and form completion. Custom events do not include inquiry contents, names, or email addresses. Vercel Web Analytics does not use analytics cookies.</p>
    <h2>Private fax desk</h2>
    <p>The private fax desk uses short-lived sign-in cookies and the Telnyx fax service. Fax details and files are handled only for sending, receiving, and checking fax delivery. The private desk is not part of the public project inquiry flow.</p>
    <h2>Sharing and requests</h2>
    <p>Information is handled by the studio and the providers needed to operate the site and deliver its services, including Vercel, Resend, and Telnyx for fax functions. We do not sell personal information. To request access to or deletion of information you submitted, contact the email above. Some records may need to be retained for project or legal obligations.</p>
  </main>;
}
