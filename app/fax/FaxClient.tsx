"use client";

import { FormEvent, useEffect, useState } from "react";

type AnyJson = Record<string, any>;

const EXISTING_FAX_ID = "70e35733-4cdc-4dd5-bc52-047b70123ea8";

export default function FaxClient() {
  const [result, setResult] = useState<AnyJson | null>({
    faxId: EXISTING_FAX_ID,
    status: "checking",
  });
  const [sending, setSending] = useState(false);
  const [checking, setChecking] = useState(false);

  async function checkStatus(faxId: string) {
    setChecking(true);
    try {
      const response = await fetch(
        `/api/fax/status/${encodeURIComponent(faxId)}`,
        { cache: "no-store" }
      );
      const json = await response.json();

      const fax = json?.telnyxResponse?.data ?? {};
      setResult({
        ...json,
        faxId,
        status: fax.status ?? json.status ?? "unknown",
        fax,
      });
    } catch {
      setResult({
        faxId,
        status: "error",
        error: "Could not check fax status.",
      });
    } finally {
      setChecking(false);
    }
  }

  useEffect(() => {
    void checkStatus(EXISTING_FAX_ID);
  }, []);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setResult(null);

    try {
      const response = await fetch("/api/fax/send", {
        method: "POST",
        body: new FormData(e.currentTarget),
      });
      const json = await response.json();
      setResult(json);

      if (json?.faxId) {
        window.setTimeout(() => void checkStatus(json.faxId), 1500);
      }
    } catch {
      setResult({ status: "error", error: "Could not reach the fax server." });
    } finally {
      setSending(false);
    }
  }

  const status = String(result?.status || "").toLowerCase();

  return (
    <main style={{ maxWidth: 680, margin: "60px auto", padding: 24 }}>
      <h1>A. Halliwell Fax</h1>
      <p>From: +1 313-855-4074</p>

      <form onSubmit={submit} style={{ display: "grid", gap: 16 }}>
        <label>
          Destination fax number
          <input
            name="to"
            type="tel"
            inputMode="tel"
            placeholder="855-555-1234"
            required
            style={{ display: "block", width: "100%", padding: 12, marginTop: 6 }}
          />
        </label>

        <label>
          Document
          <input
            name="file"
            type="file"
            accept=".pdf,.tif,.tiff,.jpg,.jpeg,.png,.doc,.docx,.rtf,.txt"
            required
            style={{ display: "block", marginTop: 6 }}
          />
        </label>

        <button type="submit" disabled={sending} style={{ padding: 14 }}>
          {sending ? "Submitting…" : "Send Fax"}
        </button>
      </form>

      {result?.faxId && (
        <section style={{ marginTop: 28, padding: 18, border: "1px solid currentColor", borderRadius: 12 }}>
          <h2 style={{ marginTop: 0 }}>Fax status</h2>
          <p style={{ fontSize: 22, fontWeight: 700 }}>
            {checking ? "Checking…" : status || "Unknown"}
          </p>
          <p>Fax ID: {result.faxId}</p>

          <button
            type="button"
            onClick={() => void checkStatus(result.faxId)}
            disabled={checking}
            style={{ padding: 10 }}
          >
            {checking ? "Checking…" : "Check now"}
          </button>

          <h3>Telnyx diagnostic response</h3>
          <pre style={{
            whiteSpace: "pre-wrap",
            overflowWrap: "anywhere",
            padding: 12,
            border: "1px solid currentColor",
            borderRadius: 8,
            fontSize: 12
          }}>
            {JSON.stringify(result?.telnyxResponse ?? result, null, 2)}
          </pre>
        </section>
      )}
    </main>
  );
}
