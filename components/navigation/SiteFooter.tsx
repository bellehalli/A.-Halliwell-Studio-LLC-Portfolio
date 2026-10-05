"use client";
import { studio } from "@/lib/studio-config";

import { usePathname } from "next/navigation";

export default function SiteFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/fax") || pathname.startsWith("/api")) return null;

  return <footer className="conversion-footer">
    <div className="conversion-footer-inner">
      <div className="conversion-footer-brand"><span className="logo-mark" aria-hidden="true">A.</span><strong>A. HALLIWELL STUDIO</strong>
        <p>Custom websites + digital systems for businesses that need their online presence to work harder.</p>
        <small>Detroit, Michigan · Currently accepting select projects</small>
      </div>
      <div className="conversion-footer-action"><span>HAVE A DIGITAL PROBLEM TO SOLVE?</span><a className="button button-primary" href="/start">START A PROJECT ↗</a><a href={`mailto:${studio.email}`}>{studio.email}</a></div>
      <nav aria-label="Footer navigation"><a href="/work">Work</a><a href="/services">Services</a><a href="/services#faqs">FAQs</a><a href="/studio">Studio</a><a href="/lab">Lab</a><a href="/resources">Resources</a><a href="/portal">Client Portal</a><a href="/privacy">Privacy</a><a href="/cookies">Cookies &amp; storage</a><a href="/terms">Terms</a><a href="/accessibility">Accessibility</a></nav>
      <nav aria-label="Explore studio services"><a href="/web-design">Custom web design</a><a href="/web-development">Web development</a><a href="/interactive-experiences">Interactive experiences</a><a href="/michigan-web-design">Michigan web design</a><a href="/detroit-web-design">Detroit web design</a></nav>
      <nav aria-label="Industries we design for"><a href="/industries/wedding-venues">Wedding venues</a><a href="/industries/hospitality">Hospitality</a><a href="/industries/med-spas">Med spas</a><a href="/industries/nightlife">Nightlife</a><a href="/industries/home-services">Home services</a></nav>
    </div>
  </footer>;
}
