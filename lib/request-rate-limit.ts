import { createHash } from "node:crypto";
import { neon } from "@neondatabase/serverless";

let ready: Promise<unknown> | undefined;
export async function checkRequestLimit(request: Request, route: string, max: number, windowMs: number, identity?: string) {
  const address = (request.headers.get("x-vercel-forwarded-for") || request.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim().slice(0, 64);
  const url = process.env.DATABASE_URL;
  if (!url) return { limited: true, retryAfter: Math.ceil(windowMs / 1000) };
  const sql = neon(url);
  ready ??= sql`CREATE TABLE IF NOT EXISTS request_rate_limits (
    key text PRIMARY KEY, count integer NOT NULL, expires_at timestamptz NOT NULL
  )`;
  try { await ready; } catch (error) { ready = undefined; throw error; }
  if (Math.random() < 0.01) await sql`DELETE FROM request_rate_limits WHERE expires_at < now()`;
  const window = Math.floor(Date.now() / windowMs);
  const key = createHash("sha256").update(`${route}:${identity || address}:${window}`).digest("hex");
  const seconds = Math.max(1, Math.ceil(windowMs / 1000));
  const rows = await sql`INSERT INTO request_rate_limits(key, count, expires_at)
    VALUES (${key}, 1, now() + (${seconds} * interval '1 second'))
    ON CONFLICT (key) DO UPDATE SET count = request_rate_limits.count + 1
    RETURNING count`;
  return { limited: Number(rows[0].count) > max, retryAfter: Math.max(1, Math.ceil(((window + 1) * windowMs - Date.now()) / 1000)) };
}
