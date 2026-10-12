"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Analytics, type BeforeSend } from "@vercel/analytics/next";
import { track } from "@vercel/analytics";

const isPrivatePath = (path: string) => /^\/(portal|fax|api|admin|dashboard|checkout|onboarding)(?:\/|$)/.test(path);
const outreachKey = "ahs-outreach-ref";
function outreachRef() {
  try {
    const value = window.sessionStorage.getItem(outreachKey) || "";
    return /^[a-f0-9]{24}$/.test(value) ? value : "";
  } catch { return ""; }
}
// Tracking must never interfere with navigation when the analytics service fails.
function safeTrack(name: string, properties: Record<string, string>) {
  try { const ref = outreachRef(); track(name, ref ? { ...properties, outreachRef: ref } : properties); } catch { /* Navigation remains available. */ }
}
const publicEvent: BeforeSend = (event) => {
  try {
    const url = new URL(event.url);
    if (isPrivatePath(url.pathname) || isPrivatePath(window.location.pathname)) return null;
    url.search = "";
    url.hash = "";
    return { ...event, url: url.toString() };
  } catch { return null; }
};

export default function SiteAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (isPrivatePath(window.location.pathname)) return;
    try {
      const query = new URLSearchParams(window.location.search);
      const ref = query.get("ref") || "";
      if (query.get("utm_source") !== "outreach" || query.get("utm_campaign") !== "october_12_14" || !/^[a-f0-9]{24}$/.test(ref)) return;
      window.sessionStorage.setItem(outreachKey, ref);
      safeTrack("Outreach visit", { campaign: "october_12_14", route: window.location.pathname });
    } catch { /* A tracking failure must leave the portfolio usable. */ }
  }, []);

  useEffect(() => {
    if (pathname === "/work" || pathname.startsWith("/work/")) safeTrack("Work view", { route: pathname });
  }, [pathname]);

  useEffect(() => {
    const click = (event: MouseEvent) => {
      if (isPrivatePath(window.location.pathname) || !(event.target instanceof Element)) return;
      const anchor = event.target.closest("a[href]");
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      if (href === "/start" || href === "#start") safeTrack("Start project click", { route: window.location.pathname });
      if (anchor.hasAttribute("data-consultation-booking")) safeTrack("Consultation booking click", { route: window.location.pathname });
      if (href.startsWith("mailto:")) safeTrack("Email click", { route: window.location.pathname });
      const project = anchor.closest("[data-project-slug]")?.getAttribute("data-project-slug");
      if (project && /^\/work\//.test(href)) safeTrack("Case study click", { route: window.location.pathname, project });
      if (project && /^https?:\/\//.test(href)) safeTrack("Live project click", { route: window.location.pathname, project });
    };
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, []);

  return <Analytics beforeSend={publicEvent} />;
}
