import "server-only";
import { get } from "@vercel/blob";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { createHash } from "node:crypto";
import { SignatureLayout, signatureFields, validSignatureLayout } from "./portal-signature-layout";
export const pdfHash = (bytes: Uint8Array) => createHash("sha256").update(bytes).digest("hex");
export async function privatePdf(url: string, expectedHash: string) {
  const blob = await get(url, { access: "private" });
  if (!blob || blob.statusCode !== 200) throw Error("The agreement file is unavailable.");
  const bytes = new Uint8Array(await new Response(blob.stream).arrayBuffer());
  if (pdfHash(bytes) !== expectedHash) throw Error("The agreement integrity check failed.");
  return bytes;
}
export async function alignedSignedCopy(original: Uint8Array, layout: SignatureLayout, records: { role: "studio" | "client"; bytes: Uint8Array; signedAt: string }[]) {
  if (!validSignatureLayout(layout)) throw Error("Place all four signature and date fields.");
  const pdf = await PDFDocument.load(original);
  const count = pdf.getPageCount();
  for (const key of signatureFields) {
    const p = layout[key], page = pdf.getPages()[p.page - 1];
    if (p.page > count || !page || page.getRotation().angle !== 0 || p.x + p.width > page.getWidth() || p.y + 2 + (key.endsWith("Signature") ? p.width * .3 : 16) > page.getHeight()) throw Error("A signature field extends beyond its agreement page. Adjust its placement.");
  }
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  for (const record of records) {
    const signed = await PDFDocument.load(record.bytes);
    const certificate = signed.getPages()[signed.getPageCount() - 1];
    const crop = await pdf.embedPage(certificate, { left: 46, right: 446, bottom: 467, top: 587 });
    const signature = layout[`${record.role}Signature`];
    pdf.getPages()[signature.page - 1].drawPage(crop, { x: signature.x, y: signature.y + 2, width: signature.width, height: signature.width * .3 });
    const position = layout[`${record.role}Date`];
    const date = new Intl.DateTimeFormat("en-US", { timeZone: "America/Detroit", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(record.signedAt));
    const size = Math.min(11, position.width / font.widthOfTextAtSize(date, 1));
    pdf.getPages()[position.page - 1].drawText(date, { x: position.x, y: position.y + 2, size, font, color: rgb(.2,.13,.2) });
    const [copy] = await pdf.copyPages(signed, [signed.getPageCount() - 1]);
    pdf.addPage(copy);
  }
  return new Uint8Array(await pdf.save());
}
