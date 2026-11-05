CREATE TABLE "site_settings" (
	"key" text PRIMARY KEY,
	"value" jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "attitude_types" ADD COLUMN "polarity" text DEFAULT 'neutral' NOT NULL;