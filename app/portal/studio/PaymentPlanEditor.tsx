"use client";

import { FormEvent, useState } from "react";
import { defaultMilestoneAmounts, milestoneLabels } from "@/lib/portal-plan";

const dollars = (cents: number) => (cents / 100).toFixed(2);
const parseCents = (value: string) => {
  if (!/^\d{1,7}(\.\d{1,2})?$/.test(value.trim())) return null;
  const [whole, decimal = ""] = value.trim().split(".");
  return Number(whole) * 100 + Number(decimal.padEnd(2, "0"));
};

export default function PaymentPlanEditor({ projectId, total, amounts, busy, post }: {
  projectId: string;
  total: number;
  amounts: [number, number, number];
  busy: boolean;
  post: (data: Record<string, string>) => Promise<void>;
}) {
  const [totalText, setTotalText] = useState(total ? dollars(total) : "");
  const [parts, setParts] = useState(amounts.map(amount => amount ? dollars(amount) : ""));
  const totalCents = parseCents(totalText);
  const partCents = parts.map(parseCents);
  const sum = partCents.reduce<number>((value, amount) => value + (amount || 0), 0);
  const valid = !!totalCents && partCents.every(amount => amount !== null && amount > 0) && sum === totalCents;
  function split() {
    if (!totalCents) return;
    setParts(defaultMilestoneAmounts(totalCents).map(dollars));
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!valid) return;
    void post({ action: "updatePaymentPlan", projectId, total: totalText, milestone1: parts[0], milestone2: parts[1], milestone3: parts[2] });
  }
  return <form className="portal-studio-form portal-payment-plan" onSubmit={submit}>
    <h4>Plan the full investment</h4>
    <p>Set the project total, then divide it across the three payments. These amounts appear in the client journey. Dates can be decided when each invoice is issued.</p>
    <label>Project total in USD<input inputMode="decimal" type="number" min="0.03" step="0.01" value={totalText} onChange={event => { const next = event.target.value; setTotalText(next); const parsed = parseCents(next); if (parsed && parsed >= 3) setParts(defaultMilestoneAmounts(parsed).map(dollars)); }} required /></label>
    <button type="button" className="portal-plan-split" onClick={split} disabled={!totalCents}>Split 50 / 25 / 25</button>
    <div className="portal-plan-parts">{milestoneLabels.map((label, index) => <label key={label}>0{index + 1} {label}<input inputMode="decimal" type="number" min="0.01" step="0.01" value={parts[index]} onChange={event => setParts(current => current.map((part, at) => at === index ? event.target.value : part))} required /></label>)}</div>
    <p className={valid ? "portal-plan-balance is-balanced" : "portal-plan-balance"} role="status">{totalCents ? (valid ? "The three payments match the project total." : `${dollars(Math.abs(totalCents - sum))} ${sum > totalCents ? "over" : "left to allocate"}.`) : "Enter the project total to begin."}</p>
    <button type="submit" disabled={busy || !valid}>Save payment plan</button>
    <p>Amounts already attached to an active invoice cannot change until that invoice is corrected or voided. Once the client signs the payment terms, use an amended agreement for changes.</p>
  </form>;
}
