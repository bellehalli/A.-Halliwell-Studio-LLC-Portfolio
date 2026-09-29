import { NextResponse } from "next/server";
import { Resend } from "resend";
import { currentPortalClient, isPortalStudio, portalDb, portalEnabled } from "@/lib/portal";

export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store" };

export async function GET(request: Request) {
  if (!portalEnabled()) return NextResponse.json({ message: "Portal unavailable." }, { status: 503, headers });
  if (!isPortalStudio(await currentPortalClient())) return NextResponse.json({ message: "Forbidden." }, { status: 403, headers });
  const projectId = new URL(request.url).searchParams.get("projectId") || "";
  if (!/^[a-f0-9-]{36}$/.test(projectId)) return NextResponse.json({ message: "Choose a project." }, { status: 400, headers });
  const rows = await portalDb()`SELECT c.email FROM portal_projects p JOIN portal_clients c ON c.id = p.client_id WHERE p.id = ${projectId} LIMIT 1`;
  if (!rows.length) return NextResponse.json({ message: "Project not found." }, { status: 404, headers });
  try {
    const { data, error } = await new Resend(process.env.RESEND_API_KEY).emails.list({ limit: 100 });
    if (error || !data) return NextResponse.json({ message: "Delivery status is temporarily unavailable." }, { status: 502, headers });
    const recipient = String(rows[0].email).toLowerCase();
    const invitations = data.data.filter(item => item.subject === "Your A. Halliwell Studio project workspace" && item.to.some(address => address.toLowerCase() === recipient)).slice(0, 3)
      .map(item => ({ id: item.id, status: item.last_event, at: item.created_at }));
    return NextResponse.json({ recipient, invitations, hasMore: data.has_more }, { headers });
  } catch {
    return NextResponse.json({ message: "Delivery status is temporarily unavailable." }, { status: 502, headers });
  }
}
