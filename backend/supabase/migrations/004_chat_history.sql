-- 004_chat_history.sql
-- Create table for database-persisted chat history

CREATE TABLE IF NOT EXISTS public.chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_type TEXT NOT NULL CHECK (user_type IN ('child', 'parent')),
    age_tier TEXT CHECK (age_tier IN ('early', 'middle', 'tween')),
    history JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON public.chat_sessions(user_id);

-- Triggers
CREATE TRIGGER tr_chat_sessions_updated_at BEFORE UPDATE ON public.chat_sessions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Enable RLS
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

-- Policies: Own chat sessions only
CREATE POLICY chat_sessions_own ON public.chat_sessions FOR ALL TO authenticated USING (auth.uid() = user_id);
