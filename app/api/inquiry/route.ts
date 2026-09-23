import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 12_000;
const clean = (value: unknown, max: number) => typeof value === "string" ? value.trim().replace(/\0/g, "").slice(0, max) : "";
const esc = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
const emailOK = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const json = (body: Record<string, unknown>, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  try {
    if (!(request.headers.get("content-type") || "").toLowerCase().includes("application/json")) {
      return json({ success: false, message: "Unsupported request format." }, 415);
    }

    const raw = await request.text();
    if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) {
      return json({ success: false, message: "Inquiry is too large." }, 413);
    }

    let body: any;
    try {
      body = JSON.parse(raw);
    } catch {
      return json({ success: false, message: "Invalid inquiry data." }, 400);
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return json({ success: false, message: "Invalid inquiry data." }, 400);
    }

    if (clean(body.website, 200)) {
      return json({ success: true, message: "Your inquiry was received." });
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
          .filter((item: unknown): item is string => typeof item === "string")
          .map((item: string) => clean(item, 100))
          .filter(Boolean)
          .slice(0, 20)
      : [];

    if (!name || !email || !projectType || !timing || !investment) {
      return json({ success: false, message: "Please complete all required fields." }, 400);
    }

    if (!emailOK(email)) {
      return json({ success: false, message: "Please enter a valid email address." }, 400);
    }

    const key = process.env.RESEND_API_KEY;
    const destination = process.env.INQUIRY_TO_EMAIL;

    if (!key || !destination) {
      return json({ success: false, message: "Inquiry delivery is temporarily unavailable." }, 500);
    }

    const resend = new Resend(key);
    const safe = {
      name: esc(name),
      email: esc(email),
      business: esc(business || "Not provided"),
      projectType: esc(projectType),
      timing: esc(timing),
      investment: esc(investment),
      message: esc(message || "No additional message"),
      needs: needs.map(esc),
    };

    const { error } = await resend.emails.send({
      from: process.env.INQUIRY_FROM_EMAIL || "A. Halliwell Studio <hello@ahalliwellstudio.com>",
      to: [destination],
      replyTo: email,
      subject: `New project inquiry from ${name}`,
      html: `<h1>New project inquiry</h1><p><b>Name:</b> ${safe.name}</p><p><b>Email:</b> ${safe.email}</p><p><b>Business:</b> ${safe.business}</p><p><b>Project:</b> ${safe.projectType}</p><p><b>Needs:</b> ${safe.needs.join(", ") || "None selected"}</p><p><b>Timing:</b> ${safe.timing}</p><p><b>Investment:</b> ${safe.investment}</p><p><b>Details:</b><br/>${safe.message}</p>`,
      text: `Name: ${name}\nEmail: ${email}\nBusiness: ${business || "Not provided"}\nProject: ${projectType}\nNeeds: ${needs.join(", ") || "None selected"}\nTiming: ${timing}\nInvestment: ${investment}\n\n${message || "No additional message"}`,
    });

    if (error) {
      return json({ success: false, message: "We couldn't send your inquiry right now. Please try again." }, 502);
    }

    return json({ success: true, message: "Your project inquiry has been sent." });
  } catch {
    return json({ success: false, message: "Something went wrong while sending your inquiry. Please try again." }, 500);
  }
}
