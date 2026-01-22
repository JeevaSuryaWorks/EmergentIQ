-- Add session_name column to chat_history to allow custom naming
ALTER TABLE public.chat_history ADD COLUMN IF NOT EXISTS session_name TEXT;

-- Index it for performance
CREATE INDEX IF NOT EXISTS idx_chat_history_session_name ON public.chat_history(session_name);
