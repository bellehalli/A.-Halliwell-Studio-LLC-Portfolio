import { NextRequest, NextResponse } from "next/server";
import { portalDb, portalEnabled, PORTAL_COOKIE, tokenHash, validToken } from "@/lib/portal";

export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  const headers = { "Cache-Control": "private, no-store" };
  if (request.headers.get("origin") !== new URL(request.url).origin) return NextResponse.json({ ok: false }, { status: 403, headers });
  const token = request.cookies.get(PORTAL_COOKIE)?.value;
  if (portalEnabled() && validToken(token)) await portalDb()`DELETE FROM portal_sessions WHERE token_hash = ${tokenHash(token)}`;
  const response = NextResponse.json({ ok: true }, { headers });
  response.cookies.delete(PORTAL_COOKIE);
  return response;
}
