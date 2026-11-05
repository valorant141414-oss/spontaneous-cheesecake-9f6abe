CREATE TABLE "attitude_types" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL UNIQUE,
	"color" text DEFAULT '#94a3b8' NOT NULL,
	"icon" text DEFAULT 'fa-circle' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
