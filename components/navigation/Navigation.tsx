"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

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

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  return (
    <header className="site-nav shell ah-nav">
      <a className="logo" href="#top" aria-label="A. Halliwell Studio home">
        <span className="logo-mark">A.</span>
        <span>HALLIWELL</span>
      </a>

      <button
        className="heart-menu-trigger"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="heart-navigation"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
      >
        <span className="heart-button-art" aria-hidden="true">
          <Image src={HEART} alt="" fill sizes="72px" priority />
        </span>
        <span className="heart-button-label">{open ? "Close" : "Menu"}</span>
      </button>

      <nav
        id="heart-navigation"
        className={`heart-dock ${open ? "is-open" : ""}`}
        aria-label="Primary navigation"
      >
        {links.map(([label, href]) => (
          <a
            className="heart-nav-button"
            href={href}
            key={label}
            onClick={() => setOpen(false)}
          >
            <span className="heart-button-art" aria-hidden="true">
              <Image src={HEART} alt="" fill sizes="96px" />
            </span>
            <span className="heart-button-label">{label}</span>
          </a>
        ))}

        <a
          className="heart-nav-button heart-start"
          href="#start"
          onClick={() => setOpen(false)}
        >
          <span className="heart-button-art" aria-hidden="true">
            <Image src={HEART} alt="" fill sizes="112px" />
          </span>
          <span className="heart-button-label">
            Start a
            <br />
            Project
          </span>
        </a>
      </nav>
    </header>
  );
}
