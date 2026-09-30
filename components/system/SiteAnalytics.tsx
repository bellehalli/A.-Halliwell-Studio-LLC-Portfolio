"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Analytics, type BeforeSend } from "@vercel/analytics/next";
import { track } from "@vercel/analytics";

const isPrivatePath = (path: string) => /^\/(portal|fax|api|admin|dashboard|checkout|onboarding)(?:\/|$)/.test(path);
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
    if (pathname === "/work" || pathname.startsWith("/work/")) track("Work view", { route: pathname });
  }, [pathname]);

  useEffect(() => {
    const click = (event: MouseEvent) => {
      if (isPrivatePath(window.location.pathname) || !(event.target instanceof Element)) return;
      const anchor = event.target.closest("a[href]");
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      if (href === "/start" || href === "#start") track("Start project click", { route: window.location.pathname });
      if (anchor.hasAttribute("data-consultation-booking")) track("Consultation booking click", { route: window.location.pathname });
      if (href.startsWith("mailto:")) track("Email click", { route: window.location.pathname });
    };
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, []);

  return <Analytics beforeSend={publicEvent} />;
}
