import "server-only";
import { createHash, createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { portalDb } from "@/lib/portal";
import { ensureLeads, type InquiryLead } from "@/lib/leads";
export type Consultation = { bookingId: string; startsAt: string; endsAt: string; status: "confirmed" | "cancelled"; details: string };
export type Booking = Consultation & { name: string; email: string; updatedAt: string };
export function validBooking(value: unknown): value is Booking {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const b = value as Booking;
  const text = (v: unknown, max: number) => typeof v === "string" && v.length <= max && !v.includes("\0");
  const iso = (v: unknown) => text(v, 40) && /^\d{4}-\d{2}-\d{2}T/.test(String(v)) && Number.isFinite(Date.parse(String(v)));
  return text(b.bookingId, 300) && !!b.bookingId.trim() && text(b.name, 100) && !!b.name.trim()
    && text(b.email, 254) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email)
    && text(b.details, 5000) && ["confirmed", "cancelled"].includes(b.status)
    && iso(b.startsAt) && iso(b.endsAt) && iso(b.updatedAt) && Date.parse(b.endsAt) > Date.parse(b.startsAt);
}
export function verifyBookingSignature(raw: string, timestamp: string, signature: string, secret: string, now = Date.now()) {
  if (!/^\d{10}$/.test(timestamp) || Math.abs(now / 1000 - Number(timestamp)) > 300 || !/^[a-f0-9]{64}$/.test(signature)) return false;
  return timingSafeEqual(createHmac("sha256", secret).update(`${timestamp}.${raw}`).digest(), Buffer.from(signature, "hex"));
}
let ready: Promise<unknown> | undefined;
export async function ensureConsultations() {
  ready ??= (async () => {
    await ensureLeads();
    const sql = portalDb();
    await sql`CREATE TABLE IF NOT EXISTS studio_consultations (
      booking_id text PRIMARY KEY, lead_id text NOT NULL REFERENCES studio_leads(id),
      starts_at timestamptz NOT NULL, ends_at timestamptz NOT NULL, status text NOT NULL CHECK (status IN ('confirmed','cancelled')),
      details text NOT NULL DEFAULT '', provider_updated_at timestamptz NOT NULL
    )`;
    await sql`CREATE INDEX IF NOT EXISTS studio_consultations_lead ON studio_consultations(lead_id, starts_at)`;
  })();
  try { await ready; } catch (error) { ready = undefined; throw error; }
}
export async function saveConsultation(b: Booking) {
  await ensureConsultations();
  const sql = portalDb(), email = b.email.trim().toLowerCase();
  const brief: InquiryLead = { name: b.name.trim(), email, business: "", projectType: "Consultation", classification: "CONSULTATION", needs: ["Project consultation"],
    timing: b.startsAt, investment: "Not discussed", currentUrl: "", currentProblem: "", successGoal: "Discuss project goals", assets: [], source: "Google Calendar booking", productCount: "", bookingType: "Phone consultation", guestPain: "" };
  const history = JSON.stringify([{ at: new Date().toISOString(), action: b.status === "cancelled" ? "Consultation cancelled" : "Consultation booked or rescheduled", notes: `${b.startsAt} · ${b.bookingId}` }]);
  const results = await sql.transaction([
    sql`SELECT pg_advisory_xact_lock(hashtext(${email}))`,
    sql`WITH candidate AS (
      SELECT lead_id AS id, 0 AS priority FROM studio_consultations WHERE booking_id = ${b.bookingId}
      UNION ALL
      (SELECT id, 1 AS priority FROM studio_leads WHERE lower(email) = ${email} AND stage NOT IN ('won','lost')
        AND brief->>'classification' != 'SUPPORT' ORDER BY created_at DESC LIMIT 1)
    ), inserted AS (
      INSERT INTO studio_leads(id, submission_id, payload_hash, name, email, business, brief, stage, next_action, studio_email_status, confirmation_status, history)
      SELECT ${randomUUID()}, ${`calendar:${b.bookingId}`}, ${createHash("sha256").update(JSON.stringify(brief)).digest("hex")}, ${brief.name}, ${email}, '', ${JSON.stringify(brief)}::jsonb,
        'consultation', 'Prepare for consultation', 'not requested', 'Google Calendar', ${history}::jsonb
      WHERE NOT EXISTS (SELECT 1 FROM candidate) AND ${b.status} = 'confirmed'
      ON CONFLICT (submission_id) DO NOTHING RETURNING id
    ), chosen AS (SELECT id FROM candidate ORDER BY priority LIMIT 1), saved AS (
      INSERT INTO studio_consultations(booking_id, lead_id, starts_at, ends_at, status, details, provider_updated_at)
      SELECT ${b.bookingId}, id, ${b.startsAt}::timestamptz, ${b.endsAt}::timestamptz, ${b.status}, ${b.details}, ${b.updatedAt}::timestamptz
      FROM (SELECT id FROM chosen UNION ALL SELECT id FROM inserted) contact
      ON CONFLICT (booking_id) DO UPDATE SET starts_at = EXCLUDED.starts_at, ends_at = EXCLUDED.ends_at, status = EXCLUDED.status,
        details = CASE WHEN EXCLUDED.status = 'cancelled' AND EXCLUDED.details = '' THEN studio_consultations.details ELSE EXCLUDED.details END,
        provider_updated_at = EXCLUDED.provider_updated_at
      WHERE EXCLUDED.provider_updated_at > studio_consultations.provider_updated_at RETURNING lead_id
    ), updated AS (
      UPDATE studio_leads SET stage = CASE WHEN ${b.status} = 'confirmed' AND stage IN ('new','qualified') THEN 'consultation' ELSE stage END,
        history = history || ${history}::jsonb, updated_at = now(), revision = revision + 1
      WHERE id IN (SELECT lead_id FROM saved) RETURNING id
    ) SELECT lead_id AS id FROM saved`,
  ]);
  return { changed: results[1].length > 0 };
}
