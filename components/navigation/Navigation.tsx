"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const HEART = "/assets/hearts/Portfolio Assets A.Halliwell  - 1.PNG";

const links = [
  ["EXPLORE", "#top"],
  ["PROJECTS", "#work"],
  ["SERVICES", "#services"],
  ["STUDIO", "#studio"],
  ["LAB", "#capabilities"],
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
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
      <a className="logo" href="#top" aria-label="A. Halliwell Studio home">
        <span className="logo-mark">A.</span>
        <span className="logo-type">HALLIWELL</span>
      </a>

      <button
        ref={triggerRef}
        className="heart-menu-trigger"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="heart-navigation"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
      >
        <span className="heart-button-art" aria-hidden="true">
          <Image src={HEART} alt="" fill sizes="76px" priority />
        </span>
        <span className="heart-button-label">{open ? "CLOSE" : "MENU"}</span>
      </button>

      <nav
        id="heart-navigation"
        className={`heart-dock ${open ? "is-open" : ""}`}
        aria-label="Primary navigation"
      >
        {links.map(([label, href]) => (
          <a className="heart-nav-button" href={href} key={label} onClick={() => setOpen(false)}>
            <span className="heart-button-art" aria-hidden="true">
              <Image src={HEART} alt="" fill sizes="100px" />
            </span>
            <span className="heart-button-label">{label}</span>
          </a>
        ))}

        <a className="heart-nav-button heart-start" href="#start" onClick={() => setOpen(false)}>
          <span className="heart-button-art" aria-hidden="true">
            <Image src={HEART} alt="" fill sizes="118px" />
          </span>
          <span className="heart-button-label">START A<br />PROJECT</span>
        </a>
      </nav>
    </header>
  );
}
