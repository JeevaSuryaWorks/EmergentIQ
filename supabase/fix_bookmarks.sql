-- 1. Ensure the bookmarks table has a unique constraint to prevent duplicates
ALTER TABLE public.bookmarks DROP CONSTRAINT IF EXISTS bookmarks_user_id_college_id_key;
ALTER TABLE public.bookmarks ADD CONSTRAINT bookmarks_user_id_college_id_key UNIQUE (user_id, college_id);

-- 2. Seed some real college data to ensure the AI has verified IDs to work with
-- This will prevent Foreign Key violations because the IDs will now exist in the database
INSERT INTO public.colleges (id, name, country, state, city, type, website, description)
VALUES 
  ('e1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1', 'Massachusetts Institute of Technology', 'USA', 'MA', 'Cambridge', 'private', 'https://mit.edu', 'A world-leading research university.'),
  ('e2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 'Stanford University', 'USA', 'CA', 'Stanford', 'private', 'https://stanford.edu', 'Known for its entrepreneurial spirit.'),
  ('e3b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b3b3', 'Harvard University', 'USA', 'MA', 'Cambridge', 'private', 'https://harvard.edu', 'The oldest institution of higher learning in the US.'),
  ('e4b4b4b4-b4b4-b4b4-b4b4-b4b4b4b4b4b4', 'University of Oxford', 'UK', null, 'Oxford', 'public', 'https://ox.ac.uk', 'The oldest university in the English-speaking world.'),
  ('e5b5b5b5-b5b5-b5b5-b5b5-b5b5b5b5b5b5', 'University of Cambridge', 'UK', null, 'Cambridge', 'public', 'https://cam.ac.uk', 'A world-class research university.')
ON CONFLICT (id) DO NOTHING;

-- 3. Seed some dummy rankings to make the comparison tool work
INSERT INTO public.rankings (college_id, ranking_body, rank_position, year)
VALUES 
  ('e1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1', 'QS World', 1, 2025),
  ('e2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 'QS World', 2, 2025),
  ('e3b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b3b3', 'QS World', 3, 2025),
  ('e4b4b4b4-b4b4-b4b4-b4b4-b4b4b4b4b4b4', 'QS World', 4, 2025),
  ('e5b5b5b5-b5b5-b5b5-b5b5-b5b5b5b5b5b5', 'QS World', 5, 2025)
ON CONFLICT DO NOTHING;
