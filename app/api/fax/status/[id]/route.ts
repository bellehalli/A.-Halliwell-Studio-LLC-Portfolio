import { NextRequest, NextResponse } from "next/server";
import { authorized } from "@/lib/fax-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!authorized(request)) return NextResponse.json({ ok: false, error: "Sign in to check fax status." }, { status: 401, headers: { "Cache-Control": "no-store" } });
  const apiKey = process.env.TELNYX_API_KEY;
  if (!apiKey) return NextResponse.json({ ok:false, error:"TELNYX_API_KEY is not configured." }, {status:500});

  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id))
    return NextResponse.json({ok:false,error:"Invalid fax ID."},{status:400});

  try {
    const response = await fetch(`https://api.telnyx.com/v2/faxes/${encodeURIComponent(id)}`, {
      headers:{Authorization:`Bearer ${apiKey}`},
      cache:"no-store"
    });
    const payload = await response.json().catch(()=>null);

    return NextResponse.json({
      ok:response.ok,
      telnyxHttpStatus:response.status,
      faxId:id,
      status: payload?.data?.status ?? "unknown",
      error: response.ok ? undefined : "Could not retrieve fax status."
    }, {
      status:response.ok ? 200 : response.status,
      headers:{"Cache-Control":"no-store"}
    });
  } catch {
    return NextResponse.json({ok:false,faxId:id,error:"Could not retrieve the Telnyx fax record."},{status:500});
  }
}
