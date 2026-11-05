import type { Config } from "@netlify/functions";
import { asc, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { attitudes, attitudeTypes } from "../../db/schema.js";
import { BUILTIN_TYPES } from "../../lib/attitude-types.js";
import { clean, isAuthorized, parseId, readJson, unauthorized } from "../../lib/admin.js";

function parseMeters(input: unknown, allowed: string[]) {
  if (!Array.isArray(input)) return [];
  const seen = new Set<string>();
  const out: { type: string; value: number }[] = [];
  for (const m of input.slice(0, allowed.length)) {
    const type = typeof m?.type === "string" ? m.type : "";
    const value = Math.round(Number(m?.value));
    if (!allowed.includes(type) || seen.has(type) || !Number.isFinite(value)) continue;
    seen.add(type);
    out.push({ type, value: Math.min(100, Math.max(0, value)) });
  }
  return out;
}

export default async (req: Request) => {
  if (req.method === "GET") {
    const rows = await db.select().from(attitudes).orderBy(asc(attitudes.id));
    return Response.json(rows);
  }

  if (!isAuthorized(req)) return unauthorized();

  if (req.method === "POST" || req.method === "PUT") {
    const body = await readJson(req);
    if (!body) return Response.json({ error: "Geçersiz istek." }, { status: 400 });
    const name = clean(body.name, 120);
    const note = clean(body.note, 2000);
    const custom = await db.select({ name: attitudeTypes.name }).from(attitudeTypes);
    const meters = parseMeters(body.meters, [...BUILTIN_TYPES, ...custom.map((c) => c.name)]);
    if (!name) return Response.json({ error: "Karakter adı zorunludur." }, { status: 400 });
    if (meters.length === 0) return Response.json({ error: "En az bir duygu ekleyin." }, { status: 400 });
    if (req.method === "POST") {
      const [row] = await db.insert(attitudes).values({ name, note, meters }).returning();
      return Response.json(row, { status: 201 });
    }
    const id = parseId(req);
    if (!id) return Response.json({ error: "Geçersiz id." }, { status: 400 });
    const [row] = await db.update(attitudes).set({ name, note, meters }).where(eq(attitudes.id, id)).returning();
    if (!row) return Response.json({ error: "Kayıt bulunamadı." }, { status: 404 });
    return Response.json(row);
  }

  if (req.method === "DELETE") {
    const id = parseId(req);
    if (!id) return Response.json({ error: "Geçersiz id." }, { status: 400 });
    await db.delete(attitudes).where(eq(attitudes.id, id));
    return Response.json({ ok: true });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = { path: "/api/attitudes" };
