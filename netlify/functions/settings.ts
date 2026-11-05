import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { siteSettings } from "../../db/schema.js";
import { clean, isAuthorized, readJson, unauthorized } from "../../lib/admin.js";

const ORDER_KEY_RE = /^order:[a-z0-9_-]{1,40}$/;
const ID_RE = /^[a-zA-Z0-9_-]{1,64}$/;

function clampInt(v: unknown, min: number, max: number): number | null {
  const n = Math.round(Number(v));
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : null;
}

// Validates and normalizes a value for a known settings key; returns undefined if invalid.
function normalize(key: string, value: any): unknown {
  if (ORDER_KEY_RE.test(key)) {
    if (!Array.isArray(value)) return undefined;
    const ids = [...new Set(value.map(String).filter((id) => ID_RE.test(id)))];
    return ids.slice(0, 1000);
  }
  if (key === "environment") {
    const v = clampInt(value?.value, -100, 100);
    return v === null ? undefined : { value: v };
  }
  if (key === "legality") {
    const v = clampInt(value?.value, 0, 100);
    return v === null ? undefined : { value: v };
  }
  if (key === "crimes") {
    if (!Array.isArray(value)) return undefined;
    return value
      .slice(0, 50)
      .map((c) => ({
        name: clean(c?.name, 80),
        count: clampInt(c?.count, 1, 999) ?? 1,
      }))
      .filter((c) => c.name);
  }
  return undefined;
}

export default async (req: Request) => {
  if (req.method === "GET") {
    const rows = await db.select().from(siteSettings);
    return Response.json(Object.fromEntries(rows.map((r) => [r.key, r.value])));
  }

  if (!isAuthorized(req)) return unauthorized();

  if (req.method === "PUT") {
    const body = await readJson(req);
    const key = typeof body?.key === "string" ? body.key : "";
    const value = normalize(key, body?.value);
    if (value === undefined) return Response.json({ error: "Geçersiz ayar." }, { status: 400 });
    await db
      .insert(siteSettings)
      .values({ key, value })
      .onConflictDoUpdate({ target: siteSettings.key, set: { value, updatedAt: new Date() } });
    return Response.json({ key, value });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = { path: "/api/settings" };
