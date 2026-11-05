import type { Config } from "@netlify/functions";
import { asc, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { contacts } from "../../db/schema.js";
import { clean, isAuthorized, parseId, readJson, unauthorized } from "../../lib/admin.js";

const STATUSES = ["Arkadaş", "İlişki / Aşk", "Rakip", "Ortak"];
const SECTIONS = ["los_santos", "mexico"];

export default async (req: Request) => {
  if (req.method === "GET") {
    const rows = await db.select().from(contacts).orderBy(asc(contacts.id));
    return Response.json(rows);
  }

  if (!isAuthorized(req)) return unauthorized();

  if (req.method === "POST" || req.method === "PUT") {
    const body = await readJson(req);
    if (!body) return Response.json({ error: "Geçersiz istek." }, { status: 400 });
    const name = clean(body.name, 120);
    const notes = clean(body.notes, 5000);
    const status = STATUSES.includes(body.status) ? body.status : "Arkadaş";
    const section = SECTIONS.includes(body.section) ? body.section : "los_santos";
    if (!name || !notes) return Response.json({ error: "İsim ve notlar zorunludur." }, { status: 400 });
    if (req.method === "POST") {
      const [row] = await db.insert(contacts).values({ name, status, section, notes }).returning();
      return Response.json(row, { status: 201 });
    }
    const id = parseId(req);
    if (!id) return Response.json({ error: "Geçersiz id." }, { status: 400 });
    const [row] = await db.update(contacts).set({ name, status, section, notes }).where(eq(contacts.id, id)).returning();
    if (!row) return Response.json({ error: "Kişi bulunamadı." }, { status: 404 });
    return Response.json(row);
  }

  if (req.method === "DELETE") {
    const id = parseId(req);
    if (!id) return Response.json({ error: "Geçersiz id." }, { status: 400 });
    await db.delete(contacts).where(eq(contacts.id, id));
    return Response.json({ ok: true });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = { path: "/api/contacts" };
