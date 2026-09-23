import { NextResponse } from "next/server";

// Disabled until the fax service has server-side authentication.
export async function POST() {
  return NextResponse.json({ ok: false, error: "Fax sending is unavailable." }, { status: 403 });
}
