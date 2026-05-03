-- Phase 2 - Database
-- 003_assessments_and_milestones.sql

-- 1. assessments table (Quiz Results)
CREATE TABLE IF NOT EXISTS public.assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    result_type TEXT NOT NULL CHECK (result_type IN ('fine', 'alert', 'warning')),
    summary TEXT,
    responses JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. child_profiles table (To store child details separate from parent)
CREATE TABLE IF NOT EXISTS public.child_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    age_months INTEGER NOT NULL,
    gender TEXT,
    medical_history TEXT,
    concerns TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. milestones table (Progress Tracking)
CREATE TABLE IF NOT EXISTS public.milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID NOT NULL REFERENCES public.child_profiles(id) ON DELETE CASCADE,
    category TEXT NOT NULL, -- 'cognitive', 'social', 'motor', 'language'
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'achieved')),
    achieved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Indexes
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON public.assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_child_profiles_parent_id ON public.child_profiles(parent_id);
CREATE INDEX IF NOT EXISTS idx_milestones_child_id ON public.milestones(child_id);

-- 5. Triggers
CREATE TRIGGER tr_child_profiles_updated_at BEFORE UPDATE ON public.child_profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER tr_milestones_updated_at BEFORE UPDATE ON public.milestones FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 6. RLS
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.child_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;

-- Assessments: Own only
CREATE POLICY assessments_own ON public.assessments FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Child Profiles: Own only
CREATE POLICY child_profiles_own ON public.child_profiles FOR ALL TO authenticated USING (auth.uid() = parent_id);

-- Milestones: Own only (via child_profile ownership)
CREATE POLICY milestones_own ON public.milestones FOR ALL TO authenticated USING (
    EXISTS (
        SELECT 1 FROM public.child_profiles
        WHERE public.child_profiles.id = public.milestones.child_id
        AND public.child_profiles.parent_id = auth.uid()
    )
);
