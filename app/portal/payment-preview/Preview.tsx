"use client";
import { useState } from "react";
import PaymentJourney from "../projects/[id]/PaymentJourney";

export default function Preview() {
  const [received, setReceived] = useState(0);
  const milestones = [
    { label: "Project deposit", amount: 187500 },
    { label: "First concept", amount: 93750 },
    { label: "Final delivery", amount: 93750 },
  ].map((item, index) => ({ ...item, paid: index < received, issued: index === received }));
  return <section className="portal-card portal-project-detail"><small>PRIVATE DESIGN PREVIEW</small><h1>Custom Illustrated Venue Experience Map</h1><div className="portal-welcome"><h2>Welcome, Valerie.</h2><p>Your project dashboard houses the agreement, payments, updates, and final deliverables throughout the creative process.</p></div><PaymentJourney projectId="visual-approval-preview" milestones={milestones}/><div className="portal-preview-controls"><p>These buttons only demonstrate the appearance of a confirmed payment. They do not change an invoice or send an email.</p><button type="button" onClick={() => setReceived(Math.min(received + 1, 3))} disabled={received === 3}>Preview next payment receipt</button><button type="button" onClick={() => setReceived(0)}>Reset preview</button></div></section>;
}
