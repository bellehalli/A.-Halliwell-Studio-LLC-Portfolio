"use client";

import { FormEvent, useState } from "react";

type Project = { id: string; title: string; summary: string; stage: string; agreementUrl: string; invoiceId: string; paymentInstructions: string; firstName: string; email: string };
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
  return <div className="portal-studio-tools">
    <section><h2>New client project</h2><form onSubmit={submitCreate}><label>Client first name<input name="firstName" required /></label><label>Client email<input name="email" type="email" required /></label><label>Project title<input name="title" required placeholder="Illustration project" /></label><label>Short scope summary<textarea name="summary" maxLength={1000}/></label><button disabled={busy}>Create private workspace</button></form></section>
    {projects.length > 0 && <section><h2>Manage a project</h2><label>Project<select value={selected} onChange={event => setSelected(event.target.value)}>{projects.map(item => <option key={item.id} value={item.id}>{item.firstName} · {item.title}</option>)}</select></label>
      {project && <><p>{project.email}</p><form key={selected} onSubmit={submitUpdate}><label>Stage<select name="stage" defaultValue={project.stage}>{stages.map(stage => <option key={stage} value={stage}>{stage.replaceAll("_", " ")}</option>)}</select></label><label>Signing provider URL<input name="agreementUrl" type="url" defaultValue={project.agreementUrl} placeholder="https://…" /></label><label>Stripe invoice ID<input name="invoiceId" defaultValue={project.invoiceId} placeholder="in_…" /></label><label>Zelle or check instructions<textarea name="paymentInstructions" maxLength={1000} defaultValue={project.paymentInstructions} placeholder="Optional private instructions shown with the finalized invoice" /></label><button disabled={busy}>Save project details</button></form>
        <button type="button" disabled={busy} onClick={() => void post({ action: "invite", projectId: selected })}>Email private invitation</button>
        <form onSubmit={upload}><h3>Publish review version</h3><label>Version title<input name="title" required placeholder="First proof" /></label><label>Private PDF or image<input name="file" type="file" accept=".pdf,.png,.jpg,.jpeg,.webp" required /></label><button disabled={busy}>Share version and email client</button></form></>}
    </section>}
    {message && <p role="status">{message}</p>}
  </div>;
}
