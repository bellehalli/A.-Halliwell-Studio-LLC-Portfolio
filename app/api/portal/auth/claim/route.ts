import { NextResponse } from "next/server";
import { ensurePortalLifecycle, newToken, portalDb, portalEnabled, PORTAL_COOKIE, SESSION_AGE_SECONDS, tokenHash, validToken } from "@/lib/portal";

export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store" };

export async function POST(request: Request) {
  if (!portalEnabled()) return NextResponse.json({ ok: false }, { status: 503, headers });
  if (request.headers.get("origin") !== new URL(request.url).origin) return NextResponse.json({ ok: false }, { status: 403, headers });
  try {
    const raw = await request.text();
    if (raw.length > 1_000) return NextResponse.json({ ok: false }, { status: 400, headers });
    const token = JSON.parse(raw)?.token;
    if (!validToken(token)) return NextResponse.json({ ok: false }, { status: 400, headers });
    await ensurePortalLifecycle();
    const sql = portalDb();
    const rows = await sql`UPDATE portal_login_links SET consumed_at = now()
      WHERE token_hash = ${tokenHash(token)} AND consumed_at IS NULL AND expires_at > now()
      RETURNING client_id`;
    if (!rows.length) return NextResponse.json({ ok: false, message: "This link has expired or has already been used." }, { status: 401, headers });

    const allowed = await sql`SELECT 1 FROM portal_clients c WHERE c.id = ${rows[0].client_id} AND
      (c.role = 'studio' OR EXISTS(SELECT 1 FROM portal_projects p WHERE p.client_id = c.id AND p.invited_at IS NOT NULL AND p.archived_at IS NULL)) LIMIT 1`;
    if (!allowed.length) return NextResponse.json({ ok: false, message: "This project has not been released." }, { status: 403, headers });
    const session = newToken();
    await sql`INSERT INTO portal_sessions(token_hash, client_id, expires_at)
      VALUES (${tokenHash(session)}, ${rows[0].client_id}, now() + interval '7 days')`;
    const response = NextResponse.json({ ok: true }, { headers });
    response.cookies.set(PORTAL_COOKIE, session, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: SESSION_AGE_SECONDS });
    return response;
  } catch {
    return NextResponse.json({ ok: false }, { status: 500, headers });
  }
}
