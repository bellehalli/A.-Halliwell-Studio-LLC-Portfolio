"use client";
import { FormEvent, useState } from "react";
export default function PortalLogin({ projectId = "", returnTo = "" }: { projectId?: string; returnTo?: string }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [challenge, setChallenge] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function requestCode() {
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/portal/auth/request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, projectId }) });
      const result = await response.json();
      if (!response.ok) throw Error(result.message || "Please wait a moment and try again.");
      setChallenge(result.challenge); setCode(""); setMessage("If this email has access, a six-digit code is on its way. Check your inbox and spam folder.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "The code could not be requested."); }
    finally { setBusy(false); }
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!challenge) { await requestCode(); return; }
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/portal/auth/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ challenge, code }) });
      const result = await response.json();
      if (!response.ok) throw Error(result.message || "Sign-in could not complete.");
      window.location.replace(/^\/portal\/documents\/[a-f0-9-]{36}(\?attachment=[a-f0-9-]{36})?$/.test(returnTo) ? returnTo : result.redirectTo || "/portal");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Sign-in could not complete."); }
    finally { setBusy(false); }
  }
  return <form className="portal-login" onSubmit={submit}>
    <label htmlFor="portal-email">Your email address</label><input id="portal-email" type="email" autoComplete="email" required value={email} readOnly={!!challenge} onChange={event => setEmail(event.target.value)} />
    {challenge && <><label htmlFor="portal-code">Email sign-in code</label><input id="portal-code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required value={code} onChange={event => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}/></>}
    <button className="button button-primary" disabled={busy}>{busy ? "Working…" : challenge ? "Open my workspace" : "Email my sign-in code"}</button>
    {challenge && <><button type="button" disabled={busy} onClick={() => void requestCode()}>Send a fresh code</button><button type="button" disabled={busy} onClick={() => { setChallenge(""); setCode(""); setMessage(""); }}>Use another email</button></>}
    {message && <p role="status">{message}</p>}
  </form>;
}
