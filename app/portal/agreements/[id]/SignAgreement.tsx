"use client";

import { FormEvent, useState } from "react";

export default function SignAgreement({ documentId, email, studio }: { documentId: string; email: string; studio: boolean }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/portal/sign", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ documentId, typedName: data.get("typedName"), businessName: data.get("businessName"), reviewed: data.get("reviewed") === "on", consent: data.get("consent") === "on" }) });
      const result = await response.json();
      if (!response.ok) throw Error(result.message || "Signature could not be recorded.");
      setMessage(result.notified ? "Signature recorded. Your signed copy is ready." : "Signature recorded. The email notification did not send; your signed copy is ready here.");
      window.location.reload();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Please try again."); }
    finally { setBusy(false); }
  }
  return <form className="portal-sign-form" onSubmit={submit}>
    <h2>Sign this agreement</h2><p>You are signed in as <strong>{email}</strong>. Your typed legal name, consent, and signing time are attached to this exact PDF. {studio ? "Sign for A. Halliwell Studio first." : "Sign only if you are authorized to accept the agreement for your business."}</p>
    <label>Full legal name<input name="typedName" autoComplete="name" minLength={3} maxLength={120} required /></label>
    {!studio && <label>Business you are signing for<input name="businessName" maxLength={150} required placeholder="Vale Royal Barn" /></label>}
    <label className="portal-check"><input type="checkbox" name="reviewed" required /><span>I have read the entire agreement displayed above.</span></label>
    <label className="portal-check"><input type="checkbox" name="consent" required /><span>I agree to use electronic records and signatures for this agreement. Typing my name and selecting Sign agreement is my electronic signature.</span></label>
    <button disabled={busy}>{busy ? "Recording signature…" : "Sign agreement"}</button>
    {message && <p role="status">{message}</p>}
  </form>;
}
