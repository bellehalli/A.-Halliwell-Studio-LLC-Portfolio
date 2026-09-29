"use client";

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
      <div className="conversion-footer-action"><span>HAVE A DIGITAL PROBLEM TO SOLVE?</span><a className="button button-primary" href="/start">START A PROJECT ↗</a><a href="mailto:hello@ahalliwellstudio.com">hello@ahalliwellstudio.com</a></div>
      <nav aria-label="Footer navigation"><a href="/work">Work</a><a href="/services">Services</a><a href="/studio">Studio</a><a href="/lab">Lab</a><a href="/resources">Resources</a><a href="/privacy">Privacy</a><a href="/cookies">Cookies &amp; storage</a><a href="/terms">Terms</a><a href="/accessibility">Accessibility</a></nav>
    </div>
  </footer>;
}
