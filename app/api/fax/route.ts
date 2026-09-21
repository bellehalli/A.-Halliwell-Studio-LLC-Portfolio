import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FAX_TO_EMAIL = "arabellakhalliwell@gmail.com";
const FAX_NUMBER = "+13138554074";

const json = (body: Record<string, unknown>, status = 200) =>
  NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });

export async function GET() {
  return json({ ok: true, service: "fax-receiver" });
}

export async function POST(request: Request) {
  try {
    const expectedSecret = process.env.TELNYX_FAX_WEBHOOK_SECRET;
    const url = new URL(request.url);
    const suppliedSecret = url.searchParams.get("secret");

    if (!expectedSecret || suppliedSecret !== expectedSecret) {
      return json({ ok: false }, 401);
    }

    const raw = await request.text();
    if (Buffer.byteLength(raw, "utf8") > 100_000) {
      return json({ ok: false }, 413);
    }

    let event: any;
    try {
      event = JSON.parse(raw);
    } catch {
      return json({ ok: false }, 400);
    }

    const data = event?.data;
    const payload = data?.payload;

    if (data?.event_type !== "fax.received") {
      return json({ ok: true, ignored: true });
    }

    const destination = String(payload?.to || "").replace(/\D/g, "");
    if (destination !== FAX_NUMBER.replace(/\D/g, "")) {
      return json({ ok: true, ignored: true });
    }

    const mediaUrl =
      typeof payload?.media_url === "string" ? payload.media_url : "";

    if (!mediaUrl) {
      return json({ ok: false, message: "Fax received without media." }, 422);
    }

    const mediaHost = new URL(mediaUrl).hostname.toLowerCase();
    if (!(mediaHost === "telnyx.com" || mediaHost.endsWith(".telnyx.com"))) {
      return json({ ok: false, message: "Unexpected fax media host." }, 422);
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      return json({ ok: false, message: "Email delivery unavailable." }, 500);
    }

    const resend = new Resend(resendKey);
    const faxId = String(payload?.fax_id || data?.id || "received-fax");
    const from = String(payload?.from || "Unknown sender");
    const pages = payload?.page_count ? String(payload.page_count) : "Unknown";

    const { error } = await resend.emails.send(
      {
        from:
          process.env.INQUIRY_FROM_EMAIL ||
          "A. Halliwell Studio <onboarding@resend.dev>",
        to: [FAX_TO_EMAIL],
        subject: `New fax received from ${from}`,
        text:
          `A fax was received on 313-855-4074.\n\n` +
          `From: ${from}\nPages: ${pages}\nFax ID: ${faxId}\n\n` +
          "The fax is attached as a PDF.",
        attachments: [
          {
            path: mediaUrl,
            filename: `fax-${faxId}.pdf`,
          },
        ],
      },
      { idempotencyKey: `telnyx-fax/${faxId}` }
    );

    if (error) {
      return json({ ok: false, message: "Email delivery failed." }, 502);
    }

    return json({ ok: true });
  } catch {
    return json({ ok: false }, 500);
  }
}
