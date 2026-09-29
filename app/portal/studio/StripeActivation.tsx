"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import EmbeddedStripePayment from "../projects/[id]/EmbeddedStripePayment";
type Report = { hostedUrl: string | null; stripeId: string; stripeStatus: string; embedded: boolean; hosted: boolean; clientReady: boolean; issues: string[]; message: string };
export default function StripeActivation({ documentId }: { documentId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const [preview, setPreview] = useState(false);
  async function check(action: "connect" | "check") {
    setBusy(true); setMessage(""); setPreview(false); setReport(null);
    try {
      const response = await fetch("/api/portal/studio/stripe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ documentId, action }) });
      const data = await response.json();
      if (!response.ok) throw Error(data.message || "Stripe could not be checked.");
      setReport(data); setMessage(data.message); router.refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Stripe could not be checked."); }
    finally { setBusy(false); }
  }
  return <section className="portal-stripe-activation"><h4>Activate Stripe for this payment</h4><p>Connect the open Stripe invoice matching this client’s email and milestone amount. Existing payment details stay intact.</p>
    <div className="portal-invoice-actions"><button type="button" disabled={busy} onClick={() => void check("connect")}>{busy ? "Checking Stripe…" : "Connect Stripe"}</button><button type="button" disabled={busy} onClick={() => void check("check")}>Check client readiness</button></div>
    {message && <p role="status">{message}</p>}
    {report && <><p><strong>{report.clientReady ? "Stripe checkout is ready for the client." : "Stripe is connected. Complete the steps below to make it available to the client."}</strong></p><p>Stripe invoice {report.stripeId}<br/>Status {report.stripeStatus}<br/>Embedded fields {report.embedded ? "available" : "unavailable"}<br/>Hosted checkout {report.hosted ? "available" : "unavailable"}</p>{report.issues.length > 0 && <ul>{report.issues.map(issue => <li key={issue}>{issue}</li>)}</ul>}<button type="button" disabled={!report.embedded} onClick={() => setPreview(value => !value)}>{preview ? "Close Stripe preview" : "Preview real Stripe fields"}</button>{preview && <EmbeddedStripePayment documentId={documentId} preview/>}{report.hosted && report.hostedUrl && <p><a href={report.hostedUrl} target="_blank" rel="noopener noreferrer">Open hosted Stripe invoice</a></p>}</>}
    <p>Connecting and checking do not email the client or charge anything. The preview has no Pay button. If multiple invoices match, use Edit payment details to choose the invoice ID.</p>
  </section>;
}
