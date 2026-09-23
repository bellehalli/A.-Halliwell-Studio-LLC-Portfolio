import { NextRequest, NextResponse } from "next/server";
import { authorized, sameOrigin } from "@/lib/fax-auth";

export const runtime = "nodejs";

const TELNYX_FAX_URL = "https://api.telnyx.com/v2/faxes";
const FROM_NUMBER = "+13138554074";

// Confirmed from the Telnyx Fax API application Details screen.
// If Telnyx rejects this as connection_id, return the error instead of guessing.
const CONNECTION_ID =
  process.env.TELNYX_FAX_CONNECTION_ID || "3053724466908497856";

function normalizeE164(value: string) {
  const cleaned = value.replace(/[^\d+]/g, "");
  if (/^\+1\d{10}$/.test(cleaned)) return cleaned;
  if (/^\d{10}$/.test(cleaned)) return `+1${cleaned}`;
  if (/^1\d{10}$/.test(cleaned)) return `+${cleaned}`;
  return null;
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ ok: false, error: "Sign in to send faxes." }, { status: 401, headers: { "Cache-Control": "no-store" } });
  if (!sameOrigin(req)) return NextResponse.json({ ok: false }, { status: 403, headers: { "Cache-Control": "no-store" } });
  const apiKey = process.env.TELNYX_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: "TELNYX_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  try {
    const incoming = await req.formData();
    const toRaw = String(incoming.get("to") || "");
    const file = incoming.get("file");

    const to = normalizeE164(toRaw);
    if (!to) {
      return NextResponse.json(
        { ok: false, error: "Enter a valid US fax number." },
        { status: 400 }
      );
    }

    if (!(file instanceof File) || file.size === 0 || file.type !== "application/pdf") {
      return NextResponse.json(
        { ok: false, error: "Choose a PDF document to fax." },
        { status: 400 }
      );
    }

    // Keep uploads within typical serverless request limits.
    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json(
        { ok: false, error: "The PDF must be 4 MB or smaller." },
        { status: 400 }
      );
    }
    const header = new Uint8Array(await file.slice(0, 5).arrayBuffer());
    if (String.fromCharCode(...header) !== "%PDF-") {
      return NextResponse.json({ ok: false, error: "The selected file is not a PDF." }, { status: 400 });
    }

    const outbound = new FormData();
    outbound.append("connection_id", CONNECTION_ID);
    outbound.append("from", FROM_NUMBER);
    outbound.append("to", to);
    outbound.append("quality", "high");
    outbound.append("t38_enabled", "true");
    outbound.append("store_media", "false");
    outbound.append("store_preview", "false");
    outbound.append("contents", file, file.name || "fax-document.pdf");

    const response = await fetch(TELNYX_FAX_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: outbound,
      cache: "no-store",
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: "Telnyx rejected the fax request.",
          telnyxStatus: response.status,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        faxId: payload?.data?.id ?? null,
        status: payload?.data?.status ?? "queued",
        from: FROM_NUMBER,
        to,
      },
      { status: 202 }
    );
  } catch (error) {
    console.error("Outbound fax error:", error);
    return NextResponse.json(
      { ok: false, error: "The server could not submit the fax." },
      { status: 500 }
    );
  }
}
