"use client";

import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

type Details = { publishableKey: string; clientSecret: string; projectId: string };

function PaymentForm({ projectId }: { projectId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!stripe || !elements || busy) return;
    setBusy(true); setMessage("");
    try {
      const { error: validation } = await elements.submit();
      if (validation) { setMessage(validation.message || "Check your payment details."); return; }
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: `${window.location.origin}/portal/projects/${projectId}` },
        redirect: "if_required",
      });
      if (error) setMessage(error.message || "Payment could not be completed. Try again.");
      else if (paymentIntent?.status === "succeeded") { setMessage("Stripe received your payment. The invoice status will update shortly."); router.refresh(); }
      else { setMessage("Stripe is processing your payment. Please check the invoice status before trying another method."); router.refresh(); }
    } catch { setMessage("Payment could not be completed. Check your invoice before trying again."); }
    finally { setBusy(false); }
  }
  return <form className="portal-stripe-form" onSubmit={submit}>
    <PaymentElement options={{ layout: "tabs" }} />
    <button type="submit" disabled={!stripe || !elements || busy}>{busy ? "Processing…" : "Pay securely with Stripe"}</button>
    {message && <p role="status" aria-live="polite">{message}</p>}
  </form>;
}

export default function EmbeddedStripePayment({ documentId, stripeUrl }: { documentId: string; stripeUrl: string }) {
  const [details, setDetails] = useState<Details | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/portal/stripe-embed", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ documentId }), signal: controller.signal })
      .then(async response => { const data = await response.json(); if (!response.ok) throw Error(data.message || "Embedded payment is unavailable."); return data as Details; })
      .then(data => setDetails(data))
      .catch(reason => { if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : "Embedded payment is unavailable."); });
    return () => controller.abort();
  }, [documentId]);
  return <div className="portal-stripe-embed">
    {!details && !error && <p role="status">Loading secure payment fields…</p>}
    {details && <Elements stripe={loadStripe(details.publishableKey)} options={{ clientSecret: details.clientSecret, appearance: { theme: "stripe", variables: { colorPrimary: "#60217d", colorText: "#32243a", borderRadius: "8px" } } }}><PaymentForm projectId={details.projectId} /></Elements>}
    {error && <p role="status">{error}</p>}
    <p><a href={stripeUrl} target="_blank" rel="noopener noreferrer">Open secure Stripe invoice instead</a></p>
  </div>;
}
