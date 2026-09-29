"use client";

import { useEffect, useRef, useState } from "react";

type Milestone = { label: string; amount: number; paid: boolean; issued: boolean };
const money = (cents: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);

export default function PaymentJourney({ projectId, milestones }: { projectId: string; milestones: Milestone[] }) {
  const [celebrating, setCelebrating] = useState<number | null>(null);
  const replayTimer = useRef<number | null>(null);
  const receiptTimer = useRef<number | null>(null);
  const latestPaid = milestones.findLastIndex(item => item.paid);
  function replayMilestone() {
    if (latestPaid < 0) return;
    if (replayTimer.current) window.clearTimeout(replayTimer.current);
    if (receiptTimer.current) window.clearTimeout(receiptTimer.current);
    setCelebrating(null);
    replayTimer.current = window.setTimeout(() => {
      setCelebrating(latestPaid);
      receiptTimer.current = window.setTimeout(() => setCelebrating(null), 4800);
    }, 40);
  }
  useEffect(() => () => {
    if (replayTimer.current) window.clearTimeout(replayTimer.current);
    if (receiptTimer.current) window.clearTimeout(receiptTimer.current);
  }, []);
  useEffect(() => {
    const paid = milestones.map((item, index) => item.paid ? index : -1).filter(index => index >= 0);
    const key = `ahs-payment-seen-${projectId}`;
    let seen: number[] = [];
    try { seen = JSON.parse(sessionStorage.getItem(key) || "[]") as number[]; } catch { /* The journey works without browser storage. */ }
    const latest = paid.find(index => !seen.includes(index));
    try { sessionStorage.setItem(key, JSON.stringify(paid)); } catch { /* Storage may be disabled. */ }
    if (latest === undefined) return;
    const open = window.setTimeout(() => setCelebrating(latest), 0);
    const close = window.setTimeout(() => setCelebrating(null), 4800);
    return () => { window.clearTimeout(open); window.clearTimeout(close); };
  }, [projectId, milestones]);
  return <section className="portal-payment-journey" aria-labelledby="payment-journey-heading">
    <div className="portal-payment-journey-head"><span>YOUR INVESTMENT JOURNEY</span><h2 id="payment-journey-heading">One lovely step at a time.</h2><p>Three payments across your project. Each step is complete only after payment has been confirmed.</p></div>
    <ol>{milestones.map((item, index) => <li key={item.label} className={item.paid ? "is-paid" : item.issued ? "is-due" : "is-upcoming"}>
      <span className="portal-milestone-number">0{index + 1}</span><div><h3>{item.label}</h3><strong>{money(item.amount)}</strong><span>{item.paid ? "Payment received" : item.issued ? "Invoice ready" : "Coming later"}</span></div>
      <span className="portal-milestone-flower" aria-hidden="true"></span>
      {celebrating === index && <div className="portal-payment-celebration" role="status"><span className="portal-butterfly-flight" aria-hidden="true"><span className="portal-butterfly-asset" /></span><strong>Payment received</strong><small>Another step closer to your finished piece.</small></div>}
    </li>)}</ol>
    {latestPaid >= 0 && <button className="portal-milestone-replay" type="button" onClick={replayMilestone}>Replay milestone moment</button>}
  </section>;
}
