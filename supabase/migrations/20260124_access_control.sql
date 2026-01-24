-- Create a simple key-value store for global app settings
CREATE TABLE public.app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Insert the default lock state (LOCKED by default)
INSERT INTO public.app_settings (key, value)
VALUES ('app_unlocked', 'false')
ON CONFLICT (key) DO NOTHING;

-- Enable RLS
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Policies

-- 1. Public Read (Everyone needs to know if the app is unlocked)
CREATE POLICY "Anyone can read app settings" ON public.app_settings
  FOR SELECT USING (true);

-- 2. Admin Write (Only admins can change the lock state)
CREATE POLICY "Admins can update app settings" ON public.app_settings
  FOR UPDATE USING (
    public.has_role(auth.uid(), 'admin')
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'admin')
  );

-- realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.app_settings;
