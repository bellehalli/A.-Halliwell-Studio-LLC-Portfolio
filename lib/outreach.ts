import "server-only";
import { portalDb } from "@/lib/portal";

let ready: Promise<unknown> | undefined;
export function validOutreachRef(value: string) { return /^[a-f0-9]{24}$/.test(value); }
export const outreachSteps = ["Day 0", "Day 3", "Day 7", "Day 14"];
export const outreachDestinations = {
  portfolio: "https://www.ahalliwellstudio.com/",
  start: "https://www.ahalliwellstudio.com/start",
  elan: "https://elan.ahalliwellstudio.com/book.html",
  routing: "https://www.ahalliwellstudio.com/lab?capability=routing-engine#capabilities",
} as const;
export type OutreachDestination = keyof typeof outreachDestinations;
export function validOutreachDestination(value: string): value is OutreachDestination {
  return Object.prototype.hasOwnProperty.call(outreachDestinations, value);
}
export async function ensureOutreach() {
  ready ??= portalDb()`CREATE TABLE IF NOT EXISTS studio_outreach_opens (
    ref text NOT NULL, step text NOT NULL, first_at timestamptz NOT NULL DEFAULT now(),
    last_at timestamptz NOT NULL DEFAULT now(), request_count integer NOT NULL DEFAULT 1,
    PRIMARY KEY (ref, step)
  )`.then(async () => {
    await portalDb()`CREATE TABLE IF NOT EXISTS studio_outreach_clicks (
      ref text NOT NULL, step text NOT NULL, destination text NOT NULL,
      first_at timestamptz NOT NULL DEFAULT now(), last_at timestamptz NOT NULL DEFAULT now(),
      request_count integer NOT NULL DEFAULT 1,
      PRIMARY KEY (ref, step, destination)
    )`;
  });
  try { await ready; } catch (error) { ready = undefined; throw error; }
}
export async function recordOutreachOpen(ref: string, step: string) {
  if (!validOutreachRef(ref) || !outreachSteps.includes(step)) return;
  await ensureOutreach();
  await portalDb()`INSERT INTO studio_outreach_opens(ref, step) VALUES (${ref}, ${step})
    ON CONFLICT (ref, step) DO UPDATE SET last_at = now(), request_count = studio_outreach_opens.request_count + 1
    WHERE studio_outreach_opens.last_at < now() - interval '5 minutes'`;
}
export async function recordOutreachClick(ref: string, step: string, destination: OutreachDestination) {
  if (!validOutreachRef(ref) || !outreachSteps.includes(step) || !validOutreachDestination(destination)) return;
  await ensureOutreach();
  await portalDb()`INSERT INTO studio_outreach_clicks(ref, step, destination) VALUES (${ref}, ${step}, ${destination})
    ON CONFLICT (ref, step, destination) DO UPDATE SET last_at = now(), request_count = studio_outreach_clicks.request_count + 1
    WHERE studio_outreach_clicks.last_at < now() - interval '5 minutes'`;
}
export async function outreachOpenRows() {
  await ensureOutreach();
  return portalDb()`SELECT ref, step, first_at, last_at, request_count FROM studio_outreach_opens ORDER BY last_at DESC LIMIT 1000`;
}
export async function outreachClickRows() {
  await ensureOutreach();
  return portalDb()`SELECT ref, step, destination, first_at, last_at, request_count FROM studio_outreach_clicks ORDER BY last_at DESC LIMIT 1000`;
}
