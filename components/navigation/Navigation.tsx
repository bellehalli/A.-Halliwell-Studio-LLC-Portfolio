"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const HEART = "/assets/hearts/Portfolio Assets A.Halliwell  - 1.PNG";

const links = [
  ["HOME", "/"],
  ["WORK", "/work"],
  ["SERVICES", "/services"],
  ["STUDIO", "/studio"],
  ["LAB", "/lab"],
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("nav-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="site-nav shell">
      <a className="logo" href="/" aria-label="A. Halliwell Studio home">
        <span className="logo-mark">A.</span>
        <span className="logo-type">HALLIWELL</span>
      </a>

      <button
        ref={triggerRef}
        className="heart-menu-trigger"
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-controls="primary-navigation"
        aria-label={open ? "Close navigation" : "Open navigation"}
      >
        <span className="heart-button-art" aria-hidden="true">
          <Image src={HEART} alt="" fill sizes="64px" priority />
        </span>
        <span className="heart-button-label">{open ? "CLOSE" : "MENU"}</span>
      </button>

      <nav id="primary-navigation" className={`heart-dock ${open ? "is-open" : ""}`} aria-label="Primary navigation">
        {links.map(([label, href]) => (
          <a className="heart-nav-button" href={href} key={href} onClick={() => setOpen(false)}>
            <span className="heart-button-art" aria-hidden="true">
              <Image src={HEART} alt="" fill sizes="88px" />
            </span>
            <span className="heart-button-label">{label}</span>
          </a>
        ))}
        <a className="heart-nav-button heart-start" href="/start" onClick={() => setOpen(false)}>
          <span className="heart-button-art" aria-hidden="true">
            <Image src={HEART} alt="" fill sizes="104px" />
          </span>
          <span className="heart-button-label">START A<br />PROJECT</span>
        </a>
      </nav>
    </header>
  );
}
