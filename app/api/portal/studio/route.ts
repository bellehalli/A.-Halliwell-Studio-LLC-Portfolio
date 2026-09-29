import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import Stripe from "stripe";
import { currentPortalClient, isPortalStudio, newToken, portalDb, portalEnabled, tokenHash } from "@/lib/portal";

export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store" };
const fail = (status: number, message: string) => NextResponse.json({ ok: false, message }, { status, headers });
const stages = ["proposal", "agreement", "invoice", "in_progress", "review", "complete"];

export async function POST(request: Request) {
  if (!portalEnabled()) return fail(503, "Portal unavailable.");
  if (request.headers.get("origin") !== new URL(request.url).origin) return fail(403, "Forbidden.");
  const studio = await currentPortalClient();
  if (!isPortalStudio(studio)) return fail(403, "Forbidden.");
  try {
    const raw = await request.text();
    if (raw.length > 8_000) return fail(413, "Request too large.");
    const data = JSON.parse(raw);
    const sql = portalDb();
    if (data.action === "create") {
      const email = String(data.email || "").trim().toLowerCase();
      const firstName = String(data.firstName || "").trim().slice(0, 80);
      const title = String(data.title || "").trim().slice(0, 150);
      const summary = String(data.summary || "").trim().slice(0, 1000);
      const clientBusiness = String(data.clientBusiness || "").trim().slice(0, 150);
      const investment = String(data.investment || "").trim();
      if (investment && !/^\d{1,7}(\.\d{1,2})?$/.test(investment)) return fail(400, "Check the project investment.");
      const [dollars, cents = ""] = investment.split(".");
      const investmentCents = investment ? Number(dollars) * 100 + Number(cents.padEnd(2, "0")) : null;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !firstName || !title) return fail(400, "Client email, name, and project title are required.");
      await sql`INSERT INTO portal_clients(id, email, first_name) VALUES (${randomUUID()}, ${email}, ${firstName}) ON CONFLICT (email) DO NOTHING`;
      const clients = await sql`SELECT id, role FROM portal_clients WHERE email = ${email} LIMIT 1`;
      if (clients[0]?.role !== "client") return fail(400, "Use a client email address.");
      const id = randomUUID();
      await sql`INSERT INTO portal_projects(id, client_id, title, summary, client_business, investment_cents) VALUES (${id}, ${clients[0].id}, ${title}, ${summary}, ${clientBusiness}, ${investmentCents})`;
      return NextResponse.json({ ok: true, id }, { headers });
    }
    if (data.action === "update") {
      const id = String(data.projectId || "");
      const stage = String(data.stage || "");
      const agreementUrl = String(data.agreementUrl || "").trim();
      const invoiceId = String(data.invoiceId || "").trim();
      const paymentInstructions = String(data.paymentInstructions || "").trim();
      if (!/^[a-f0-9-]{36}$/.test(id) || !stages.includes(stage) || (agreementUrl && !agreementUrl.startsWith("https://")) || (invoiceId && !/^in_[A-Za-z0-9]+$/.test(invoiceId)) || paymentInstructions.length > 1000) return fail(400, "Check the project, stage, agreement URL, invoice ID, and payment instructions.");
      const project = await sql`SELECT p.id, c.email FROM portal_projects p JOIN portal_clients c ON c.id = p.client_id WHERE p.id = ${id} LIMIT 1`;
      if (!project.length) return fail(404, "Project not found.");
      if (invoiceId) {
        if (!process.env.STRIPE_SECRET_KEY) return fail(503, "Stripe is not configured.");
        const invoice = await new Stripe(process.env.STRIPE_SECRET_KEY).invoices.retrieve(invoiceId);
        if (invoice.customer_email?.toLowerCase() !== String(project[0].email).toLowerCase()) return fail(400, "The Stripe invoice must belong to this client email.");
      }
      await sql`UPDATE portal_projects SET stage = ${stage}, agreement_url = ${agreementUrl || null}, stripe_invoice_id = ${invoiceId || null}, payment_instructions = ${paymentInstructions} WHERE id = ${id}`;
      return NextResponse.json({ ok: true }, { headers });
    }
    if (data.action === "invite") {
      const id = String(data.projectId || "");
      const rows = await sql`SELECT c.id, c.email, c.first_name FROM portal_projects p JOIN portal_clients c ON c.id = p.client_id WHERE p.id = ${id} LIMIT 1`;
      if (!rows.length) return fail(404, "Project not found.");
      const client = rows[0];
      const recent = await sql`SELECT count(*)::int AS count FROM portal_login_links WHERE client_id = ${client.id} AND created_at > now() - interval '1 hour'`;
      if (Number(recent[0]?.count) >= 3) return fail(429, "Please wait before sending another invitation.");
      const token = newToken(), hash = tokenHash(token);
      await sql`INSERT INTO portal_login_links(token_hash, client_id, expires_at) VALUES (${hash}, ${client.id}, now() + interval '15 minutes')`;
      const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
        from: process.env.INQUIRY_FROM_EMAIL || "A. Halliwell Studio <onboarding@resend.dev>", to: [String(client.email)],
        subject: "Your A. Halliwell Studio project workspace",
        text: `Hi ${client.first_name},\n\nYour project workspace is ready. Open this private link to see the next steps:\n\nhttps://www.ahalliwellstudio.com/portal/claim#token=${token}\n\nThis link expires in 15 minutes. You can request a fresh link any time at https://www.ahalliwellstudio.com/portal.\n\nArabella`,
      });
      if (error) { await sql`DELETE FROM portal_login_links WHERE token_hash = ${hash}`; return fail(502, "Invitation email could not be sent."); }
      return NextResponse.json({ ok: true }, { headers });
    }
    if (data.action === "invoiceStatus") {
      const documentId = String(data.documentId || "");
      const status = String(data.status || "");
      if (!/^[a-f0-9-]{36}$/.test(documentId) || !["issued", "paid", "void"].includes(status)) return fail(400, "Check the invoice and status.");
      const rows = await sql`UPDATE portal_invoices SET status = ${status}, paid_at = CASE WHEN ${status} = 'paid' THEN now() ELSE NULL END
        WHERE document_id = ${documentId} RETURNING document_id`;
      if (!rows.length) return fail(404, "Invoice not found.");
      return NextResponse.json({ ok: true }, { headers });
    }
    return fail(400, "Unknown action.");
  } catch {
    return fail(500, "The studio action could not be completed.");
  }
}
