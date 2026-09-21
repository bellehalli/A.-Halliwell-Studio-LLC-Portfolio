"use client";

import { FormEvent, useMemo, useState } from "react";

const projectTypes = ["Website", "Digital experience", "Booking or commerce", "Business system", "Not sure yet"];
const timelines = ["As soon as possible", "1–3 months", "3–6 months", "Exploring"];
const budgets = ["$10k–$20k", "$20k–$35k", "$35k+", "I need guidance"];

export default function StartProject() {
  const [projectType, setProjectType] = useState("");
  const [timeline, setTimeline] = useState("");
  const [budget, setBudget] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");
  const brief = useMemo(() => [projectType, timeline, budget].filter(Boolean).join(" · "), [projectType, timeline, budget]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    const payload = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const response = await fetch("/api/inquiry", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to send inquiry.");
      setStatus("sent");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to send inquiry.");
    }
  }

  if (status === "sent") return <section className="start-sheet"><div className="start-project-success"><span className="start-kicker">INQUIRY RECEIVED</span><div className="start-success-heart" aria-hidden="true">♥</div><h2>Your project brief is in.</h2><p>I’ll review the scope and reply with the clearest next step.</p>{brief ? <div className="start-success-summary"><span>YOUR BRIEF</span><strong>{brief}</strong></div> : null}</div></section>;

  return (
    <section className="start-sheet" id="start"><div className="start-project">
      <header className="start-project-header"><div><span className="start-kicker">05 / START A PROJECT</span><h2>Tell me what<br/>we are building.</h2></div><p>A short brief is enough. Share what the business needs, where the current experience falls short, and what a successful launch should make possible.</p></header>
      <form className="project-builder" onSubmit={submit}>
        <fieldset className="builder-step"><legend><span>01</span> What are we building?</legend><div className="builder-options">{projectTypes.map(option => <button className={projectType === option ? "selected" : ""} type="button" aria-pressed={projectType === option} onClick={() => setProjectType(option)} key={option}>{option}</button>)}</div><input type="hidden" name="projectType" value={projectType}/></fieldset>
        <div className="builder-split"><fieldset className="builder-step"><legend><span>02</span> Ideal timeline</legend><div className="builder-options">{timelines.map(option => <button className={timeline === option ? "selected" : ""} type="button" aria-pressed={timeline === option} onClick={() => setTimeline(option)} key={option}>{option}</button>)}</div><input type="hidden" name="timeline" value={timeline}/></fieldset><fieldset className="builder-step"><legend><span>03</span> Investment range</legend><div className="builder-options">{budgets.map(option => <button className={budget === option ? "selected" : ""} type="button" aria-pressed={budget === option} onClick={() => setBudget(option)} key={option}>{option}</button>)}</div><input type="hidden" name="budget" value={budget}/></fieldset></div>
        <fieldset className="builder-step"><legend><span>04</span> Contact + context</legend><div className="builder-fields"><label><span>Name *</span><input name="name" autoComplete="name" required/></label><label><span>Email *</span><input name="email" type="email" autoComplete="email" required/></label><label><span>Business</span><input name="business" autoComplete="organization"/></label><label><span>Current website</span><input name="website" type="url" inputMode="url" placeholder="https://"/></label><label className="builder-message"><span>What does the project need to accomplish? *</span><textarea name="details" rows={6} required/></label><label className="builder-honeypot" aria-hidden="true">Company fax<input name="companyFax" tabIndex={-1} autoComplete="off"/></label></div></fieldset>
        {brief ? <div className="builder-brief"><span>BRIEF SNAPSHOT</span><pre>{brief}</pre></div> : null}
        <div className="builder-submit"><div><small>READY WHEN YOU ARE</small><p>No polished brief required.</p></div><button className="button button-primary" type="submit" disabled={status === "sending"}>{status === "sending" ? "SENDING…" : "SEND INQUIRY ↗"}</button></div>
        <div className="builder-feedback" role="status" aria-live="polite">{status === "error" ? <p className="builder-error">{message}</p> : null}</div>
        <p className="builder-privacy">Your information is used only to respond to this project inquiry.</p>
      </form>
    </div></section>
  );
}
