import "server-only";
import { Resend } from "resend";
import { portalDb } from "./portal";
import { privatePdf } from "./portal-signed-copy";

export async function sendCompletedAgreement(documentId: string, resend = false) {
  const sql = portalDb();
  const rows = await sql`SELECT d.id, d.completed_email_id, c.signer_email AS client_email, s.signer_email AS studio_email,
      c.signed_pdf_url, c.signed_pdf_sha256
    FROM portal_documents d JOIN portal_agreement_signatures c ON c.document_id = d.id AND c.signer_role = 'client'
    JOIN portal_agreement_signatures s ON s.document_id = d.id AND s.signer_role = 'studio'
    WHERE d.id = ${documentId} AND d.kind = 'agreement' LIMIT 1`;
  if (!rows.length) return { ok: false, message: "Both signatures must be recorded before sending the completed copy." };
  if (rows[0].completed_email_id && !resend) return { ok: true, message: "Completed agreement email already accepted." };
  const claimed = await sql`UPDATE portal_documents SET completed_email_status = 'sending', completed_email_attempted_at = now(),
    completed_email_attempts = completed_email_attempts + 1
    WHERE id = ${documentId} AND (completed_email_status != 'sending' OR completed_email_attempted_at < now() - interval '5 minutes') RETURNING completed_email_attempts`;
  if (!claimed.length) return { ok: false, message: "An agreement email is already being prepared. Refresh its status shortly." };
  try {
    const bytes = await privatePdf(String(rows[0].signed_pdf_url), String(rows[0].signed_pdf_sha256));
    const to = [...new Set([String(rows[0].client_email), String(rows[0].studio_email)])];
    const result = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: process.env.INQUIRY_FROM_EMAIL || "A. Halliwell Studio <onboarding@resend.dev>", to,
      subject: "Your agreement is signed",
      attachments: [{ filename: "completed-signed-agreement.pdf", content: Buffer.from(bytes) }],
      text: "The attached agreement has both signatures, dates on the agreement lines, and timestamped signature records. You can download your signed copy from your private project workspace: https://www.ahalliwellstudio.com/portal\n\nArabella",
    }, { idempotencyKey: `portal-completed-agreement/${documentId}/${claimed[0].completed_email_attempts}` });
    if (result.error || !result.data?.id) throw Error("Email was not accepted.");
    await sql`UPDATE portal_documents SET completed_email_status = 'accepted', completed_email_id = ${result.data.id} WHERE id = ${documentId}`;
    return { ok: true, message: "Resend accepted the completed agreement for both signers. Inbox delivery is not yet confirmed." };
  } catch {
    await sql`UPDATE portal_documents SET completed_email_status = 'failed' WHERE id = ${documentId}`;
    return { ok: false, message: "The completed agreement email failed. Signed records are safe; retry from this panel." };
  }
}
