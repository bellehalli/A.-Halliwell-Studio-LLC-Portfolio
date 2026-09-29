import { NextResponse } from "next/server";
import { checkRequestLimit } from "@/lib/request-rate-limit";
import { ensurePortalLifecycle, newToken, portalDb, portalEnabled, PORTAL_COOKIE, SESSION_AGE_SECONDS, tokenHash, validToken } from "@/lib/portal";
export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store" };
const fail = () => NextResponse.json({ ok: false, message: "This code is incorrect, expired, or already used. Request a fresh code." }, { status: 401, headers });
export async function POST(request: Request) {
  if (!portalEnabled()) return NextResponse.json({ ok: false }, { status: 503, headers });
  if (request.headers.get("origin") !== new URL(request.url).origin) return NextResponse.json({ ok: false }, { status: 403, headers });
  if ((await checkRequestLimit(request, "portal-verify", 10, 15 * 60_000)).limited) return NextResponse.json({ ok: false, message: "Please wait before trying another code." }, { status: 429, headers });
  try {
    const raw = await request.text();
    if (raw.length > 500) return fail();
    const { challenge, code } = JSON.parse(raw);
    if (!validToken(challenge) || typeof code !== "string" || !/^\d{6}$/.test(code)) return fail();
    await ensurePortalLifecycle();
    const sql = portalDb();
    const hash = tokenHash(`${challenge}:${code}`);
    const rows = await sql`UPDATE portal_login_codes SET attempts = attempts + 1, consumed_at = CASE WHEN code_hash = ${hash} THEN now() ELSE consumed_at END
      WHERE token_hash = ${tokenHash(challenge)} AND consumed_at IS NULL AND expires_at > now() AND attempts < 5
      RETURNING client_id, project_id, code_hash = ${hash} AS matched`;
    if (!rows.length || !rows[0].matched) return fail();
    const item = rows[0];
    const allowed = await sql`SELECT 1 FROM portal_clients c WHERE c.id = ${item.client_id} AND
      (c.role = 'studio' AND ${item.project_id || ""} = '' OR EXISTS(SELECT 1 FROM portal_projects p WHERE p.client_id = c.id AND p.invited_at IS NOT NULL AND p.archived_at IS NULL AND (${item.project_id || ""} = '' OR p.id = ${item.project_id || ""}))) LIMIT 1`;
    if (!allowed.length) return fail();
    const session = newToken();
    await sql`INSERT INTO portal_sessions(token_hash, client_id, expires_at) VALUES (${tokenHash(session)}, ${item.client_id}, now() + interval '7 days')`;
    const response = NextResponse.json({ ok: true, redirectTo: item.project_id ? `/portal/projects/${item.project_id}` : "/portal" }, { headers });
    response.cookies.set(PORTAL_COOKIE, session, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: SESSION_AGE_SECONDS });
    return response;
  } catch { return NextResponse.json({ ok: false, message: "Sign-in could not complete. Please try again." }, { status: 500, headers }); }
}
