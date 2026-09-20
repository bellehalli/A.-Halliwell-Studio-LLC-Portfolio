"use client";
import { useState } from "react";
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

  return (
    <header className="site-nav shell ah-nav">
      <a className="logo" href="#top">
        <span className="logo-mark">A.</span>
        <span>HALLIWELL</span>
      </a>

      <button
        className="heart-menu-trigger"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="heart-navigation"
      >
        <Image src={HEART} alt="" width={72} height={72} />
        <span>{open ? "CLOSE" : "MENU"}</span>
      </button>

      <nav
        id="heart-navigation"
        className={`heart-dock ${open ? "is-open" : ""}`}
        aria-label="Primary navigation"
      >
        {links.map(([label, href]) => (
          <a href={href} key={label} onClick={() => setOpen(false)}>
            <Image src={HEART} alt="" width={100} height={100} />
            <span>{label}</span>
          </a>
        ))}

        <a
          className="heart-start"
          href="#start"
          onClick={() => setOpen(false)}
        >
          <Image src={HEART} alt="" width={118} height={118} />
          <span>
            START A
            <br />
            PROJECT
          </span>
        </a>
      </nav>
    </header>
  );
}
