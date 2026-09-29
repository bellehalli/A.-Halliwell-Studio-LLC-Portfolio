import { randomUUID } from "node:crypto";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { currentPortalClient, portalDb, portalEnabled } from "@/lib/portal";

export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store" };
const categories = new Set(["aerial", "site_plan", "floor_plan", "photos", "branding", "references"]);
const contentTypes = ["application/pdf", "image/png", "image/jpeg", "image/webp"];

export async function POST(request: Request) {
  if (!portalEnabled() || !process.env.BLOB_READ_WRITE_TOKEN) return NextResponse.json({ error: "Uploads are not configured." }, { status: 503, headers });
  if (request.headers.get("origin") && request.headers.get("origin") !== new URL(request.url).origin) return NextResponse.json({ error: "Forbidden." }, { status: 403, headers });
  try {
    const body = (await request.json()) as HandleUploadBody;
    const result = await handleUpload({ body, request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const client = await currentPortalClient();
        if (!client) throw Error("Sign in before uploading.");
        const payload = JSON.parse(clientPayload || "{}");
        const projectId = String(payload.projectId || "");
        const category = String(payload.category || "");
        const note = String(payload.note || "").trim();
        if (!/^[a-f0-9-]{36}$/.test(projectId) || !categories.has(category) || note.length > 500 || !new RegExp(`^portal-materials/${projectId}/[a-f0-9-]{36}-[A-Za-z0-9._-]{1,120}$`).test(pathname)) throw Error("Invalid material details.");
        const projects = await portalDb()`SELECT id FROM portal_projects WHERE id = ${projectId} AND client_id = ${client.id} LIMIT 1`;
        if (!projects.length) throw Error("Project not found.");
        const signed = await portalDb()`SELECT 1 FROM portal_documents d JOIN portal_agreement_signatures s ON s.document_id = d.id AND s.signer_role = 'client'
          WHERE d.project_id = ${projectId} AND d.kind = 'agreement'
            AND d.id = (SELECT id FROM portal_documents WHERE project_id = d.project_id AND kind = 'agreement' ORDER BY created_at DESC, id DESC LIMIT 1) LIMIT 1`;
        if (!signed.length) throw Error("Sign the current agreement before uploading materials.");
        return { allowedContentTypes: contentTypes, maximumSizeInBytes: 25_000_000, addRandomSuffix: false,
          tokenPayload: JSON.stringify({ projectId, clientId: client.id, category, note, fileName: pathname.split("/").at(-1)!.replace(/^[a-f0-9-]{37}/, "") }) };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        if (!tokenPayload) throw Error("Missing upload authorization.");
        const payload = JSON.parse(tokenPayload);
        const sql = portalDb();
        const rows = await sql`INSERT INTO portal_materials(id, project_id, client_id, category, note, file_name, blob_url, content_type)
          VALUES (${randomUUID()}, ${payload.projectId}, ${payload.clientId}, ${payload.category}, ${payload.note}, ${payload.fileName}, ${blob.url}, ${blob.contentType})
          ON CONFLICT (blob_url) DO NOTHING RETURNING id`;
        if (!rows.length) return;
        if (process.env.PORTAL_STUDIO_EMAIL) {
          try { await new Resend(process.env.RESEND_API_KEY).emails.send({
            from: process.env.INQUIRY_FROM_EMAIL || "A. Halliwell Studio <onboarding@resend.dev>",
            to: [process.env.PORTAL_STUDIO_EMAIL], subject: "New client project material",
            text: `A client uploaded ${payload.category.replaceAll("_", " ")} for a project. Open the private studio workspace to review the file: https://www.ahalliwellstudio.com/portal/studio`,
          }, { idempotencyKey: `portal-material/${rows[0].id}` }); } catch { /* The upload is safely recorded if mail fails. */ }
        }
      },
    });
    return NextResponse.json(result, { headers });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed." }, { status: 400, headers }); }
}
