-- Fix the permissive RLS policies
-- For feedback: require either authenticated user or allow anonymous but with rate limiting consideration
DROP POLICY IF EXISTS "Anyone can submit feedback" ON public.feedback;
CREATE POLICY "Authenticated users can submit feedback" ON public.feedback
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- For ai_response_cache: only allow system/service role to manage
DROP POLICY IF EXISTS "System can manage cache" ON public.ai_response_cache;
-- Cache should only be managed through edge functions using service role