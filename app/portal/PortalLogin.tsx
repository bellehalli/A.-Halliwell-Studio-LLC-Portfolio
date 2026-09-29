"use client";

import { FormEvent, useState } from "react";

export default function PortalLogin() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/portal/auth/request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      setMessage(response.ok ? "If this email has a workspace, a private sign-in link is on its way." : "Please wait a moment and try again.");
    } catch { setMessage("The link could not be requested. Please try again or email the studio."); }
    finally { setBusy(false); }
  }
  return <form className="portal-login" onSubmit={submit}>
    <label htmlFor="portal-email">Your email address</label>
    <input id="portal-email" type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} />
    <button className="button button-primary" disabled={busy}>{busy ? "Sending…" : "Email my private link"}</button>
    {message && <p role="status">{message}</p>}
  </form>;
}
