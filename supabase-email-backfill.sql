-- ============================================================
-- EMAIL BACKFILL MIGRATION
-- Run this in: Supabase Dashboard → SQL Editor → New query
--
-- This fixes profiles that have a blank email by syncing the
-- email from auth.users (where it is always stored correctly).
-- ============================================================

-- 1. Backfill: copy email from auth.users into profiles
--    where profiles.email is blank or null.
UPDATE public.profiles
SET email = u.email
FROM auth.users u
WHERE profiles.id = u.id
  AND u.email IS NOT NULL
  AND u.email <> ''
  AND (profiles.email IS NULL OR profiles.email = '');

-- 2. Verify the result — should return 0 rows with blank emails after running above.
SELECT p.id, p.full_name, p.email AS profile_email, u.email AS auth_email
FROM public.profiles p
JOIN auth.users u ON u.id = p.id
WHERE p.email IS NULL OR p.email = '';

-- ============================================================
-- TRIGGER REMINDER
-- Make sure these triggers exist in your project.
-- If you haven't run supabase-setup.sql yet, run it first.
-- The two triggers that keep profile emails in sync are:
--
--   on_auth_user_created  → copies email on new signup
--   on_auth_user_email_changed → syncs email if user changes it
--
-- You can verify they exist with:
-- ============================================================
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
   OR event_object_schema = 'auth';
