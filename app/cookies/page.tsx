import { socialMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookies & Storage",
  description: "How A. Halliwell Studio uses cookies and browser storage.",
  alternates: { canonical: "/cookies" },
  ...socialMetadata("/cookies", "Cookies & Storage", "How A. Halliwell Studio uses cookies and browser storage."),
};

export default function Cookies() {
  return <main className="legal-page">
    <h1>Cookies &amp; storage</h1>
    <p className="legal-updated">Updated September 29, 2026</p>
    <p>The public portfolio does not use advertising cookies. Vercel Web Analytics works without analytics cookies. The site uses browser storage for a few conveniences and essential cookies for private workspaces.</p>
    <h2>Browser storage</h2>
    <ul>
      <li><strong>Project inquiry draft:</strong> local storage saves your answers on this device while you fill out the form. It is removed after successful submission; you can clear site data in your browser sooner.</li>
      <li><strong>Opening and Lab:</strong> session storage remembers that you have seen the opening during this tab session and carries a Lab scope into the inquiry form. It is not used for advertising.</li>
    </ul>
    <h2>Private fax cookies</h2>
    <p>If an authorized user requests a fax desk sign-in code, a short-lived challenge cookie lasts up to five minutes. After sign-in, a session cookie lasts up to one hour. These cookies are HttpOnly, SameSite Strict, and Secure on the production site; they are required for the private fax desk and are removed at sign-out or expiry.</p>
    <h2>Client portal cookie</h2>
    <p>When an invited client or studio owner signs in with an email code or invitation link, an essential session cookie keeps their private workspace open for up to seven days. It is HttpOnly, SameSite Lax, and Secure on the production site. Signing out clears it. Invitation links expire after 48 hours and can be used once. Returning sign-in codes expire after 15 minutes and can be used once.</p>
    <p>The payment tracker uses session storage to remember which completed milestones have already been celebrated in this tab. It does not store card details.</p>
    <h2>Your controls</h2>
    <p>You can clear this site&apos;s cookies and local storage in your browser settings. That will sign you out of private workspaces and remove any saved inquiry draft or session preferences. For information about submitted inquiries and client records, see the <a href="/privacy">Privacy Policy</a>.</p>
  </main>;
}
