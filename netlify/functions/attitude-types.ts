import type { Config } from "@netlify/functions";
import { asc, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { attitudeTypes } from "../../db/schema.js";
import { clean, isAuthorized, parseId, readJson, unauthorized } from "../../lib/admin.js";
import { BUILTIN_TYPES, CUSTOM_ICONS } from "../../lib/attitude-types.js";

const POLARITIES = ["positive", "negative", "neutral"];

export default async (req: Request) => {
  if (req.method === "GET") {
    const rows = await db.select().from(attitudeTypes).orderBy(asc(attitudeTypes.id));
    return Response.json(rows);
  }

  if (!isAuthorized(req)) return unauthorized();

  if (req.method === "POST") {
    const body = await readJson(req);
    if (!body) return Response.json({ error: "Geçersiz istek." }, { status: 400 });
    const name = clean(body.name, 30);
    const color = typeof body.color === "string" && /^#[0-9a-fA-F]{6}$/.test(body.color) ? body.color.toLowerCase() : "#94a3b8";
    const icon = CUSTOM_ICONS.includes(body.icon) ? body.icon : "fa-circle";
    const polarity = POLARITIES.includes(body.polarity) ? body.polarity : "neutral";
    if (!name) return Response.json({ error: "Duygu adı zorunludur." }, { status: 400 });
    const lower = name.toLocaleLowerCase("tr");
    const existing = await db.select({ name: attitudeTypes.name }).from(attitudeTypes);
    if ([...BUILTIN_TYPES, ...existing.map((e) => e.name)].some((t) => t.toLocaleLowerCase("tr") === lower)) {
      return Response.json({ error: "Bu isimde bir duygu zaten var." }, { status: 409 });
    }
    const [row] = await db.insert(attitudeTypes).values({ name, color, icon, polarity }).returning();
    return Response.json(row, { status: 201 });
  }

  if (req.method === "PUT") {
    const id = parseId(req);
    const body = await readJson(req);
    if (!id || !POLARITIES.includes(body?.polarity)) return Response.json({ error: "Geçersiz istek." }, { status: 400 });
    const [row] = await db.update(attitudeTypes).set({ polarity: body.polarity }).where(eq(attitudeTypes.id, id)).returning();
    if (!row) return Response.json({ error: "Duygu bulunamadı." }, { status: 404 });
    return Response.json(row);
  }

  if (req.method === "DELETE") {
    const id = parseId(req);
    if (!id) return Response.json({ error: "Geçersiz id." }, { status: 400 });
    await db.delete(attitudeTypes).where(eq(attitudeTypes.id, id));
    return Response.json({ ok: true });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = { path: "/api/attitude-types" };
