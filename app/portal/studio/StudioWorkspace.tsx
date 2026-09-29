"use client";

import { upload as uploadBlob } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import StripeActivation from "./StripeActivation";
import PaymentPlanEditor from "./PaymentPlanEditor";
import { milestoneLabels } from "@/lib/portal-plan";

type ShareState = { shared: boolean; notificationStatus: string; notificationAttemptedAt: string; notificationEmailId: string };
type StudioDocument = ShareState & { versions: { id: string; fileName: string; at: string }[]; chaseClosed: boolean; milestoneNumber: number; stripeInvoiceId: string; stripeStatus: string;  id: string; kind: string; title: string; invoiceNumber: string; amountCents: number; status: string; paymentUrl: string; achUrl: string; selectedMethod: string; selectedAt: string; zelleId: string; checkAddress: string; studioSigned: boolean; clientSigned: boolean };
type Project = { firstOpenedAt: string; invited: boolean; archived: boolean; reviews: (ShareState & { id: string; version: number; title: string; fileName: string; status: string; decision: string; note: string; decisionAt: string })[];  id: string; title: string; summary: string; stage: string; agreementUrl: string; invoiceId: string; paymentInstructions: string; firstName: string; email: string; clientBusiness: string; investmentCents: number; milestoneAmounts: [number, number, number]; proposals: { id: string; title: string; fileName: string }[]; documents: StudioDocument[]; materials: { id: string; category: string; fileName: string; note: string }[] };
type Panel = "overview" | "proposal" | "agreement" | "invoice" | "review" | "settings";
const stages = ["proposal", "agreement", "invoice", "in_progress", "review", "complete"];
const money = (cents: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);

export default function StudioWorkspace({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState(projects[0]?.id || "");
  const [panel, setPanel] = useState<Panel>("overview");
  const [invoiceMilestone, setInvoiceMilestone] = useState(1);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [inviteRefresh, setInviteRefresh] = useState(0);
  const [uploadState, setUploadState] = useState<Record<string, string>>({});
  useEffect(() => { if (selected && projects.length && !projects.some(item => item.id === selected)) setSelected(projects[0].id); }, [projects, selected]);
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
      if ((data.action === "create" || data.action === "createValerieDraft") && result.id) { setSelected(result.id); setPanel("overview"); }
      if (data.action === "deleteWorkspace") { setSelected(projects.find(item => item.id !== data.projectId)?.id || ""); setPanel("overview"); }
      if (data.action === "invite") setInviteRefresh(value => value + 1);
      setMessage(data.action === "removeDocument" ? "Unsigned agreement removed from the portal. No email was sent." : data.action === "updateRecipient" ? result.changed ? `Recipient changed to ${result.recipient}. Previous sign-ins and invitation links were revoked. No email was sent. Send a new invitation when you are ready.` : "Recipient email is unchanged. No email was sent." : data.action === "invite" ? `Resend accepted an invitation for ${result.recipient}. Check the delivery status below; acceptance does not mean it reached the inbox.` : data.action === "createValerieDraft" ? "Valerie's private draft is ready. No email was added or sent. Review the preview, then attach your approved documents." : data.action === "create" ? "Private workspace created. You can now attach the agreement and invoice." : data.action === "deleteWorkspace" ? `Workspace removed for ${result.email}. You can create a fresh project below.` : data.action === "releaseDraft" ? "Valerie's email is attached. No invitation was sent. Review once more before inviting her." : data.action === "shareInvoice" || data.action === "shareReview" ? "Shared with the client. Resend accepted the notification; delivery is not yet confirmed." : data.action === "updatePaymentPlan" ? "Payment plan saved. Each invoice will use its milestone amount." : data.action === "archiveWorkspace" ? result.archived ? "Workspace archived. Its documents and signatures are retained." : "Workspace restored." : "Changes saved.");
      router.refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not save changes."); if (data.action === "shareInvoice" || data.action === "shareReview") router.refresh(); }
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
      setUploadMessage(kind, result.replaced ? "Invoice PDF replaced and held privately. Payment details are unchanged. No email was sent. Share the corrected copy when ready." : `${kind === "proposal" ? "Proposal" : kind === "agreement" ? "Agreement" : "Invoice"} saved privately. No email was sent.`);
      form.reset();
      router.refresh();
    } catch (error) { setUploadMessage(kind, error instanceof Error ? error.message : "Upload failed. Please try again."); }
    finally { setBusy(false); }
  }
  async function uploadReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setUploadMessage("review", "Saving the review file privately.");
    const form = event.currentTarget;
    const body = new FormData(form); body.set("projectId", selected);
    try {
      const response = await fetch("/api/portal/studio/upload", { method: "POST", body });
      const result = await response.json();
      if (!response.ok) throw Error(result.message || "The review file could not be published.");
      setUploadMessage("review", `Version ${result.version} saved privately. No email was sent.`);
      form.reset(); router.refresh();
    } catch (error) { setUploadMessage("review", error instanceof Error ? error.message : "The review file could not be published."); }
    finally { setBusy(false); }
  }
  const tabs: [Panel, string][] = [["overview", "Overview"], ["proposal", "Proposal"], ["agreement", "Agreement"], ["invoice", "Invoices"], ["review", "Review files"], ["settings", "Project details"]];
  return <div className="portal-studio-dashboard">
    <div className="portal-studio-intro"><div><span className="portal-studio-eyebrow">PRIVATE STUDIO DESK</span><h2>Good work deserves a beautiful handoff.</h2><p>Everything your client needs, gathered in one place. Choose a project to prepare its proposal, agreement, invoice, and next review.</p></div><div className="portal-studio-monogram" aria-hidden="true">A.</div></div>
    {projects.length > 0 && <div className="portal-studio-picker"><label htmlFor="studio-project">CURRENT PROJECT</label><select id="studio-project" value={selected} onChange={event => { setSelected(event.target.value); setInvoiceMilestone(1); setPanel("overview"); setInvoiceMilestone(1); setMessage(""); setUploadState({}); }}>{projects.map(item => <option key={item.id} value={item.id}>{item.firstName} · {item.title}{item.archived ? " · Archived" : ""}</option>)}</select></div>}
    {project && <>
      <div className="portal-studio-feature"><div><span className="portal-studio-eyebrow">{project.clientBusiness || "CLIENT PROJECT"}</span><h3>{project.title}</h3><p>For {project.firstName} · {project.email.endsWith(".invalid") ? "Private draft with no client email" : project.email}</p><a href={`/portal/projects/${selected}?studioPreview=1`}>Preview {project.firstName}&apos;s client workspace</a><p>Permanent client address <span>{`ahalliwellstudio.com/portal/projects/${selected}`}</span></p><button type="button" onClick={() => { void navigator.clipboard.writeText(`https://www.ahalliwellstudio.com/portal/projects/${selected}`).then(() => setMessage("Client workspace address copied.")).catch(() => setMessage("Copy the workspace address shown above.")); }}>Copy client workspace address</button><p>{project.firstOpenedAt ? `First client visit ${new Date(project.firstOpenedAt).toLocaleString()}` : 'Client has not opened this workspace yet.'}</p></div><div className="portal-studio-feature-side"><span>{project.stage.replaceAll("_", " ")}</span>{project.investmentCents > 0 && <strong>{money(project.investmentCents)}</strong>}</div></div>
      <nav className="portal-studio-tabs" aria-label="Manage project">{tabs.map(([id, title]) => <button key={id} type="button" aria-current={panel === id ? "page" : undefined} onClick={() => { setPanel(id); setMessage(""); }}>{title}</button>)}</nav>
      {message && <p className="portal-studio-notice" role="status" aria-live="polite">{message}</p>}
      {panel === "overview" && <section className="portal-studio-panel"><div className="portal-studio-panel-head"><span>PROJECT JOURNEY</span><h3>Ready for the next step.</h3><p>Your client can read the proposal and agreement before signing. Payment options appear after both parties have signed.</p></div><div className="portal-studio-milestones">
        <button type="button" onClick={() => setPanel("proposal")}><small>PROPOSAL</small><strong>{project.proposals.length ? "Proposal attached" : "Attach proposal"}</strong><span>{project.proposals.length ? "Available for private review" : "Scope and payment milestones"}</span></button>
        <button type="button" onClick={() => setPanel("agreement")}><small>01 AGREEMENT</small><strong>{agreement ? agreement.studioSigned ? "Signed by studio" : "Ready for your signature" : "Attach agreement"}</strong><span>{agreement?.clientSigned ? "Client signed" : "Client signature pending"}</span></button>
        <button type="button" onClick={() => setPanel("invoice")}><small>02 INVESTMENT</small><strong>{issued.length ? `${issued.length} issued invoice${issued.length > 1 ? "s" : ""}` : "Save invoice privately"}</strong><span>{project.invoiceId ? "Stripe invoice connected" : "Card checkout optional"}</span></button>
        <button type="button" onClick={() => setPanel("review")}><small>03 CREATIVE REVIEW</small><strong>Share the next proof</strong><span>Private review files and revision notes</span></button>
      </div><div className="portal-studio-send"><div><h4>Invite {project.firstName} to their workspace</h4><p>The invitation becomes available once you have attached the proposal, signed the agreement, and attached an issued invoice. A test workspace can use its nonpayable preview.</p><p className="portal-studio-recipient">{project.email.endsWith(".invalid") ? "No client email is attached. This draft cannot send an invitation." : `Invitation recipient ${project.email}`}</p></div><button type="button" disabled={busy || project.email.endsWith(".invalid") || (!project.proposals.length && !project.title.startsWith("TEST")) || !agreement?.studioSigned || (!issued.length && !project.title.startsWith("TEST"))} onClick={() => void post({ action: "invite", projectId: selected })}>{busy ? "Working…" : "Send client invitation"}</button></div>
      {!project.email.endsWith(".invalid") && <InvitationStatus projectId={selected} refreshKey={inviteRefresh} />}
      <div className="portal-studio-archive"><button type="button" disabled={busy} onClick={() => void post({ action: "archiveWorkspace", projectId: selected })}>{project.archived ? "Restore workspace" : "Archive workspace"}</button><p>Archiving keeps signed agreements, invoices, and review history safely in the studio desk.</p></div>
      {!project.documents.some(doc => doc.studioSigned || doc.clientSigned || doc.status === "paid") && <details className="portal-studio-reset"><summary>Delete empty practice workspace</summary><p>Delete {project.title} for {project.email.endsWith(".invalid") ? "Valerie’s private draft" : project.email}. This removes its portal documents, signatures, payment choices, materials, review files, and access. If this client has no other projects, their portal account is removed too. Workspaces with a signature or confirmed payment are preserved by archiving. Close external invoices before deleting an unsigned practice workspace.</p><button type="button" disabled={busy} onClick={() => { const draft = project.email.endsWith(".invalid"); const confirmation = window.prompt(draft ? `To delete ${project.title}, type DRAFT. This cannot be undone.` : `To delete ${project.title}, type the client email ${project.email}. This cannot be undone.`); if (confirmation && (draft ? confirmation.trim().toUpperCase() === "DRAFT" : confirmation.trim().toLowerCase() === project.email.toLowerCase())) void post({ action: "deleteWorkspace", projectId: selected, confirmEmail: draft ? "draft" : confirmation.trim().toLowerCase(), confirmTitle: project.title }); else if (confirmation !== null) setMessage("The confirmation did not match. Nothing was deleted."); }}>Delete workspace</button></details>}
      {project.email.endsWith(".invalid") && <div className="portal-studio-draft-note"><strong>Held for your review</strong><p>No client email is attached, and no invitation can be sent. The client will see the project only after you deliberately add her address and invite her.</p></div>}<div className="portal-studio-materials"><h4>Materials from your client</h4>{project.materials.length ? project.materials.map(item => <p key={item.id}><a href={`/api/portal/materials/${item.id}`}>{item.fileName}</a><span>{item.category.replaceAll("_", " ")}{item.note ? ` · ${item.note}` : ""}</span></p>) : <p>When the client shares property photos, plans, or references, they will appear here.</p>}</div></section>}
      {panel === "proposal" && <section className="portal-studio-panel"><div className="portal-studio-panel-head"><span>PROPOSAL</span><h3>The project, beautifully framed.</h3><p>Attach your approved proposal PDF. It stays private in this workspace and uploading it never sends an email.</p></div><form className="portal-studio-form" onSubmit={uploadDocument}><input type="hidden" name="kind" value="proposal" /><label>Proposal title<input name="title" required defaultValue="Custom Estate Experience Map Proposal" /></label><label>Approved PDF<input name="file" type="file" accept=".pdf,application/pdf" required /><small>Private PDF, up to 25 MB.</small></label><button disabled={busy}>{busy ? "Uploading…" : "Attach proposal"}</button><p className="portal-studio-form-status" role="status" aria-live="polite">{uploadState.proposal}</p></form><div className="portal-studio-attachment-list"><h4>Proposals in this project</h4>{project.proposals.map(doc => <article key={doc.id}><div><strong>{doc.title}</strong><span>{doc.fileName}</span></div><a href={`/api/portal/proposals/${doc.id}`} target="_blank" rel="noopener noreferrer">View proposal PDF</a></article>)}{!project.proposals.length && <p>No proposal attached yet.</p>}</div></section>}
      {panel === "agreement" && <section className="portal-studio-panel"><div className="portal-studio-panel-head"><span>01 AGREEMENT</span><h3>Set the terms beautifully.</h3><p>Attach the approved agreement, then open it here to add your signature and date.</p></div><form className="portal-studio-form" onSubmit={uploadDocument}><input type="hidden" name="kind" value="agreement" /><label>Agreement title<input name="title" required placeholder="Illustrated Venue Experience Map agreement" /></label><label>Approved PDF<input name="file" type="file" accept=".pdf,application/pdf" required /><small>Private PDF, up to 25 MB. The agreement must be an unencrypted PDF for electronic signing.</small></label><button disabled={busy}>{busy ? "Uploading…" : "Attach agreement"}</button><p className="portal-studio-form-status" role="status" aria-live="polite">{uploadState.agreement}</p></form><div className="portal-studio-attachment-list"><h4>Agreement versions in this project</h4>{project.documents.filter(doc => doc.kind === "agreement").map(doc => <article key={doc.id}><div><strong>{doc.title}</strong><span>Studio {doc.studioSigned ? "signed" : "signature pending"} · Client {doc.clientSigned ? "signed" : "signature pending"}</span></div><a href={`/portal/agreements/${doc.id}`}>Open agreement</a><DocumentReplacement doc={doc} busy={busy} onSubmit={uploadDocument} message={uploadState[doc.kind] || ""}/>{!doc.studioSigned && !doc.clientSigned && <button type="button" disabled={busy} onClick={() => { if (window.confirm("Remove this unsigned agreement from the portal? No email will be sent.")) void post({ action: "removeDocument", documentId: doc.id }); }}>Remove unsigned agreement</button>}{(doc.studioSigned || doc.clientSigned) && <p>Signed records are retained. Upload a new version below to sign again.</p>}</article>)}{!agreement && <p>No agreement attached yet.</p>}</div></section>}
      {panel === "invoice" && <section className="portal-studio-panel">
        <div className="portal-studio-panel-head"><span>02 INVESTMENT</span><h3>Plan the whole project.</h3><p>Set the total and divide it into three payments. Attach each Chase invoice only when that milestone is ready. Zelle appears first for your client.</p><button type="button" onClick={() => router.refresh()}>Refresh client choices</button></div>
        <PaymentPlanEditor key={`${selected}-${project.investmentCents}-${project.milestoneAmounts.join("-")}`} projectId={selected} total={project.investmentCents} amounts={project.milestoneAmounts} busy={busy} post={post} />
        <form className="portal-studio-form portal-studio-invoice-form" onSubmit={uploadDocument}>
          <input type="hidden" name="kind" value="invoice" />
          <h4>Attach an issued invoice</h4><p>Each PDF covers one milestone. The amount below comes from your saved plan; confirm the Chase PDF matches it.</p>
          <label>Payment milestone<select name="milestoneNumber" value={invoiceMilestone} onChange={event => setInvoiceMilestone(Number(event.target.value))}>{milestoneLabels.map((label, index) => <option key={label} value={index + 1}>0{index + 1} {label}</option>)}</select></label>
          <label>Invoice title<input name="title" required placeholder={milestoneLabels[invoiceMilestone - 1]} /></label>
          <div className="portal-studio-form-pair"><label>Chase invoice number<input name="invoiceNumber" required placeholder="11741" /></label><label>Amount for this milestone in USD<input name="amount" readOnly value={(project.milestoneAmounts[invoiceMilestone - 1] / 100).toFixed(2)} /><small>Set the full project total and split above to change this amount.</small></label></div>
          <label>Due date, if confirmed<input name="dueOn" type="date" /><small>Optional. Leave this blank while timing is flexible; issue or update the Chase invoice when the date is agreed.</small></label>
          <label>Chase invoice payment link<input name="paymentUrl" type="url" placeholder="https://" /></label>
          <label>ACH bank payment link<input name="achUrl" type="url" placeholder="https://" /><small>Paste a verified Chase or Stripe payment page that accepts ACH. Never enter bank account details here.</small></label>
          <label>Zelle recipient<input name="zelleId" defaultValue="arabellakhalliwell@gmail.com" /></label>
          <label>Mail check to<textarea name="checkAddress" maxLength={500} placeholder="Add your mailing address when ready" /></label>
          <label>Issued Chase invoice PDF<input name="file" type="file" accept=".pdf,application/pdf" required /><small>Private PDF, up to 25 MB. A Chase PDF can be attached even if its editing is protected.</small></label>
          <button disabled={busy || !project.investmentCents || project.documents.some(doc => doc.kind === "invoice" && doc.milestoneNumber === invoiceMilestone && doc.status !== "void")}>{busy ? "Uploading…" : "Save invoice privately"}</button>
          {project.documents.some(doc => doc.kind === "invoice" && doc.milestoneNumber === invoiceMilestone && doc.status !== "void") && <p>This milestone already has an active invoice. Void it before attaching a replacement.</p>}
          <p className="portal-studio-form-status" role="status" aria-live="polite">{uploadState.invoice}</p>
        </form>
        <div className="portal-studio-attachment-list"><h4>Invoices in this project</h4>{project.documents.filter(doc => doc.kind === "invoice").map(doc => <article key={doc.id} className="portal-studio-invoice-item"><div><strong>{doc.title}</strong><span>Milestone 0{doc.milestoneNumber} · Chase {doc.invoiceNumber} · {money(doc.amountCents)} · {doc.status}</span><span>Stripe {doc.stripeStatus}{doc.stripeInvoiceId ? ` · ${doc.stripeInvoiceId}` : ""}</span><span>{doc.shared ? "Shared with client" : "Private draft"}</span><NotificationState item={doc} />{doc.selectedMethod && <span className="portal-studio-choice">Client chose {doc.selectedMethod === "card" ? "Card via Stripe" : doc.selectedMethod.toUpperCase()}{doc.selectedAt ? ` on ${new Date(doc.selectedAt).toLocaleString()}` : ""}. Payment is confirmed separately.</span>}</div><a href={`/portal/documents/${doc.id}`} target="_blank" rel="noopener noreferrer">View PDF</a>{doc.status === "issued" && <DocumentReplacement doc={doc} busy={busy} onSubmit={uploadDocument} message={uploadState[doc.kind] || ""}/>}<StripeActivation documentId={doc.id}/><InvoicePaymentEditor doc={doc} projectId={selected} busy={busy} post={post} /></article>)}{!project.documents.some(doc => doc.kind === "invoice") && <p>No invoices attached yet.</p>}</div>
      </section>}
      {panel === "review" && <section className="portal-studio-panel"><div className="portal-studio-panel-head"><span>03 CREATIVE REVIEW</span><h3>A thoughtful first look.</h3><p>Save the proof privately, check the file, then share it. Sharing emails the invited client.</p></div><form className="portal-studio-form" onSubmit={uploadReview}><label>Version title<input name="title" required placeholder="First concept" /></label><label>Private PDF or image<input name="file" type="file" accept=".pdf,.png,.jpg,.jpeg,.webp" required /><small>Up to 10 MB per file.</small></label><button disabled={busy}>{busy ? "Publishing…" : "Save version privately"}</button><p className="portal-studio-form-status" role="status" aria-live="polite">{uploadState.review}</p></form><div className="portal-studio-attachment-list"><h4>Version history and decisions</h4>{project.reviews.map(review => <article key={review.id}><div><strong>Version {review.version} · {review.title}</strong><span>{review.shared ? "Shared" : "Private"} · {review.status.replaceAll("_", " ")}</span>{review.decision && <p>{review.decision === "approved" ? "Approved" : "Changes requested"}{review.decisionAt ? ` on ${new Date(review.decisionAt).toLocaleString()}` : ""}</p>}{review.note && <p className="portal-studio-review-note">{review.note}</p>}</div><a href={`/api/portal/files/${review.id}`} target="_blank" rel="noopener noreferrer">View file</a><NotificationState item={review} />{review.notificationStatus !== "accepted" && review.notificationStatus !== "included_in_invitation" && <button type="button" disabled={busy || !project.invited || project.archived} onClick={() => void post({ action: "shareReview", deliverableId: review.id })}>{review.shared ? "Retry client email" : "Share with client and email"}</button>}</article>)}{!project.reviews.length && <p>No review files yet.</p>}</div></section>}
      {panel === "settings" && <section className="portal-studio-panel"><div className="portal-studio-panel-head"><span>PROJECT DETAILS</span><h3>Everything in its place.</h3><p>Update the project stage and optional payment integrations here.</p></div><form className="portal-studio-form" key={`recipient-${selected}-${project.email}`} onSubmit={event => { event.preventDefault(); const email = String(new FormData(event.currentTarget).get("email") || "").trim().toLowerCase(); if (email === project.email || window.confirm(`Change this client's recipient from ${project.email} to ${email}? This updates all workspaces for the same client account, signs out previous sessions, and cancels old invitations and codes. Documents and signed records are retained. No email will be sent. You must send a new invitation to grant access.`)) void post({ action: "updateRecipient", projectId: selected, email }); }}><h4>Client recipient</h4><p>Correct the email here without recreating the workspace. This updates every workspace belonging to this client account. Previous sign-ins are revoked, and access stays held until you send a new invitation.</p><label>Recipient email<input name="email" type="email" maxLength={254} required defaultValue={project.email.endsWith(".invalid") ? "" : project.email} /></label><button disabled={busy}>Save recipient without sending</button><p>Uploaded documents and signed records stay intact. Stripe and Chase invoices keep their existing billing details; update those separately if needed.</p></form><form className="portal-studio-form" key={selected} onSubmit={submitUpdate}><label>Stage<select name="stage" defaultValue={project.stage}>{stages.map(stage => <option key={stage} value={stage}>{stage.replaceAll("_", " ")}</option>)}</select></label><label>External signing URL, if needed<input name="agreementUrl" type="url" defaultValue={project.agreementUrl} placeholder="https://" /></label><label>Other payment instructions<textarea name="paymentInstructions" maxLength={1000} defaultValue={project.paymentInstructions} /></label><button disabled={busy}>Save project details</button></form></section>}
    </>}
    <div className="portal-studio-draft-start"><h3>Prepare Valerie’s portal privately</h3><p>Create the Vale Royal Barn project with the agreed scope and $3,750 investment. No client email is attached or sent. The agreement, invoice, payment links, and review files remain for you to add.</p><button type="button" disabled={busy} onClick={() => void post({ action: "createValerieDraft" })}>Prepare Valerie’s private draft</button></div><details className="portal-studio-create"><summary>Start a new client project</summary><form className="portal-studio-form" onSubmit={submitCreate}><div className="portal-studio-form-pair"><label>Client first name<input name="firstName" required /></label><label>Client email<input name="email" type="email" required /></label></div><label>Client business<input name="clientBusiness" placeholder="Vale Royal Barn" /></label><label>Project title<input name="title" required placeholder="Custom Illustrated Venue Experience Map" /></label><label>Agreed project investment in USD<input name="investment" type="number" min="0.01" step="0.01" placeholder="3750.00" /></label><label>Short scope summary<textarea name="summary" maxLength={1000} /></label><label className="portal-studio-test-toggle"><input name="isTest" type="checkbox" /> Create as a test workspace with no real payment due</label><p>Test workspaces can use a nonpayable invoice preview.</p><button disabled={busy}>Create private workspace</button></form></details>
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

function NotificationState({ item }: { item: ShareState }) {
  if (!item.shared) return null;
  const label = item.notificationStatus === "accepted" ? "Email accepted by Resend; delivery not confirmed"
    : item.notificationStatus === "included_in_invitation" ? "Released with the invitation email"
    : item.notificationStatus === "failed" ? "Email failed; retry from this panel"
    : item.notificationStatus === "sending" ? "Email sending; retry after two minutes if it stays here"
    : "Earlier email status unknown; check Resend before retrying";
  return <span role="status">{label}{item.notificationAttemptedAt ? ` · ${new Date(item.notificationAttemptedAt).toLocaleString()}` : ""}</span>;
}

function InvoicePaymentEditor({ doc, projectId, busy, post }: { doc: StudioDocument; projectId: string; busy: boolean; post: (data: Record<string, string>) => Promise<void> }) {
  if (doc.status !== "issued") return <div className="portal-studio-settlement"><p>{doc.status === "paid" ? "Payment confirmed." : "This invoice is void and cannot accept payment."}</p>{doc.status === "paid" && !doc.invoiceNumber.startsWith("TEST-") && !doc.chaseClosed && <><p className="portal-studio-settlement-alert">Close or mark the Chase invoice paid in Chase. A previously shared Chase link can remain payable until you do.</p><button type="button" disabled={busy} onClick={() => { if (window.confirm("Have you closed or marked this invoice paid in Chase?")) void post({ action: "confirmChaseClosed", documentId: doc.id, confirm: "yes" }); }}>Confirm Chase is closed</button></>}</div>;
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void post({ action: "updateInvoice", projectId, documentId: doc.id, ...Object.fromEntries(new FormData(event.currentTarget)) as Record<string, string> });
  }
  return <div className="portal-studio-invoice-controls">{doc.notificationStatus !== "accepted" && doc.notificationStatus !== "included_in_invitation" && <button type="button" disabled={busy} onClick={() => void post({ action: "shareInvoice", documentId: doc.id })}>{doc.shared ? "Retry client email" : "Share with client and email"}</button>}<details><summary>Edit payment details</summary><form className="portal-studio-form" onSubmit={save}><label>Chase invoice payment link<input type="url" name="paymentUrl" defaultValue={doc.paymentUrl} placeholder="https://" /></label><label>ACH bank payment link<input type="url" name="achUrl" defaultValue={doc.achUrl} placeholder="https://" /><small>Paste a verified payment page that accepts ACH. Do not enter account or routing numbers.</small></label><label>Stripe invoice ID for this milestone<input name="stripeInvoiceId" defaultValue={doc.stripeInvoiceId} placeholder="in_" /><small>Issued to this client for this exact amount. Its live status appears above.</small></label><label>Zelle recipient<input name="zelleId" defaultValue={doc.zelleId} /></label><label>Mail check to<textarea name="checkAddress" maxLength={500} defaultValue={doc.checkAddress} /></label><button disabled={busy}>Save payment details</button></form></details><div className="portal-invoice-actions"><button type="button" disabled={busy} onClick={() => { const confirm = window.confirm("Confirm funds arrived and that you closed or marked the Chase invoice paid. The matching open Stripe invoice will be voided before this is recorded. Continue?"); if (confirm) void post({ action: "invoiceStatus", documentId: doc.id, status: "paid", externalClosed: "yes" }); }}>Confirm payment received</button><button type="button" disabled={busy} onClick={() => { if (!doc.invoiceNumber.startsWith("TEST-") && !window.confirm("Close the Chase invoice first. Have you done that?")) return; void post({ action: "invoiceStatus", documentId: doc.id, status: "void", externalClosed: "yes" }); }}>Remove and void invoice</button></div></div>;
}

function DocumentReplacement({ doc, busy, onSubmit, message }: { doc: StudioDocument; busy: boolean; onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>; message: string }) {
  return <details className="portal-document-replacement"><summary>{doc.kind === "invoice" ? "Replace this PDF" : "Upload replacement and sign again"}</summary><form className="portal-studio-form" onSubmit={onSubmit}>
    <input type="hidden" name="kind" value={doc.kind}/><input type="hidden" name="replaceDocumentId" value={doc.id}/>
    <label>Document title<input name="title" required maxLength={150} defaultValue={doc.title}/></label>
    <label>Corrected PDF<input name="file" type="file" accept=".pdf,application/pdf" required/></label>
    <p>{doc.kind === "invoice" ? "Replaces the PDF for this same invoice. The invoice number, amount, milestone, and payment links stay unchanged. The corrected copy is held privately until you share it. To change the invoice itself, remove and void it before attaching a new invoice." : "Creates a new agreement version with fresh signature fields. Open the new version, place its fields, and sign your part again. Any earlier signed versions stay in the history. Uploading does not email the client."}</p>
    <button disabled={busy}>{doc.kind === "invoice" ? "Replace PDF without sending" : "Save new agreement version"}</button>
    {message && <p role="status">{message}</p>}
  </form>{doc.versions.length > 0 && <div><h4>Previous PDF copies</h4>{doc.versions.map(version => <p key={version.id}><a href={`/portal/documents/${doc.id}?version=${version.id}`} target="_blank" rel="noopener noreferrer">{version.fileName}</a> saved {new Date(version.at).toLocaleString()}</p>)}</div>}</details>;
}
