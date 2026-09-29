"use client";

import { FormEvent, useState } from "react";

type StudioDocument = { id: string; kind: string; title: string; invoiceNumber: string; amountCents: number; status: string; studioSigned: boolean; clientSigned: boolean };
type Project = { id: string; title: string; summary: string; stage: string; agreementUrl: string; invoiceId: string; paymentInstructions: string; firstName: string; email: string; clientBusiness: string; investmentCents: number; documents: StudioDocument[]; materials: { id: string; category: string; fileName: string; note: string }[] };
const stages = ["proposal", "agreement", "invoice", "in_progress", "review", "complete"];

export default function StudioWorkspace({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState(projects[0]?.id || "");
  const project = projects.find(item => item.id === selected);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function post(data: Record<string, string>) {
    setBusy(true); setMessage("");
    try { const response = await fetch("/api/portal/studio", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const result = await response.json(); if (!response.ok) throw Error(result.message || "Request failed.");
      setMessage(data.action === "invite" ? "Invitation sent." : "Saved.");
      if (data.action !== "invite") window.location.reload();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not save."); }
    finally { setBusy(false); }
  }
  function submitCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const data = Object.fromEntries(new FormData(event.currentTarget)) as Record<string,string>;
    void post({ action: "create", ...data });
  }
  function submitUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const data = Object.fromEntries(new FormData(event.currentTarget)) as Record<string,string>;
    void post({ action: "update", projectId: selected, ...data });
  }
  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const body = new FormData(event.currentTarget); body.set("projectId", selected);
    try { const response = await fetch("/api/portal/studio/upload", { method: "POST", body }); const result = await response.json();
      if (!response.ok) throw Error(result.message || "Upload failed.");
      setMessage(result.notified ? `Version ${result.version} shared and client emailed.` : `Version ${result.version} shared; client email failed. Contact them directly.`);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Upload failed."); }
    finally { setBusy(false); }
  }
  async function uploadDocument(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const body = new FormData(event.currentTarget); body.set("projectId", selected);
    try { const response = await fetch("/api/portal/studio/documents", { method: "POST", body }); const result = await response.json();
      if (!response.ok) throw Error(result.message || "Could not attach the PDF.");
      window.location.reload();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not attach the PDF."); }
    finally { setBusy(false); }
  }
  return <div className="portal-studio-tools">
    <section><h2>New client project</h2><form onSubmit={submitCreate}><label>Client first name<input name="firstName" required /></label><label>Client email<input name="email" type="email" required /></label><label>Client business<input name="clientBusiness" placeholder="Vale Royal Barn" /></label><label>Project title<input name="title" required placeholder="Custom Illustrated Venue Experience Map" /></label><label>Agreed project investment in USD<input name="investment" type="number" min="0.01" step="0.01" placeholder="3750.00" /></label><label>Short scope summary<textarea name="summary" maxLength={1000}/></label><button disabled={busy}>Create private workspace</button></form></section>
    {projects.length > 0 && <section><h2>Manage a project</h2><label>Project<select value={selected} onChange={event => setSelected(event.target.value)}>{projects.map(item => <option key={item.id} value={item.id}>{item.firstName}. {item.title}</option>)}</select></label>
      {project && <><p>{project.email}</p><form key={selected} onSubmit={submitUpdate}><label>Stage<select name="stage" defaultValue={project.stage}>{stages.map(stage => <option key={stage} value={stage}>{stage.replaceAll("_", " ")}</option>)}</select></label><label>External signing URL, if needed<input name="agreementUrl" type="url" defaultValue={project.agreementUrl} placeholder="https://…" /></label><label>Stripe invoice ID for optional card checkout<input name="invoiceId" defaultValue={project.invoiceId} placeholder="in_…" /></label><p>The Stripe invoice must use this client email and match the Chase invoice amount due. Clients see the card option once the agreement is signed and Stripe has issued the invoice.</p><label>Other payment instructions<textarea name="paymentInstructions" maxLength={1000} defaultValue={project.paymentInstructions} placeholder="Optional payment details" /></label><button disabled={busy}>Save project details</button></form>
        <form onSubmit={uploadDocument}><h3>Agreement for electronic signing</h3><p>Upload the approved PDF, then open it and sign as the studio. Your client will receive a sign-in email once you sign.</p><input type="hidden" name="kind" value="agreement" /><label>Agreement title<input name="title" required placeholder="Illustrated Venue Experience Map agreement" /></label><label>Final agreement PDF<input name="file" type="file" accept=".pdf,application/pdf" required /></label><button disabled={busy}>Attach agreement</button></form>
        <form onSubmit={uploadDocument}><h3>Invoice made in Chase</h3><p>Download the issued invoice PDF from Chase, then attach it here. This portal shows your uploaded invoice; it cannot update Chase payment status automatically.</p><input type="hidden" name="kind" value="invoice" /><label>Invoice title<input name="title" required placeholder="Project deposit" /></label><label>Chase invoice number<input name="invoiceNumber" required /></label><label>Amount due in USD<input name="amount" type="number" min="0.01" step="0.01" required placeholder="1875.00" /></label><label>Due date<input name="dueOn" type="date" /></label><label>Chase payment link, if available<input name="paymentUrl" type="url" placeholder="https://…" /></label><label>Zelle ID<input name="zelleId" placeholder="Enter your business Zelle email or phone" /></label><label>Mail check to<textarea name="checkAddress" maxLength={500} placeholder="Optional; add when ready" /></label><label>Issued Chase invoice PDF<input name="file" type="file" accept=".pdf,application/pdf" required /></label><button disabled={busy}>Attach Chase invoice</button></form>
        <div className="portal-studio-documents"><h3>Attached documents</h3>{project.documents.length ? project.documents.map(doc => <article key={doc.id}><strong>{doc.title}</strong><p>{doc.kind === "agreement" ? `Studio ${doc.studioSigned ? "signed" : "awaiting signature"}. Client ${doc.clientSigned ? "signed" : "awaiting signature"}` : `Invoice ${doc.invoiceNumber}. $${(doc.amountCents / 100).toFixed(2)}. ${doc.status}`}</p><a href={doc.kind === "agreement" ? `/portal/agreements/${doc.id}` : `/api/portal/documents/${doc.id}`}>{doc.kind === "agreement" ? "Open signing page" : "View invoice PDF"}</a>{doc.kind === "invoice" && <div className="portal-invoice-actions"><button type="button" disabled={busy || doc.status === "paid"} onClick={() => void post({ action: "invoiceStatus", documentId: doc.id, status: "paid" })}>Mark paid after confirming in Chase</button><button type="button" disabled={busy || doc.status === "void"} onClick={() => void post({ action: "invoiceStatus", documentId: doc.id, status: "void" })}>Mark void</button></div>}</article>) : <p>No agreements or invoices attached yet.</p>}</div>
        <div className="portal-studio-documents"><h3>Client materials</h3>{project.materials.length ? project.materials.map(item => <article key={item.id}><a href={`/api/portal/materials/${item.id}`}>{item.fileName}</a><p>{item.category.replaceAll("_", " ")}</p>{item.note && <p>Client note: {item.note}</p>}</article>) : <p>No materials uploaded yet.</p>}</div>
        <button type="button" disabled={busy} onClick={() => void post({ action: "invite", projectId: selected })}>Email private invitation</button>
        <form onSubmit={upload}><h3>Publish review version</h3><label>Version title<input name="title" required placeholder="First proof" /></label><label>Private PDF or image<input name="file" type="file" accept=".pdf,.png,.jpg,.jpeg,.webp" required /></label><button disabled={busy}>Share version and email client</button></form></>}
    </section>}
    {message && <p role="status">{message}</p>}
  </div>;
}
