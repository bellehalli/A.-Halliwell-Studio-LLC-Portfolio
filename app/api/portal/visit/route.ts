import { NextResponse } from "next/server";
import { currentPortalClient, portalEnabled } from "@/lib/portal";
import { recordFirstClientVisit } from "@/lib/portal-first-visit";
const headers = { "Cache-Control": "private, no-store" };
export async function POST(request: Request) {
  if (!portalEnabled() || request.headers.get("origin") !== new URL(request.url).origin) return NextResponse.json({ ok: false }, { status: 403, headers });
  const client = await currentPortalClient();
  if (!client || client.role !== "client") return NextResponse.json({ ok: false }, { status: 401, headers });
  try {
    const raw = await request.text();
    if (raw.length > 200) return NextResponse.json({ ok: false }, { status: 400, headers });
    const projectId = String(JSON.parse(raw).projectId || "");
    if (!/^[a-f0-9-]{36}$/.test(projectId)) return NextResponse.json({ ok: false }, { status: 400, headers });
    await recordFirstClientVisit(projectId, client.id);
    return NextResponse.json({ ok: true }, { headers });
  } catch { return NextResponse.json({ ok: false }, { status: 400, headers }); }
}
