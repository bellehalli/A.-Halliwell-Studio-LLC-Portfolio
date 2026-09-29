import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { del } from "@vercel/blob";
import Stripe from "stripe";
import { currentPortalClient, ensurePortalPaymentOptions, ensurePortalProposals, ensurePortalLifecycle, isPortalStudio, newToken, portalDb, portalEnabled, tokenHash } from "@/lib/portal";
import { projectMilestoneAmounts } from "@/lib/portal-plan";

export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store" };
const fail = (status: number, message: string) => NextResponse.json({ ok: false, message }, { status, headers });
const stages = ["proposal", "agreement", "invoice", "in_progress", "review", "complete"];
const cents = (value: unknown) => {
  const amount = String(value ?? "").trim();
  if (!/^\d{1,7}(\.\d{1,2})?$/.test(amount)) return null;
  const [dollars, fraction = ""] = amount.split(".");
  return Number(dollars) * 100 + Number(fraction.padEnd(2, "0"));
};

export async function POST(request: Request) {
  if (!portalEnabled()) return fail(503, "Portal unavailable.");
  if (request.headers.get("origin") !== new URL(request.url).origin) return fail(403, "Forbidden.");
  const studio = await currentPortalClient();
  if (!isPortalStudio(studio)) return fail(403, "Forbidden.");
  try {
    const raw = await request.text();
    if (raw.length > 8_000) return fail(413, "Request too large.");
    const data = JSON.parse(raw);
    await ensurePortalLifecycle();
    const sql = portalDb();
    if (data.action === "createValerieDraft") {
      const email = "valerie-draft@portal.invalid";
      const title = "Custom Illustrated Venue Experience Map";
      const summary = "A custom illustrated map of Vale Royal Barn, composed to help couples picture their arrival, ceremony, celebration, and stay. The final artwork will include venue spaces, suites, outdoor areas, photo locations, parking, and thoughtful labels, prepared for website and brochure use. Two rounds of refinements and an exclusive commercial usage license for the approved final artwork are included in the agreement.";
      await sql`INSERT INTO portal_clients(id, email, first_name) VALUES (${randomUUID()}, ${email}, 'Valerie') ON CONFLICT (email) DO NOTHING`;
      const clients = await sql`SELECT id FROM portal_clients WHERE email = ${email} LIMIT 1`;
      const clientId = String(clients[0].id);
      const existing = await sql`SELECT id FROM portal_projects WHERE client_id = ${clientId} AND title = ${title} LIMIT 1`;
      if (existing.length) return NextResponse.json({ ok: true, id: existing[0].id, draft: true }, { headers });
      const id = randomUUID();
      await sql`INSERT INTO portal_projects(id, client_id, title, summary, client_business, investment_cents)
        VALUES (${id}, ${clientId}, ${title}, ${summary}, 'Vale Royal Barn', 375000)`;
      return NextResponse.json({ ok: true, id, draft: true }, { headers });
    }
    if (data.action === "releaseDraft") {
      const id = String(data.projectId || "");
      const email = String(data.email || "").trim().toLowerCase();
      if (!/^[a-f0-9-]{36}$/.test(id) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.endsWith(".invalid")) return fail(400, "Enter Valerie's real email address.");
      const draft = await sql`SELECT p.client_id FROM portal_projects p JOIN portal_clients c ON c.id = p.client_id
        WHERE p.id = ${id} AND c.email = 'valerie-draft@portal.invalid' LIMIT 1`;
      if (!draft.length) return fail(409, "This workspace is not a held Valerie draft.");
      const duplicate = await sql`SELECT id FROM portal_clients WHERE email = ${email} LIMIT 1`;
      if (duplicate.length) return fail(409, "This email already has a portal account. Resolve the existing client record first.");
      await sql`UPDATE portal_clients SET email = ${email} WHERE id = ${draft[0].client_id}`;
      return NextResponse.json({ ok: true }, { headers });
    }
    if (data.action === "updateRecipient") {
      const id = String(data.projectId || "");
      const email = String(data.email || "").trim().toLowerCase();
      if (!/^[a-f0-9-]{36}$/.test(id) || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.endsWith(".invalid")) return fail(400, "Enter a valid client email address.");
      const rows = await sql`SELECT c.id, c.email, c.role FROM portal_projects p JOIN portal_clients c ON c.id = p.client_id WHERE p.id = ${id} LIMIT 1`;
      if (!rows.length) return fail(404, "Project not found.");
      const client = rows[0];
      if (client.role !== "client") return fail(403, "Only client recipients can be edited here.");
      if (client.email === email) return NextResponse.json({ ok: true, recipient: email, changed: false }, { headers });
      const duplicate = await sql`SELECT 1 FROM portal_clients WHERE email = ${email} AND id != ${client.id} LIMIT 1`;
      if (duplicate.length) return fail(409, "This email already belongs to another portal account. Use a different email or resolve that account first.");
      // Keep signed records and their original signer_email immutable. Revoke the old identity atomically.
      await sql.transaction([
        sql`UPDATE portal_clients SET email = ${email} WHERE id = ${client.id} AND role = 'client'`,
        sql`DELETE FROM portal_sessions WHERE client_id = ${client.id}`,
        sql`DELETE FROM portal_login_links WHERE client_id = ${client.id}`,
        sql`DELETE FROM portal_login_codes WHERE client_id = ${client.id}`,
        sql`UPDATE portal_projects SET invited_at = NULL WHERE client_id = ${client.id}`,
      ]);
      return NextResponse.json({ ok: true, recipient: email, changed: true }, { headers });
    }
    if (data.action === "create") {
      const email = String(data.email || "").trim().toLowerCase();
      const firstName = String(data.firstName || "").trim().slice(0, 80);
      const rawTitle = String(data.title || "").trim();
      const title = (data.isTest === "on" ? `TEST ${rawTitle}` : rawTitle).slice(0, 150);
      const summary = String(data.summary || "").trim().slice(0, 1000);
      const clientBusiness = String(data.clientBusiness || "").trim().slice(0, 150);
      const investment = String(data.investment || "").trim();
      if (investment && !/^\d{1,7}(\.\d{1,2})?$/.test(investment)) return fail(400, "Check the project investment.");
      const [dollars, cents = ""] = investment.split(".");
      const investmentCents = investment ? Number(dollars) * 100 + Number(cents.padEnd(2, "0")) : null;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !firstName || !rawTitle) return fail(400, "Client email, name, and project title are required.");
      await sql`INSERT INTO portal_clients(id, email, first_name) VALUES (${randomUUID()}, ${email}, ${firstName}) ON CONFLICT (email) DO NOTHING`;
      const clients = await sql`SELECT id, role FROM portal_clients WHERE email = ${email} LIMIT 1`;
      if (clients[0]?.role !== "client") return fail(400, "Use a client email address.");
      const id = randomUUID();
      await sql`INSERT INTO portal_projects(id, client_id, title, summary, client_business, investment_cents) VALUES (${id}, ${clients[0].id}, ${title}, ${summary}, ${clientBusiness}, ${investmentCents})`;
      return NextResponse.json({ ok: true, id }, { headers });
    }
    if (data.action === "removeDocument") {
      const id = String(data.documentId || "");
      if (!/^[a-f0-9-]{36}$/.test(id)) return fail(400, "Choose a document.");
      const removed = await sql`UPDATE portal_documents SET removed_at = now()
        WHERE id = ${id} AND kind = 'agreement' AND removed_at IS NULL
        AND NOT EXISTS (SELECT 1 FROM portal_agreement_signatures WHERE document_id = ${id}) RETURNING id`;
      if (!removed.length) return fail(409, "Signed agreements are retained. Upload a replacement version instead.");
      return NextResponse.json({ ok: true }, { headers });
    }
    if (data.action === "updatePaymentPlan") {
      const id = String(data.projectId || "");
      const total = cents(data.total);
      const amounts = [cents(data.milestone1), cents(data.milestone2), cents(data.milestone3)];
      if (!/^[a-f0-9-]{36}$/.test(id) || !total || amounts.some(amount => !amount) || amounts.reduce<number>((sum, amount) => sum + Number(amount), 0) !== total) return fail(400, "The three payment amounts must add up exactly to the project total.");
      const project = await sql`SELECT investment_cents, milestone_1_cents, milestone_2_cents, milestone_3_cents FROM portal_projects WHERE id = ${id} LIMIT 1`;
      if (!project.length) return fail(404, "Project not found.");
      const original = projectMilestoneAmounts(project[0]);
      const changed = total !== Number(project[0].investment_cents || 0) || amounts.some((amount, index) => amount !== original[index]);
      if (changed) {
        const signed = await sql`SELECT 1 FROM portal_agreement_signatures s JOIN portal_documents d ON d.id = s.document_id
          WHERE d.project_id = ${id} AND s.signer_role = 'client' LIMIT 1`;
        if (signed.length) return fail(409, "The client has signed the payment terms. Add an amended agreement before changing the plan.");
      }
      const attached = await sql`SELECT i.milestone_number, i.amount_cents FROM portal_invoices i JOIN portal_documents d ON d.id = i.document_id
        WHERE d.project_id = ${id} AND i.status != 'void'`;
      if (attached.some(invoice => Number(invoice.amount_cents) !== amounts[Number(invoice.milestone_number) - 1])) return fail(409, "An attached invoice has a different amount. Correct or void that invoice before changing its milestone.");
      await sql`UPDATE portal_projects SET investment_cents = ${total}, milestone_1_cents = ${amounts[0]}, milestone_2_cents = ${amounts[1]}, milestone_3_cents = ${amounts[2]} WHERE id = ${id}`;
      return NextResponse.json({ ok: true }, { headers });
    }
    if (data.action === "deleteWorkspace") {
      const id = String(data.projectId || "");
      const confirmEmail = String(data.confirmEmail || "").trim().toLowerCase();
      if (!/^[a-f0-9-]{36}$/.test(id) || !confirmEmail) return fail(400, "Choose a workspace and confirm its client email.");
      const rows = await sql`SELECT p.id, p.client_id, p.title, p.stripe_invoice_id, c.email FROM portal_projects p
        JOIN portal_clients c ON c.id = p.client_id WHERE p.id = ${id} LIMIT 1`;
      if (!rows.length) return fail(404, "Workspace not found.");
      const target = rows[0];
      const draftConfirmed = String(target.email).endsWith(".invalid") && confirmEmail === "draft" && String(data.confirmTitle || "") === String(target.title);
      if ((!draftConfirmed && confirmEmail !== String(target.email).toLowerCase()) || confirmEmail === studio?.email) return fail(403, "The client confirmation does not match this workspace.");
      const paidInvoice = await sql`SELECT 1 FROM portal_invoices i JOIN portal_documents d ON d.id = i.document_id
        WHERE d.project_id = ${id} AND i.status = 'paid' LIMIT 1`;
      if (paidInvoice.length) return fail(409, "This workspace has a confirmed payment. Archive it instead.");
      const signed = await sql`SELECT 1 FROM portal_agreement_signatures s JOIN portal_documents d ON d.id = s.document_id WHERE d.project_id = ${id} LIMIT 1`;
      if (signed.length) return fail(409, "A signed agreement is part of this workspace. Archive it instead.");
      const connected = await sql`SELECT DISTINCT i.stripe_invoice_id FROM portal_invoices i JOIN portal_documents d ON d.id = i.document_id WHERE d.project_id = ${id} AND i.stripe_invoice_id IS NOT NULL`;
      const stripeIds = [...new Set([target.stripe_invoice_id, ...connected.map(row => row.stripe_invoice_id)].filter(Boolean).map(String))];
      if (stripeIds.length && !process.env.STRIPE_SECRET_KEY) return fail(503, "Stripe payment status is unavailable. Try again later.");
      for (const invoiceId of stripeIds) {
        const stripeInvoice = await new Stripe(process.env.STRIPE_SECRET_KEY!).invoices.retrieve(invoiceId);
        if (stripeInvoice.status === "paid" || stripeInvoice.amount_paid > 0) return fail(409, "This workspace has a Stripe payment. Archive it instead.");
        if (stripeInvoice.status === "open") return fail(409, "Void the open Stripe invoice before removing this practice workspace.");
      }
      await ensurePortalProposals();
      const blobs = await sql`SELECT blob_url AS url FROM portal_documents WHERE project_id = ${id}
        UNION SELECT blob_url AS url FROM portal_proposals WHERE project_id = ${id}
        UNION SELECT blob_url AS url FROM portal_materials WHERE project_id = ${id}
        UNION SELECT blob_url AS url FROM portal_deliverables WHERE project_id = ${id}
        UNION SELECT signed_pdf_url AS url FROM portal_agreement_signatures s JOIN portal_documents d ON d.id = s.document_id WHERE d.project_id = ${id}`;
      await sql`DELETE FROM portal_projects WHERE id = ${id}`;
      const remaining = await sql`SELECT 1 FROM portal_projects WHERE client_id = ${target.client_id} LIMIT 1`;
      if (!remaining.length) await sql`DELETE FROM portal_clients WHERE id = ${target.client_id}`;
      const urls = blobs.map(blob => String(blob.url)).filter(url => url.startsWith("https://"));
      if (urls.length) await del(urls).catch(() => { /* The database removal remains authoritative. */ });
      return NextResponse.json({ ok: true, email: target.email, clientRemoved: !remaining.length }, { headers });
    }
    if (data.action === "archiveWorkspace") {
      const id = String(data.projectId || "");
      if (!/^[a-f0-9-]{36}$/.test(id)) return fail(400, "Choose a workspace.");
      const rows = await sql`UPDATE portal_projects SET archived_at = CASE WHEN archived_at IS NULL THEN now() ELSE NULL END WHERE id = ${id} RETURNING archived_at`;
      if (!rows.length) return fail(404, "Workspace not found.");
      return NextResponse.json({ ok: true, archived: !!rows[0].archived_at }, { headers });
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
        const amounts = await sql`SELECT i.amount_cents FROM portal_invoices i JOIN portal_documents d ON d.id = i.document_id
          WHERE d.project_id = ${id} AND i.status = 'issued' ORDER BY d.created_at DESC, d.id DESC LIMIT 1`;
        if (!amounts.length || invoice.currency !== "usd" || invoice.amount_due !== Number(amounts[0].amount_cents) || !["open", "paid"].includes(invoice.status ?? "")) return fail(400, "The Stripe invoice must be issued in USD for the same amount as the current Chase invoice.");
      }
      await sql`UPDATE portal_projects SET stage = ${stage}, agreement_url = ${agreementUrl || null}, stripe_invoice_id = ${invoiceId || null}, payment_instructions = ${paymentInstructions} WHERE id = ${id}`;
      return NextResponse.json({ ok: true }, { headers });
    }
    if (data.action === "invite") {
      const id = String(data.projectId || "");
      if (!/^[a-f0-9-]{36}$/.test(id)) return fail(400, "Choose a project.");
      const rows = await sql`SELECT c.id, c.email, c.first_name, p.title FROM portal_projects p JOIN portal_clients c ON c.id = p.client_id WHERE p.id = ${id} LIMIT 1`;
      if (!rows.length) return fail(404, "Project not found.");
      if (!String(rows[0].title).startsWith("TEST")) {
        await ensurePortalProposals();
        const proposals = await sql`SELECT 1 FROM portal_proposals WHERE project_id = ${id} LIMIT 1`;
        if (!proposals.length) return fail(409, "Attach the approved proposal before inviting the client.");
      }
      const signed = await sql`SELECT 1 FROM portal_documents d JOIN portal_agreement_signatures s ON s.document_id = d.id AND s.signer_role = 'studio'
        WHERE d.project_id = ${id} AND d.kind = 'agreement'
          AND d.id = (SELECT id FROM portal_documents WHERE project_id = ${id} AND kind = 'agreement' AND removed_at IS NULL ORDER BY created_at DESC, id DESC LIMIT 1) LIMIT 1`;
      if (!signed.length) return fail(409, "Sign the current agreement as the studio before inviting the client.");
      const readyInvoice = await sql`SELECT 1 FROM portal_invoices i JOIN portal_documents d ON d.id = i.document_id
        WHERE d.project_id = ${id} AND i.status = 'issued' LIMIT 1`;
      const sample = await sql`SELECT 1 FROM portal_invoices i JOIN portal_documents d ON d.id = i.document_id
        WHERE d.project_id = ${id} AND i.status = 'void' AND i.invoice_number LIKE 'TEST-%' LIMIT 1`;
      if (!readyInvoice.length && !(String(rows[0].title).startsWith("TEST") && sample.length)) return fail(409, "Attach an issued invoice before inviting the client.");
      const client = rows[0];
      if (String(client.email).endsWith(".invalid")) return fail(409, "This draft has no client email. Review it before adding an address and inviting Valerie.");
      const recent = await sql`SELECT count(*)::int AS count FROM portal_login_links WHERE client_id = ${client.id} AND created_at > now() - interval '1 hour'`;
      if (Number(recent[0]?.count) >= 3) return fail(429, "Please wait before sending another invitation.");
      const token = newToken(), hash = tokenHash(token);
      await sql`INSERT INTO portal_login_links(token_hash, client_id, project_id, expires_at) VALUES (${hash}, ${client.id}, ${id}, now() + interval '48 hours')`;
      const { data: sent, error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
        from: process.env.INQUIRY_FROM_EMAIL || "A. Halliwell Studio <onboarding@resend.dev>", to: [String(client.email)],
        subject: "Your A. Halliwell Studio project workspace",
        text: `Hi ${client.first_name},\n\nYour private project workspace is ready. The agreement is signed by the studio and waiting for your review. Open your private link to sign and see the next steps:\n\nhttps://www.ahalliwellstudio.com/portal/claim#token=${token}\n\nThis invitation link expires in 48 hours and can be used once. Your permanent workspace address is https://www.ahalliwellstudio.com/portal/projects/${id}. Sign in there with your email and a fresh email code whenever you return.\n\nArabella`,
      });
      if (error || !sent?.id) { await sql`DELETE FROM portal_login_links WHERE token_hash = ${hash}`; return fail(502, "The email provider did not accept the invitation. Check the sender configuration and try again."); }
      await sql`UPDATE portal_projects SET invited_at = coalesce(invited_at, now()) WHERE id = ${id}`;
      await sql`UPDATE portal_invoices i SET shared_at = coalesce(i.shared_at, now()), notification_status = 'included_in_invitation', notification_attempted_at = now(), notification_email_id = ${sent.id}
        FROM portal_documents d WHERE i.document_id = d.id AND d.project_id = ${id} AND i.status = 'issued' AND i.milestone_number = 1 AND i.shared_at IS NULL`;
      return NextResponse.json({ ok: true, recipient: String(client.email), emailId: sent.id, status: "accepted" }, { headers });
    }
    if (data.action === "updateInvoice") {
      const projectId = String(data.projectId || "");
      const documentId = String(data.documentId || "");
      const paymentUrl = String(data.paymentUrl || "").trim();
      const achUrl = String(data.achUrl || "").trim();
      const zelleId = String(data.zelleId || "").trim();
      const checkAddress = String(data.checkAddress || "").trim();
      const stripeId = String(data.stripeInvoiceId || "").trim();
      if (stripeId && !/^in_[A-Za-z0-9]+$/.test(stripeId)) return fail(400, "Check the Stripe invoice ID.");
      if (!/^[a-f0-9-]{36}$/.test(projectId) || !/^[a-f0-9-]{36}$/.test(documentId) || (paymentUrl && (!paymentUrl.startsWith("https://") || paymentUrl.length > 1000)) || (achUrl && (!achUrl.startsWith("https://") || achUrl.length > 1000)) || zelleId.length > 254 || checkAddress.length > 500) return fail(400, "Check the invoice payment details.");
      if (stripeId) {
        if (!process.env.STRIPE_SECRET_KEY) return fail(503, "Stripe is not configured.");
        const info = await sql`SELECT i.amount_cents, c.email FROM portal_invoices i JOIN portal_documents d ON d.id = i.document_id
          JOIN portal_projects p ON p.id = d.project_id JOIN portal_clients c ON c.id = p.client_id WHERE d.id = ${documentId} AND p.id = ${projectId} LIMIT 1`;
        if (!info.length) return fail(404, "Invoice not found.");
        const stripe = await new Stripe(process.env.STRIPE_SECRET_KEY).invoices.retrieve(stripeId);
        if (stripe.customer_email?.toLowerCase() !== String(info[0].email).toLowerCase() || stripe.currency !== "usd" || stripe.amount_due !== Number(info[0].amount_cents) || !["open", "paid"].includes(stripe.status || "")) return fail(400, "Stripe must be issued to the same client for the same amount.");
      }
      const rows = await sql`UPDATE portal_invoices i SET payment_url = ${paymentUrl || null}, zelle_id = ${zelleId}, check_address = ${checkAddress}, stripe_invoice_id = ${stripeId || null}
        FROM portal_documents d WHERE i.document_id = d.id AND d.id = ${documentId} AND d.project_id = ${projectId} AND i.status = 'issued' RETURNING i.document_id`;
      if (!rows.length) return fail(404, "Issued invoice not found.");
      await ensurePortalPaymentOptions();
      await sql`INSERT INTO portal_payment_options(document_id, ach_url) VALUES (${documentId}, ${achUrl})
        ON CONFLICT (document_id) DO UPDATE SET ach_url = EXCLUDED.ach_url`;
      return NextResponse.json({ ok: true }, { headers });
    }
    if (data.action === "shareInvoice" || data.action === "shareReview") {
      const id = String(data.documentId || data.deliverableId || "");
      if (!/^[a-f0-9-]{36}$/.test(id)) return fail(400, "Choose a file.");
      const invoice = data.action === "shareInvoice";
      const rows = invoice ? await sql`SELECT d.project_id, d.sha256, c.email, c.first_name, p.invited_at, p.archived_at, i.status, i.shared_at, i.notification_status
        FROM portal_invoices i JOIN portal_documents d ON d.id = i.document_id JOIN portal_projects p ON p.id = d.project_id
        JOIN portal_clients c ON c.id = p.client_id WHERE d.id = ${id} LIMIT 1`
        : await sql`SELECT d.project_id, c.email, c.first_name, p.invited_at, p.archived_at, d.status, d.shared_at, d.version, d.notification_status
          FROM portal_deliverables d JOIN portal_projects p ON p.id = d.project_id JOIN portal_clients c ON c.id = p.client_id WHERE d.id = ${id} LIMIT 1`;
      if (!rows.length) return fail(404, "This file is unavailable.");
      if (rows[0].shared_at && ["accepted", "included_in_invitation"].includes(String(rows[0].notification_status))) return fail(409, "This file has already been shared and its email was accepted.");
      if (!rows[0].invited_at || rows[0].archived_at || String(rows[0].email).endsWith(".invalid")) return fail(409, "Invite the client and keep the project active before sharing a file.");
      if (invoice && rows[0].status !== "issued") return fail(409, "Only issued invoices can be shared.");
      if (invoice || data.action === "shareReview") {
        const signed = await sql`SELECT 1 FROM portal_agreement_signatures s JOIN portal_documents d ON d.id = s.document_id
          WHERE d.project_id = ${rows[0].project_id} AND d.kind = 'agreement' AND s.signer_role = 'client'
            AND d.id = (SELECT id FROM portal_documents WHERE project_id = ${rows[0].project_id} AND kind = 'agreement' AND removed_at IS NULL ORDER BY created_at DESC, id DESC LIMIT 1) LIMIT 1`;
        if (!signed.length) return fail(409, "The client must sign the agreement before this file is shared. The deposit invoice is released with the invitation.");
      }
      const claimed = invoice ? await sql`UPDATE portal_invoices SET shared_at = coalesce(shared_at, now()), notification_status = 'sending', notification_attempted_at = now()
        WHERE document_id = ${id} AND (notification_status != 'sending' OR notification_attempted_at < now() - interval '2 minutes')
          AND notification_status NOT IN ('accepted', 'included_in_invitation') RETURNING document_id`
        : await sql`UPDATE portal_deliverables SET shared_at = coalesce(shared_at, now()), notification_status = 'sending', notification_attempted_at = now()
          WHERE id = ${id} AND (notification_status != 'sending' OR notification_attempted_at < now() - interval '2 minutes')
            AND notification_status NOT IN ('accepted', 'included_in_invitation') RETURNING id`;
      if (!claimed.length) return fail(409, "An email is already being sent. Refresh its status shortly.");
      const subject = invoice ? "Your project invoice is ready" : "A new version is ready for your review";
      try {
        const { data: sent, error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
          from: process.env.INQUIRY_FROM_EMAIL || "A. Halliwell Studio <onboarding@resend.dev>", to: [String(rows[0].email)], subject,
          text: `Hi ${rows[0].first_name},\n\n${invoice ? "Your invoice" : `Version ${rows[0].version}`} is ready in your private project workspace.\n\nhttps://www.ahalliwellstudio.com/portal\n\nArabella`,
        }, { idempotencyKey: invoice ? `portal-share/${id}/${rows[0].sha256}` : `portal-share/${id}` });
        if (error || !sent?.id) throw new Error("Notification not accepted.");
        if (invoice) await sql`UPDATE portal_invoices SET notification_status = 'accepted', notification_email_id = ${sent.id} WHERE document_id = ${id}`;
        else await sql`UPDATE portal_deliverables SET notification_status = 'accepted', notification_email_id = ${sent.id} WHERE id = ${id}`;
        return NextResponse.json({ ok: true, notified: true, emailId: sent.id }, { headers });
      } catch {
        if (invoice) await sql`UPDATE portal_invoices SET notification_status = 'failed' WHERE document_id = ${id} AND notification_status = 'sending'`;
        else await sql`UPDATE portal_deliverables SET notification_status = 'failed' WHERE id = ${id} AND notification_status = 'sending'`;
        return fail(502, "The file is visible in the client workspace, but the email was not accepted. Retry the notification from this panel.");
      }
    }
    if (data.action === "confirmChaseClosed") {
      const id = String(data.documentId || "");
      if (!/^[a-f0-9-]{36}$/.test(id) || data.confirm !== "yes") return fail(400, "Confirm the Chase invoice was closed or marked paid in Chase.");
      const rows = await sql`UPDATE portal_invoices SET chase_closed_at = now()
        WHERE document_id = ${id} AND status = 'paid' AND invoice_number NOT LIKE 'TEST-%' AND chase_closed_at IS NULL RETURNING document_id`;
      if (!rows.length) return fail(409, "No Chase closure is pending for this paid invoice.");
      return NextResponse.json({ ok: true }, { headers });
    }
    if (data.action === "invoiceStatus") {
      const documentId = String(data.documentId || "");
      const status = String(data.status || "");
      if (!/^[a-f0-9-]{36}$/.test(documentId) || !["paid", "void"].includes(status)) return fail(400, "Check the invoice and status.");
      const details = await sql`SELECT i.status, i.invoice_number, i.stripe_invoice_id, i.payment_url, i.amount_cents FROM portal_invoices i WHERE i.document_id = ${documentId} LIMIT 1`;
      if (!details.length || details[0].status !== "issued") return fail(409, "Only an issued invoice can be marked paid or void.");
      const item = details[0];
      const needsChaseCloseout = !String(item.invoice_number).startsWith("TEST-");
      if (needsChaseCloseout && data.externalClosed !== "yes") return fail(409, "Close or mark the Chase invoice paid first, then confirm it here.");
      if (item.stripe_invoice_id) {
        if (!process.env.STRIPE_SECRET_KEY) return fail(503, "Stripe status is unavailable. Try again later.");
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const live = await stripe.invoices.retrieve(String(item.stripe_invoice_id));
        if (live.status === "paid" || live.amount_paid > 0) return fail(409, "Stripe records a payment. Refresh the invoice to reconcile its actual status.");
        if (live.status === "open") await stripe.invoices.voidInvoice(String(item.stripe_invoice_id));
        else if (live.status !== "void") return fail(409, "Stripe is still processing this invoice. Wait for its final status.");
      }
      const rows = await sql`UPDATE portal_invoices SET status = ${status}, paid_at = CASE WHEN ${status} = 'paid' THEN now() ELSE NULL END, chase_closed_at = CASE WHEN ${needsChaseCloseout} THEN now() ELSE chase_closed_at END
        WHERE document_id = ${documentId} AND status = 'issued' RETURNING document_id`;
      if (!rows.length) return fail(409, "Invoice status changed. Refresh before trying again.");
      if (status === "paid") {
        const recipient = await sql`SELECT c.email, c.first_name, i.invoice_number FROM portal_invoices i JOIN portal_documents d ON d.id = i.document_id
          JOIN portal_projects p ON p.id = d.project_id JOIN portal_clients c ON c.id = p.client_id WHERE i.document_id = ${documentId} LIMIT 1`;
        if (recipient.length && !String(recipient[0].email).endsWith(".invalid")) {
          try { await new Resend(process.env.RESEND_API_KEY).emails.send({
            from: process.env.INQUIRY_FROM_EMAIL || "A. Halliwell Studio <onboarding@resend.dev>", to: [String(recipient[0].email)],
            subject: "Your project payment is confirmed",
            text: `Hi ${recipient[0].first_name},\n\nYour payment for invoice ${recipient[0].invoice_number} has been confirmed by the studio. Your project workspace now shows it as paid.\n\nhttps://www.ahalliwellstudio.com/portal\n\nArabella`,
          }, { idempotencyKey: `portal-payment-confirmed/${documentId}` }); } catch { /* The paid status remains authoritative. */ }
        }
      }
      return NextResponse.json({ ok: true }, { headers });
    }
    return fail(400, "Unknown action.");
  } catch {
    return fail(500, "The studio action could not be completed.");
  }
}
