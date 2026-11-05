-- Seed the initial contacts and log entries that previously lived only in the browser.
INSERT INTO "contacts" ("name", "status", "notes") VALUES
('Javier', 'Müttefik', 'En yakın lise arkadaşı. Çocukluğunda araç sevgisini aşılayan dostu (Merhum - Trafik Kazası).'),
('Luciano', 'Arkadaş', 'Monterrey''den çocukluk arkadaşı. Acı haberi gecenin bir yarısı telefonda veren dostu.'),
('Mateo', 'Arkadaş', 'Monterrey''deki arkadaş grubundan. Sıkıntılı günlerinde her zaman destek oldu.');
--> statement-breakpoint
INSERT INTO "logs" ("date", "category", "title", "content") VALUES
('2026-03-01', 'Önemli Karar', 'Los Santos Garajında İlk Gece', 'Monterrey geride kaldı. Cebimdeki son birikmişle eski bir garaj alanı kiraladım. Los Santos büyük ve soğuk hissettiriyor ama pes etmeyeceğim.'),
('2026-03-04', 'Etkinlik Projesi', 'Çelik Mide Fikrinin Doğuşu', 'Sokakta tacoları satarken insanların ne kadar mesafeli olduğunu fark ettim. Herkesi eşit kılacak "Çelik Mide" acı yeme etkinliğini organize etme fikri kafama yattı.');
