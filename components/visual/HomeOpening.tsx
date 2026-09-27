"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const CURSOR = "/assets/ui/Portfolio Assets A.Halliwell  - 24.PNG";

/** A short, non-scrolling opening scene. The site becomes usable after the curtain lifts. */
export default function HomeOpening() {
  const [phase, setPhase] = useState<"open" | "leaving" | "done">("open");
  const phaseRef = useRef(false);
  const finishRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const leave = useCallback(() => {
    if (phaseRef.current) return;
    phaseRef.current = true;
    setPhase("leaving");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    finishRef.current = setTimeout(() => {
      const content = document.getElementById("home-content");
      if (content) {
        content.inert = false;
        content.removeAttribute("aria-hidden");
      }
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      setPhase("done");
      document.getElementById("home-heading")?.focus({ preventScroll: true });
    }, reduced ? 0 : 850);
  }, []);

  useEffect(() => {
    const content = document.getElementById("home-content");
    if (content) {
      content.inert = true;
      content.setAttribute("aria-hidden", "true");
    }
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    window.scrollTo(0, 0);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = setTimeout(leave, reduced ? 1400 : 5600);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") leave();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(timer);
      if (finishRef.current) clearTimeout(finishRef.current);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      if (content) {
        content.inert = false;
        content.removeAttribute("aria-hidden");
      }
    };
  }, [leave]);

  if (phase === "done") return null;

  return (
    <section className={`home-opening ${phase === "leaving" ? "is-leaving" : ""}`} aria-label="A. Halliwell Studio opening" aria-live="off">
      <button className="opening-skip" type="button" onClick={leave}>SKIP INTRO <Image className="glitter-cursor" src={CURSOR} alt="" width={28} height={28} aria-hidden="true" /></button>
      <span className="opening-edition" aria-hidden="true">A. HALLIWELL STUDIO<br />DETROIT / EST. 2026</span>
      <div className="opening-center">
        <div className="opening-heart" aria-hidden="true">
          <Image src="/assets/hearts/Portfolio Assets A.Halliwell  - 119.PNG" alt="" fill sizes="(max-width: 700px) 82vw, 570px" priority />
        </div>
        <h2 className="opening-brand"><span>A. HALLIWELL</span><em>Studio</em></h2>
        <p className="opening-caption">DESIGN WITH A PULSE.</p>
      </div>
      <button className="opening-enter" type="button" onClick={leave}>ENTER THE STUDIO <Image className="glitter-cursor" src={CURSOR} alt="" width={34} height={34} aria-hidden="true" /></button>
      <span className="opening-counter" aria-hidden="true">01 / 01</span>
    </section>
  );
}
