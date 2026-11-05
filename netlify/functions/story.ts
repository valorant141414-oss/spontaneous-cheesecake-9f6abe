import type { Config } from "@netlify/functions";
import { asc, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { storyStages } from "../../db/schema.js";
import { clean, isAuthorized, parseId, readJson, unauthorized } from "../../lib/admin.js";

const COLORS = ["cyan", "crimson", "amber", "neonGreen"];

export default async (req: Request) => {
  if (req.method === "GET") {
    const rows = await db.select().from(storyStages).orderBy(asc(storyStages.createdAt));
    return Response.json(rows);
  }

  if (!isAuthorized(req)) return unauthorized();

  if (req.method === "POST" || req.method === "PUT") {
    const body = await readJson(req);
    if (!body) return Response.json({ error: "Geçersiz istek." }, { status: 400 });
    if (req.method === "POST" && body.verifyOnly) return Response.json({ ok: true });
    const period = clean(body.period, 120);
    const title = clean(body.title, 200);
    const content = clean(body.content, 10000);
    const color = COLORS.includes(body.color) ? body.color : "cyan";
    if (!period || !title || !content) {
      return Response.json({ error: "Dönem, başlık ve içerik zorunludur." }, { status: 400 });
    }
    if (req.method === "POST") {
      const [row] = await db.insert(storyStages).values({ period, title, content, color }).returning();
      return Response.json(row, { status: 201 });
    }
    const id = parseId(req);
    if (!id) return Response.json({ error: "Geçersiz id." }, { status: 400 });
    const [row] = await db
      .update(storyStages)
      .set({ period, title, content, color })
      .where(eq(storyStages.id, id))
      .returning();
    if (!row) return Response.json({ error: "Aşama bulunamadı." }, { status: 404 });
    return Response.json(row);
  }

  if (req.method === "DELETE") {
    const id = parseId(req);
    if (!id) return Response.json({ error: "Geçersiz id." }, { status: 400 });
    await db.delete(storyStages).where(eq(storyStages.id, id));
    return Response.json({ ok: true });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = { path: "/api/story" };
