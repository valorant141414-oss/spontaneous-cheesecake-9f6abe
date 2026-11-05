-- Move the four original (previously hard-coded) story stages into the database so they can be edited.
-- Early created_at values keep them first in the timeline.
INSERT INTO "story_stages" ("period", "title", "content", "color", "created_at") VALUES
('2000 - 2017 // İLK YILLAR & GENÇLİK', 'Sumidero Kasabası ve Monterrey Lise Yılları', 'Daniel Brown 06/03/2000 tarihinde Meksika''nın Monterrey şehrinde dünyaya geldi. Çocukluğunun ilk yıllarını ve ilkokul/ortaokul eğitimini Sumidero kasabasında tamamladı. Lise eğitimi için Monterrey şehrine geçti.

Lise yıllarında içine kapanık, az arkadaşı olan bir gençti. Vaktinin çoğunu spor ve yüzmeyle geçiriyordu. Zamanla lisede Javier, Luciano ve Mateo isimli 3 sıkı dost edindi. Javier’in eski arabasıyla Meksika sokaklarında turlarken araç mekaniklerine ve sürüşe karşı ilgisini keşfetti.', 'cyan', '2000-01-01 00:00:00'),
('TRAVMATİK DÖNÜM NOKTASI', 'Gece Gelen Acı Telefon ve Javier’in Kaybı', 'Gelecek hayalleri kurduğu, üniversiteye hazırlandığı dönemde ailesinin kısıtlı maddi durumu araba almasına imkan tanımıyordu. Tam hayatını düzene koymaya çalışırken bir gece geç saatte telefonu çaldı.

Arayan arkadaşı Luciano''ydu. Ağlayarak en yakın dostları Javier''in ailesiyle birlikte korkunç bir trafik kazasında hayatını kaybettiği haberini verdi. Bu gece gelen acı telefon haberi, Daniel''ın ruhunda derin izler bıraktı ve hayat boyu sürecek telefon çınlaması travmasını başlattı.', 'crimson', '2000-01-01 00:00:01'),
('MADDİ DÖNÜŞÜM & İLK BAŞARI', 'Eski Evi Yenileme ve İlk Arabasını Alma', 'Kaybın ardından ayakta kalmak zorunda olan Daniel, bir işe girerek sıkı şekilde para biriktirmeye başladı. Biriktirdiği sermayeyle Monterrey''de oldukça eski ve yıpranmış bir ev satın aldı.

Kendi el emeği, uykusuz geceleri ve tadilat yeteneğiyle evi tepeden tırnağa yeniledi. Kısa süre sonra bu evi Amerikalı bir aileye aldığı fiyatın tam 2 katına satmayı başardı. Kazandığı bu parayla çocukluk hayali olan ilk arabasını alabildi.', 'amber', '2000-01-01 00:00:02'),
('YENİ BİR BAŞLANGIÇ', 'Los Santos’a Tek Başına Taşınma', 'Zamanla Monterrey şehri anıları ve sınırlarıyla Daniel''a dar gelmeye başladı. Artık yeni bir çevrede, hiç kimseyi tanımadığı bir metropolde sıfırdan başlama kararı aldı.

Bin bir emekle aldığı arabasını satıp tüm sermayesini yanına alarak Los Santos şehrine doğru yola çıktı. Şimdi Los Santos''ta legal yollardan tutunmaya ve bagaj lezzetleriyle insanlara dokunmaya hazır.', 'neonGreen', '2000-01-01 00:00:03');
