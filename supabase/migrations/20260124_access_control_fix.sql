-- Fix RLS: Upsert requires INSERT permission even if updating
-- Drop previous narrow policies
DROP POLICY IF EXISTS "Anyone can update app settings" ON public.app_settings;
DROP POLICY IF EXISTS "Admins can update app settings" ON public.app_settings;

-- Create a truly permissive policy for ALL operations (Insert, Update, Delete)
CREATE POLICY "Anyone can modify app settings" ON public.app_settings
  FOR ALL 
  USING (true)
  WITH CHECK (true);
