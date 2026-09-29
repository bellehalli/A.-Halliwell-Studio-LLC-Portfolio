import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { currentPortalClient, isPortalStudio, portalDb, portalEnabled } from "@/lib/portal";

export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store" };

export async function POST(request: Request) {
  if (!portalEnabled() || !process.env.BLOB_READ_WRITE_TOKEN) return NextResponse.json({ error: "Private storage is not configured." }, { status: 503, headers });
  if (request.headers.get("origin") && request.headers.get("origin") !== new URL(request.url).origin) return NextResponse.json({ error: "Forbidden." }, { status: 403, headers });
  try {
    const body = (await request.json()) as HandleUploadBody;
    const result = await handleUpload({ body, request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (!isPortalStudio(await currentPortalClient())) throw Error("Sign in to the studio workspace before uploading.");
        const payload = JSON.parse(clientPayload || "{}");
        const projectId = String(payload.projectId || "");
        const kind = String(payload.kind || "");
        if (!/^[a-f0-9-]{36}$/.test(projectId) || !["agreement", "invoice"].includes(kind) ||
          !new RegExp(`^portal/${projectId}/documents/[a-f0-9-]{36}-[A-Za-z0-9._-]{1,120}\\.pdf$`, "i").test(pathname)) throw Error("Invalid document upload.");
        const projects = await portalDb()`SELECT id FROM portal_projects WHERE id = ${projectId} LIMIT 1`;
        if (!projects.length) throw Error("Project not found.");
        return { allowedContentTypes: ["application/pdf"], maximumSizeInBytes: 25_000_000, addRandomSuffix: false,
          tokenPayload: JSON.stringify({ projectId, kind }) };
      },
      // The studio explicitly finalizes metadata in /documents after the upload completes.
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(result, { headers });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed." }, { status: 400, headers });
  }
}
