import { createPublicKey, verify } from "node:crypto";

const ED25519_SPKI_PREFIX = Buffer.from("302a300506032b6570032100", "hex");
const MAX_AGE_SECONDS = 5 * 60;

/** Verify the raw Telnyx payload before parsing or acting on it. */
export function validTelnyxWebhook(raw: string, headers: Headers, publicKey: string, now = Date.now()) {
  const timestamp = headers.get("telnyx-timestamp") || "";
  const signature = headers.get("telnyx-signature-ed25519") || "";
  if (!/^\d{10}$/.test(timestamp) || !signature) return false;
  if (Math.abs(now / 1000 - Number(timestamp)) > MAX_AGE_SECONDS) return false;

  try {
    const trimmed = publicKey.trim();
    const rawKey = /^[a-f0-9]{64}$/i.test(trimmed) ? Buffer.from(trimmed, "hex") : Buffer.from(trimmed, "base64");
    const signatureBytes = Buffer.from(signature, "base64");
    if (rawKey.length !== 32 || signatureBytes.length !== 64) return false;
    const key = createPublicKey({ key: Buffer.concat([ED25519_SPKI_PREFIX, rawKey]), format: "der", type: "spki" });
    return verify(null, Buffer.from(`${timestamp}|${raw}`, "utf8"), key, signatureBytes);
  } catch {
    return false;
  }
}
