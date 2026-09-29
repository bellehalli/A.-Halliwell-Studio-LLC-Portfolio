"use client";

import { useState } from "react";

export default function PortalFeedback({ deliverableId }: { deliverableId: string }) {
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function send(decision: "changes_requested" | "approved") {
    if (decision === "changes_requested" && !note.trim()) { setMessage("Add your revision notes first."); return; }
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/portal/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ deliverableId, decision, note }) });
      if (!response.ok) throw new Error();
      setMessage(decision === "approved" ? "Approved. Thank you!" : "Your revision notes were sent to the studio.");
      window.location.reload();
    } catch { setMessage("We couldn't save that decision. Please try again."); }
    finally { setBusy(false); }
  }
  return <div className="portal-feedback"><label htmlFor={`note-${deliverableId}`}>Revision notes for this version</label><textarea id={`note-${deliverableId}`} value={note} maxLength={4000} onChange={event => setNote(event.target.value)} placeholder="What would you like adjusted?" /><button type="button" disabled={busy} onClick={() => send("changes_requested")}>Request revisions</button><button type="button" disabled={busy} onClick={() => send("approved")}>Approve this version</button>{message && <p role="status">{message}</p>}</div>;
}
