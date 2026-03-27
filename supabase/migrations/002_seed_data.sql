-- Migration: 002_seed_data
-- Description: Seed initial source data for Defo

-- ============================================
-- INDUSTRY NEWS SOURCES (19)
-- ============================================
INSERT INTO sources (name, slug, type, url, logo_url, is_active) VALUES
-- Design Industry News
('Designboom', 'designboom', 'news', 'https://www.designboom.com', 'https://cdn.defo.com/logos/designboom.png', true),
('Dezeen', 'dezeen', 'news', 'https://www.dezeen.com', 'https://cdn.defo.com/logos/dezeen.png', true),
('Design Week', 'design-week', 'news', 'https://www.designweek.co.uk', 'https://cdn.defo.com/logos/designweek.png', true),
('Fast Company Design', 'fast-company-design', 'news', 'https://www.fastcompany.com/section/design', 'https://cdn.defo.com/logos/fastcompany.png', true),
('Creative Bloq', 'creative-bloq', 'news', 'https://www.creativebloq.com', 'https://cdn.defo.com/logos/creativebloq.png', true),
('Dexigner', 'dexigner', 'news', 'https://dexigner.com', 'https://cdn.defo.com/logos/dexigner.png', true),
('Communication Arts', 'communication-arts', 'news', 'https://www.commarts.com', 'https://cdn.defo.com/logos/commarts.png', true),
('AIGA Eye on Design', 'aiga-eye-on-design', 'news', 'https://eyeondesign.aiga.org', 'https://cdn.defo.com/logos/aiga.png', true),
('Design News', 'design-news', 'news', 'https://www.designnews.com', 'https://cdn.defo.com/logos/designnews.png', true),
('Slanted', 'slanted', 'news', 'https://slanted.de', 'https://cdn.defo.com/logos/slanted.png', true),
('Graphic Design USA', 'graphic-design-usa', 'news', 'https://www.gdusa.com', 'https://cdn.defo.com/logos/gdusa.png', true),
('urdesignmag', 'urdesignmag', 'news', 'https://urdesignmag.com', 'https://cdn.defo.com/logos/urdesignmag.png', true),
('Daily Design News', 'daily-design-news', 'news', 'https://dailydesignnews.com', 'https://cdn.defo.com/logos/dailydesignnews.png', true),
('Yanko Design', 'yanko-design', 'news', 'https://www.yankodesign.com', 'https://cdn.defo.com/logos/yanko.png', true),
('Design World', 'design-world', 'news', 'https://www.designworldonline.com', 'https://cdn.defo.com/logos/designworld.png', true),
('Control Design', 'control-design', 'news', 'https://www.controldesign.com', 'https://cdn.defo.com/logos/controldesign.png', true),
('Car Body Design', 'car-body-design', 'news', 'https://www.carbodydesign.com', 'https://cdn.defo.com/logos/carbodydesign.png', true),
('Web Designer Depot', 'web-designer-depot', 'news', 'https://www.webdesignerdepot.com', 'https://cdn.defo.com/logos/webdesignerdepot.png', true),
('Society for News Design', 'society-news-design', 'news', 'https://www.snd.org', 'https://cdn.defo.com/logos/snd.png', true),
('World Architecture News', 'world-architecture-news', 'news', 'https://www.worldarchitecturenews.com', 'https://cdn.defo.com/logos/wan.png', true);

-- ============================================
-- ACADEMIC PAPER SOURCES (5)
-- ============================================
INSERT INTO sources (name, slug, type, url, logo_url, is_active) VALUES
-- Academic Paper Sources
('Google Scholar', 'google-scholar', 'paper', 'https://scholar.google.com', 'https://cdn.defo.com/logos/googlescholar.png', true),
('ACM Digital Library', 'acm-digital-library', 'paper', 'https://dl.acm.org', 'https://cdn.defo.com/logos/acm.png', true),
('ScienceDirect', 'sciencedirect', 'paper', 'https://www.sciencedirect.com', 'https://cdn.defo.com/logos/sciencedirect.png', true),
('CORE', 'core', 'paper', 'https://core.ac.uk', 'https://cdn.defo.com/logos/core.png', true),
('DOAJ', 'doaj', 'paper', 'https://www.doaj.org', 'https://cdn.defo.com/logos/doaj.png', true);

-- ============================================
-- DESIGN COMPETITION SOURCES (40+)
-- ============================================
INSERT INTO sources (name, slug, type, url, logo_url, is_active) VALUES
-- International Design Awards
('A'' Design Award', 'a-design-award', 'competition', 'https://competition.adesignaward.com', 'https://cdn.defo.com/logos/adesign.png', true),
('International Design Awards', 'international-design-awards', 'competition', 'https://www.idae.it', 'https://cdn.defo.com/logos/ida.png', true),
('DNA Paris Design Awards', 'dna-paris', 'competition', 'https://dnapatents.com', 'https://cdn.defo.com/logos/dna.png', true),
('London Design Awards', 'london-design-awards', 'competition', 'https://www.londondesignawards.com', 'https://cdn.defo.com/logos/londondesign.png', true),
('MUSE Design Awards', 'muse-design-awards', 'competition', 'https://muse.design', 'https://cdn.defo.com/logos/muse.png', true),
('Creative Communication Award', 'creative-communication-award', 'competition', 'https://www.creativecommaward.com', 'https://cdn.defo.com/logos/cca.png', true),
('Indigo Design Award', 'indigo-design-award', 'competition', 'https://indigodesignaward.com', 'https://cdn.defo.com/logos/indigo.png', true),
('German Design Award', 'german-design-award', 'competition', 'https://www.german-design-award.com', 'https://cdn.defo.com/logos/german.png', true),
('Spark Design Awards', 'spark-design-awards', 'competition', 'https://sparkawards.com', 'https://cdn.defo.com/logos/spark.png', true),
('Core77 Design Awards', 'core77-design-awards', 'competition', 'https://designawards.core77.com', 'https://cdn.defo.com/logos/core77.png', true),
('Dezeen Awards', 'dezeen-awards', 'competition', 'https://www.dezeenawards.com', 'https://cdn.defo.com/logos/dezeenawards.png', true),
('Frame Awards', 'frame-awards', 'competition', 'https://frameawards.com', 'https://cdn.defo.com/logos/frame.png', true),
('Architizer A+ Awards', 'architizer-a-awards', 'competition', 'https://architizer.com/awards', 'https://cdn.defo.com/logos/architizer.png', true),
('World Design Awards', 'world-design-awards', 'competition', 'https://worlddesignawards.com', 'https://cdn.defo.com/logos/worlddesign.png', true),
('SIT Furniture Design Award', 'sit-furniture-design-award', 'competition', 'https://sitawards.com', 'https://cdn.defo.com/logos/sit.png', true),
('Adobe Design Achievement Awards', 'adobe-design-achievement-awards', 'competition', 'https://www.adobeaawards.com', 'https://cdn.defo.com/logos/adobe.png', true),
('D&AD New Blood', 'dad-new-blood', 'competition', 'https://www.dandad.org/new-blood', 'https://cdn.defo.com/logos/dad.png', true),
('Young Ones ADC', 'young-ones-adc', 'competition', 'https://youngones.art Directorsclub.com', 'https://cdn.defo.com/logos/youngones.png', true),
('Red Dot Junior Prize', 'red-dot-junior-prize', 'competition', 'https://www.red-dot.org/junior', 'https://cdn.defo.com/logos/reddot.png', true),
('iF Student Design Award', 'if-student-design-award', 'competition', 'https://if-student-design-award.com', 'https://cdn.defo.com/logos/ifdesign.png', true),
('James Dyson Award', 'james-dyson-award', 'competition', 'https://www.jamesdysonaward.org', 'https://cdn.defo.com/logos/dyson.png', true),
('BraunPrize', 'braunprize', 'competition', 'https://www.braunprize.com', 'https://cdn.defo.com/logos/braun.png', true),
('Michelin Design Challenge', 'michelin-design-challenge', 'competition', 'https://michelin.design', 'https://cdn.defo.com/logos/michelin.png', true),
('H&M Design Award', 'hm-design-award', 'competition', 'https://hm.com/designaward', 'https://cdn.defo.com/logos/hm.png', true),
('Swarovski Design Award', 'swarovski-design-award', 'competition', 'https://www.swarovski.com/designaward', 'https://cdn.defo.com/logos/swarovski.png', true),
('Electrolux Design Lab', 'electrolux-design-lab', 'competition', 'https://electroluxdesignlab.com', 'https://cdn.defo.com/logos/electrolux.png', true),
('Sony Design Vision', 'sony-design-vision', 'competition', 'https://sony.com/designvision', 'https://cdn.defo.com/logos/sony.png', true),
('Samsung Design Competition', 'samsung-design-competition', 'competition', 'https://samsung.com/designcomp', 'https://cdn.defo.com/logos/samsung.png', true),
('Huawei Themes Design Contest', 'huawei-themes-design-contest', 'competition', 'https://huawei.com/themes', 'https://cdn.defo.com/logos/huawei.png', true),
('Graphis Awards', 'graphis-awards', 'competition', 'https://graphis.com/awards', 'https://cdn.defo.com/logos/graphis.png', true),
('Communication Arts Awards', 'communication-arts-awards', 'competition', 'https://www.commarts.com/awards', 'https://cdn.defo.com/logos/caawards.png', true),
('Tokyo TDC', 'tokyo-tdc', 'competition', 'https://tdc.org', 'https://cdn.defo.com/logos/tokyotdc.png', true),
('NY TDC', 'ny-tdc', 'competition', 'https://nytdc.org', 'https://cdn.defo.com/logos/nytdc.png', true),
('LA TDC', 'la-tdc', 'competition', 'https://latdc.org', 'https://cdn.defo.com/logos/latdc.png', true),
('Brand New Awards', 'brand-new-awards', 'competition', 'https://brandnewawards.com', 'https://cdn.defo.com/logos/brandnew.png', true),
('Pentawards', 'pentawards', 'competition', 'https://pentawards.com', 'https://cdn.defo.com/logos/pentawards.png', true),
('Dieline Awards', 'dieline-awards', 'competition', 'https://www.thedieline.com/awards', 'https://cdn.defo.com/logos/dieline.png', true),
('Indigo Branding Awards', 'indigo-branding-awards', 'competition', 'https://indigobranding.com', 'https://cdn.defo.com/logos/indigobranding.png', true),
('Transform Awards', 'transform-awards', 'competition', 'https://transformmagazine.net/awards', 'https://cdn.defo.com/logos/transform.png', true),
-- Chinese Design Competition
('方正字体设计大赛', 'fangzheng-type-design', 'competition', 'https://www.foundertype.com', 'https://cdn.defo.com/logos/foundertype.png', true);

-- ============================================
-- VERIFICATION QUERY
-- ============================================
-- SELECT type, COUNT(*) as count FROM sources GROUP BY type ORDER BY type;
