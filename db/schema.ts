import { jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const storyStages = pgTable("story_stages", {
  id: serial().primaryKey(),
  period: text().notNull(),
  title: text().notNull(),
  content: text().notNull(),
  color: text().notNull().default("cyan"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contacts = pgTable("contacts", {
  id: serial().primaryKey(),
  name: text().notNull(),
  status: text().notNull().default("Arkadaş"),
  section: text().notNull().default("los_santos"),
  notes: text().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const logs = pgTable("logs", {
  id: serial().primaryKey(),
  date: text().notNull(),
  category: text().notNull(),
  title: text().notNull(),
  content: text().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Overrides for the page's static texts (name, birth date, hobbies, ...), keyed by a stable id.
export const siteContent = pgTable("site_content", {
  key: text().primaryKey(),
  value: text().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// How Daniel feels about other characters (IC): one row per character, several feeling meters each.
export const attitudes = pgTable("attitudes", {
  id: serial().primaryKey(),
  name: text().notNull(),
  note: text().notNull().default(""),
  meters: jsonb().$type<{ type: string; value: number }[]>().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Custom feeling types added by the admin (in addition to the built-in list in the frontend).
export const attitudeTypes = pgTable("attitude_types", {
  id: serial().primaryKey(),
  name: text().notNull().unique(),
  color: text().notNull().default("#94a3b8"),
  icon: text().notNull().default("fa-circle"),
  // "positive" | "negative" | "neutral": used to balance the overall attitude-toward-people bar.
  polarity: text().notNull().default("neutral"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Admin-controlled layout and profile settings, keyed by name:
// "order:<group>" -> ordered id list, "environment" / "legality" -> { value }, "crimes" -> list.
export const siteSettings = pgTable("site_settings", {
  key: text().primaryKey(),
  value: jsonb().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
