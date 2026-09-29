"use client";

import { useEffect, useRef, useState } from "react";
import type { PDFDocumentLoadingTask, PDFDocumentProxy, RenderTask } from "pdfjs-dist";

export default function PdfReader({ url, title }: { url: string; title: string }) {
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
        if (!response.ok) throw new Error("The agreement could not be opened here.");
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
        loading = pdfjs.getDocument({ data: new Uint8Array(await response.arrayBuffer()) });
        const document = await loading.promise;
        if (!active) { await document.destroy(); return; }
        pdf.current = document;
        setPages(document.numPages);
        setMessage("");
      } catch {
        if (active) setMessage("The in-page reader could not open this PDF. Use the open or download link below.");
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
    <div className="portal-pdf-canvas" ref={frame}><canvas ref={canvas} role="img" aria-label={`${title}, page ${page} of ${pages}`}/></div>
  </div>;
}
