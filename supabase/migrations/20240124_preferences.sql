-- Canonical Tables (Read-only for users)
CREATE TABLE IF NOT EXISTS academic_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS academic_interests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES academic_categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(category_id, name)
);

CREATE TABLE IF NOT EXISTS degree_levels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS study_modes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label TEXT UNIQUE NOT NULL,
    value TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS budget_ranges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label TEXT UNIQUE NOT NULL,
    min_value INTEGER NOT NULL,
    max_value INTEGER NOT NULL,
    currency TEXT DEFAULT 'INR',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- User Preferences (1:1 with User)
-- user_id is the PRIMARY KEY ensuring 1:1
CREATE TABLE IF NOT EXISTS user_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    budget_range_id UUID REFERENCES budget_ranges(id) ON DELETE SET NULL,
    language_preference TEXT DEFAULT 'English',
    onboarding_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Junction Tables (Many-to-Many via IDs)
CREATE TABLE IF NOT EXISTS user_academic_interests (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    interest_id UUID REFERENCES academic_interests(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (user_id, interest_id)
);

CREATE TABLE IF NOT EXISTS user_degree_levels (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    degree_level_id UUID REFERENCES degree_levels(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (user_id, degree_level_id)
);

CREATE TABLE IF NOT EXISTS user_study_modes (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    study_mode_id UUID REFERENCES study_modes(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (user_id, study_mode_id)
);

-- Enable RLS
ALTER TABLE academic_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE degree_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_modes ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_ranges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_academic_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_degree_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_study_modes ENABLE ROW LEVEL SECURITY;

-- Select policies
CREATE POLICY "Public read academic_categories" ON academic_categories FOR SELECT USING (true);
CREATE POLICY "Public read academic_interests" ON academic_interests FOR SELECT USING (true);
CREATE POLICY "Public read degree_levels" ON degree_levels FOR SELECT USING (true);
CREATE POLICY "Public read study_modes" ON study_modes FOR SELECT USING (true);
CREATE POLICY "Public read budget_ranges" ON budget_ranges FOR SELECT USING (true);

-- User policies
CREATE POLICY "Users manage own preferences" ON user_preferences FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own interests" ON user_academic_interests FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own degrees" ON user_degree_levels FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own modes" ON user_study_modes FOR ALL USING (auth.uid() = user_id);

-- Initial Seeding
INSERT INTO academic_categories (name) VALUES 
('STEM'), ('Medicine & Health'), ('Business & Law'), ('Arts & Humanities'), ('Social Sciences')
ON CONFLICT (name) DO NOTHING;

INSERT INTO degree_levels (label) VALUES 
('Bachelor''s'), ('Master''s'), ('PhD'), ('Doctorate'), ('Diploma'), ('Certificate')
ON CONFLICT (label) DO NOTHING;

INSERT INTO study_modes (label, value) VALUES 
('On-campus (Full-time)', 'on-campus'), 
('Online (Full-time)', 'online'), 
('Hybrid', 'hybrid')
ON CONFLICT (label) DO NOTHING;

INSERT INTO budget_ranges (label, min_value, max_value) VALUES 
('₹0 - ₹15L', 0, 1500000),
('₹15L - ₹30L', 1500000, 3000000),
('₹30L - ₹60L', 3000000, 6000000),
('₹60L+', 6000000, 20000000)
ON CONFLICT (label) DO NOTHING;
