import type { Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { isAuthorized, unauthorized } from "../../lib/admin.js";

const KEY = "profile-photo";
const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export default async (req: Request) => {
  const store = getStore({ name: "avatars", consistency: "strong" });

  if (req.method === "GET") {
    const result = await store.getWithMetadata(KEY, { type: "arrayBuffer" });
    if (!result) return new Response("Not found", { status: 404 });
    const contentType = String(result.metadata?.contentType || "image/jpeg");
    return new Response(result.data, {
      headers: {
        "content-type": contentType,
        "cache-control": "public, max-age=0, must-revalidate",
      },
    });
  }

  if (!isAuthorized(req)) return unauthorized();

  if (req.method === "POST") {
    const contentType = (req.headers.get("content-type") || "").split(";")[0].trim();
    if (!ALLOWED_TYPES.includes(contentType)) {
      return Response.json({ error: "Sadece JPG, PNG, WEBP veya GIF yüklenebilir." }, { status: 400 });
    }
    const data = await req.arrayBuffer();
    if (data.byteLength === 0) return Response.json({ error: "Dosya boş." }, { status: 400 });
    if (data.byteLength > MAX_BYTES) return Response.json({ error: "Dosya en fazla 4 MB olabilir." }, { status: 413 });
    await store.set(KEY, data, { metadata: { contentType, updatedAt: Date.now() } });
    return Response.json({ ok: true });
  }

  if (req.method === "DELETE") {
    await store.delete(KEY);
    return Response.json({ ok: true });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = { path: "/api/avatar" };
