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

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.error("RESEND_API_KEY is not configured.");

      return NextResponse.json(
        {
          success: false,
          message: "Inquiry delivery is temporarily unavailable.",
        },
        { status: 500 }
      );
    }

    const body = (await request.json()) as InquiryBody;

    /*
      Honeypot field.

      Real visitors should never fill this out.
      Bots frequently will.
    */
    const website = clean(body.website, 200);

    if (website) {
      return NextResponse.json({
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
      return NextResponse.json(
        {
          success: false,
          message: "Please complete all required fields.",
        },
        { status: 400 }
      );
    }

    if (!validEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    const resend = new Resend(apiKey);

    /*
      Replace this sender after your A. Halliwell Studio
      sending domain has been verified in Resend.

      Resend's onboarding sender can be used while testing.
    */
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

    const { data, error } = await resend.emails.send({
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

      return NextResponse.json(
        {
          success: false,
          message:
            "We couldn't send your inquiry right now. Please try again.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your project inquiry has been sent.",
        id: data?.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Inquiry route error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong while sending your inquiry. Please try again.",
      },
      { status: 500 }
    );
  }
}
