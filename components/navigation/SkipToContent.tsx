"use client";

export default function SkipToContent() {
  return <a className="skip-to-content" href="#main-content" onClick={event => {
    const main = document.querySelector("main");
    const target = main?.querySelector<HTMLElement>("h1, h2") || main;
    if (!target) return;
    event.preventDefault();
    target.tabIndex = -1;
    target.focus();
    target.scrollIntoView({ block: "start" });
  }}>Skip to content</a>;
}
