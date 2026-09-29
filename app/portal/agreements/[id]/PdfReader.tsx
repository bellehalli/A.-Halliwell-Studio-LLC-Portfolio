"use client";

import { useEffect, useRef, useState } from "react";
import { signatureFields, SignatureField, SignatureLayout, SignaturePosition, validSignatureLayout } from "@/lib/portal-signature-layout";
import type { PDFDocumentLoadingTask, PDFDocumentProxy, RenderTask } from "pdfjs-dist";

const labels = { studioSignature: "Studio signature", studioDate: "Studio date", clientSignature: "Client signature", clientDate: "Client date" };
export default function PdfReader({ url, title, placement }: { url: string; title: string; placement?: { documentId: string; initialLayout: SignatureLayout | null } }) {
  const [layout, setLayout] = useState<Partial<SignatureLayout>>(placement?.initialLayout || {});
  const [activeField, setActiveField] = useState<SignatureField>("studioSignature");
  const [dimensions, setDimensions] = useState({ width: 612, height: 792 });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState("");
  function place(x: number, y: number) {
    setLayout(current => ({ ...current, [activeField]: { page, x: Math.round(x), y: Math.round(y), width: current[activeField]?.width || (activeField.endsWith("Signature") ? 220 : 120) } }));
  }
  async function save(emailCopy = false) {
    if (!placement || !validSignatureLayout(layout)) { setSaved("Place all four signature and date fields first."); return; }
    setSaving(true); setSaved("");
    try {
      const response = await fetch("/api/portal/signature-layout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ documentId: placement.documentId, layout, emailCopy }) });
      const result = await response.json();
      if (!response.ok) throw Error(result.message || "Could not save placement.");
      setSaved(result.message);
    } catch (error) { setSaved(error instanceof Error ? error.message : "Could not save placement."); }
    finally { setSaving(false); }
  }
  const frame = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const pdf = useRef<PDFDocumentProxy | null>(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [message, setMessage] = useState("Loading the agreement…");

  useEffect(() => {
    let active = true;
    let loading: PDFDocumentLoadingTask | undefined;
    (async () => {
      try {
        const response = await fetch(url, { credentials: "same-origin", cache: "no-store" });
        if (!response.ok) throw new Error(response.status === 401 ? "Your session has expired. Sign in to the portal again, then reopen this document." : response.status === 403 ? "This document is not released for your account yet. Invoices open after the current agreement is signed and the studio shares the file." : response.status === 404 ? "This document is unavailable. Return to your workspace and open its latest copy." : "The PDF could not be retrieved. Please try again or use Download PDF below.");
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
        loading = pdfjs.getDocument({ data: new Uint8Array(await response.arrayBuffer()) });
        const document = await loading.promise;
        if (!active) { await document.destroy(); return; }
        pdf.current = document;
        setPages(document.numPages);
        setMessage("");
      } catch (error) {
        if (active) setMessage(error instanceof Error ? error.message : "The in-page reader could not open this PDF. Use the download link below.");
      }
    })();
    return () => { active = false; pdf.current = null; void loading?.destroy(); };
  }, [url]);

  useEffect(() => {
    if (!pages || !frame.current || !canvas.current) return;
    let active = true;
    let render: RenderTask | undefined;
    let revision = 0;
    const draw = async () => {
      const current = ++revision;
      render?.cancel();
      const document = pdf.current;
      const element = frame.current;
      const surface = canvas.current;
      if (!document || !element || !surface) return;
      try {
        const pdfPage = await document.getPage(page);
        if (!active || current !== revision) return;
        const width = Math.max(240, element.clientWidth);
        const base = pdfPage.getViewport({ scale: 1 });
        setDimensions({ width: base.width, height: base.height });
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        const viewport = pdfPage.getViewport({ scale: width / base.width });
        surface.width = Math.round(viewport.width * ratio);
        surface.height = Math.round(viewport.height * ratio);
        surface.style.width = `${viewport.width}px`;
        surface.style.height = `${viewport.height}px`;
        const context = surface.getContext("2d");
        if (!context) throw new Error("Canvas unavailable");
        render = pdfPage.render({ canvas: surface, canvasContext: context, viewport, transform: [ratio, 0, 0, ratio, 0, 0] });
        await render.promise;
      } catch (error) {
        if (active && current === revision && !(error instanceof Error && error.name === "RenderingCancelledException")) setMessage("This page could not be displayed. Open the PDF directly below.");
      }
    };
    const observer = new ResizeObserver(() => { void draw(); });
    observer.observe(frame.current);
    void draw();
    return () => { active = false; revision++; observer.disconnect(); render?.cancel(); };
  }, [page, pages]);

  return <div className="portal-pdf-reader" aria-label={title}>
    {message && <p role="status">{message}</p>}
    {pages > 0 && <div className="portal-pdf-controls"><button type="button" disabled={page === 1} onClick={() => setPage(value => value - 1)}>Previous page</button><span>Page {page} of {pages}</span><button type="button" disabled={page === pages} onClick={() => setPage(value => value + 1)}>Next page</button></div>}
    {placement && <div className="portal-signature-placement"><h2>Place signatures on the agreement</h2><p>Choose a field, navigate to its page, then tap the left end of its signature or date line. The signature sits just above that point. Adjust the coordinates and width if needed. Save before signing.</p><div className="portal-placement-fields">{signatureFields.map(key => <button type="button" key={key} aria-pressed={activeField === key} onClick={() => { setActiveField(key); if (layout[key]) setPage(layout[key]!.page); }}>{labels[key]} {layout[key] ? "placed" : "not placed"}</button>)}</div><div className="portal-placement-fields">{(["page", "x", "y", "width"] as const).map(key => <label key={key}>{key === "y" ? "Y above page bottom" : key === "x" ? "X from page left" : key === "width" ? "Width in PDF points" : "Page"}<input type="number" min={key === "page" ? 1 : key === "width" ? 40 : 0} value={layout[activeField]?.[key] ?? ""} onChange={event => setLayout(current => ({ ...current, [activeField]: { page, x: 0, y: 0, width: activeField.endsWith("Signature") ? 220 : 120, ...current[activeField], [key]: Number(event.target.value) } as SignaturePosition }))}/></label>)}</div><button type="button" disabled={saving} onClick={() => void save()}>Save signature placement</button><button type="button" disabled={saving} onClick={() => void save(true)}>Email completed copy to studio</button>{saved && <p role="status">{saved}</p>}<p><a href={`/portal/documents/${placement.documentId}`} target="_blank" rel="noopener noreferrer">Check the saved signed PDF</a></p></div>}
    <div className="portal-pdf-canvas" ref={frame} style={{ position: "relative" }}><canvas ref={canvas} onClick={placement ? event => { const box = event.currentTarget.getBoundingClientRect(); place((event.clientX - box.left) / box.width * dimensions.width, (1 - (event.clientY - box.top) / box.height) * dimensions.height); } : undefined} style={placement ? { cursor: "crosshair" } : undefined} role="img" aria-label={`${title}, page ${page} of ${pages}`}/>{placement && signatureFields.map(key => { const position = layout[key]; if (!position || position.page !== page) return null; return <span key={key} className="portal-placement-marker" style={{ pointerEvents: "none", position: "absolute", left: `${position.x / dimensions.width * 100}%`, bottom: `${position.y / dimensions.height * 100}%`, width: `${position.width / dimensions.width * 100}%` }}>{labels[key]}</span>; })}</div>
  </div>;
}
