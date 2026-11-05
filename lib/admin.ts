import { scryptSync, timingSafeEqual } from "node:crypto";

// One-way scrypt hash of the admin password (the password itself is not stored).
// Setting the STORY_ADMIN_PASSWORD environment variable overrides it.
const ADMIN_SALT = "48c5c143ccdbed91af93f049fcd4f982";
const ADMIN_HASH = "8dbb96f9b5b1d6fd790ee421cd6256134be515dfae2127779475adbfa16256d4";

export function isAuthorized(req: Request): boolean {
  const given = req.headers.get("x-admin-password") ?? "";
  if (!given || given.length > 200) return false;
  const envPassword = Netlify.env.get("STORY_ADMIN_PASSWORD");
  if (envPassword) {
    const a = Buffer.from(given);
    const b = Buffer.from(envPassword);
    return a.length === b.length && timingSafeEqual(a, b);
  }
  const computed = scryptSync(given, ADMIN_SALT, 32);
  return timingSafeEqual(computed, Buffer.from(ADMIN_HASH, "hex"));
}

export function unauthorized(): Response {
  return Response.json({ error: "Şifre hatalı." }, { status: 401 });
}

export function clean(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function readJson(req: Request): Promise<any> {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

export function parseId(req: Request): number | null {
  const id = Number(new URL(req.url).searchParams.get("id"));
  return Number.isInteger(id) && id > 0 ? id : null;
}
