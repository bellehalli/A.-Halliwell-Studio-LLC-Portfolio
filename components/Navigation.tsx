"use client";

import { useEffect, useState } from "react";

const links = [
  ["Explore", "#top"],
  ["Projects", "#work"],
  ["Services", "#services"],
  ["Studio", "#studio"],
  ["Lab", "#capabilities"],
] as const;

export default function Navigation() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  return (
    <header className={`site-nav shell heart-nav ${open ? "menu-open" : ""}`}>
      <a className="logo" href="#top" aria-label="A. Halliwell Studio home">
        <span className="logo-mark">A.</span>
        <span>HALLIWELL</span>
      </a>

      <button
        className="menu-toggle heart-menu-trigger"
        type="button"
        aria-expanded={open}
        aria-controls="primary-nav"
        onClick={() => setOpen((value) => !value)}
      >
        <span>{open ? "Close" : "Menu"}</span>
        <b aria-hidden="true">♥</b>
      </button>

      <nav id="primary-nav" className="nav-links heart-links" aria-label="Primary navigation">
        {links.map(([label, href]) => (
          <a className="heart-link" key={label} href={href} onClick={() => setOpen(false)}>
            <span>{label}</span>
          </a>
        ))}
        <a className="heart-link heart-link-large" href="#start" onClick={() => setOpen(false)}>
          <span>Start a<br />Project</span>
        </a>
      </nav>
    </header>
  );
}
