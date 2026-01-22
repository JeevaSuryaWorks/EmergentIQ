-- Create college_rankings table
CREATE TABLE IF NOT EXISTS public.college_rankings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    ranking_body TEXT NOT NULL,
    rank_position INTEGER,
    year INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create college_fees table
CREATE TABLE IF NOT EXISTS public.college_fees (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    fee_type TEXT NOT NULL,
    amount NUMERIC,
    currency TEXT DEFAULT 'INR',
    per_period TEXT DEFAULT 'year',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.college_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.college_fees ENABLE ROW LEVEL SECURITY;

-- Create Policies (Allow Public Read)
CREATE POLICY "Allow public read access on rankings"
ON public.college_rankings FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow public read access on fees"
ON public.college_fees FOR SELECT TO anon, authenticated USING (true);

-- Create Policies (Allow Service Role to Insert/Update)
CREATE POLICY "Allow service role full access on rankings"
ON public.college_rankings FOR ALL TO service_role USING (true);

CREATE POLICY "Allow service role full access on fees"
ON public.college_fees FOR ALL TO service_role USING (true);

-- Notify schema reload
NOTIFY pgrst, 'reload schema';
