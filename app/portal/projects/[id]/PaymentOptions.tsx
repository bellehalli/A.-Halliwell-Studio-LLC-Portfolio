"use client";

import { useState } from "react";
import EmbeddedStripePayment from "./EmbeddedStripePayment";

type Method = "zelle" | "ach" | "chase" | "card" | "check";
const methods: Method[] = ["zelle", "ach", "chase", "card", "check"];

export default function PaymentOptions({ documentId, amount, invoiceNumber, zelleId, bankLink, achUrl, stripeUrl, checkAddress, selectedMethod, submitted = false, preview = false, readonly = false }: {
  documentId: string; amount: string; invoiceNumber: string; zelleId: string; bankLink: string | null; achUrl: string; stripeUrl: string | null; checkAddress: string; selectedMethod: string; submitted?: boolean; preview?: boolean; readonly?: boolean;
}) {
  const [selected, setSelected] = useState<Method | null>(methods.includes(selectedMethod as Method) ? selectedMethod as Method : null);
  const [reported, setReported] = useState(submitted);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [copied, setCopied] = useState(false);
  const options: { id: Method; name: string; detail: string; available: boolean }[] = [
    { id: "zelle", name: "Zelle", detail: "Our preferred way to pay", available: !!zelleId || preview },
    { id: "ach", name: "Bank transfer", detail: "Pay from your bank account with ACH", available: !!achUrl || preview },
    { id: "chase", name: "Chase invoice", detail: "Bank supplied payment page", available: !!bankLink || preview },
    { id: "card", name: "Debit or credit card", detail: "Pay here securely with Stripe", available: !!stripeUrl || preview },
    { id: "check", name: "Check", detail: "Mail a check", available: !!checkAddress || preview },
  ];
  async function choose(method: Method) {
    if (readonly) { setSelected(method); return; }
    setSaving(true); setNotice("");
    try {
      const response = await fetch("/api/portal/payment-choice", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ documentId, method }) });
      const data = await response.json();
      if (!response.ok) throw Error(data.message || "The choice could not be saved.");
      setSelected(method);
      setNotice(preview ? "Test choice saved to the studio workspace. No payment is due." : "Your choice was shared with the studio. Payment is confirmed separately after it arrives.");
    } catch (error) { setNotice(error instanceof Error ? error.message : "The choice could not be saved."); }
    finally { setSaving(false); }
  }
  async function reportPayment() {
    if (!selected || readonly || preview || selected === "card") return;
    setSaving(true); setNotice("");
    try {
      const response = await fetch("/api/portal/payment-choice", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ documentId, method: selected, action: "reportPayment" }) });
      const data = await response.json();
      if (!response.ok) throw Error(data.message || "Could not report payment.");
      setReported(true); setNotice(data.message);
    } catch (error) { setNotice(error instanceof Error ? error.message : "Could not report payment."); }
    finally { setSaving(false); }
  }
  async function copyRecipient() {
    try { await navigator.clipboard.writeText(zelleId); setCopied(true); window.setTimeout(() => setCopied(false), 2500); }
    catch { setCopied(false); }
  }
  if (reported && !readonly) return <p className="portal-payment-notice">Payment submitted. Awaiting studio approval. No further payment is needed for this invoice while it is being reviewed.</p>;
  return <div className="portal-payment-chooser">
    <h3>A little closer to bringing your project to life</h3>
    <p>Choose the payment option that feels easiest for you.</p>
    {!!zelleId && !preview && <section className="portal-zelle-welcome" aria-label="Preferred payment instructions"><span className="portal-payment-preferred">Preferred payment method</span><h4>Zelle</h4><p>Send <strong>{amount}</strong> from Zelle in your banking app to</p><p className="portal-payment-recipient">{zelleId}</p><button type="button" onClick={() => void copyRecipient()}>{copied ? "Email copied" : "Copy Zelle email"}</button><p>Add <strong>{invoiceNumber}</strong> in the memo so we can match it to your project. Please check the recipient before sending.</p><small>Once sent, select Zelle below and let us know. We’ll confirm it here after it arrives.</small></section>}
    <p>{readonly ? "Preview the available methods. No choice is submitted from this view." : "Choosing an option lets us know how you plan to pay. You won’t be charged by selecting it."}</p>
    <div className="portal-payment-methods" role="group" aria-label="Payment method">
      {options.map(option => <button key={option.id} type="button" disabled={!option.available || saving || reported} aria-pressed={selected === option.id} onClick={() => void choose(option.id)}><strong>{option.name}</strong><span>{option.detail}</span>{!option.available && <small>Not available yet</small>}</button>)}
    </div>
    {saving && <p role="status">Saving your choice…</p>}
    {notice && <p className="portal-payment-notice" role="status" aria-live="polite">{notice}</p>}
    {preview && <p className="portal-preview-safety">Test preview only. No payment can be sent from this sample.</p>}
    {readonly && <p className="portal-preview-safety">Manager preview. Payment submission is disabled. The Stripe option can load its real fields for review.</p>}
    {selected === "zelle" && <div className="portal-payment-detail"><h4>Pay with Zelle</h4><p>Open Zelle in your own banking app. Send <strong>{amount}</strong> using the recipient below and include <strong>{invoiceNumber}</strong> as the memo. Confirm the recipient name in your bank before sending.</p><p className="portal-payment-recipient">{preview ? "Recipient appears on an issued invoice" : zelleId}</p>{!preview && <button type="button" onClick={() => void copyRecipient()}>{copied ? "Copied" : "Copy Zelle recipient"}</button>}<p><a href="https://www.zellepay.com/how-it-works" target="_blank" rel="noopener noreferrer">How to use Zelle</a></p><small>Preferred. Check your bank’s terms and payment limits.</small></div>}
    {selected === "ach" && <div className="portal-payment-detail"><h4>Pay by ACH</h4><p>Use the studio supplied secure bank payment page for <strong>{amount}</strong>. Your bank details stay on that payment page.</p>{preview || readonly ? <button type="button" disabled>Open ACH payment page</button> : <a className="portal-payment-button" href={achUrl} target="_blank" rel="noopener noreferrer">Open ACH payment page</a>}</div>}
    {selected === "chase" && <div className="portal-payment-detail"><h4>Pay through the Chase invoice</h4><p>Open the issued Chase invoice for <strong>{amount}</strong>. Use this option only if you have not paid by another method.</p>{preview || readonly ? <button type="button" disabled>Open Chase invoice payment page</button> : bankLink && <a className="portal-payment-button" href={bankLink} target="_blank" rel="noopener noreferrer">Open Chase invoice payment page</a>}</div>}
    {selected === "card" && <div className="portal-payment-detail"><h4>Pay by debit or credit card</h4><p>Pay <strong>{amount}</strong> right here. Stripe keeps your card details secure, and you don’t need a Stripe account.</p><small>Already sent your payment another way? Please let us know instead of paying again.</small>{preview ? <button type="button" disabled>Embedded Stripe payment preview</button> : stripeUrl && <EmbeddedStripePayment documentId={documentId} stripeUrl={stripeUrl} preview={readonly}/>}</div>}
    {selected === "check" && <div className="portal-payment-detail"><h4>Pay by check</h4><p>Make the check payable to <strong>A. Halliwell Studio LLC</strong> for <strong>{amount}</strong>. Write <strong>{invoiceNumber}</strong> on the memo line.</p><p className="portal-payment-address">{preview ? "Mailing address appears once the studio supplies it" : checkAddress}</p><small>The studio updates the invoice after the check arrives and clears.</small></div>}
    {reported ? <p>Payment submitted. Awaiting studio approval.</p> : selected && selected !== "card" && !readonly && !preview && <button type="button" disabled={saving} onClick={() => void reportPayment()}>I’ve sent my payment</button>}
  </div>;
}
