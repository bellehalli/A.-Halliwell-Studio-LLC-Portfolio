"use client";

import { FormEvent, useEffect, useState } from "react";

type Result = {
  ok?: boolean; faxId?: string | null; status?: string; error?: string;
  telnyxStatus?: number; telnyx?: unknown; completedAt?: string | null;
  pageCount?: number | null; errors?: unknown[];
};

const EXISTING_FAX_ID = "70e35733-4cdc-4dd5-bc52-047b70123ea8";
const FINAL = new Set(["delivered", "failed"]);

export default function FaxClient() {
  const [result, setResult] = useState<Result | null>({ ok: true, faxId: EXISTING_FAX_ID, status: "checking" });
  const [sending, setSending] = useState(false);
  const [checking, setChecking] = useState(false);

  async function checkStatus(faxId: string) {
    setChecking(true);
    try {
      const response = await fetch(`/api/fax/status/${encodeURIComponent(faxId)}`, { cache: "no-store" });
      const json = await response.json();
      setResult(current => ({ ...current, ...json, faxId }));
    } catch {
      setResult(current => ({ ...current, ok: false, faxId, error: "Could not check fax status." }));
    } finally { setChecking(false); }
  }

  useEffect(() => {
    const faxId = result?.faxId;
    const status = String(result?.status || "").toLowerCase();
    if (!faxId || FINAL.has(status)) return;
    if (status === "checking") void checkStatus(faxId);
    const timer = window.setInterval(() => void checkStatus(faxId), 5000);
    return () => window.clearInterval(timer);
  }, [result?.faxId, result?.status]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setSending(true); setResult(null);
    try {
      const response = await fetch("/api/fax/send", { method: "POST", body: new FormData(e.currentTarget) });
      setResult(await response.json());
    } catch { setResult({ ok: false, error: "Could not reach the fax server." }); }
    finally { setSending(false); }
  }

  const status = String(result?.status || "").toLowerCase();
  const delivered = status === "delivered";
  const failed = status === "failed";

  return (
    <main style={{maxWidth:640,margin:"60px auto",padding:24}}>
      <h1>A. Halliwell Fax</h1><p>From: +1 313-855-4074</p>
      <form onSubmit={submit} style={{display:"grid",gap:16}}>
        <label>Destination fax number<input name="to" type="tel" inputMode="tel" placeholder="855-555-1234" required style={{display:"block",width:"100%",padding:12,marginTop:6}} /></label>
        <label>Document<input name="file" type="file" accept=".pdf,.tif,.tiff,.jpg,.jpeg,.png,.doc,.docx,.rtf,.txt" required style={{display:"block",marginTop:6}} /></label>
        <button type="submit" disabled={sending} style={{padding:14}}>{sending ? "Submitting…" : "Send Fax"}</button>
      </form>

      {result?.faxId && <section style={{marginTop:28,padding:18,border:"1px solid currentColor",borderRadius:12}}>
        <h2 style={{marginTop:0}}>Fax status</h2>
        <p style={{fontSize:22,fontWeight:700}}>{delivered ? "✓ Delivered" : failed ? "✕ Failed" : checking ? "Checking…" : result.status || "Queued"}</p>
        <p>Fax ID: {result.faxId}</p>
        {result.pageCount ? <p>Pages: {result.pageCount}</p> : null}
        {result.completedAt ? <p>Completed: {new Date(result.completedAt).toLocaleString()}</p> : null}
        {!delivered && !failed ? <p>Status refreshes automatically every 5 seconds.</p> : null}
        <button type="button" onClick={() => void checkStatus(result.faxId!)} disabled={checking} style={{padding:10}}>{checking ? "Checking…" : "Check now"}</button>
        {result.error ? <p>{result.error}</p> : null}
        {failed && result.errors?.length ? <pre style={{whiteSpace:"pre-wrap",overflowWrap:"anywhere"}}>{JSON.stringify(result.errors,null,2)}</pre> : null}
      </section>}

      {result && !result.faxId && !result.ok ? <section style={{marginTop:24}}><strong>Fax was not submitted.</strong><p>{result.error}</p></section> : null}
    </main>
  );
}
