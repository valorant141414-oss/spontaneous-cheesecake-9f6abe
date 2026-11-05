CREATE TABLE "contacts" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL,
	"status" text DEFAULT 'Arkadaş' NOT NULL,
	"notes" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "logs" (
	"id" serial PRIMARY KEY,
	"date" text NOT NULL,
	"category" text NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
