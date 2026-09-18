"use client";

import { useState } from "react";

const capabilities = {
  "Take bookings": ["Choose a service", "Pick a date", "Confirm details"],
  "Sell products": ["Browse collection", "Customize item", "Checkout"],
  "Build packages": ["Choose a base", "Add upgrades", "Get your brief"],
  "Manage events": ["Browse calendar", "Reserve access", "Get reminders"],
  "Capture leads": ["Qualify inquiry", "Collect details", "Route follow-up"],
  "Something weird": ["Click the thing", "Make it move", "Make it useful"],
} as const;

type Capability = keyof typeof capabilities;

export default function CapabilityPlayground() {
  const [active, setActive] = useState<Capability>("Take bookings");
  return (
    <section className="sheet sheet-lavender capability" id="capabilities">
      <div className="content-shell capability-grid">
        <div>
          <span className="section-kicker-text">TRY THE WORK</span>
          <h2>What could your<br /><em>website do?</em></h2>
          <p className="capability-intro">A website can be more than pages. Pick a job and watch the experience reorganize around it.</p>
          <div className="capability-tabs" role="group" aria-label="Website capability examples">
            {(Object.keys(capabilities) as Capability[]).map((item) => (
              <button key={item} type="button" className={active === item ? "is-active" : ""} onClick={() => setActive(item)}>{item}</button>
            ))}
          </div>
        </div>
        <div className="demo-window" aria-live="polite">
          <div className="demo-window-top"><span/><span/><span/><b>YOUR WEBSITE</b></div>
          <div className="demo-screen">
            <small>DEMO / {active.toUpperCase()}</small>
            <h3>{active}</h3>
            <div className="demo-steps">
              {capabilities[active].map((step, index) => <div key={step}><span>0{index + 1}</span><strong>{step}</strong><i>↗</i></div>)}
            </div>
            <div className="demo-result">Built around the action your customer actually needs to take. <span>♥</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
