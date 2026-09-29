"use client";

import { useState } from "react";

type Method = "zelle" | "chase" | "card" | "check";

export default function PaymentOptions({ amount, invoiceNumber, zelleId, bankLink, stripeUrl, checkAddress, preview = false }: {
  amount: string; invoiceNumber: string; zelleId: string; bankLink: string | null; stripeUrl: string | null; checkAddress: string; preview?: boolean;
}) {
  const [selected, setSelected] = useState<Method>(zelleId || preview ? "zelle" : stripeUrl ? "card" : "check");
  const [copied, setCopied] = useState(false);
  const options: { id: Method; name: string; detail: string; available: boolean }[] = [
    { id: "zelle", name: "Zelle", detail: "Preferred bank transfer", available: !!zelleId || preview },
    { id: "chase", name: "Chase invoice", detail: "Bank supplied payment page", available: !!bankLink || preview },
    { id: "card", name: "Card", detail: "Secure Stripe checkout", available: !!stripeUrl || preview },
    { id: "check", name: "Check", detail: "Mail a check", available: !!checkAddress || preview },
  ];
  async function copyRecipient() {
    try { await navigator.clipboard.writeText(zelleId); setCopied(true); window.setTimeout(() => setCopied(false), 2500); }
    catch { setCopied(false); }
  }
  return <div className="portal-payment-chooser">
    <h3>Choose how to pay</h3>
    <p>Choose one method for this invoice. The studio confirms bank and check payments after they arrive.</p>
    <div className="portal-payment-methods" role="group" aria-label="Payment method">
      {options.map(option => <button key={option.id} type="button" disabled={!option.available} aria-pressed={selected === option.id} onClick={() => setSelected(option.id)}><strong>{option.name}</strong><span>{option.detail}</span>{!option.available && <small>Not available yet</small>}</button>)}
    </div>
    {preview && <p className="portal-preview-safety">Test preview only. No payment can be sent from this sample.</p>}
    {selected === "zelle" && <div className="portal-payment-detail"><h4>Pay with Zelle</h4><p>Open Zelle in your own banking app. Send <strong>{amount}</strong> using the recipient below and include <strong>{invoiceNumber}</strong> as the memo. Confirm the recipient name in your bank before sending.</p><p className="portal-payment-recipient">{preview ? "Recipient appears on an issued invoice" : zelleId}</p>{!preview && <button type="button" onClick={() => void copyRecipient()}>{copied ? "Copied" : "Copy Zelle recipient"}</button>}<p><a href="https://www.zellepay.com/how-it-works" target="_blank" rel="noopener noreferrer">How to use Zelle</a></p><small>Preferred. Chase does not add a Zelle transaction fee to its business account. Check your own bank’s terms and payment limits.</small></div>}
    {selected === "chase" && <div className="portal-payment-detail"><h4>Pay through the Chase invoice</h4><p>Open the issued Chase invoice for <strong>{amount}</strong>. Use this option only if you have not paid by another method.</p>{preview ? <button type="button" disabled>Open Chase invoice payment page</button> : bankLink && <a className="portal-payment-button" href={bankLink} target="_blank" rel="noopener noreferrer">Open Chase invoice payment page</a>}</div>}
    {selected === "card" && <div className="portal-payment-detail"><h4>Pay by card</h4><p>Stripe opens a secure invoice for <strong>{amount}</strong>. Use this option only if you have not paid by another method.</p>{preview ? <button type="button" disabled>Open Stripe checkout</button> : stripeUrl && <a className="portal-payment-button" href={stripeUrl} target="_blank" rel="noopener noreferrer">Open Stripe checkout</a>}</div>}
    {selected === "check" && <div className="portal-payment-detail"><h4>Pay by check</h4><p>Make the check payable to <strong>A. Halliwell Studio LLC</strong> for <strong>{amount}</strong>. Write <strong>{invoiceNumber}</strong> on the memo line.</p><p className="portal-payment-address">{preview ? "Mailing address appears once the studio supplies it" : checkAddress}</p><small>The studio updates the invoice after the check arrives and clears.</small></div>}
  </div>;
}
