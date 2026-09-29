import { randomInt } from "node:crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { checkRequestLimit } from "@/lib/request-rate-limit";
import { ensurePortalLifecycle, newToken, portalDb, portalEnabled, tokenHash } from "@/lib/portal";

export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store" };
export async function POST(request: Request) {
  if (!portalEnabled()) return NextResponse.json({ ok: false }, { status: 503, headers });
  if (request.headers.get("origin") !== new URL(request.url).origin) return NextResponse.json({ ok: false }, { status: 403, headers });
  if ((await checkRequestLimit(request, "portal-code", 5, 15 * 60_000)).limited) return NextResponse.json({ ok: false, message: "Please wait before requesting another code." }, { status: 429, headers });
  const challenge = newToken();
  const accepted = () => NextResponse.json({ ok: true, challenge, message: "If this email has access, a sign-in code is on its way." }, { headers });
  try {
    const raw = await request.text();
    if (raw.length > 1_000) return accepted();
    const data = JSON.parse(raw);
    const email = String(data.email || "").trim().toLowerCase();
    const projectId = String(data.projectId || "");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || (projectId && !/^[a-f0-9-]{36}$/.test(projectId))) return accepted();
    await ensurePortalLifecycle();
    const sql = portalDb();
    const clients = await sql`SELECT id, first_name, role FROM portal_clients WHERE email = ${email} LIMIT 1`;
    if (!clients.length) return accepted();
    const client = clients[0];
    if (client.role !== "studio" || projectId) {
      const allowed = await sql`SELECT 1 FROM portal_projects WHERE client_id = ${client.id} AND invited_at IS NOT NULL AND archived_at IS NULL AND (${projectId} = '' OR id = ${projectId}) LIMIT 1`;
      if (!allowed.length) return accepted();
    }
    const recent = await sql`SELECT count(*)::int AS count FROM portal_login_codes WHERE client_id = ${client.id} AND created_at > now() - interval '1 hour'`;
    if (Number(recent[0]?.count) >= 5) return accepted();
    const code = String(randomInt(100000, 1000000));
    const hash = tokenHash(challenge);
    await sql`INSERT INTO portal_login_codes(token_hash, code_hash, client_id, project_id, expires_at)
      VALUES (${hash}, ${tokenHash(`${challenge}:${code}`)}, ${client.id}, ${projectId || null}, now() + interval '15 minutes')`;
    const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: process.env.INQUIRY_FROM_EMAIL || "A. Halliwell Studio <onboarding@resend.dev>", to: [email], subject: "Your A. Halliwell Studio sign-in code",
      text: `Hi ${client.first_name},\n\nYour sign-in code is ${code}. Enter it in the portal to open your private workspace. This code expires in 15 minutes and can be used once.\n\nYour workspace address is https://www.ahalliwellstudio.com${projectId ? `/portal/projects/${projectId}` : "/portal"}. You can request a fresh code whenever you return.\n\nIf you did not request this code, ignore this email.\n\nArabella`,
    });
    if (error) await sql`DELETE FROM portal_login_codes WHERE token_hash = ${hash}`;
    return accepted();
  } catch { return accepted(); }
}
