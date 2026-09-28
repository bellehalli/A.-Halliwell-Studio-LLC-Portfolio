"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { track } from "@vercel/analytics";

export default function SiteAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/work" || pathname.startsWith("/work/")) track("Work view", { route: pathname });
  }, [pathname]);

  useEffect(() => {
    const click = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const anchor = event.target.closest("a[href]");
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      if (href === "/start" || href === "#start") track("Start project click", { route: window.location.pathname });
      if (href.startsWith("mailto:")) track("Email click", { route: window.location.pathname });
    };
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, []);

  return <Analytics />;
}
