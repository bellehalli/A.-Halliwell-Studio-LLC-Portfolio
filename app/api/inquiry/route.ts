import { NextResponse } from "next/server";
import { Resend } from "resend";

const requests = new Map<string, number>();

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const now = Date.now();
  const last = requests.get(ip) || 0;

  if (now - last < 5000) {
    return NextResponse.json({success:false,message:"Please wait before trying again."},{status:429});
  }

  requests.set(ip, now);

  try {
    const body = await request.json();

    if (body.companyFax) return NextResponse.json({success:true,message:"Inquiry received."});
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const details = typeof body.details === "string" ? body.details.trim() : "";
    if (!name || !email || !details || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({success:false,message:"Missing required fields."},{status:400});
    }
    if (process.env.RESEND_API_KEY && process.env.INQUIRY_TO_EMAIL) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const safe = (value: unknown) => String(value || "").replace(/[<>]/g, "");
      const { error } = await resend.emails.send({
        from: process.env.INQUIRY_FROM_EMAIL || "A. Halliwell Studio <onboarding@resend.dev>",
        to: process.env.INQUIRY_TO_EMAIL,
        replyTo: email,
        subject: `New studio inquiry from ${safe(name)}`,
        text: [`Name: ${name}`, `Email: ${email}`, `Business: ${safe(body.business)}`, `Website: ${safe(body.website)}`, `Project: ${safe(body.projectType)}`, `Timeline: ${safe(body.timeline)}`, `Budget: ${safe(body.budget)}`, "", details].join("\n")
      });
      if (error) return NextResponse.json({success:false,message:"The inquiry could not be delivered. Please try again."},{status:502});
    }

    return NextResponse.json({
      success:true,
      message:"Inquiry received."
    });
  } catch {
    return NextResponse.json({success:false,message:"Invalid request."},{status:400});
  }
}
