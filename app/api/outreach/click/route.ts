import {
  outreachDestinations,
  outreachSteps,
  recordOutreachClick,
  validOutreachDestination,
  validOutreachRef,
} from "@/lib/outreach";
import { checkRequestLimit } from "@/lib/request-rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function looksAutomated(request: Request) {
  return /bot|crawler|spider|preview|scanner|fetch/i.test(request.headers.get("user-agent") || "")
    || request.headers.has("purpose")
    || request.headers.has("sec-purpose");
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const ref = url.searchParams.get("ref") || "";
  const step = url.searchParams.get("step") || "";
  const destination = url.searchParams.get("to") || "";
  const target = validOutreachDestination(destination) ? outreachDestinations[destination] : outreachDestinations.portfolio;

  try {
    if (validOutreachRef(ref) && outreachSteps.includes(step) && validOutreachDestination(destination) && !looksAutomated(request)) {
      const limit = await checkRequestLimit(request, "outreach-click", 30, 60_000);
      if (!limit.limited) await recordOutreachClick(ref, step, destination);
    }
  } catch {
    console.warn("Outreach click could not be recorded.");
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: target,
      "Cache-Control": "private, no-store, max-age=0",
      "Referrer-Policy": "no-referrer",
    },
  });
}
