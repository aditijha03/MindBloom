-- Phase 2 - Database
-- P-05 - Row Level Security Policies

-- 1. Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 2. public.profiles policies
-- SELECT: Everyone (anon + authenticated) can read all profiles
CREATE POLICY profiles_select_all ON public.profiles FOR SELECT USING (true);
-- UPDATE: Authenticated users can only update their own row
CREATE POLICY profiles_update_own ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
-- DELETE: Authenticated users can only delete their own row
CREATE POLICY profiles_delete_own ON public.profiles FOR DELETE TO authenticated USING (auth.uid() = id);
-- INSERT: Disallow direct insert (handled via trigger only) - No policy needed as default is deny.

-- 3. public.posts policies
-- SELECT (public): status = published AND deleted_at IS NULL
CREATE POLICY posts_select_published ON public.posts FOR SELECT USING (status = 'published' AND deleted_at IS NULL);
-- SELECT (own drafts): auth.uid() = author_id
CREATE POLICY posts_select_own ON public.posts FOR SELECT TO authenticated USING (auth.uid() = author_id);
-- INSERT: Authenticated users can insert their own posts
CREATE POLICY posts_insert_own ON public.posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
-- UPDATE: Authenticated users can update their own posts
CREATE POLICY posts_update_own ON public.posts FOR UPDATE TO authenticated USING (auth.uid() = author_id);
-- DELETE: Authenticated users can delete their own posts (soft delete or hard delete allowed by policy, but service uses soft)
CREATE POLICY posts_delete_own ON public.posts FOR DELETE TO authenticated USING (auth.uid() = author_id);

-- 4. public.comments policies
-- SELECT: Everyone can read non-deleted comments
CREATE POLICY comments_select_all ON public.comments FOR SELECT USING (deleted_at IS NULL);
-- INSERT: Authenticated users can comment
CREATE POLICY comments_insert_own ON public.comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
-- DELETE: Authenticated users can delete their own comments
CREATE POLICY comments_delete_own ON public.comments FOR DELETE TO authenticated USING (auth.uid() = author_id);

-- 5. public.audit_logs policies
-- NO policies for authenticated or anon roles.
-- Only the service_role (used by Express server) can access audit_logs.
-- service_role bypasses RLS by default in Supabase.
COMMENT ON TABLE public.audit_logs IS 'Audit logs are restricted to the service_role and are not accessible via client-side keys.';
