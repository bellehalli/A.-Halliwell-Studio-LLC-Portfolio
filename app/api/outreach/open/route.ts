import { recordOutreachOpen, validOutreachRef, outreachSteps } from "@/lib/outreach";
import { checkRequestLimit } from "@/lib/request-rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const pixel = new Uint8Array(Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64"));
export async function GET(request: Request) {
  const url = new URL(request.url), ref = url.searchParams.get("ref") || "", step = url.searchParams.get("step") || "";
  try {
    const automatic = /bot|crawler|spider|preview|scanner/i.test(request.headers.get("user-agent") || "") || request.headers.has("purpose") || request.headers.has("sec-purpose");
    if (validOutreachRef(ref) && outreachSteps.includes(step) && !automatic) {
      const limit = await checkRequestLimit(request, "outreach-open", 30, 60_000);
      if (!limit.limited) await recordOutreachOpen(ref, step);
    }
  } catch { console.warn("Outreach open estimate could not be recorded."); }
  return new Response(pixel, { headers: { "Content-Type": "image/gif", "Cache-Control": "private, no-store, max-age=0", "X-Content-Type-Options": "nosniff" } });
}
