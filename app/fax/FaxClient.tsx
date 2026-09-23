"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type FaxResult = { ok?: boolean; faxId?: string; status?: string; error?: string; to?: string };
export default function FaxClient() {
  const router = useRouter();
  const [result, setResult] = useState<FaxResult | null>(null);
  const [sending, setSending] = useState(false);
  const [checking, setChecking] = useState(false);
  async function checkStatus(faxId: string) {
    setChecking(true);
    try {
      const response = await fetch(`/api/fax/status/${encodeURIComponent(faxId)}`, { cache: "no-store" });
      const data = await response.json();
      if (response.status === 401) { router.refresh(); return; }
      setResult(data);
    } catch { setResult({ error: "Could not check fax status." }); }
    finally { setChecking(false); }
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setSending(true); setResult(null);
    try {
      const response = await fetch("/api/fax/send", { method: "POST", body: new FormData(form) });
      const data = await response.json();
      if (response.status === 401) { router.refresh(); return; }
      setResult(data);
      if (response.ok) form.reset();
    } catch { setResult({ error: "Could not reach the fax server." }); }
    finally { setSending(false); }
  }
  async function signOut() {
    await fetch("/api/fax/auth/logout", { method: "POST" });
    router.refresh();
  }
  return <main className="fax-shell"><div className="fax-card">
    <a href="/" className="fax-back">← A. Halliwell Studio</a>
    <div className="fax-header"><div><small>PRIVATE STUDIO TOOL</small><h1>Fax desk</h1></div><button type="button" className="fax-text-button" onClick={signOut}>Sign out</button></div>
    <p>Send a PDF from your studio fax number. Your incoming faxes still arrive in your email.</p>
    <form onSubmit={submit} className="fax-form">
      <label>Destination fax number<input name="to" type="tel" inputMode="tel" placeholder="855-555-1234" required /></label>
      <label>PDF document, up to 4 MB<input name="file" type="file" accept=".pdf,application/pdf" required /></label>
      <button className="button button-primary" disabled={sending}>{sending ? "Submitting…" : "Send fax"}</button>
    </form>
    {result && <section className="fax-result" role="status" aria-live="polite">
      {result.error ? <p>{result.error}</p> : <><strong>{result.status || "Queued"}</strong><p>Fax ID: {result.faxId}</p><p>To: {result.to}</p><p>Submitted means Telnyx accepted the request. Check status for delivery.</p></>}
      {result.faxId && <button type="button" className="fax-text-button" onClick={() => checkStatus(result.faxId!)} disabled={checking}>{checking ? "Checking…" : "Check delivery status"}</button>}
    </section>}
  </div></main>;
}
