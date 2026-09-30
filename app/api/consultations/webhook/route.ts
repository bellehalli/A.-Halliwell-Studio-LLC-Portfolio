import { NextResponse } from "next/server";
import { saveConsultation, validBooking, verifyBookingSignature } from "@/lib/consultations";
export const runtime = "nodejs";
const json = (body: object, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store" } });
export async function POST(request: Request) {
  const secret = process.env.CONSULTATION_WEBHOOK_SECRET;
  if (!secret || !process.env.DATABASE_URL) return json({ ok: false, message: "Booking sync unavailable." }, 503);
  if (!(request.headers.get("content-type") || "").includes("application/json")) return json({ ok: false }, 415);
  const raw = await request.text();
  if (Buffer.byteLength(raw) > 16_000) return json({ ok: false }, 413);
  if (!verifyBookingSignature(raw, request.headers.get("x-booking-timestamp") || "", request.headers.get("x-booking-signature") || "", secret)) return json({ ok: false }, 401);
  let booking: unknown;
  try { booking = JSON.parse(raw); } catch { return json({ ok: false }, 400); }
  if (!validBooking(booking)) return json({ ok: false }, 400);
  try { return json({ ok: true, ...await saveConsultation(booking) }); }
  catch { console.error("consultation: booking sync failed"); return json({ ok: false }, 500); }
}
