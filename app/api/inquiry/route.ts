import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

type InquiryBody = {
  name?: unknown;
  email?: unknown;
  business?: unknown;
  projectType?: unknown;
  needs?: unknown;
  timing?: unknown;
  investment?: unknown;
  message?: unknown;
  website?: unknown;
};

const MAX_BODY_BYTES = 12_000;

const clean = (value: unknown, maxLength: number) => {
  if (typeof value !== "string") return "";

  return value
    .trim()
    .replace(/\0/g, "")
    .slice(0, maxLength);
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const validEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const json = (
  body: Record<string, unknown>,
  status = 200,
  extraHeaders?: HeadersInit
) =>
  NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...extraHeaders,
    },
  });

export async function POST(request: Request) {
  try {
    /*
      Only accept JSON submissions from the application.
    */
    const contentType = request.headers.get("content-type") || "";

    if (!contentType.toLowerCase().includes("application/json")) {
      return json(
        {
          success: false,
          message: "Unsupported request format.",
        },
        415
      );
    }

    /*
      Reject obviously oversized submissions before parsing them.

      Content-Length is not a complete security boundary, so the actual
      body length is checked again below.
    */
    const contentLength = request.headers.get("content-length");

    if (contentLength) {
      const bytes = Number(contentLength);

      if (
        !Number.isFinite(bytes) ||
        bytes < 0 ||
        bytes > MAX_BODY_BYTES
      ) {
        return json(
          {
            success: false,
            message: "Inquiry is too large.",
          },
          413
        );
      }
    }

    /*
      Basic same-origin protection.

      This is not a substitute for rate limiting, but it prevents ordinary
      cross-site browser submissions when Origin is present.
    */
    const origin = request.headers.get("origin");

    if (origin) {
      let originHost = "";

      try {
        originHost = new URL(origin).host;
      } catch {
        return json(
          {
            success: false,
            message: "Invalid request origin.",
          },
          403
        );
      }

      const requestHost =
        request.headers.get("x-forwarded-host") ||
        request.headers.get("host");

      if (!requestHost || originHost !== requestHost) {
        return json(
          {
            success: false,
            message: "Invalid request origin.",
          },
          403
        );
      }
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.error("RESEND_API_KEY is not configured.");

      return json(
        {
          success: false,
          message: "Inquiry delivery is temporarily unavailable.",
        },
        500
      );
    }

    /*
      Read as text first so the server can enforce a real body-size limit
      even when Content-Length is missing or inaccurate.
    */
    const rawBody = await request.text();

    if (Buffer.byteLength(rawBody, "utf8") > MAX_BODY_BYTES) {
      return json(
        {
          success: false,
          message: "Inquiry is too large.",
        },
        413
      );
    }

    let body: InquiryBody;

    try {
      body = JSON.parse(rawBody) as InquiryBody;
    } catch {
      return json(
        {
          success: false,
          message: "Invalid inquiry data.",
        },
        400
      );
    }

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body)
    ) {
      return json(
        {
          success: false,
          message: "Invalid inquiry data.",
        },
        400
      );
    }

    /*
      Honeypot field.

      Real visitors should never fill this out.
      Bots frequently will.

      We intentionally return success so bots do not learn that they
      triggered the spam trap.
    */
    const website = clean(body.website, 200);

    if (website) {
      return json({
        success: true,
        message: "Your inquiry was received.",
      });
    }

    const name = clean(body.name, 100);
    const email = clean(body.email, 254);
    const business = clean(body.business, 150);
    const projectType = clean(body.projectType, 150);
    const timing = clean(body.timing, 100);
    const investment = clean(body.investment, 100);
    const message = clean(body.message, 3000);

    const needs = Array.isArray(body.needs)
      ? body.needs
          .filter((item): item is string => typeof item === "string")
          .map((item) => clean(item, 100))
          .filter(Boolean)
          .slice(0, 20)
      : [];

    if (!name || !email || !projectType || !timing || !investment) {
      return json(
        {
          success: false,
          message: "Please complete all required fields.",
        },
        400
      );
    }

    if (!validEmail(email)) {
      return json(
        {
          success: false,
          message: "Please enter a valid email address.",
        },
        400
      );
    }

    const resend = new Resend(apiKey);

    const fromAddress =
      process.env.INQUIRY_FROM_EMAIL ||
      "A. Halliwell Studio <onboarding@resend.dev>";

    const recipient =
      process.env.INQUIRY_TO_EMAIL ||
      "arabellakhalliwell@gmail.com";

    const safe = {
      name: escapeHtml(name),
      email: escapeHtml(email),
      business: escapeHtml(business || "Not provided"),
      projectType: escapeHtml(projectType),
      timing: escapeHtml(timing),
      investment: escapeHtml(investment),
      message: escapeHtml(message || "No additional message"),
      needs: needs.map(escapeHtml),
    };

    const needsHtml = safe.needs.length
      ? safe.needs.map((need) => `<li>${need}</li>`).join("")
      : "<li>None selected</li>";

    const { error } = await resend.emails.send({
      from: fromAddress,
      to: [recipient],
      replyTo: email,
      subject: `New project inquiry from ${name}`,
      html: `
        <div
          style="
            font-family: Arial, Helvetica, sans-serif;
            max-width: 680px;
            margin: 0 auto;
            color: #171717;
            line-height: 1.6;
          "
        >
          <p
            style="
              font-size: 12px;
              letter-spacing: 0.12em;
              text-transform: uppercase;
            "
          >
            A. Halliwell Studio
          </p>

          <h1 style="font-size: 32px; line-height: 1.1;">
            New project inquiry
          </h1>

          <p>
            Someone completed the project inquiry on your website.
          </p>

          <hr
            style="
              border: 0;
              border-top: 1px solid #dddddd;
              margin: 28px 0;
            "
          />

          <p><strong>Name:</strong> ${safe.name}</p>

          <p>
            <strong>Email:</strong>
            <a href="mailto:${safe.email}">
              ${safe.email}
            </a>
          </p>

          <p>
            <strong>Business:</strong>
            ${safe.business}
          </p>

          <p>
            <strong>Project:</strong>
            ${safe.projectType}
          </p>

          <p><strong>Needs:</strong></p>

          <ul>
            ${needsHtml}
          </ul>

          <p>
            <strong>Timing:</strong>
            ${safe.timing}
          </p>

          <p>
            <strong>Investment:</strong>
            ${safe.investment}
          </p>

          <p><strong>Additional details:</strong></p>

          <p style="white-space: pre-wrap;">
            ${safe.message}
          </p>

          <hr
            style="
              border: 0;
              border-top: 1px solid #dddddd;
              margin: 28px 0;
            "
          />

          <p style="font-size: 13px; color: #666666;">
            Reply directly to this email to respond to ${safe.name}.
          </p>
        </div>
      `,
      text: `
A. HALLIWELL STUDIO
NEW PROJECT INQUIRY

Name: ${name}
Email: ${email}
Business: ${business || "Not provided"}
Project: ${projectType}
Needs: ${needs.length ? needs.join(", ") : "None selected"}
Timing: ${timing}
Investment: ${investment}

Additional details:
${message || "No additional message"}
      `.trim(),
    });

    if (error) {
      console.error("Resend inquiry error:", error);

      return json(
        {
          success: false,
          message:
            "We couldn't send your inquiry right now. Please try again.",
        },
        502
      );
    }

    return json(
      {
        success: true,
        message: "Your project inquiry has been sent.",
      },
      200
    );
  } catch (error) {
    console.error("Inquiry route error:", error);

    return json(
      {
        success: false,
        message:
          "Something went wrong while sending your inquiry. Please try again.",
      },
      500
    );
  }
}
