import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";
const MAX_BODY_BYTES = 12_000;
const clean = (v: unknown, n: number) => typeof v === "string" ? v.trim().replace(/\0/g, "").slice(0, n) : "";
const esc = (v: string) => v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
const emailOK = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const json = (body: Record<string, unknown>, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  try {
    if (!(request.headers.get("content-type") || "").toLowerCase().includes("application/json")) return json({ success: false, message: "Unsupported request format." }, 415);
    const raw = await request.text();
    if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) return json({ success: false, message: "Inquiry is too large." }, 413);

    let b: any;
    try { b = JSON.parse(raw); } catch { return json({ success: false, message: "Invalid inquiry data." }, 400); }
    if (!b || typeof b !== "object" || Array.isArray(b)) return json({ success: false, message: "Invalid inquiry data." }, 400);
    if (clean(b.website, 200)) return json({ success: true, message: "Your inquiry was received." });

    const name = clean(b.name, 100);
    const email = clean(b.email, 254);
    const business = clean(b.business, 150);
    const projectType = clean(b.projectType, 150);
    const timing = clean(b.timing, 100);
    const investment = clean(b.investment, 100);
    const message = clean(b.message, 3000);
    const needs = Array.isArray(b.needs) ? b.needs.filter((x: unknown): x is string => typeof x === "string").map((x: string) => clean(x, 100)).filter(Boolean).slice(0, 20) : [];

    if (!name || !email || !projectType || !timing || !investment) return json({ success: false, message: "Please complete all required fields." }, 400);
    if (!emailOK(email)) return json({ success: false, message: "Please enter a valid email address." }, 400);

    const key = process.env.RESEND_API_KEY;
    if (!key) return json({ success: false, message: "Inquiry delivery is temporarily unavailable." }, 500);

    const resend = new Resend(key);
    const safe = {
      name: esc(name), email: esc(email), business: esc(business || "Not provided"), projectType: esc(projectType),
      timing: esc(timing), investment: esc(investment), message: esc(message || "No additional message"), needs: needs.map(esc)
    };

    const { error } = await resend.emails.send({
      from: process.env.INQUIRY_FROM_EMAIL || "A. Halliwell Studio <onboarding@resend.dev>",
      to: [process.env.INQUIRY_TO_EMAIL || "arabellakhalliwell@gmail.com"],
      replyTo: email,
      subject: `New project inquiry from ${name}`,
      html: `<h1>New project inquiry</h1><p><b>Name:</b> ${safe.name}</p><p><b>Email:</b> ${safe.email}</p><p><b>Business:</b> ${safe.business}</p><p><b>Project:</b> ${safe.projectType}</p><p><b>Needs:</b> ${safe.needs.join(", ") || "None selected"}</p><p><b>Timing:</b> ${safe.timing}</p><p><b>Investment:</b> ${safe.investment}</p><p><b>Details:</b><br/>${safe.message}</p>`,
      text: `Name: ${name}\nEmail: ${email}\nBusiness: ${business || "Not provided"}\nProject: ${projectType}\nNeeds: ${needs.join(", ") || "None selected"}\nTiming: ${timing}\nInvestment: ${investment}\n\n${message || "No additional message"}`
    });

    if (error) return json({ success: false, message: "We couldn't send your inquiry right now. Please try again." }, 502);
    return json({ success: true, message: "Your project inquiry has been sent." });
  } catch {
    return json({ success: false, message: "Something went wrong while sending your inquiry. Please try again." }, 500);
  }
}
