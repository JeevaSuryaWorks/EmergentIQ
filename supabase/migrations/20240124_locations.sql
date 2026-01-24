-- Canonical Continents
CREATE TABLE IF NOT EXISTS continents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Canonical Countries
CREATE TABLE IF NOT EXISTS countries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    continent_id UUID REFERENCES continents(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    iso_code TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Canonical States/Regions
CREATE TABLE IF NOT EXISTS states_regions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_id UUID REFERENCES countries(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(country_id, name)
);

-- User Bookmarks (Virtual + Real)
CREATE TABLE IF NOT EXISTS user_saved_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    location_hash TEXT NOT NULL, -- The deterministic ID
    location_snapshot JSONB NOT NULL, -- Snapshot for fast display
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, location_hash)
);

-- Enable RLS
ALTER TABLE continents ENABLE ROW LEVEL SECURITY;
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE states_regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_saved_locations ENABLE ROW LEVEL SECURITY;

-- Select policies
CREATE POLICY "Public read access for continents" ON continents FOR SELECT USING (true);
CREATE POLICY "Public read access for countries" ON countries FOR SELECT USING (true);
CREATE POLICY "Public read access for states_regions" ON states_regions FOR SELECT USING (true);

-- User-specific policies for bookmarks
CREATE POLICY "Users can manage their own saved locations" ON user_saved_locations
    FOR ALL USING (auth.uid() = user_id);

-- Initial Seed Data
INSERT INTO continents (name) VALUES 
('North America'), ('Europe'), ('Asia'), ('Oceania'), ('South America'), ('Middle East'), ('Africa')
ON CONFLICT (name) DO NOTHING;

-- Seed Countries and States
DO $$
DECLARE
    cont_id UUID;
    count_id UUID;
BEGIN
    -- --- North America ---
    SELECT id INTO cont_id FROM continents WHERE name = 'North America';
    
    INSERT INTO countries (continent_id, name, iso_code) VALUES (cont_id, 'United States', 'US') ON CONFLICT (iso_code) DO NOTHING;
    SELECT id INTO count_id FROM countries WHERE iso_code = 'US';
    INSERT INTO states_regions (country_id, name) VALUES 
    (count_id, 'California'), (count_id, 'New York'), (count_id, 'Texas'), (count_id, 'Massachusetts'), (count_id, 'Illinois')
    ON CONFLICT DO NOTHING;

    INSERT INTO countries (continent_id, name, iso_code) VALUES (cont_id, 'Canada', 'CA') ON CONFLICT (iso_code) DO NOTHING;
    SELECT id INTO count_id FROM countries WHERE iso_code = 'CA';
    INSERT INTO states_regions (country_id, name) VALUES 
    (count_id, 'Ontario'), (count_id, 'British Columbia'), (count_id, 'Quebec')
    ON CONFLICT DO NOTHING;

    -- --- Europe ---
    SELECT id INTO cont_id FROM continents WHERE name = 'Europe';

    INSERT INTO countries (continent_id, name, iso_code) VALUES (cont_id, 'United Kingdom', 'GB') ON CONFLICT (iso_code) DO NOTHING;
    SELECT id INTO count_id FROM countries WHERE iso_code = 'GB';
    INSERT INTO states_regions (country_id, name) VALUES 
    (count_id, 'England'), (count_id, 'Scotland'), (count_id, 'Wales')
    ON CONFLICT DO NOTHING;

    INSERT INTO countries (continent_id, name, iso_code) VALUES (cont_id, 'Germany', 'DE') ON CONFLICT (iso_code) DO NOTHING;
    SELECT id INTO count_id FROM countries WHERE iso_code = 'DE';
    INSERT INTO states_regions (country_id, name) VALUES 
    (count_id, 'Bavaria'), (count_id, 'Berlin'), (count_id, 'Hesse')
    ON CONFLICT DO NOTHING;

    INSERT INTO countries (continent_id, name, iso_code) VALUES (cont_id, 'France', 'FR') ON CONFLICT (iso_code) DO NOTHING;
    SELECT id INTO count_id FROM countries WHERE iso_code = 'FR';
    INSERT INTO states_regions (country_id, name) VALUES 
    (count_id, 'Île-de-France'), (count_id, 'Auvergne-Rhône-Alpes')
    ON CONFLICT DO NOTHING;

    -- --- Asia ---
    SELECT id INTO cont_id FROM continents WHERE name = 'Asia';

    INSERT INTO countries (continent_id, name, iso_code) VALUES (cont_id, 'India', 'IN') ON CONFLICT (iso_code) DO NOTHING;
    SELECT id INTO count_id FROM countries WHERE iso_code = 'IN';
    INSERT INTO states_regions (country_id, name) VALUES 
    (count_id, 'Maharashtra'), (count_id, 'Karnataka'), (count_id, 'Delhi'), (count_id, 'Tamil Nadu'), (count_id, 'Telangana')
    ON CONFLICT DO NOTHING;

    INSERT INTO countries (continent_id, name, iso_code) VALUES (cont_id, 'Singapore', 'SG') ON CONFLICT (iso_code) DO NOTHING;
    SELECT id INTO count_id FROM countries WHERE iso_code = 'SG';
    INSERT INTO states_regions (country_id, name) VALUES (count_id, 'Central Region'), (count_id, 'West Region') ON CONFLICT DO NOTHING;

    INSERT INTO countries (continent_id, name, iso_code) VALUES (cont_id, 'Japan', 'JP') ON CONFLICT (iso_code) DO NOTHING;
    SELECT id INTO count_id FROM countries WHERE iso_code = 'JP';
    INSERT INTO states_regions (country_id, name) VALUES (count_id, 'Tokyo'), (count_id, 'Osaka') ON CONFLICT DO NOTHING;

    -- --- Oceania ---
    SELECT id INTO cont_id FROM continents WHERE name = 'Oceania';
    INSERT INTO countries (continent_id, name, iso_code) VALUES (cont_id, 'Australia', 'AU') ON CONFLICT (iso_code) DO NOTHING;
    SELECT id INTO count_id FROM countries WHERE iso_code = 'AU';
    INSERT INTO states_regions (country_id, name) VALUES (count_id, 'New South Wales'), (count_id, 'Victoria') ON CONFLICT DO NOTHING;

    -- --- Middle East ---
    SELECT id INTO cont_id FROM continents WHERE name = 'Middle East';
    INSERT INTO countries (continent_id, name, iso_code) VALUES (cont_id, 'United Arab Emirates', 'AE') ON CONFLICT (iso_code) DO NOTHING;
    SELECT id INTO count_id FROM countries WHERE iso_code = 'AE';
    INSERT INTO states_regions (country_id, name) VALUES (count_id, 'Dubai'), (count_id, 'Abu Dhabi') ON CONFLICT DO NOTHING;

END $$;
