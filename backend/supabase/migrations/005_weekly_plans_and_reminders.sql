-- 005_weekly_plans_and_reminders.sql
-- Create tables for database-persisted weekly plans and reminders

CREATE TABLE IF NOT EXISTS public.weekly_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    child_id UUID REFERENCES public.child_profiles(id) ON DELETE CASCADE,
    age_group TEXT NOT NULL,
    minutes INTEGER NOT NULL,
    concerns JSONB NOT NULL DEFAULT '[]',
    activities JSONB NOT NULL DEFAULT '[]',
    feedback JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    time TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_weekly_plans_user_id ON public.weekly_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON public.reminders(user_id);

-- Triggers
CREATE TRIGGER tr_weekly_plans_updated_at BEFORE UPDATE ON public.weekly_plans FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER tr_reminders_updated_at BEFORE UPDATE ON public.reminders FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Enable RLS
ALTER TABLE public.weekly_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

-- Policies: Own only
CREATE POLICY weekly_plans_own ON public.weekly_plans FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY reminders_own ON public.reminders FOR ALL TO authenticated USING (auth.uid() = user_id);
