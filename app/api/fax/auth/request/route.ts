import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { available, CHALLENGE_COOKIE, CHALLENGE_SECONDS, challengeFrom, cookieOptions, newChallenge, sameOrigin } from "@/lib/fax-auth";
export const runtime = "nodejs";
const noStore = { "Cache-Control": "no-store" };

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ ok: false }, { status: 403, headers: noStore });
  if (!available()) return NextResponse.json({ ok: false, error: "Fax sign-in is not configured." }, { status: 503, headers: noStore });
  const previous = challengeFrom(request.cookies.get(CHALLENGE_COOKIE)?.value);
  if (previous && Date.now() - previous.issued < 60_000) return NextResponse.json({ ok: false, error: "Wait a minute before requesting another code." }, { status: 429, headers: noStore });
  const { code, token } = newChallenge();
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: process.env.INQUIRY_FROM_EMAIL || "A. Halliwell Studio <onboarding@resend.dev>",
    to: ["arabellakhalliwell@gmail.com"],
    subject: "Your A. Halliwell fax sign-in code",
    text: `Your private fax sign-in code is ${code}. It expires in 5 minutes. If you did not request it, ignore this email.`,
  });
  if (error) return NextResponse.json({ ok: false, error: "Could not send the code. Try again shortly." }, { status: 502, headers: noStore });
  const response = NextResponse.json({ ok: true, message: "Check your studio inbox for the code." }, { headers: noStore });
  response.cookies.set(CHALLENGE_COOKIE, token, { ...cookieOptions, maxAge: CHALLENGE_SECONDS });
  return response;
}
