import { NextResponse } from "next/server";

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

    if (!body.name || !body.email) {
      return NextResponse.json({success:false,message:"Missing required fields."},{status:400});
    }

    return NextResponse.json({
      success:true,
      message:"Inquiry received."
    });
  } catch {
    return NextResponse.json({success:false,message:"Invalid request."},{status:400});
  }
}
