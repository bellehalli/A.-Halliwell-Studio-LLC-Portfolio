"use client";

import { upload } from "@vercel/blob/client";
import { FormEvent, useState } from "react";

const categories = [
  ["aerial", "Aerial imagery"], ["site_plan", "Site plan"], ["floor_plan", "Floor plan"],
  ["photos", "Property photography"], ["branding", "Logo / branding"], ["references", "Inspiration / references"],
] as const;

export default function MaterialUpload({ projectId }: { projectId: string }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const files = Array.from((data.getAll("files") as File[]).filter(file => file.size));
    if (!files.length) return;
    if (files.length > 12 || files.some(file => file.size > 25_000_000 || !["application/pdf", "image/png", "image/jpeg", "image/webp"].includes(file.type))) {
      setMessage("Choose up to 12 PDF, JPG, PNG, or WebP files, each under 25 MB."); return;
    }
    setBusy(true); setMessage("");
    let count = 0;
    try {
      for (const file of files) {
        const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120) || "material";
        await upload(`portal-materials/${projectId}/${crypto.randomUUID()}-${safe}`, file, {
          access: "private", handleUploadUrl: "/api/portal/materials/upload",
          clientPayload: JSON.stringify({ projectId, category: data.get("category"), note: data.get("note") }),
        });
        count++;
        setMessage(`Uploading materials: ${count} of ${files.length} sent.`);
      }
      form.reset();
      setMessage(`${count} ${count === 1 ? "file" : "files"} uploaded. They will appear in your project folder shortly.`);
      window.setTimeout(() => window.location.reload(), 1800);
    } catch (error) { setMessage(`${count} file(s) sent. ${error instanceof Error ? error.message : "The remaining upload failed."}`); }
    finally { setBusy(false); }
  }
  return <form className="portal-material-form" onSubmit={submit}>
    <label>What are you sharing?<select name="category" required>{categories.map(([value, title]) => <option key={value} value={value}>{title}</option>)}</select></label>
    <label>Choose files<input name="files" type="file" multiple required accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp" /><small>Up to 12 files at a time, 25 MB each. PDF, JPG, PNG, or WebP.</small></label>
    <label>Optional note<textarea name="note" maxLength={500} placeholder="Any spaces, views, or details especially meaningful to your guests?" /></label>
    <button type="submit" disabled={busy}>{busy ? "Uploading…" : "Upload project materials"}</button>
    <p role="status" aria-live="polite">{message}</p>
  </form>;
}
