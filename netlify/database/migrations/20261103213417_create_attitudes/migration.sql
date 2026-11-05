CREATE TABLE "attitudes" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"meters" jsonb DEFAULT '[]' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
