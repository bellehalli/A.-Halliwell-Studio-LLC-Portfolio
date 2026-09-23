"use client";

import { useState } from "react";

type Question = { prompt: string; options: [string, string, string] };
type Demo = { eyebrow: string; title: string; questions: [Question, Question, Question]; action: string; preview: (answers: string[]) => { heading: string; detail: string } };

const demos: Record<string, Demo> = {
  "Take bookings": {
    eyebrow: "VENUE INQUIRY DEMO", title: "Plan a visit", action: "Preview inquiry",
    questions: [
      { prompt: "What brings you here?", options: ["Wedding weekend", "Private celebration", "Venue tour"] },
      { prompt: "When works for you?", options: ["Friday", "Saturday", "Flexible"] },
      { prompt: "How many guests?", options: ["Under 80", "80–160", "Over 160"] },
    ],
    preview: ([occasion, day, guests]) => ({ heading: "A useful inquiry, ready to send.", detail: `${occasion} · ${day} · ${guests} guests. A real venue would collect contact details, check its calendar and follow up with the right information. No reservation has been made.` }),
  },
  "Sell products": {
    eyebrow: "CUSTOM COMMERCE DEMO", title: "Make it yours", action: "Preview product",
    questions: [
      { prompt: "Choose a product", options: ["Welcome box", "Event print", "Gift card"] },
      { prompt: "Choose a style", options: ["Classic", "Colorful", "Minimal"] },
      { prompt: "Add a detail", options: ["Personal note", "Custom date", "No extras"] },
    ],
    preview: ([product, style, detail]) => ({ heading: "A product shaped around the buyer.", detail: `${style} ${product.toLowerCase()} · ${detail.toLowerCase()}. These selections could become a product specification before checkout. Nothing was purchased.` }),
  },
  "Build packages": {
    eyebrow: "PACKAGE BUILDER DEMO", title: "Build your experience", action: "Preview package",
    questions: [
      { prompt: "Start with a gathering", options: ["Wedding", "Retreat", "Private event"] },
      { prompt: "Choose your space", options: ["Garden", "Ballroom", "Whole estate"] },
      { prompt: "Add an experience", options: ["Welcome dinner", "Morning brunch", "No add-on"] },
    ],
    preview: ([event, space, extra]) => ({ heading: "One clear package brief.", detail: `${event} · ${space} · ${extra}. A venue could use this brief to explain inclusions and prepare a quote. This demo does not show live pricing.` }),
  },
  "Manage events": {
    eyebrow: "EVENT DISCOVERY DEMO", title: "Find your event", action: "Preview event match",
    questions: [
      { prompt: "Who is coming?", options: ["A couple", "A group", "Just me"] },
      { prompt: "What sounds good?", options: ["Dinner", "Live music", "A workshop"] },
      { prompt: "What time?", options: ["Daytime", "Evening", "Either"] },
    ],
    preview: ([party, interest, time]) => ({ heading: "A more relevant event list.", detail: `${interest} · ${time.toLowerCase()} · ${party.toLowerCase()}. An event calendar could use these preferences to filter actual events and show the next available date. No live calendar is connected here.` }),
  },
  "Capture leads": {
    eyebrow: "SMART INQUIRY DEMO", title: "Ask better questions", action: "Preview lead brief",
    questions: [
      { prompt: "What do you need?", options: ["A venue tour", "Pricing details", "A custom proposal"] },
      { prompt: "When do you need it?", options: ["Soon", "This season", "Still exploring"] },
      { prompt: "What matters most?", options: ["Guest experience", "Budget clarity", "Availability"] },
    ],
    preview: ([need, timing, priority]) => ({ heading: "A lead with useful context.", detail: `${need} · ${timing.toLowerCase()} · ${priority.toLowerCase()}. A team could route this to the right person and respond with relevant details, instead of starting with a blank email.` }),
  },
  "Something weird": {
    eyebrow: "CUSTOM INTERACTION DEMO", title: "Let's make it strange", action: "Invent my interaction",
    questions: [
      { prompt: "Pick a little world", options: ["A secret garden", "A midnight hotel", "A floating menu"] },
      { prompt: "How should it react?", options: ["On a tap", "As you scroll", "When you choose"] },
      { prompt: "Give it a job", options: ["Reveal the venue", "Explain an offer", "Guide an inquiry"] },
    ],
    preview: ([world, trigger, purpose]) => ({ heading: `${world}, with a reason to exist.`, detail: `${trigger}, the scene changes to ${purpose.toLowerCase()}. That is the start of a custom interaction: a memorable moment with a clear next step. Your combination is a concept, not a finished client project.` }),
  },
};

export default function CapabilityPlayground() {
  const [active, setActive] = useState("Take bookings");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  const demo = demos[active];
  const question = demo.questions[step];
  const preview = finished ? demo.preview(answers) : null;

  function chooseDemo(key: string) { setActive(key); setStep(0); setAnswers([]); setFinished(false); }
  function chooseAnswer(value: string) { setAnswers(current => [...current.slice(0, step), value]); }
  function advance() { if (!answers[step]) return; if (step === demo.questions.length - 1) setFinished(true); else setStep(step + 1); }

  return <section className="sheet sheet-lavender capability" id="capabilities">
    <div className="content-shell capability-grid">
      <div className="capability-copy">
        <span className="section-kicker-text">03 / THE LAB</span>
        <h2>Don't just read<br /><em>what I can build.</em></h2>
        <p className="capability-intro">Choose a task and try a short interactive concept. Your choices change the preview. These examples use sample scenarios, not live booking or sales data.</p>
        <div className="capability-tabs" role="group" aria-label="Website capability examples">
          {Object.keys(demos).map(item => <button key={item} type="button" className={active === item ? "is-active" : ""} aria-pressed={active === item} onClick={() => chooseDemo(item)}>{item}</button>)}
        </div>
      </div>
      <div className="demo-stage">
        <span className="lab-note">PICK A PATH. SEE WHAT IT BUILDS. ↘</span>
        <div className="demo-window">
          <div className="demo-window-top"><span /><span /><span /><b>A. HALLIWELL / INTERACTIVE CONCEPT</b></div>
          <div className="demo-screen">
            <small>{demo.eyebrow}</small><h3>{demo.title}</h3>
            <div className="demo-progress" aria-label={finished ? "Preview complete" : `Question ${step + 1} of ${demo.questions.length}`}>
              {demo.questions.map((_, index) => <i key={index} className={finished || index <= step ? "active" : ""} />)}
            </div>
            {preview ? <div className="demo-preview" role="status">
              <span>YOUR INTERACTIVE PREVIEW ♥</span><h4>{preview.heading}</h4><p>{preview.detail}</p>
              <button type="button" className="demo-action" onClick={() => chooseDemo(active)}>Try another combination ↗</button>
            </div> : <div className="demo-question" role="group" aria-label={question.prompt}>
              <span className="demo-step-label">0{step + 1} / 0{demo.questions.length}</span><h4>{question.prompt}</h4>
              <div className="demo-choices">{question.options.map(option => <button key={option} type="button" aria-pressed={answers[step] === option} className={answers[step] === option ? "is-selected" : ""} onClick={() => chooseAnswer(option)}>{option}</button>)}</div>
              <div className="demo-controls">
                {step > 0 && <button type="button" className="demo-back" onClick={() => setStep(step - 1)}>← Back</button>}
                <button type="button" className="demo-action" disabled={!answers[step]} onClick={advance}>{step === demo.questions.length - 1 ? demo.action : "Next question"} ↗</button>
              </div>
            </div>}
            <p className="demo-disclaimer">Concept demo only. No booking, purchase or message is submitted.</p>
          </div>
        </div>
      </div>
    </div>
  </section>;
}
