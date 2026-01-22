-- MASTER SEED FOR UNIVERSITIES
-- Run this in your Supabase SQL Editor to ensure Emily always has valid data.

-- 1. Insert Top Universities (Global)
INSERT INTO public.colleges (id, name, country, city, type, website, description)
VALUES 
  ('1b1b1b1b-1b1b-1b1b-1b1b-1b1b1b1b1b11', 'Massachusetts Institute of Technology', 'USA', 'Cambridge', 'private', 'https://mit.edu', 'Top STEM institution.'),
  ('2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b22', 'Stanford University', 'USA', 'Stanford', 'private', 'https://stanford.edu', 'Entrepreneurship leader.'),
  ('3b3b3b3b-3b3b-3b3b-3b3b-3b3b3b3b3b33', 'Harvard University', 'USA', 'Cambridge', 'private', 'https://harvard.edu', 'Historic Ivy League.'),
  ('4b4b4b4b-4b4b-4b4b-4b4b-4b4b4b4b4b44', 'University of Oxford', 'UK', 'Oxford', 'public', 'https://ox.ac.uk', 'Oldest English university.'),
  ('5b5b5b5b-5b5b-5b5b-5b5b-5b5b5b5b5b55', 'University of Cambridge', 'UK', 'Cambridge', 'public', 'https://cam.ac.uk', 'World-leading research.'),
  ('6b6b6b6b-6b6b-6b6b-6b6b-6b6b6b6b6b66', 'ETH Zurich', 'Switzerland', 'Zurich', 'public', 'https://ethz.ch', 'Europe top engineering.'),
  ('7b7b7b7b-7b7b-7b7b-7b7b-7b7b7b7b7b77', 'Imperial College London', 'UK', 'London', 'public', 'https://imperial.ac.uk', 'Science and Medicine focus.'),
  ('8b8b8b8b-8b8b-8b8b-8b8b-8b8b8b8b8b88', 'University College London', 'UK', 'London', 'public', 'https://ucl.ac.uk', 'London top multi-faculty.'),
  ('9b9b9b9b-9b9b-9b9b-9b9b-9b9b9b9b9b99', 'National University of Singapore', 'Singapore', 'Singapore', 'public', 'https://nus.edu.sg', 'Asia Top University.'),
  ('0b0b0b0b-0b0b-0b0b-0b0b-0b0b0b0b0b00', 'University of California, Berkeley', 'USA', 'Berkeley', 'public', 'https://berkeley.edu', 'Top public university.'),
  ('1a1a1a1a-1a1a-1a1a-1a1a-1a1a1a1a1a11', 'California Institute of Technology', 'USA', 'Pasadena', 'private', 'https://caltech.edu', 'Premier research in science.'),
  ('2a2a2a2a-2a2a-2a2a-2a2a-2a2a2a2a2a22', 'University of Chicago', 'USA', 'Chicago', 'private', 'https://uchicago.edu', 'Known for critical thinking.'),
  ('3a3a3a3a-3a3a-3a3a-3a3a-3a3a3a3a3a33', 'Princeton University', 'USA', 'Princeton', 'private', 'https://princeton.edu', 'Undergraduate focused Ivy.'),
  ('4a4a4a4a-4a4a-4a4a-4a4a-4a4a4a4a4a44', 'Yale University', 'USA', 'New Haven', 'private', 'https://yale.edu', 'Global law and arts leader.'),
  ('5a5a5a5a-5a5a-5a5a-5a5a-5a5a5a5a5a55', 'Cornell University', 'USA', 'Ithaca', 'private', 'https://cornell.edu', 'Diverse Ivy research.'),
  ('6a6a6a6a-6a6a-6a6a-6a6a-6a6a6a6a6a66', 'Johns Hopkins University', 'USA', 'Baltimore', 'private', 'https://jhu.edu', 'Medicine and research.'),
  ('7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a77', 'University of Pennsylvania', 'USA', 'Philadelphia', 'private', 'https://upenn.edu', 'Wharton and practical Ivy.'),
  ('8a8a8a8a-8a8a-8a8a-8a8a-8a8a-8a8a8a88', 'Tsinghua University', 'China', 'Beijing', 'public', 'https://tsinghua.edu.cn', 'China Top STEM.'),
  ('9a9a9a9a-9a9a-9a9a-9a9a-9a9a1a1a1a99', 'Peking University', 'China', 'Beijing', 'public', 'https://pku.edu.cn', 'Historic Chinese leader.'),
  ('0a0a0a0a-0a0a-0a0a-0a0a-0a0a0a0a0a00', 'University of Toronto', 'Canada', 'Toronto', 'public', 'https://utoronto.ca', 'Canada Top University.')
ON CONFLICT (id) DO NOTHING;

-- 2. Clean up any invalid benchmarks that might have been created
-- Note: Foreign keys should have prevented this, but good for stability.
DELETE FROM public.bookmarks WHERE college_id NOT IN (SELECT id FROM public.colleges);

-- 3. Confirm constraints
ALTER TABLE public.bookmarks DROP CONSTRAINT IF EXISTS bookmarks_user_id_college_id_key;
ALTER TABLE public.bookmarks ADD CONSTRAINT bookmarks_user_id_college_id_key UNIQUE (user_id, college_id);
