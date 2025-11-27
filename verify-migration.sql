-- Migration Verification Queries
-- Run these in Supabase SQL Editor to verify everything is set up correctly

-- 1. Check all new columns in users table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'users'
AND column_name IN (
  'onboarding_completed',
  'onboarding_dismissed_at',
  'inferred_stack',
  'content_view_count',
  'search_count',
  'project_type',
  'stack_preset'
)
ORDER BY column_name;

-- 2. Check user_behaviors table structure
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'user_behaviors'
ORDER BY ordinal_position;

-- 3. Check onboarding_prompts table structure
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'onboarding_prompts'
ORDER BY ordinal_position;

-- 4. Check indexes on user_behaviors
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'user_behaviors';

-- 5. Check if trigger exists
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'trigger_update_behavior_counts';

-- 6. Check if functions exist
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('update_user_behavior_counts', 'infer_user_stack');

-- 7. Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename IN ('user_behaviors', 'onboarding_prompts')
ORDER BY tablename, policyname;

-- 8. Check if view exists
SELECT table_name, view_definition
FROM information_schema.views
WHERE table_name = 'user_onboarding_status';

-- 9. Test the view (should return empty result if no users yet)
SELECT COUNT(*) as total_users
FROM user_onboarding_status;

-- 10. Quick health check - all objects created
SELECT
  'Tables' as object_type,
  COUNT(*) as count
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('user_behaviors', 'onboarding_prompts')

UNION ALL

SELECT
  'Functions' as object_type,
  COUNT(*) as count
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('update_user_behavior_counts', 'infer_user_stack')

UNION ALL

SELECT
  'Triggers' as object_type,
  COUNT(*) as count
FROM information_schema.triggers
WHERE trigger_name = 'trigger_update_behavior_counts'

UNION ALL

SELECT
  'Views' as object_type,
  COUNT(*) as count
FROM information_schema.views
WHERE table_name = 'user_onboarding_status';
