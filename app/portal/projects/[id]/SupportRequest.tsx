"use client";
import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
export default function SupportRequest({ projectId, readonly = false }: { projectId: string; readonly?: boolean }) {
  const router = useRouter();
  const reference = useRef("");
  const [busy, setBusy] = useState(false), [feedback, setFeedback] = useState(""), [sent, setSent] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (readonly || busy) return;
    const form = event.currentTarget;
    reference.current ||= crypto.randomUUID();
    setBusy(true); setFeedback("");
    try {
      const response = await fetch("/api/portal/support", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: reference.current, projectId, ...Object.fromEntries(new FormData(form)) }) });
      const result = await response.json();
      if (!response.ok) throw Error(result.message || "Could not save your request.");
      form.reset(); setSent(true); setFeedback("Your request is received. Arabella will review it and follow up with the scope, pricing, and next steps."); router.refresh();
    } catch (error) { setFeedback(error instanceof Error ? error.message : "Could not save your request."); }
    finally { setBusy(false); }
  }
  return <form className="portal-feedback" onSubmit={submit}>
    <label>What would you like help with?<textarea name="message" required minLength={5} maxLength={5000} rows={5} disabled={readonly || busy || sent} placeholder="Share the update, improvement, illustration, or feature you have in mind." /></label>
    <label>Timing preference, if you have one<input name="timing" maxLength={200} disabled={readonly || busy || sent} placeholder="Flexible, or a date you’re hoping for" /></label>
    <p>Your project is attached automatically. We’ll agree on the additional scope and price before work begins.</p>
    <button type="submit" disabled={readonly || busy || sent}>{readonly ? "Client request preview" : busy ? "Sending…" : sent ? "Request received" : "Request Studio Support"}</button>
    <p role="status" aria-live="polite">{feedback}</p>
    {sent && <button type="button" onClick={() => { setSent(false); setFeedback(""); reference.current = ""; }}>Send another request</button>}
  </form>;
}
