import { studio } from "@/lib/studio-config";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { checkRequestLimit } from "@/lib/request-rate-limit";
import { randomUUID } from "node:crypto";
import { saveInquiryLead, leadEmailStatus } from "@/lib/leads";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 24_000;

const clean = (value: unknown, max: number) =>
  typeof value === "string"
    ? value.trim().replace(/\0/g, "").slice(0, max)
    : "";

const esc = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const nl2br = (value: string) => esc(value).replace(/\n/g, "<br/>");
const emailOK = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const urlOK = (value: string) => {
  if (!value) return true;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const json = (body: Record<string, unknown>, status = 200) =>
  NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });

function cleanList(value: unknown, itemMax = 120, limit = 20) {
  return Array.isArray(value)
    ? value
        .filter((item: unknown): item is string => typeof item === "string")
        .map((item: string) => clean(item, itemMax))
        .filter(Boolean)
        .slice(0, limit)
    : [];
}

function classifyLead(needs: string[], projectType: string) {
  if (needs.includes("E-commerce")) return "ECOMMERCE";

  if (
    needs.some((x) =>
      ["Client portal", "Events or ticketing", "Custom interactive feature"].includes(x)
    )
  ) {
    return "CUSTOM SYSTEM";
  }

  if (
    needs.some((x) =>
      ["Website redesign", "Add to an existing website"].includes(x)
    )
  ) {
    return "EXISTING SITE";
  }

  if (needs.includes("Multi-page website")) return "CUSTOM WEBSITE";
  if (needs.includes("One-page website")) return "ONE-PAGE";
  if (needs.includes("Ongoing support")) return "SUPPORT";
  if (needs.includes("Illustration / property map")) return "ILLUSTRATION";
  if (projectType === "Hospitality / venue") return "HOSPITALITY";

  return "GENERAL WEB";
}

export async function POST(request: Request) {
  let savedLeadId = "";
  try {
    if (
      !(request.headers.get("content-type") || "")
        .toLowerCase()
        .includes("application/json")
    ) {
      return json(
        { success: false, message: "Unsupported request format." },
        415
      );
    }

    const raw = await request.text();

    if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) {
      return json(
        { success: false, message: "Inquiry is too large." },
        413
      );
    }

    let body: any;

    try {
      body = JSON.parse(raw);
    } catch {
      return json(
        { success: false, message: "Invalid inquiry data." },
        400
      );
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return json(
        { success: false, message: "Invalid inquiry data." },
        400
      );
    }

    if (clean(body.website, 200)) {
      return json({
        success: true,
        message: "Your inquiry was received.",
        confirmationSent: false,
      });
    }

    const name = clean(body.name, 100);
    const email = clean(body.email, 254);
    const business = clean(body.business, 150);
    const projectType = clean(body.projectType, 150);
    const timing = clean(body.timing, 100);
    const investment = clean(body.investment, 180);
    const currentUrl = clean(body.currentUrl, 400);
    const currentProblem = clean(body.currentProblem, 3000);
    const whyNow = clean(body.whyNow, 1400);
    const successGoal = clean(body.successGoal, 3000);
    const referralSource = clean(body.referralSource, 120);
    const referralOther = clean(body.referralOther, 200);
    const productCount = clean(body.productCount, 100);
    const bookingType = clean(body.bookingType, 1200);
    const guestPain = clean(body.guestPain, 1800);
    const needs = cleanList(body.needs);
    const assets = cleanList(body.assets);

    if (
      !name ||
      !email ||
      !projectType ||
      !needs.length ||
      !timing ||
      !investment
    ) {
      return json(
        { success: false, message: "Please complete all required fields." },
        400
      );
    }

    if (!emailOK(email)) {
      return json(
        { success: false, message: "Please enter a valid email address." },
        400
      );
    }

    if (!urlOK(currentUrl)) {
      return json(
        { success: false, message: "Please enter a valid website URL." },
        400
      );
    }

    const limit = await checkRequestLimit(request, "inquiry", 8, 15 * 60 * 1000);
    if (limit.limited) {
      return NextResponse.json(
        { success: false, message: "Too many inquiries from this connection. Please try again later or email the studio." },
        { status: 429, headers: { "Cache-Control": "no-store", "Retry-After": String(limit.retryAfter) } }
      );
    }

    const key = process.env.RESEND_API_KEY;
    const destination = process.env.INQUIRY_TO_EMAIL;

    const classification = classifyLead(needs, projectType);
    const labCapability = clean(body.labCapability, 100);
    const referral = referralSource === "Other" && referralOther ? `Other: ${referralOther}` : referralSource || "Not provided";
    const submissionId = clean(body.submissionId, 36) || randomUUID();
    if (!/^[a-f0-9-]{36}$/.test(submissionId)) return json({ success: false, message: "Invalid submission reference." }, 400);
    const source = labCapability ? `AHS Lab: ${labCapability} | ${referral}` : referral;
    const lead = await saveInquiryLead(submissionId, { name, email: email.toLowerCase(), business, projectType, classification, needs, timing, investment, currentUrl, currentProblem, successGoal, whyNow, assets, source, productCount, bookingType, guestPain });
    if (lead.conflict) return json({ success: false, message: "This submission reference was already used. Please try again." }, 409);
    savedLeadId = lead.id;
    if (!lead.fresh) return json({ success: true, confirmationSent: lead.confirmationSent });
    if (!key || !destination) {
      await leadEmailStatus(lead.id, "unavailable", "unavailable");
      return json({ success: true, confirmationSent: false });
    }
    const resend = new Resend(key);

    const from =
      process.env.INQUIRY_FROM_EMAIL ||
      `${studio.name} <${studio.email}>`;

    const studioReplyTo =
      process.env.INQUIRY_REPLY_TO_EMAIL ||
      studio.email;

    const safe = {
      name: esc(name),
      email: esc(email),
      business: esc(business || "Not provided"),
      projectType: esc(projectType),
      timing: esc(timing),
      investment: esc(investment),
      currentUrl: esc(currentUrl || "Not provided"),
      currentProblem: nl2br(currentProblem || "Not provided"),
      whyNow: nl2br(whyNow || "Not provided"),
      successGoal: nl2br(successGoal || "Not provided"),
      referral: esc(source),
      productCount: esc(productCount || "Not provided"),
      bookingType: nl2br(bookingType || "Not provided"),
      guestPain: nl2br(guestPain || "Not provided"),
      needs: needs.map(esc),
      assets: assets.map(esc),
      classification: esc(classification),
    };

    const conditionalRows = [
      productCount
        ? `<p><b>Approx. products:</b> ${safe.productCount}</p>`
        : "",
      bookingType
        ? `<p><b>Booking / scheduling:</b><br/>${safe.bookingType}</p>`
        : "",
      guestPain
        ? `<p><b>Hospitality guest friction:</b><br/>${safe.guestPain}</p>`
        : "",
    ].join("");

    let studioStatus = "failed";
    let confirmationStatus = "failed";
    try {
      const { error } = await resend.emails.send({
        from,
        to: [destination],
        replyTo: email,
        subject: `[${classification}] ${investment} · ${business || name}`,
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.55;color:#171317;max-width:720px">
            <p style="font-size:12px;letter-spacing:.08em"><b>${safe.classification} LEAD</b></p>
            <h1 style="margin:0 0 24px">New project inquiry</h1>
            <p><a href="https://www.ahalliwellstudio.com/portal/studio/leads">Open the Leads desk</a></p>
            <p><b>Name:</b> ${safe.name}</p>
            <p><b>Email:</b> ${safe.email}</p>
            <p><b>Business:</b> ${safe.business}</p>
            <p><b>Business type:</b> ${safe.projectType}</p>
            <p><b>Needs:</b> ${safe.needs.join(", ")}</p>
            <p><b>Timing:</b> ${safe.timing}</p>
            <p><b>Investment:</b> ${safe.investment}</p>
            <p><b>Current website:</b> ${safe.currentUrl}</p>
            ${conditionalRows}
            <p><b>What is not working now:</b><br/>${safe.currentProblem}</p>
            <p><b>Why this project matters now:</b><br/>${safe.whyNow}</p>
            <p><b>What success looks like:</b><br/>${safe.successGoal}</p>
            <p><b>Assets ready:</b> ${safe.assets.join(", ") || "Not provided"}</p>
            <p><b>How they found the studio:</b> ${safe.referral}</p>
          </div>
        `,
        text: `Open the Leads desk: https://www.ahalliwellstudio.com/portal/studio/leads
  
  LEAD CLASSIFICATION: ${classification}
  Name: ${name}
  Email: ${email}
  Business: ${business || "Not provided"}
  Business type: ${projectType}
  Needs: ${needs.join(", ")}
  Timing: ${timing}
  Investment: ${investment}
  Current website: ${currentUrl || "Not provided"}
  Approx. products: ${productCount || "Not applicable"}
  Booking / scheduling: ${bookingType || "Not applicable"}
  Hospitality guest friction: ${guestPain || "Not applicable"}
  
  WHAT IS NOT WORKING NOW
  ${currentProblem || "Not provided"}
  
  WHY THIS PROJECT MATTERS NOW
  ${whyNow || "Not provided"}

  WHAT SUCCESS LOOKS LIKE
  ${successGoal || "Not provided"}
  
  ASSETS READY
  ${assets.join(", ") || "Not provided"}
  
  SOURCE
  ${source}`,
      });
  
      if (!error) studioStatus = "accepted";
    } catch { console.warn("Inquiry studio email was not accepted; lead is saved."); }

    try {
      const confirmation = await resend.emails.send({
        from,
        to: [email],
        replyTo: studioReplyTo,
        subject: "Your A. Halliwell Studio project brief is in ♥",
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6;color:#171317;max-width:680px;margin:auto">
            <p style="font-size:12px;letter-spacing:.08em"><b>A. HALLIWELL STUDIO</b></p>
            <h1 style="font-size:34px;line-height:1.05">I got your project brief. ♥</h1>
            <p>Hi ${safe.name},</p>
            <p>Thank you for reaching out. Your inquiry made it safely to the studio. I’ll review what you sent and respond within 1–2 business days at this email address.</p>
  
            <div style="border:1px solid #171317;padding:20px;margin:24px 0">
              <p><b>Business:</b> ${safe.business}</p>
              <p><b>Project:</b> ${safe.needs.join(", ")}</p>
              <p><b>Timing:</b> ${safe.timing}</p>
              <p><b>Investment:</b> ${safe.investment}</p>
              <p><b>Current website:</b> ${safe.currentUrl}</p>
              <p><b>Why now:</b><br/>${safe.whyNow}</p>
              <p><b>Your goal:</b><br/>${safe.successGoal}</p>
            </div>
  
            <div style="padding:22px;background:#f4ebf7;border:1px solid #c9b0d0;margin:24px 0">
              <h2 style="font-family:Georgia,serif;font-weight:400">Would you like to talk it through?</h2>
              <p>You can also book a 15-minute phone consultation. Choose an available time and leave the best phone number to reach you. I’ll call you at your selected time.</p>
              <p><a href="${studio.consultationUrl}" style="display:inline-block;padding:12px 18px;background:#604273;color:#fff;text-decoration:none">Book a consultation</a></p>
            </div>
            <p>If you forgot something important, reply directly to this email and add it.</p>
            <p>Arabella Halliwell<br/>Founder · Creative Director · Full-Stack Designer<br/>A. Halliwell Studio</p>
          </div>
        `,
        text: `Hi ${name},
  
  I got your A. Halliwell Studio project brief. Thank you for reaching out. I’ll review what you sent and respond within 1–2 business days at this email address.
  
  Business: ${business || "Not provided"}
  Project: ${needs.join(", ")}
  Timing: ${timing}
  Investment: ${investment}
  Current website: ${currentUrl || "Not provided"}
  Why now: ${whyNow || "Not provided"}
  Your goal: ${successGoal || "Not provided"}
  
  Want to talk it through? Book an optional 15-minute phone consultation:
  ${studio.consultationUrl}
  Choose a time and leave your phone number. I’ll call you at your selected time.
  
  If you forgot something important, reply directly to this email and add it.
  
  Arabella Halliwell
  Founder · Creative Director · Full-Stack Designer
  A. Halliwell Studio`,
      });
  
      if (!confirmation.error) confirmationStatus = "accepted";
    } catch { console.warn("Inquiry confirmation email was not accepted; lead is saved."); }
    await leadEmailStatus(lead.id, studioStatus, confirmationStatus);
    return json({ success: true, message: "Your project inquiry has been received.", confirmationSent: confirmationStatus === "accepted" });
  } catch {
    if (savedLeadId) return json({ success: true, confirmationSent: false });
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
