import { NextResponse } from "next/server";

// Disabled until the fax service has server-side authentication.
export async function GET() {
  return NextResponse.json({ ok: false, error: "Fax status is unavailable." }, { status: 403 });
}
