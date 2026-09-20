"use client";
import { FormEvent, useMemo, useState } from "react";

type Status = "idle" | "sending" | "success" | "error";
const projectTypes = ["A new website", "A website redesign", "A custom digital experience", "An interactive business system", "Something unusual"];
const projectNeeds = ["Strategy", "Web design", "Development", "Booking or scheduling", "E-commerce", "Custom forms", "Interactive tools", "Events or ticketing", "Lead generation", "Something custom"];
const timingOptions = ["As soon as possible", "Within 2 weeks", "Within 3-4 weeks", "Within 1-2 months", "I'm flexible"];
const investmentOptions = ["$5k-$10k", "$10k-$20k", "$20k-$30k", "$30k+", "Not sure yet"];

export default function StartProject() {
  const [projectType, setProjectType] = useState("");
  const [needs, setNeeds] = useState<string[]>([]);
  const [timing, setTiming] = useState("");
  const [investment, setInvestment] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [business, setBusiness] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");

  const brief = useMemo(() => [
    projectType && `Project: ${projectType}`,
    needs.length && `Needs: ${needs.join(", ")}`,
    timing && `Timing: ${timing}`,
    investment && `Investment: ${investment}`
  ].filter(Boolean).join("\n"), [projectType, needs, timing, investment]);

  const toggleNeed = (need: string) => setNeeds(current => current.includes(need) ? current.filter(item => item !== need) : [...current, need]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!projectType || !timing || !investment || !name.trim() || !email.trim()) {
      setStatus("error");
      setFeedback("Complete the required fields before sending your project.");
      return;
    }

    setStatus("sending");
    setFeedback("");
    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, business, projectType, needs, timing, investment, message, website })
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message);
      setStatus("success");
      setFeedback("Your project inquiry has been sent. I will be in touch soon.");
    } catch {
      setStatus("error");
      setFeedback("Your inquiry could not be sent right now. Please try again.");
    }
  }

  if (status === "success") {
    return <section className="operation-panel success-panel"><small>INQUIRY RECEIVED</small><h1>It is in my inbox.</h1><p>{feedback}</p><pre>{brief}</pre></section>;
  }

  return (
    <form className="project-builder operation-panel" onSubmit={submit}>
      <header><small>PROJECT BUILDER</small><h1>Tell me what we are building.</h1><p>Your answers create a useful project brief before the first conversation.</p></header>

      <fieldset><legend>01 / What are we making?</legend><div className="choice-grid">{projectTypes.map(item => <button type="button" aria-pressed={projectType === item} className={projectType === item ? "selected" : ""} onClick={() => setProjectType(item)} key={item}>{item}</button>)}</div></fieldset>
      <fieldset><legend>02 / What does it need to do?</legend><div className="choice-grid">{projectNeeds.map(item => <button type="button" aria-pressed={needs.includes(item)} className={needs.includes(item) ? "selected" : ""} onClick={() => toggleNeed(item)} key={item}>{item}</button>)}</div></fieldset>
      <div className="form-pair">
        <fieldset><legend>03 / Timing</legend><div className="choice-grid compact">{timingOptions.map(item => <button type="button" className={timing === item ? "selected" : ""} onClick={() => setTiming(item)} key={item}>{item}</button>)}</div></fieldset>
        <fieldset><legend>04 / Investment</legend><div className="choice-grid compact">{investmentOptions.map(item => <button type="button" className={investment === item ? "selected" : ""} onClick={() => setInvestment(item)} key={item}>{item}</button>)}</div></fieldset>
      </div>
      <fieldset><legend>05 / Contact</legend><div className="field-grid">
        <label>Name *<input required maxLength={100} autoComplete="name" value={name} onChange={e => setName(e.target.value)} /></label>
        <label>Email *<input required type="email" maxLength={254} autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} /></label>
        <label>Business or brand<input maxLength={150} autoComplete="organization" value={business} onChange={e => setBusiness(e.target.value)} /></label>
        <label className="wide">Anything else I should know?<textarea rows={7} maxLength={3000} value={message} onChange={e => setMessage(e.target.value)} /></label>
        <label className="honeypot" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={website} onChange={e => setWebsite(e.target.value)} /></label>
      </div></fieldset>

      {brief ? <section className="brief-preview"><small>YOUR PROJECT BRIEF</small><pre>{brief}</pre></section> : null}
      <button className="primary-action" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending..." : "Send project inquiry ↗"}</button>
      {feedback && status === "error" ? <p role="alert" className="error">{feedback}</p> : null}
    </form>
  );
}
