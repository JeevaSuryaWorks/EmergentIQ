-- Unlock the app_settings table for public updates (as requested)
-- First drop the old restrictive policy if it exists
DROP POLICY IF EXISTS "Admins can update app settings" ON public.app_settings;

-- Create a new permissive policy for public updates
CREATE POLICY "Anyone can update app settings" ON public.app_settings
  FOR UPDATE USING (true)
  WITH CHECK (true);
