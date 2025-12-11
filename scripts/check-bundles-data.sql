-- =====================================================
-- Check bundles table data before migration
-- =====================================================

-- 1. Check if bundles table has any data
SELECT COUNT(*) as bundle_count FROM bundles;

-- 2. Check if bundle_contents has any relationships
SELECT COUNT(*) as bundle_content_count FROM bundle_contents;

-- 3. Show all bundles if any exist
SELECT * FROM bundles;

-- 4. Show all bundle relationships if any exist
SELECT
  bc.*,
  b.name as bundle_name,
  c.title as content_title
FROM bundle_contents bc
LEFT JOIN bundles b ON bc.bundle_id = b.id
LEFT JOIN contents c ON bc.content_id = c.id;

-- =====================================================
-- Expected Result: All counts should be 0
-- (Bundle feature hasn't been implemented yet)
-- =====================================================
