"use client";

import { upload as uploadBlob } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

type StudioDocument = { id: string; kind: string; title: string; invoiceNumber: string; amountCents: number; status: string; paymentUrl: string; achUrl: string; selectedMethod: string; selectedAt: string; zelleId: string; checkAddress: string; studioSigned: boolean; clientSigned: boolean };
type Project = { id: string; title: string; summary: string; stage: string; agreementUrl: string; invoiceId: string; paymentInstructions: string; firstName: string; email: string; clientBusiness: string; investmentCents: number; documents: StudioDocument[]; materials: { id: string; category: string; fileName: string; note: string }[] };
type Panel = "overview" | "agreement" | "invoice" | "review" | "settings";
const stages = ["proposal", "agreement", "invoice", "in_progress", "review", "complete"];
const money = (cents: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);

export default function StudioWorkspace({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState(projects[0]?.id || "");
  const [panel, setPanel] = useState<Panel>("overview");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [inviteRefresh, setInviteRefresh] = useState(0);
  const [uploadState, setUploadState] = useState<Record<string, string>>({});
  const project = projects.find(item => item.id === selected);
  const agreement = project?.documents.find(doc => doc.kind === "agreement");
  const issued = project?.documents.filter(doc => doc.kind === "invoice" && doc.status === "issued") || [];
  const setUploadMessage = (kind: string, value: string) => setUploadState(state => ({ ...state, [kind]: value }));

  async function post(data: Record<string, string>) {
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/portal/studio", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const result = await response.json();
      if (!response.ok) throw Error(result.message || "Could not save changes.");
      if (data.action === "create" && result.id) { setSelected(result.id); setPanel("overview"); }
      if (data.action === "invite") setInviteRefresh(value => value + 1);
      setMessage(data.action === "invite" ? `Resend accepted an invitation for ${result.recipient}. Check the delivery status below; acceptance does not mean it reached the inbox.` : data.action === "create" ? "Private workspace created. You can now attach the agreement and invoice." : "Changes saved.");
      router.refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not save changes."); }
    finally { setBusy(false); }
  }
  function submitCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void post({ action: "create", ...Object.fromEntries(new FormData(event.currentTarget)) as Record<string, string> });
  }
  function submitUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void post({ action: "update", projectId: selected, ...Object.fromEntries(new FormData(event.currentTarget)) as Record<string, string> });
  }
  async function uploadDocument(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const kind = String(data.get("kind"));
    const file = data.get("file");
    if (!(file instanceof File) || !file.size) { setUploadMessage(kind, "Choose a PDF first."); return; }
    if (file.size > 25_000_000 || !file.name.toLowerCase().endsWith(".pdf") || (file.type && file.type !== "application/pdf")) {
      setUploadMessage(kind, "Choose a PDF under 25 MB."); return;
    }
    if (await file.slice(0, 5).text() !== "%PDF-") { setUploadMessage(kind, "This file is not a PDF. Export it as a PDF and try again."); return; }
    setBusy(true); setUploadMessage(kind, "Preparing your private upload.");
    try {
      const safe = `${file.name.slice(0, -4).replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 110) || "document"}.pdf`;
      const pdf = file.type === "application/pdf" ? file : new File([file], file.name, { type: "application/pdf" });
      const blob = await uploadBlob(`portal/${selected}/documents/${crypto.randomUUID()}-${safe}`, pdf, {
        access: "private", handleUploadUrl: "/api/portal/studio/documents/upload",
        clientPayload: JSON.stringify({ projectId: selected, kind }),
        onUploadProgress: ({ percentage }) => setUploadMessage(kind, `Uploading privately. ${Math.round(percentage)} percent complete.`),
      });
      setUploadMessage(kind, "Upload complete. Attaching it to this project.");
      const details = Object.fromEntries(data.entries());
      delete details.file;
      const response = await fetch("/api/portal/studio/documents", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...details, projectId: selected, blobUrl: blob.url }),
      });
      const result = await response.json();
      if (!response.ok) throw Error(result.message || "The PDF uploaded, but could not be attached. Please try again.");
      setUploadMessage(kind, `${kind === "agreement" ? "Agreement" : "Invoice"} attached to ${project?.firstName}'s project. You can open it below.`);
      form.reset();
      router.refresh();
    } catch (error) { setUploadMessage(kind, error instanceof Error ? error.message : "Upload failed. Please try again."); }
    finally { setBusy(false); }
  }
  async function uploadReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setUploadMessage("review", "Publishing the review file.");
    const form = event.currentTarget;
    const body = new FormData(form); body.set("projectId", selected);
    try {
      const response = await fetch("/api/portal/studio/upload", { method: "POST", body });
      const result = await response.json();
      if (!response.ok) throw Error(result.message || "The review file could not be published.");
      setUploadMessage("review", result.notified ? `Version ${result.version} shared and the client emailed.` : `Version ${result.version} shared. The email did not send; contact the client directly.`);
      form.reset(); router.refresh();
    } catch (error) { setUploadMessage("review", error instanceof Error ? error.message : "The review file could not be published."); }
    finally { setBusy(false); }
  }
  const tabs: [Panel, string][] = [["overview", "Overview"], ["agreement", "Agreement"], ["invoice", "Invoices"], ["review", "Review files"], ["settings", "Project details"]];
  return <div className="portal-studio-dashboard">
    <div className="portal-studio-intro"><div><span className="portal-studio-eyebrow">PRIVATE STUDIO DESK</span><h2>Good work deserves a beautiful handoff.</h2><p>Everything your client needs, gathered in one place. Choose a project to prepare its agreement, invoice, and next review.</p></div><div className="portal-studio-monogram" aria-hidden="true">A.</div></div>
    {projects.length > 0 && <div className="portal-studio-picker"><label htmlFor="studio-project">CURRENT PROJECT</label><select id="studio-project" value={selected} onChange={event => { setSelected(event.target.value); setPanel("overview"); setMessage(""); setUploadState({}); }}>{projects.map(item => <option key={item.id} value={item.id}>{item.firstName} · {item.title}</option>)}</select></div>}
    {project && <>
      <div className="portal-studio-feature"><div><span className="portal-studio-eyebrow">{project.clientBusiness || "CLIENT PROJECT"}</span><h3>{project.title}</h3><p>For {project.firstName} · {project.email}</p></div><div className="portal-studio-feature-side"><span>{project.stage.replaceAll("_", " ")}</span>{project.investmentCents > 0 && <strong>{money(project.investmentCents)}</strong>}</div></div>
      <nav className="portal-studio-tabs" aria-label="Manage project">{tabs.map(([id, title]) => <button key={id} type="button" aria-current={panel === id ? "page" : undefined} onClick={() => { setPanel(id); setMessage(""); }}>{title}</button>)}</nav>
      {message && <p className="portal-studio-notice" role="status" aria-live="polite">{message}</p>}
      {panel === "overview" && <section className="portal-studio-panel"><div className="portal-studio-panel-head"><span>01 PROJECT JOURNEY</span><h3>Ready for the next step.</h3><p>Your client sees the signed agreement first, then payment options and the shared project materials.</p></div><div className="portal-studio-milestones">
        <button type="button" onClick={() => setPanel("agreement")}><small>01 AGREEMENT</small><strong>{agreement ? agreement.studioSigned ? "Signed by studio" : "Ready for your signature" : "Attach agreement"}</strong><span>{agreement?.clientSigned ? "Client signed" : "Client signature pending"}</span></button>
        <button type="button" onClick={() => setPanel("invoice")}><small>02 INVESTMENT</small><strong>{issued.length ? `${issued.length} issued invoice${issued.length > 1 ? "s" : ""}` : "Attach Chase invoice"}</strong><span>{project.invoiceId ? "Stripe invoice connected" : "Card checkout optional"}</span></button>
        <button type="button" onClick={() => setPanel("review")}><small>03 CREATIVE REVIEW</small><strong>Share the next proof</strong><span>Private review files and revision notes</span></button>
      </div><div className="portal-studio-send"><div><h4>Invite {project.firstName} to their workspace</h4><p>The invitation becomes available once you have signed the agreement and attached an issued invoice. Jane&apos;s test project can use its nonpayable preview.</p><p className="portal-studio-recipient">Invitation recipient {project.email}</p></div><button type="button" disabled={busy || !agreement?.studioSigned || (!issued.length && !project.title.startsWith("TEST"))} onClick={() => void post({ action: "invite", projectId: selected })}>{busy ? "Working…" : "Send client invitation"}</button></div>
      <InvitationStatus projectId={selected} refreshKey={inviteRefresh} />
      <div className="portal-studio-materials"><h4>Materials from your client</h4>{project.materials.length ? project.materials.map(item => <p key={item.id}><a href={`/api/portal/materials/${item.id}`}>{item.fileName}</a><span>{item.category.replaceAll("_", " ")}{item.note ? ` · ${item.note}` : ""}</span></p>) : <p>When the client shares property photos, plans, or references, they will appear here.</p>}</div></section>}
      {panel === "agreement" && <section className="portal-studio-panel"><div className="portal-studio-panel-head"><span>01 AGREEMENT</span><h3>Set the terms beautifully.</h3><p>Attach the approved agreement, then open it here to add your signature and date.</p></div><form className="portal-studio-form" onSubmit={uploadDocument}><input type="hidden" name="kind" value="agreement" /><label>Agreement title<input name="title" required placeholder="Illustrated Venue Experience Map agreement" /></label><label>Approved PDF<input name="file" type="file" accept=".pdf,application/pdf" required /><small>Private PDF, up to 25 MB. The agreement must be an unencrypted PDF for electronic signing.</small></label><button disabled={busy}>{busy ? "Uploading…" : "Attach agreement"}</button><p className="portal-studio-form-status" role="status" aria-live="polite">{uploadState.agreement}</p></form><div className="portal-studio-attachment-list"><h4>Agreements in this project</h4>{project.documents.filter(doc => doc.kind === "agreement").map(doc => <article key={doc.id}><div><strong>{doc.title}</strong><span>Studio {doc.studioSigned ? "signed" : "signature pending"} · Client {doc.clientSigned ? "signed" : "signature pending"}</span></div><a href={`/portal/agreements/${doc.id}`}>Open agreement</a></article>)}{!agreement && <p>No agreement attached yet.</p>}</div></section>}
      {panel === "invoice" && <section className="portal-studio-panel"><div className="portal-studio-panel-head"><span>02 INVESTMENT</span><h3>Make payment feel simple.</h3><p>Attach the issued Chase invoice and its payment details. Zelle is shown first in the client&apos;s payment choices. The invoice appears to the client after signing.</p><button type="button" onClick={() => router.refresh()}>Refresh client choices</button></div><form className="portal-studio-form portal-studio-invoice-form" onSubmit={uploadDocument}><input type="hidden" name="kind" value="invoice" /><label>Invoice title<input name="title" required placeholder="Project deposit" /></label><div className="portal-studio-form-pair"><label>Chase invoice number<input name="invoiceNumber" required /></label><label>Amount due in USD<input name="amount" type="number" min="0.01" step="0.01" required placeholder="1875.00" /></label></div><label>Due date<input name="dueOn" type="date" /></label><label>Chase invoice payment link<input name="paymentUrl" type="url" placeholder="https://" /></label><label>ACH bank payment link<input name="achUrl" type="url" placeholder="https://" /><small>Paste a verified Chase or Stripe payment page that accepts ACH. Never enter bank account details here.</small></label><label>Zelle recipient<input name="zelleId" defaultValue="arabellakhalliwell@gmail.com" /></label><label>Mail check to<textarea name="checkAddress" maxLength={500} placeholder="Add your mailing address when ready" /></label><label>Issued Chase invoice PDF<input name="file" type="file" accept=".pdf,application/pdf" required /><small>Private PDF, up to 25 MB. A Chase PDF can be attached even if its editing is protected.</small></label><button disabled={busy}>{busy ? "Uploading…" : "Attach Chase invoice"}</button><p className="portal-studio-form-status" role="status" aria-live="polite">{uploadState.invoice}</p></form><div className="portal-studio-attachment-list"><h4>Invoices in this project</h4>{project.documents.filter(doc => doc.kind === "invoice").map(doc => <article key={doc.id} className="portal-studio-invoice-item"><div><strong>{doc.title}</strong><span>Chase {doc.invoiceNumber} · {money(doc.amountCents)} · {doc.status}</span>{doc.selectedMethod && <span className="portal-studio-choice">Client chose {doc.selectedMethod === "card" ? "Card via Stripe" : doc.selectedMethod.toUpperCase()}{doc.selectedAt ? ` on ${new Date(doc.selectedAt).toLocaleString()}` : ""}. Payment is confirmed separately.</span>}</div><a href={`/api/portal/documents/${doc.id}`} target="_blank" rel="noopener noreferrer">View PDF</a><InvoicePaymentEditor doc={doc} projectId={selected} busy={busy} post={post} /></article>)}{!project.documents.some(doc => doc.kind === "invoice") && <p>No invoices attached yet.</p>}</div></section>}
      {panel === "review" && <section className="portal-studio-panel"><div className="portal-studio-panel-head"><span>03 CREATIVE REVIEW</span><h3>A thoughtful first look.</h3><p>Publish a proof when it is ready. The client receives an email and can review it in their workspace.</p></div><form className="portal-studio-form" onSubmit={uploadReview}><label>Version title<input name="title" required placeholder="First concept" /></label><label>Private PDF or image<input name="file" type="file" accept=".pdf,.png,.jpg,.jpeg,.webp" required /><small>Up to 10 MB per file.</small></label><button disabled={busy}>{busy ? "Publishing…" : "Share version and email client"}</button><p className="portal-studio-form-status" role="status" aria-live="polite">{uploadState.review}</p></form></section>}
      {panel === "settings" && <section className="portal-studio-panel"><div className="portal-studio-panel-head"><span>PROJECT DETAILS</span><h3>Everything in its place.</h3><p>Update the project stage and optional payment integrations here.</p></div><form className="portal-studio-form" key={selected} onSubmit={submitUpdate}><label>Stage<select name="stage" defaultValue={project.stage}>{stages.map(stage => <option key={stage} value={stage}>{stage.replaceAll("_", " ")}</option>)}</select></label><label>External signing URL, if needed<input name="agreementUrl" type="url" defaultValue={project.agreementUrl} placeholder="https://" /></label><label>Stripe invoice ID for card checkout<input name="invoiceId" defaultValue={project.invoiceId} placeholder="in_" /><small>Stripe must have issued this invoice to {project.email}, and its amount must match the Chase invoice.</small></label><label>Other payment instructions<textarea name="paymentInstructions" maxLength={1000} defaultValue={project.paymentInstructions} /></label><button disabled={busy}>Save project details</button></form></section>}
    </>}
    <details className="portal-studio-create"><summary>Start a new client project</summary><form className="portal-studio-form" onSubmit={submitCreate}><div className="portal-studio-form-pair"><label>Client first name<input name="firstName" required /></label><label>Client email<input name="email" type="email" required /></label></div><label>Client business<input name="clientBusiness" placeholder="Vale Royal Barn" /></label><label>Project title<input name="title" required placeholder="Custom Illustrated Venue Experience Map" /></label><label>Agreed project investment in USD<input name="investment" type="number" min="0.01" step="0.01" placeholder="3750.00" /></label><label>Short scope summary<textarea name="summary" maxLength={1000} /></label><button disabled={busy}>Create private workspace</button></form></details>
  </div>;
}

type Invitation = { id: string; status: string; at: string };
function InvitationStatus({ projectId, refreshKey }: { projectId: string; refreshKey: number }) {
  const [details, setDetails] = useState<{ recipient: string; invitations: Invitation[]; hasMore: boolean } | null>(null);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setDetails(null);
    setError("");
    fetch(`/api/portal/studio/invitation-status?projectId=${encodeURIComponent(projectId)}`, { signal: controller.signal })
      .then(async response => {
        const result = await response.json();
        if (!response.ok) throw Error(result.message || "Delivery status unavailable.");
        return result;
      })
      .then(result => { setDetails(result); setError(""); })
      .catch(reason => { if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : "Delivery status unavailable."); });
    return () => controller.abort();
  }, [projectId, refreshKey, refresh]);
  const description = (status: string) => {
    if (["delivered", "opened", "clicked"].includes(status)) return "Delivered to the receiving mail server. Check Inbox, Promotions, and Spam.";
    if (["bounced", "failed", "suppressed", "complained", "canceled"].includes(status)) return "Delivery failed. Check the address and your Resend delivery log before trying again.";
    if (status === "delivery_delayed") return "Delivery is delayed. Check again shortly.";
    return "Accepted by Resend. Delivery has not been confirmed yet.";
  };
  return <div className="portal-studio-delivery" aria-live="polite"><div className="portal-studio-delivery-heading"><div><h4>Invitation delivery</h4><p>Check what happened after the email was accepted.</p></div><button type="button" onClick={() => setRefresh(value => value + 1)}>Refresh delivery status</button></div>
    {error && <p role="alert">{error}</p>}
    {details && <><p>Recipient {details.recipient}</p>{details.invitations.length ? <ul>{details.invitations.map(invitation => <li key={invitation.id}><strong>{invitation.status.replaceAll("_", " ")}</strong><span>{new Date(invitation.at).toLocaleString()}</span><p>{description(invitation.status)}</p></li>)}</ul> : <p>No recent invitation found in the latest Resend messages. Check your Resend email log for older sends.{details.hasMore ? " There are additional older messages." : ""}</p>}</>}
  </div>;
}

function InvoicePaymentEditor({ doc, projectId, busy, post }: { doc: StudioDocument; projectId: string; busy: boolean; post: (data: Record<string, string>) => Promise<void> }) {
  if (doc.status !== "issued") return <p>{doc.status === "paid" ? "Payment confirmed." : "This invoice is void and cannot accept payment."}</p>;
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void post({ action: "updateInvoice", projectId, documentId: doc.id, ...Object.fromEntries(new FormData(event.currentTarget)) as Record<string, string> });
  }
  return <div className="portal-studio-invoice-controls"><details><summary>Edit payment details</summary><form className="portal-studio-form" onSubmit={save}><label>Chase invoice payment link<input type="url" name="paymentUrl" defaultValue={doc.paymentUrl} placeholder="https://" /></label><label>ACH bank payment link<input type="url" name="achUrl" defaultValue={doc.achUrl} placeholder="https://" /><small>Paste a verified payment page that accepts ACH. Do not enter account or routing numbers.</small></label><label>Zelle recipient<input name="zelleId" defaultValue={doc.zelleId} /></label><label>Mail check to<textarea name="checkAddress" maxLength={500} defaultValue={doc.checkAddress} /></label><button disabled={busy}>Save payment details</button></form></details><div className="portal-invoice-actions"><button type="button" disabled={busy} onClick={() => void post({ action: "invoiceStatus", documentId: doc.id, status: "paid" })}>Mark paid after Chase confirms</button><button type="button" disabled={busy} onClick={() => void post({ action: "invoiceStatus", documentId: doc.id, status: "void" })}>Void invoice</button></div></div>;
}
