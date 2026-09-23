import { createHmac, randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

export const SESSION_COOKIE = "__Host-ahs_fax_session";
export const CHALLENGE_COOKIE = "__Host-ahs_fax_challenge";
export const SESSION_SECONDS = 60 * 60;
export const CHALLENGE_SECONDS = 5 * 60;
export const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" as const, path: "/" };

type Challenge = { nonce: string; digest: string; expires: number; issued: number; attempts: number };
type Session = { expires: number; purpose: "fax" };

function secret() {
  // Derive a separate signing key from the existing server-only Telnyx key.
  const source = process.env.FAX_AUTH_SECRET || process.env.TELNYX_API_KEY;
  if (!source || source.length < 24) return null;
  return createHmac("sha256", source).update("ahs-private-fax-auth-v1").digest();
}
function mac(value: string) {
  const key = secret();
  return key ? createHmac("sha256", key).update(value).digest() : null;
}
function same(a: Buffer | null, b: Buffer | null) {
  return !!a && !!b && a.length === b.length && timingSafeEqual(a, b);
}
function sign(value: object) {
  const payload = Buffer.from(JSON.stringify(value)).toString("base64url");
  const signature = mac(payload);
  if (!signature) throw new Error("Fax authentication is not configured");
  return `${payload}.${signature.toString("base64url")}`;
}
function read<T>(token: string | undefined): T | null {
  if (!token || token.length > 2000) return null;
  const parts = token.split(".");
  if (parts.length !== 2 || !/^[A-Za-z0-9_-]+$/.test(parts[0]) || !/^[A-Za-z0-9_-]+$/.test(parts[1])) return null;
  if (!same(mac(parts[0]), Buffer.from(parts[1], "base64url"))) return null;
  try { return JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8")) as T; } catch { return null; }
}
export function available() { return !!secret() && !!process.env.RESEND_API_KEY; }
export function normalizedCode(value: unknown) { return typeof value === "string" ? value.toUpperCase().replace(/[^A-Z0-9]/g, "") : ""; }
export function newChallenge() {
  const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  const code = Array.from({ length: 12 }, () => alphabet[randomInt(alphabet.length)]).join("");
  const nonce = randomBytes(16).toString("hex");
  const issued = Date.now();
  const digest = mac(`code:${nonce}:${code}`)?.toString("base64url");
  if (!digest) throw new Error("Fax authentication is not configured");
  const payload: Challenge = { nonce, digest, issued, expires: issued + CHALLENGE_SECONDS * 1000, attempts: 0 };
  return { code: `${code.slice(0, 6)}-${code.slice(6)}`, token: sign(payload) };
}
export function challengeFrom(token: string | undefined) {
  const payload = read<Challenge>(token);
  if (!payload || typeof payload.expires !== "number" || typeof payload.issued !== "number" || typeof payload.nonce !== "string" || typeof payload.digest !== "string" || typeof payload.attempts !== "number") return null;
  if (payload.expires < Date.now() || payload.attempts >= 5) return null;
  return payload;
}
export function verifyCode(challenge: Challenge, code: string) {
  return code.length === 12 && same(mac(`code:${challenge.nonce}:${code}`), Buffer.from(challenge.digest, "base64url"));
}
export function failedChallenge(challenge: Challenge) { return sign({ ...challenge, attempts: challenge.attempts + 1 }); }
export function newSession() { return sign({ purpose: "fax", expires: Date.now() + SESSION_SECONDS * 1000 } satisfies Session); }
export function hasFaxSession(token: string | undefined) {
  const session = read<Session>(token);
  return session?.purpose === "fax" && typeof session.expires === "number" && session.expires > Date.now();
}
export function authorized(request: NextRequest) { return hasFaxSession(request.cookies.get(SESSION_COOKIE)?.value); }
export function sameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  return !!origin && origin === new URL(request.url).origin;
}
