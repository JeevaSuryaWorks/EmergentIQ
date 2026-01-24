-- Comprehensive Global Data Seed
-- Continents are already seeded in 20240124_locations.sql

DO $$
DECLARE
    cont_id UUID;
    count_id UUID;
    cat_id UUID;
BEGIN
    -- --- 1. COUNTRIES & STATES (EXPANDED) ---

    -- North America
    SELECT id INTO cont_id FROM continents WHERE name = 'North America';
    
    -- Mexico
    INSERT INTO countries (continent_id, name, iso_code) VALUES (cont_id, 'Mexico', 'MX') ON CONFLICT (iso_code) DO NOTHING;
    SELECT id INTO count_id FROM countries WHERE iso_code = 'MX';
    INSERT INTO states_regions (country_id, name) VALUES (count_id, 'Mexico City'), (count_id, 'Jalisco'), (count_id, 'Nuevo León') ON CONFLICT DO NOTHING;

    -- Europe
    SELECT id INTO cont_id FROM continents WHERE name = 'Europe';
    
    -- Ireland
    INSERT INTO countries (continent_id, name, iso_code) VALUES (cont_id, 'Ireland', 'IE') ON CONFLICT (iso_code) DO NOTHING;
    SELECT id INTO count_id FROM countries WHERE iso_code = 'IE';
    INSERT INTO states_regions (country_id, name) VALUES (count_id, 'Dublin'), (count_id, 'Cork'), (count_id, 'Galway') ON CONFLICT DO NOTHING;

    -- Netherlands
    INSERT INTO countries (continent_id, name, iso_code) VALUES (cont_id, 'Netherlands', 'NL') ON CONFLICT (iso_code) DO NOTHING;
    SELECT id INTO count_id FROM countries WHERE iso_code = 'NL';
    INSERT INTO states_regions (country_id, name) VALUES (count_id, 'North Holland'), (count_id, 'South Holland'), (count_id, 'Utrecht') ON CONFLICT DO NOTHING;

    -- Switzerland
    INSERT INTO countries (continent_id, name, iso_code) VALUES (cont_id, 'Switzerland', 'CH') ON CONFLICT (iso_code) DO NOTHING;
    SELECT id INTO count_id FROM countries WHERE iso_code = 'CH';
    INSERT INTO states_regions (country_id, name) VALUES (count_id, 'Zurich'), (count_id, 'Geneva'), (count_id, 'Vaud') ON CONFLICT DO NOTHING;

    -- Italy
    INSERT INTO countries (continent_id, name, iso_code) VALUES (cont_id, 'Italy', 'IT') ON CONFLICT (iso_code) DO NOTHING;
    SELECT id INTO count_id FROM countries WHERE iso_code = 'IT';
    INSERT INTO states_regions (country_id, name) VALUES (count_id, 'Lombardy'), (count_id, 'Lazio'), (count_id, 'Tuscany') ON CONFLICT DO NOTHING;

    -- Asia
    SELECT id INTO cont_id FROM continents WHERE name = 'Asia';
    
    -- South Korea
    INSERT INTO countries (continent_id, name, iso_code) VALUES (cont_id, 'South Korea', 'KR') ON CONFLICT (iso_code) DO NOTHING;
    SELECT id INTO count_id FROM countries WHERE iso_code = 'KR';
    INSERT INTO states_regions (country_id, name) VALUES (count_id, 'Seoul'), (count_id, 'Busan'), (count_id, 'Gyeonggi') ON CONFLICT DO NOTHING;

    -- China
    INSERT INTO countries (continent_id, name, iso_code) VALUES (cont_id, 'China', 'CN') ON CONFLICT (iso_code) DO NOTHING;
    SELECT id INTO count_id FROM countries WHERE iso_code = 'CN';
    INSERT INTO states_regions (country_id, name) VALUES (count_id, 'Beijing'), (count_id, 'Shanghai'), (count_id, 'Guangdong') ON CONFLICT DO NOTHING;

    -- Oceania
    SELECT id INTO cont_id FROM continents WHERE name = 'Oceania';
    
    -- New Zealand
    INSERT INTO countries (continent_id, name, iso_code) VALUES (cont_id, 'New Zealand', 'NZ') ON CONFLICT (iso_code) DO NOTHING;
    SELECT id INTO count_id FROM countries WHERE iso_code = 'NZ';
    INSERT INTO states_regions (country_id, name) VALUES (count_id, 'Auckland'), (count_id, 'Wellington'), (count_id, 'Canterbury') ON CONFLICT DO NOTHING;

    -- --- 2. ACADEMIC INTERESTS (EXPANDED) ---

    -- STEM
    SELECT id INTO cat_id FROM academic_categories WHERE name = 'STEM';
    INSERT INTO academic_interests (category_id, name) VALUES 
    (cat_id, 'Artificial Intelligence'), (cat_id, 'Data Science'), (cat_id, 'Quantum Computing'),
    (cat_id, 'Cybersecurity'), (cat_id, 'Robotics & Automation'), (cat_id, 'Bioinformatics'),
    (cat_id, 'Aerospace Engineering'), (cat_id, 'Renewable Energy'), (cat_id, 'Mechanical Engineering'),
    (cat_id, 'Civil Engineering'), (cat_id, 'Software Development'), (cat_id, 'Machine Learning'),
    (cat_id, 'Physics'), (cat_id, 'Chemistry'), (cat_id, 'Mathematics')
    ON CONFLICT DO NOTHING;

    -- Medicine & Health
    SELECT id INTO cat_id FROM academic_categories WHERE name = 'Medicine & Health';
    INSERT INTO academic_interests (category_id, name) VALUES 
    (cat_id, 'Genetics'), (cat_id, 'Neuroscience'), (cat_id, 'Public Health'),
    (cat_id, 'Nursing'), (cat_id, 'Dentistry'), (cat_id, 'Pharmacy'),
    (cat_id, 'Biomedical Science'), (cat_id, 'Epidemiology'), (cat_id, 'Psychology'),
    (cat_id, 'Sports Medicine'), (cat_id, 'Veterinary Science')
    ON CONFLICT DO NOTHING;

    -- Business & Law
    SELECT id INTO cat_id FROM academic_categories WHERE name = 'Business & Law';
    INSERT INTO academic_interests (category_id, name) VALUES 
    (cat_id, 'International Relations'), (cat_id, 'Corporate Law'), (cat_id, 'Entrepreneurship'),
    (cat_id, 'Finance & Investment'), (cat_id, 'Marketing Analytics'), (cat_id, 'Supply Chain Management'),
    (cat_id, 'Human Resource Management'), (cat_id, 'Digital Business'), (cat_id, 'Economics'),
    (cat_id, 'Actuarial Science'), (cat_id, 'Hospitality Management')
    ON CONFLICT DO NOTHING;

    -- Arts & Humanities
    SELECT id INTO cat_id FROM academic_categories WHERE name = 'Arts & Humanities';
    INSERT INTO academic_interests (category_id, name) VALUES 
    (cat_id, 'Digital Media & Film'), (cat_id, 'History of Art'), (cat_id, 'English Literature'),
    (cat_id, 'Philosophy'), (cat_id, 'Graphic Design'), (cat_id, 'Architecture'),
    (cat_id, 'Music Production'), (cat_id, 'Fine Arts'), (cat_id, 'Linguistics'),
    (cat_id, 'Journalism & Mass Comm')
    ON CONFLICT DO NOTHING;

    -- Social Sciences
    SELECT id INTO cat_id FROM academic_categories WHERE name = 'Social Sciences';
    INSERT INTO academic_interests (category_id, name) VALUES 
    (cat_id, 'Sociology'), (cat_id, 'Political Science'), (cat_id, 'Anthropology'),
    (cat_id, 'Criminology'), (cat_id, 'Climate Change Policy'), (cat_id, 'Urban Planning'),
    (cat_id, 'International Development'), (cat_id, 'Education & Pedagogy')
    ON CONFLICT DO NOTHING;

END $$;
