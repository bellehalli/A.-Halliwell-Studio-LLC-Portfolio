"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { leadStages, leadStageLabels, type Lead } from "@/lib/lead-fields";

const date = (value: string) => new Date(value).toLocaleDateString("en-US", { timeZone: "America/Detroit", month: "short", day: "numeric", year: "numeric" });
const today = () => new Date().toLocaleDateString("en-CA", { timeZone: "America/Detroit" });
const due = (lead: Lead) => !["won", "lost"].includes(lead.stage) && !!lead.followUpOn && lead.followUpOn <= today();

export default function LeadsDesk({ leads }: { leads: Lead[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState(leads[0]?.id || "");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("active");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const visible = leads.filter(lead => (filter === "all" || filter === "active" && !["won", "lost"].includes(lead.stage) || filter === "due" && due(lead) || lead.stage === filter)
    && [lead.name, lead.email, lead.business, lead.projectType, ...lead.needs].join(" ").toLowerCase().includes(search.toLowerCase()));
  const lead = visible.find(item => item.id === selected) || visible[0];

  async function submit(event: FormEvent<HTMLFormElement>, action: string) {
    event.preventDefault();
    if (!lead || busy) return;
    const values = Object.fromEntries(new FormData(event.currentTarget));
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/portal/studio/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...values, action, id: lead.id, revision: lead.revision }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Could not save this lead.");
      setMessage(action === "createWorkspace" ? "Private client workspace ready. Open the client desk to prepare the documents and invite them when you are ready." : "Lead saved.");
      router.refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not save this lead."); }
    finally { setBusy(false); }
  }

  return <div className="leads-desk">
    <div className="leads-counts"><div><strong>{leads.filter(item => !["won", "lost"].includes(item.stage)).length}</strong><span>Open conversations</span></div><div><strong>{leads.filter(due).length}</strong><span>Follow-ups due</span></div><div><strong>{leads.filter(item => item.projectId).length}</strong><span>Connected workspaces</span></div></div>
    <div className="leads-toolbar"><label>Find a conversation<input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Name, business, email, or service" /></label><label>Show<select value={filter} onChange={event => { setFilter(event.target.value); setMessage(""); }}><option value="active">Open conversations</option><option value="all">All leads</option><option value="due">Follow-ups due</option>{leadStages.map(stage => <option key={stage} value={stage}>{leadStageLabels[stage]}</option>)}</select></label></div>
    <p role="status" aria-live="polite" className="leads-message">{message}</p>
    {!lead ? <div className="leads-empty"><h2>{leads.length ? "No conversations match just yet." : "Room for your next lovely project."}</h2><p>{leads.length ? "Try another search or choose All leads." : "New Start Project inquiries will appear here with their brief and a follow-up date. Earlier email-only inquiries are not imported automatically."}</p></div> : <div className="leads-layout">
      <nav className="leads-list" aria-label="Project inquiries">{visible.map(item => <button key={item.id} type="button" disabled={busy} aria-pressed={item.id === lead.id} onClick={() => { setSelected(item.id); setMessage(""); }}><span>{leadStageLabels[item.stage]}</span><strong>{item.business || item.name}</strong><span>{item.name}</span><small>{due(item) ? "Follow-up due" : `Received ${date(item.createdAt)}`}</small></button>)}</nav>
      <article className="lead-detail" key={`${lead.id}-${lead.revision}`}>
        <small>{lead.classification}</small><h2>{lead.business || lead.name}</h2><p><a href={`mailto:${lead.email}`}>{lead.email}</a></p>
        <div className="lead-brief"><h3>The project brief</h3><dl>
          <dt>Business type</dt><dd>{lead.projectType}</dd><dt>Requested services</dt><dd>{lead.needs.join(", ")}</dd><dt>Investment range</dt><dd>{lead.investment}</dd><dt>Timing preference</dt><dd>{lead.timing}</dd><dt>Current website</dt><dd>{lead.currentUrl || "Not provided"}</dd><dt>Current challenge</dt><dd>{lead.currentProblem || "Not provided"}</dd><dt>Success looks like</dt><dd>{lead.successGoal || "Not provided"}</dd><dt>Materials ready</dt><dd>{lead.assets.join(", ") || "Not provided"}</dd><dt>How they found us</dt><dd>{lead.source}</dd>
          {lead.productCount && <><dt>Product count</dt><dd>{lead.productCount}</dd></>}{lead.bookingType && <><dt>Booking needs</dt><dd>{lead.bookingType}</dd></>}{lead.guestPain && <><dt>Guest experience</dt><dd>{lead.guestPain}</dd></>}
        </dl></div>
        <form className="lead-form" onSubmit={event => void submit(event, "update")}>
          <h3>Keep the conversation moving.</h3><div className="lead-pair"><label>Contact name<input name="name" required maxLength={100} defaultValue={lead.name} /></label><label>Email<input name="email" type="email" required maxLength={254} defaultValue={lead.email} /></label></div>
          <label>Business<input name="business" maxLength={150} defaultValue={lead.business} /></label>
          <div className="lead-pair"><label>Stage<select name="stage" defaultValue={lead.stage}>{leadStages.map(stage => <option key={stage} value={stage}>{leadStageLabels[stage]}</option>)}</select></label><label>Follow-up date<input name="followUpOn" type="date" defaultValue={lead.followUpOn} /></label></div>
          <label>Next action<input name="nextAction" maxLength={500} defaultValue={lead.nextAction} placeholder="Review brief, call, or prepare a proposal" /></label><label>Private studio notes<textarea name="notes" rows={5} maxLength={6000} defaultValue={lead.notes} /></label>
          {lead.projectId && <p className="lead-help">These are lead details. Edit an existing portal recipient from the client desk if their sign-in email needs to change.</p>}
          <button type="submit" disabled={busy}>{busy ? "Saving…" : "Save conversation"}</button>
        </form>
        <section className="lead-workspace"><h3>A home for the project.</h3>{lead.projectId ? <Link href={`/portal/studio?project=${lead.projectId}`}>Open client workspace</Link> : <form className="lead-form" onSubmit={event => void submit(event, "createWorkspace")}><p>Create a private workspace using this contact and brief. You decide when to send the invitation.</p><label>Project title<input name="title" required maxLength={150} defaultValue={`${lead.business || lead.name} — ${lead.needs[0] || "Custom project"}`.slice(0, 150)} /></label><label>Agreed project investment, if known<input name="investment" inputMode="decimal" placeholder="Leave blank until the scope is agreed" /><span className="lead-help">Enter the complete amount in dollars. Payment milestones are set in the client desk.</span></label><button type="submit" disabled={busy}>Create private workspace</button></form>}</section>
        <details className="lead-history"><summary>Conversation history</summary><ol>{[...lead.history].reverse().map((item, index) => <li key={`${item.at}-${index}`}><strong>{item.action}</strong><span>{date(item.at)}{item.stage ? ` · ${leadStageLabels[item.stage as keyof typeof leadStageLabels] || item.stage}` : ""}</span>{item.nextAction && <p>{item.nextAction}</p>}{item.notes && <p>{item.notes}</p>}</li>)}</ol></details>
        <p className="lead-help">Studio notification {lead.studioEmailStatus}. Client confirmation {lead.confirmationStatus}. Accepted means the email provider accepted the message; inbox delivery is not confirmed.</p>
        <p className="lead-help">Consultation bookings remain in Google Calendar. Set this lead&apos;s stage after confirming a booking there.</p>
      </article>
    </div>}
  </div>;
}
