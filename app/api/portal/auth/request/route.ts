import { NextResponse } from "next/server";
import { Resend } from "resend";
import { checkRequestLimit } from "@/lib/request-rate-limit";
import { ensurePortalLifecycle, newToken, portalDb, portalEnabled, tokenHash } from "@/lib/portal";

export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store" };
const accepted = () => NextResponse.json({ ok: true, message: "If this email has a workspace, a private sign-in link is on its way." }, { headers });

export async function POST(request: Request) {
  if (!portalEnabled()) return NextResponse.json({ ok: false }, { status: 503, headers });
  if (request.headers.get("origin") !== new URL(request.url).origin) return NextResponse.json({ ok: false }, { status: 403, headers });
  if ((await checkRequestLimit(request, "portal-link", 5, 15 * 60_000)).limited) return NextResponse.json({ ok: false, message: "Please wait before requesting another link." }, { status: 429, headers });
  try {
    const raw = await request.text();
    if (raw.length > 1_000) return accepted();
    const email = String(JSON.parse(raw)?.email ?? "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return accepted();

    await ensurePortalLifecycle();
    const sql = portalDb();
    const clients = await sql`SELECT id, first_name, role FROM portal_clients WHERE email = ${email} LIMIT 1`;
    if (!clients.length) return accepted();
    const client = clients[0];
    if (client.role !== "studio") {
      const invited = await sql`SELECT 1 FROM portal_projects WHERE client_id = ${client.id} AND invited_at IS NOT NULL AND archived_at IS NULL LIMIT 1`;
      if (!invited.length) return accepted();
    }
    const recent = await sql`SELECT count(*)::int AS count FROM portal_login_links
      WHERE client_id = ${client.id} AND created_at > now() - interval '1 hour'`;
    if (Number(recent[0]?.count) >= 3) return accepted();

    const token = newToken();
    const hash = tokenHash(token);
    await sql`INSERT INTO portal_login_links(token_hash, client_id, expires_at)
      VALUES (${hash}, ${client.id}, now() + interval '15 minutes')`;
    const url = `https://www.ahalliwellstudio.com/portal/claim#token=${token}`;
    const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: process.env.INQUIRY_FROM_EMAIL || "A. Halliwell Studio <onboarding@resend.dev>",
      to: [email],
      subject: "Your private studio workspace link",
      text: `Hi ${client.first_name},\n\nHere is your private link to your A. Halliwell Studio project workspace. It expires in 15 minutes and can only be used once:\n\n${url}\n\nIf you did not request this, you can ignore this message.\n\nArabella`,
    });
    if (error) await sql`DELETE FROM portal_login_links WHERE token_hash = ${hash}`;
    return accepted();
  } catch {
    return accepted();
  }
}
