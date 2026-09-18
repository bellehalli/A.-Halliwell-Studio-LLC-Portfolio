"use client";
import { useState } from "react";

const choices = ["A new website", "A redesign", "Booking / commerce", "An interactive system", "Something unusual"];

export default function StartProject() {
  const [choice, setChoice] = useState("");
  const subject = encodeURIComponent(`Project inquiry${choice ? `: ${choice}` : ""}`);
  const body = encodeURIComponent(`Hi A. Halliwell Studio,\n\nI’m interested in: ${choice || "a custom digital project"}.\n\nBusiness / brand:\nCurrent website:\nWhat I want the new experience to accomplish:\nTimeline:\nInvestment range:\n\n`);
  return (
    <section className="sheet sheet-dark start" id="start">
      <div className="content-shell start-inner">
        <span className="section-kicker-text">05 / START A PROJECT</span>
        <h2>Start something<br /><em>good♥</em></h2>
        <p>Choose the closest starting point. I&apos;ll turn it into a useful project conversation, not a generic contact form.</p>
        <div className="start-choices">
          {choices.map((item) => <button type="button" key={item} className={choice === item ? "is-active" : ""} onClick={() => setChoice(item)}>{item}</button>)}
        </div>
        <a className="big-cta" href={`mailto:hello@ahalliwellstudio.com?subject=${subject}&body=${body}`}>{choice ? "Continue with this project" : "Start a conversation"}<span>↗</span></a>
        <small className="start-note">Front-end project brief is active. Replace the studio email in this component if hello@ahalliwellstudio.com is not your production inbox.</small>
      </div>
    </section>
  );
}
