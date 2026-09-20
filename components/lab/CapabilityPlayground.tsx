"use client";
import { useMemo, useState } from "react";

const demos = {
  booking: {
    label: "BOOKING",
    title: "Reservation flow",
    steps: ["Choose experience", "Select date", "Enter guest details", "Review request"]
  },
  package: {
    label: "PACKAGE BUILDER",
    title: "Configure an offer",
    steps: ["Choose base package", "Add upgrades", "Review selections", "Create inquiry brief"]
  },
  lead: {
    label: "LEAD QUALIFICATION",
    title: "Route the right inquiry",
    steps: ["Choose project type", "Select required capabilities", "Set timing", "Create lead summary"]
  },
  event: {
    label: "EVENT SYSTEM",
    title: "Find the right event",
    steps: ["Choose date range", "Filter event type", "Review event details", "Reserve intent"]
  }
} as const;

type DemoKey = keyof typeof demos;

export default function CapabilityPlayground() {
  const [active, setActive] = useState<DemoKey>("booking");
  const [step, setStep] = useState(0);
  const demo = demos[active];
  const summary = useMemo(() => demo.steps.slice(0, step + 1), [demo, step]);

  function selectDemo(key: DemoKey) {
    setActive(key);
    setStep(0);
  }

  return (
    <section className="lab-engine" aria-labelledby="lab-engine-title">
      <div className="lab-tabs">
        {(Object.keys(demos) as DemoKey[]).map(key => (
          <button key={key} type="button" className={active === key ? "active" : ""} onClick={() => selectDemo(key)}>
            {demos[key].label}
          </button>
        ))}
      </div>

      <div className="lab-console">
        <div className="lab-console-head">
          <span>INTERACTIVE PROOF</span>
          <strong id="lab-engine-title">{demo.title}</strong>
        </div>

        <ol className="lab-steps">
          {demo.steps.map((item, index) => (
            <li className={index <= step ? "complete" : ""} key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item}</strong>
            </li>
          ))}
        </ol>

        <div className="lab-output">
          <small>STATE</small>
          <p>{summary.join(" → ")}</p>
        </div>

        <div className="lab-controls">
          <button type="button" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>Back</button>
          <button type="button" onClick={() => setStep(Math.min(demo.steps.length - 1, step + 1))} disabled={step === demo.steps.length - 1}>Continue</button>
          <button type="button" onClick={() => setStep(0)}>Reset</button>
        </div>
      </div>
    </section>
  );
}
