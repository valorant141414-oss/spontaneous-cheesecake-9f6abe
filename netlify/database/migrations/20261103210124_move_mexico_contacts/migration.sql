-- Javier, Luciano and Mateo belong to the "Meksika'daki Yakınları" section.
UPDATE "contacts" SET "section" = 'mexico' WHERE "name" IN ('Javier', 'Luciano', 'Mateo');
--> statement-breakpoint
-- The "Müttefik" status is removed for now; existing entries become "Arkadaş".
UPDATE "contacts" SET "status" = 'Arkadaş' WHERE "status" = 'Müttefik';
