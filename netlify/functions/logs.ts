import type { Config } from "@netlify/functions";
import { desc, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { logs } from "../../db/schema.js";
import { clean, isAuthorized, parseId, readJson, unauthorized } from "../../lib/admin.js";

const CATEGORIES = ["Sokak & İş", "Kişisel Düşünce", "Etkinlik Projesi", "Önemli Karar"];

export default async (req: Request) => {
  if (req.method === "GET") {
    const rows = await db.select().from(logs).orderBy(desc(logs.date), desc(logs.id));
    return Response.json(rows);
  }

  if (!isAuthorized(req)) return unauthorized();

  if (req.method === "POST" || req.method === "PUT") {
    const body = await readJson(req);
    if (!body) return Response.json({ error: "Geçersiz istek." }, { status: 400 });
    const date = /^\d{4}-\d{2}-\d{2}$/.test(body.date) ? body.date : "";
    const title = clean(body.title, 200);
    const content = clean(body.content, 10000);
    const category = CATEGORIES.includes(body.category) ? body.category : CATEGORIES[1];
    if (!date || !title || !content) {
      return Response.json({ error: "Tarih, başlık ve içerik zorunludur." }, { status: 400 });
    }
    if (req.method === "POST") {
      const [row] = await db.insert(logs).values({ date, category, title, content }).returning();
      return Response.json(row, { status: 201 });
    }
    const id = parseId(req);
    if (!id) return Response.json({ error: "Geçersiz id." }, { status: 400 });
    const [row] = await db.update(logs).set({ date, category, title, content }).where(eq(logs.id, id)).returning();
    if (!row) return Response.json({ error: "Kayıt bulunamadı." }, { status: 404 });
    return Response.json(row);
  }

  if (req.method === "DELETE") {
    const id = parseId(req);
    if (!id) return Response.json({ error: "Geçersiz id." }, { status: 400 });
    await db.delete(logs).where(eq(logs.id, id));
    return Response.json({ ok: true });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = { path: "/api/logs" };
