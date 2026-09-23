"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function FaxSignIn() {
  const router = useRouter();
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function requestCode() {
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/fax/auth/request", { method: "POST" });
      const result = await response.json();
      setMessage(result.message || result.error || "Could not send the code.");
      if (response.ok) setSent(true);
    } catch { setMessage("Could not reach the server. Try again."); }
    finally { setBusy(false); }
  }
  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/fax/auth/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }) });
      const result = await response.json();
      if (!response.ok) { setMessage(result.error || "That code could not be verified."); return; }
      router.refresh();
    } catch { setMessage("Could not verify the code. Try again."); }
    finally { setBusy(false); }
  }
  return <main className="fax-shell"><div className="fax-card">
    <a href="/" className="fax-back">← A. Halliwell Studio</a>
    <small>PRIVATE STUDIO TOOL</small><h1>Fax desk</h1>
    <p>Only your studio inbox can unlock sending and status checks. Incoming faxes continue to arrive by email.</p>
    {!sent ? <button className="button button-primary" onClick={requestCode} disabled={busy}>{busy ? "Sending…" : "Email me a sign-in code"}</button> :
      <form onSubmit={signIn} className="fax-form">
        <label>Code from your email<input value={code} onChange={event => setCode(event.target.value)} autoComplete="one-time-code" inputMode="text" maxLength={15} required placeholder="XXXXXX-XXXXXX" /></label>
        <button className="button button-primary" disabled={busy}>{busy ? "Checking…" : "Unlock fax desk"}</button>
        <button type="button" className="fax-text-button" onClick={requestCode} disabled={busy}>Send a new code</button>
      </form>}
    {message && <p role="status" aria-live="polite">{message}</p>}
  </div></main>;
}
