import type { Config } from "@netlify/functions";
import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { siteContent } from "../../db/schema.js";
import { isAuthorized, readJson, unauthorized } from "../../lib/admin.js";

const KEY_RE = /^[a-z0-9_-]{1,64}$/;

export default async (req: Request) => {
  if (req.method === "GET") {
    const rows = await db.select().from(siteContent);
    return Response.json(Object.fromEntries(rows.map((r) => [r.key, r.value])));
  }

  if (!isAuthorized(req)) return unauthorized();

  if (req.method === "PUT") {
    const body = await readJson(req);
    const key = typeof body?.key === "string" ? body.key : "";
    const value = typeof body?.value === "string" ? body.value.trim().slice(0, 5000) : "";
    if (!KEY_RE.test(key)) return Response.json({ error: "Geçersiz alan." }, { status: 400 });
    if (!value) return Response.json({ error: "Metin boş olamaz." }, { status: 400 });
    const [row] = await db
      .insert(siteContent)
      .values({ key, value })
      .onConflictDoUpdate({ target: siteContent.key, set: { value, updatedAt: new Date() } })
      .returning();
    return Response.json({ key: row.key, value: row.value });
  }

  if (req.method === "DELETE") {
    const key = new URL(req.url).searchParams.get("key") ?? "";
    if (!KEY_RE.test(key)) return Response.json({ error: "Geçersiz alan." }, { status: 400 });
    await db.delete(siteContent).where(eq(siteContent.key, key));
    return Response.json({ ok: true });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = { path: "/api/content" };
