import { NextRequest, NextResponse } from "next/server";
import { CHALLENGE_COOKIE, SESSION_COOKIE, SESSION_SECONDS, challengeFrom, cookieOptions, failedChallenge, newSession, normalizedCode, sameOrigin, verifyCode } from "@/lib/fax-auth";
export const runtime = "nodejs";
const noStore = { "Cache-Control": "no-store" };
export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ ok: false }, { status: 403, headers: noStore });
  const challenge = challengeFrom(request.cookies.get(CHALLENGE_COOKIE)?.value);
  if (!challenge) return NextResponse.json({ ok: false, error: "Request a fresh code." }, { status: 401, headers: noStore });
  const body = await request.json().catch(() => null);
  const code = normalizedCode(body?.code);
  if (!verifyCode(challenge, code)) {
    const response = NextResponse.json({ ok: false, error: "That code did not match. Try again or request a fresh code." }, { status: 401, headers: noStore });
    response.cookies.set(CHALLENGE_COOKIE, failedChallenge(challenge), { ...cookieOptions, maxAge: Math.max(0, Math.floor((challenge.expires - Date.now()) / 1000)) });
    return response;
  }
  const response = NextResponse.json({ ok: true }, { headers: noStore });
  response.cookies.set(SESSION_COOKIE, newSession(), { ...cookieOptions, maxAge: SESSION_SECONDS });
  response.cookies.delete(CHALLENGE_COOKIE);
  return response;
}
