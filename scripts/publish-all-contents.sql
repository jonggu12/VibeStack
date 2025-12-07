-- VibeStack: Publish all draft contents
-- This script updates all draft contents to published status
-- Run this in Supabase SQL Editor

UPDATE contents
SET
  status = 'published',
  published_at = NOW(),
  updated_at = NOW()
WHERE status = 'draft';

-- Verify the update
SELECT
  type,
  status,
  COUNT(*) as count
FROM contents
GROUP BY type, status
ORDER BY type, status;
