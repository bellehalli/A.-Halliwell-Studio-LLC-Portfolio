"use client";

import { FormEvent, PointerEvent, useRef, useState } from "react";

export default function SignAgreement({ documentId, email, studio }: { documentId: string; email: string; studio: boolean }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [typedName, setTypedName] = useState("");
  const [signatureStyle, setSignatureStyle] = useState<"draw" | "type">("draw");
  const [hasDrawing, setHasDrawing] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  function point(event: PointerEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: (event.clientX - rect.left) * 600 / rect.width, y: (event.clientY - rect.top) * 180 / rect.height };
  }
  function startDrawing(event: PointerEvent<HTMLCanvasElement>) {
    event.preventDefault();
    const ctx = event.currentTarget.getContext("2d");
    if (!ctx) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const { x, y } = point(event);
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + .1, y + .1);
    ctx.strokeStyle = "#332233"; ctx.lineWidth = 2.4; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.stroke();
    drawing.current = true; setHasDrawing(true);
  }
  function continueDrawing(event: PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    event.preventDefault();
    const ctx = event.currentTarget.getContext("2d");
    if (!ctx) return;
    const { x, y } = point(event);
    ctx.lineTo(x, y); ctx.stroke();
  }
  function clearDrawing() {
    canvas.current?.getContext("2d")?.clearRect(0, 0, 600, 180);
    setHasDrawing(false);
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const data = new FormData(event.currentTarget);
    try {
      if (signatureStyle === "draw" && !hasDrawing) throw Error("Draw your signature or choose the typed signature option.");
      const signatureImage = signatureStyle === "draw" ? canvas.current?.toDataURL("image/png") : undefined;
      const response = await fetch("/api/portal/sign", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ documentId, typedName: data.get("typedName"), businessName: data.get("businessName"), signatureStyle, signatureImage, reviewed: data.get("reviewed") === "on", consent: data.get("consent") === "on" }) });
      const result = await response.json();
      if (!response.ok) throw Error(result.message || "Signature could not be recorded.");
      setMessage(result.notified ? "Signature recorded. Your signed copy is ready." : "Signature recorded. The email notification did not send; your signed copy is ready here.");
      window.location.reload();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Please try again."); }
    finally { setBusy(false); }
  }
  return <form className="portal-sign-form" onSubmit={submit}>
    <h2>Sign this agreement</h2><p>You are signed in as <strong>{email}</strong>. Your signature, consent, and signing time will be added to this agreement. {studio ? "Sign for A. Halliwell Studio first." : "Sign only if you are authorized to accept the agreement for your business."}</p>
    <label>Full legal name<input name="typedName" autoComplete="name" minLength={3} maxLength={120} value={typedName} onChange={event => setTypedName(event.target.value)} required /></label>
    {!studio && <label>Business you are signing for<input name="businessName" maxLength={150} required placeholder="Vale Royal Barn" /></label>}
    <fieldset className="portal-signature-choice"><legend>Your electronic signature</legend><label><input type="radio" name="signatureStyle" checked={signatureStyle === "draw"} onChange={() => setSignatureStyle("draw")}/> Draw my signature</label><label><input type="radio" name="signatureStyle" checked={signatureStyle === "type"} onChange={() => setSignatureStyle("type")}/> Use my typed name</label></fieldset>
    {signatureStyle === "draw" ? <div className="portal-signature-pad"><p>Draw with your finger, mouse, or stylus.</p><canvas ref={canvas} width={600} height={180} role="img" aria-label="Draw your signature here" onPointerDown={startDrawing} onPointerMove={continueDrawing} onPointerUp={() => { drawing.current = false; }} onPointerCancel={() => { drawing.current = false; }}/><button type="button" className="portal-signature-clear" onClick={clearDrawing}>Clear signature</button></div> : <div className="portal-signature-typed" aria-label="Signature preview">{typedName.trim() || "Your name will appear here"}</div>}
    <label className="portal-check"><input type="checkbox" name="reviewed" required /><span>I have read the entire agreement displayed above.</span></label>
    <label className="portal-check"><input type="checkbox" name="consent" required /><span>I agree to use electronic records and signatures. By selecting Sign agreement, I intend to sign this agreement with the signature shown above.</span></label>
    <button disabled={busy}>{busy ? "Recording signature…" : "Sign agreement"}</button>
    {message && <p role="status">{message}</p>}
  </form>;
}
