import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  try {
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
    const destination = process.env.INQUIRY_TO_EMAIL;

    if (!webhookSecret || !destination) {
      return NextResponse.json(
        { error: "Inbound email is not fully configured." },
        { status: 500 }
      );
    }

    const payload = await request.text();

    const event = resend.webhooks.verify({
      payload,
      headers: {
        id: request.headers.get("svix-id") || "",
        timestamp: request.headers.get("svix-timestamp") || "",
        signature: request.headers.get("svix-signature") || "",
      },
      webhookSecret,
    });

    if (event.type !== "email.received") {
      return NextResponse.json({ received: true });
    }

    const incoming = event.data;

    const isForHello = incoming.to?.some((address: string) =>
      address.toLowerCase().includes("hello@ahalliwellstudio.com")
    );

    if (!isForHello) {
      return NextResponse.json({ received: true });
    }

    const { data: receivedEmail, error: retrieveError } =
      await resend.emails.receiving.get(incoming.email_id);

    if (retrieveError || !receivedEmail) {
      console.error("Could not retrieve inbound email:", retrieveError);
      return NextResponse.json(
        { error: "Could not retrieve inbound email." },
        { status: 502 }
      );
    }

    const originalSender = incoming.from;
    const subject = incoming.subject || "(No subject)";

    const { error: sendError } = await resend.emails.send({
      from: "A. Halliwell Studio <hello@ahalliwellstudio.com>",
      to: [destination],
      replyTo: originalSender,
      subject,
      html:
        receivedEmail.html ||
        `<pre style="white-space:pre-wrap;font-family:Arial,sans-serif;">${escapeHtml(receivedEmail.text || "")}</pre>`,
      text: receivedEmail.text || undefined,
    });

    if (sendError) {
      console.error("Could not forward inbound email:", sendError);
      return NextResponse.json(
        { error: "Could not forward inbound email." },
        { status: 502 }
      );
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Invalid Resend webhook:", error);
    return NextResponse.json(
      { error: "Invalid webhook." },
      { status: 400 }
    );
  }
}
