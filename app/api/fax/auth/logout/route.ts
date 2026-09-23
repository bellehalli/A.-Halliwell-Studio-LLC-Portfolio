import { NextRequest, NextResponse } from "next/server";
import { CHALLENGE_COOKIE, SESSION_COOKIE, sameOrigin } from "@/lib/fax-auth";
export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ ok: false }, { status: 403, headers: { "Cache-Control": "no-store" } });
  const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  response.cookies.delete(SESSION_COOKIE);
  response.cookies.delete(CHALLENGE_COOKIE);
  return response;
}
