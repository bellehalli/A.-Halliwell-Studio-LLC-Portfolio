"use client";

import { useState } from "react";

type Demo = {
  eyebrow: string;
  title: string;
  fields: string[];
  action: string;
  result: string;
};

const demos: Record<string, Demo> = {
  "Take bookings": {
    eyebrow: "RESERVATION FLOW",
    title: "Find your time",
    fields: ["Choose experience", "Select a date", "Guest details"],
    action: "Check availability",
    result: "A calm path from interest to confirmed intent.",
  },
  "Sell products": {
    eyebrow: "CUSTOM COMMERCE",
    title: "Make it yours",
    fields: ["Choose a style", "Add personalization", "Review order"],
    action: "Build my order",
    result: "Commerce shaped around the product, not a generic grid.",
  },
  "Build packages": {
    eyebrow: "PACKAGE BUILDER",
    title: "Build your experience",
    fields: ["Start with a base", "Choose upgrades", "See your selections"],
    action: "Create my package",
    result: "Complex offers become easy to understand and easier to buy.",
  },
  "Manage events": {
    eyebrow: "EVENT SYSTEM",
    title: "What's happening?",
    fields: ["Browse calendar", "Filter the vibe", "Reserve access"],
    action: "See this week",
    result: "One source of truth for guests, events and conversion.",
  },
  "Capture leads": {
    eyebrow: "SMART INQUIRY",
    title: "Tell us what you need",
    fields: ["Qualify the request", "Collect useful details", "Route follow-up"],
    action: "Build my inquiry",
    result: "Better questions create better leads before the first call.",
  },
  "Something weird": {
    eyebrow: "CUSTOM INTERACTION",
    title: "Good. Let's make it strange.",
    fields: ["Invent the interaction", "Give it a job", "Make it delightful"],
    action: "Do the weird thing",
    result: "Personality is strongest when it still has a purpose.",
  },
};

export default function CapabilityPlayground() {
  const [active, setActive] = useState("Take bookings");
  const [step, setStep] = useState(0);
  const demo = demos[active];

  const choose = (key: string) => {
    setActive(key);
    setStep(0);
  };

  const advance = () => setStep((value) => (value + 1) % demo.fields.length);

  return (
    <section className="sheet sheet-lavender capability" id="capabilities">
      <div className="content-shell capability-grid">
        <div className="capability-copy">
          <span className="section-kicker-text">03 / THE LAB</span>
          <h2>
            Don't just read
            <br />
            <em>what I can build.</em>
          </h2>
          <p className="capability-intro">
            Use it. Pick a job the internet needs to do and click through a tiny
            working demonstration.
          </p>

          <div className="capability-tabs" role="group" aria-label="Website capability examples">
            {Object.keys(demos).map((item) => (
              <button
                key={item}
                type="button"
                className={active === item ? "is-active" : ""}
                onClick={() => choose(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="demo-stage">
          <span className="lab-note">YOU AREN'T READING A LIST. YOU'RE USING IT. ↘</span>
          <div className="demo-window" aria-live="polite">
            <div className="demo-window-top">
              <span /><span /><span />
              <b>A. HALLIWELL / LAB PREVIEW</b>
            </div>

            <div className="demo-screen">
              <small>{demo.eyebrow}</small>
              <h3>{demo.title}</h3>

              <div className="demo-progress" aria-label={`Step ${step + 1} of ${demo.fields.length}`}>
                {demo.fields.map((_, index) => (
                  <i key={index} className={index <= step ? "active" : ""} />
                ))}
              </div>

              <button className="demo-interaction" type="button" onClick={advance}>
                <span>0{step + 1}</span>
                <strong>{demo.fields[step]}</strong>
                <i>↗</i>
              </button>

              <div className="demo-result">{demo.result} <span>♥</span></div>
              <button className="demo-action" type="button" onClick={advance}>
                {demo.action} ↗
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
