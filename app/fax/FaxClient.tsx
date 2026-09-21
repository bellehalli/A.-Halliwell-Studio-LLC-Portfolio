"use client";

import { FormEvent, useState } from "react";

type Result = {
  ok?: boolean;
  faxId?: string | null;
  status?: string;
  error?: string;
  telnyxStatus?: number;
  telnyx?: unknown;
};

export default function FaxClient() {
  const [result, setResult] = useState<Result | null>(null);
  const [sending, setSending] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setResult(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("/api/fax/send", {
        method: "POST",
        body: data,
      });
      const json = await response.json();
      setResult(json);
    } catch {
      setResult({ ok: false, error: "Could not reach the fax server." });
    } finally {
      setSending(false);
    }
  }

  return (
    <main style={{maxWidth: 640, margin: "60px auto", padding: 24}}>
      <h1>A. Halliwell Fax</h1>
      <p>From: +1 313-855-4074</p>

      <form onSubmit={submit} style={{display: "grid", gap: 16}}>
        <label>
          Destination fax number
          <input
            name="to"
            type="tel"
            inputMode="tel"
            placeholder="855-555-1234"
            required
            style={{display: "block", width: "100%", padding: 12, marginTop: 6}}
          />
        </label>

        <label>
          Document
          <input
            name="file"
            type="file"
            accept=".pdf,.tif,.tiff,.jpg,.jpeg,.png,.doc,.docx,.rtf,.txt"
            required
            style={{display: "block", marginTop: 6}}
          />
        </label>

        <button type="submit" disabled={sending} style={{padding: 14}}>
          {sending ? "Submitting…" : "Send Fax"}
        </button>
      </form>

      {result && (
        <section style={{marginTop: 24}}>
          {result.ok ? (
            <>
              <strong>Fax accepted by Telnyx.</strong>
              <p>Status: {result.status}</p>
              {result.faxId && <p>Fax ID: {result.faxId}</p>}
              <p>Queued does not mean delivered. Wait for a delivered status/webhook.</p>
            </>
          ) : (
            <>
              <strong>Fax was not submitted.</strong>
              <p>{result.error}</p>
              {result.telnyxStatus && <p>Telnyx HTTP status: {result.telnyxStatus}</p>}
              {result.telnyx ? (
                <pre style={{whiteSpace: "pre-wrap", overflowWrap: "anywhere"}}>
                  {JSON.stringify(result.telnyx, null, 2)}
                </pre>
              ) : null}
            </>
          )}
        </section>
      )}
    </main>
  );
}
