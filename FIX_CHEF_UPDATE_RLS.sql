-- ============================================================================
-- FIX: Chef Update RLS Policy Issue
-- ============================================================================
-- This script fixes the RLS policy for chefs to allow admins to update
-- chefs even when they are inactive (is_active = false)
-- ============================================================================

-- Step 1: Drop existing policies
DROP POLICY IF EXISTS "Anyone can view active chefs" ON public.chefs;
DROP POLICY IF EXISTS "Admins can manage chefs" ON public.chefs;

-- Step 2: Create separate policies for better control

-- Policy 1: Public can view active chefs (no auth required)
-- This policy allows anonymous users to see only active chefs
CREATE POLICY "Anyone can view active chefs"
  ON public.chefs FOR SELECT
  USING (is_active = true);

-- Policy 2: Admins can view ALL chefs (including inactive ones)
-- This policy allows authenticated admin users to see all chefs
-- Note: This policy is checked AFTER the public policy, so admins get both active and inactive
CREATE POLICY "Admins can view all chefs"
  ON public.chefs FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Policy 3: Admins can insert chefs
CREATE POLICY "Admins can insert chefs"
  ON public.chefs FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Policy 4: Admins can update ALL chefs (including inactive ones)
CREATE POLICY "Admins can update chefs"
  ON public.chefs FOR UPDATE
  USING (
    auth.uid() IS NOT NULL AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Policy 5: Admins can delete chefs
CREATE POLICY "Admins can delete chefs"
  ON public.chefs FOR DELETE
  USING (
    auth.uid() IS NOT NULL AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Step 3: Verify the policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'chefs'
ORDER BY policyname;

-- Step 4: Test query (run as admin user)
-- This should return the chef even if is_active = false
-- SELECT * FROM public.chefs WHERE id = 'ba3cabdd-8af1-462c-bff3-3f3ea41d8e4b';

