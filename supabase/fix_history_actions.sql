-- MASTER HISTORY STABILIZATION
-- 1. Ensure the session_name column exists for AI and manual titles
ALTER TABLE public.chat_history ADD COLUMN IF NOT EXISTS session_name TEXT;

-- 2. Ensure RLS is enabled
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

-- 3. DROP old restrictive policies if they exist (to avoid duplicates)
DROP POLICY IF EXISTS "Users can view their own history" ON public.chat_history;
DROP POLICY IF EXISTS "Users can insert their own history" ON public.chat_history;
DROP POLICY IF EXISTS "Users can update their own history names" ON public.chat_history;
DROP POLICY IF EXISTS "Users can delete their own history" ON public.chat_history;

-- 4. CREATE fresh permissive policies for all CRUD operations
CREATE POLICY "Users can view their own history" 
ON public.chat_history FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own history" 
ON public.chat_history FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own history names" 
ON public.chat_history FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own history" 
ON public.chat_history FOR DELETE 
USING (auth.uid() = user_id);

-- 5. Add index for faster sidebar loading
CREATE INDEX IF NOT EXISTS idx_chat_history_user_session ON public.chat_history(user_id, session_id);
