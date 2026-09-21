import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const apiKey = process.env.TELNYX_API_KEY;
  if (!apiKey) return NextResponse.json({ ok: false, error: "TELNYX_API_KEY is not configured." }, { status: 500 });

  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id))
    return NextResponse.json({ ok: false, error: "Invalid fax ID." }, { status: 400 });

  try {
    const response = await fetch(`https://api.telnyx.com/v2/faxes/${encodeURIComponent(id)}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: "no-store",
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok)
      return NextResponse.json({ ok: false, error: "Could not retrieve fax status.", telnyx: payload }, { status: response.status });

    const fax = payload?.data ?? {};
    return NextResponse.json({
      ok: true,
      faxId: fax.id ?? id,
      status: fax.status ?? "unknown",
      completedAt: fax.completed_at ?? null,
      pageCount: fax.page_count ?? null,
      errors: fax.errors ?? [],
    });
  } catch {
    return NextResponse.json({ ok: false, error: "The server could not check fax status." }, { status: 500 });
  }
}
