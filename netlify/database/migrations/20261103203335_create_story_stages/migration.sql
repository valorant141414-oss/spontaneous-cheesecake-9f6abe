CREATE TABLE "story_stages" (
	"id" serial PRIMARY KEY,
	"period" text NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"color" text DEFAULT 'cyan' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
