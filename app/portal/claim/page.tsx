import type { Metadata } from "next";
import PortalClaim from "./PortalClaim";
export const metadata: Metadata = { title: "Private portal sign-in", robots: { index: false, follow: false }, referrer: "no-referrer" };
export default function ClaimPage() { return <main className="portal-page"><div className="site-background" aria-hidden="true"/><section className="portal-card"><small>PRIVATE STUDIO LINK</small><h1>Opening your<br/><em>workspace.</em></h1><PortalClaim /></section></main>; }
