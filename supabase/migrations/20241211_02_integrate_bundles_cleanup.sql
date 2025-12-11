-- =====================================================
-- Bundle Integration - Phase 2/3: Cleanup
-- Migration: 20241211_02_integrate_bundles_cleanup.sql
-- Date: 2025-12-11
-- =====================================================

-- Purpose: Remove bundles table (no longer needed)
-- Note: Since bundles table has no data, we skip data migration

-- =====================================================
-- STEP 1: Verify bundles table is empty
-- =====================================================

DO $$
DECLARE
  bundle_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO bundle_count FROM bundles;

  IF bundle_count > 0 THEN
    RAISE EXCEPTION 'bundles table has % rows. Please migrate data first!', bundle_count;
  END IF;

  RAISE NOTICE 'Verification: bundles table is empty (% rows)', bundle_count;
END $$;

-- =====================================================
-- STEP 2: Remove foreign key from purchases table
-- =====================================================

-- Check if purchases table has any bundle_id references
DO $$
DECLARE
  purchase_bundle_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO purchase_bundle_count
  FROM purchases
  WHERE bundle_id IS NOT NULL;

  IF purchase_bundle_count > 0 THEN
    RAISE EXCEPTION 'purchases table has % rows with bundle_id. Please migrate first!', purchase_bundle_count;
  END IF;

  RAISE NOTICE 'Verification: No purchases reference bundles (% rows)', purchase_bundle_count;
END $$;

-- Drop the bundle_id column from purchases table
ALTER TABLE purchases
DROP COLUMN IF EXISTS bundle_id CASCADE;

COMMENT ON TABLE purchases IS 'Single content purchases (bundles now stored in contents table with type=bundle)';

-- =====================================================
-- STEP 3: Drop bundles table
-- =====================================================

-- Drop the bundles table (CASCADE will drop dependent objects)
DROP TABLE IF EXISTS bundles CASCADE;

-- =====================================================
-- STEP 4: Update CHECK constraint on purchases
-- =====================================================

-- Remove the old CHECK constraint that required either content_id OR bundle_id
ALTER TABLE purchases
DROP CONSTRAINT IF EXISTS purchases_check;

ALTER TABLE purchases
DROP CONSTRAINT IF EXISTS purchases_content_id_bundle_id_check;

-- Add new CHECK constraint (content_id is now required)
ALTER TABLE purchases
ADD CONSTRAINT purchases_content_id_required
CHECK (content_id IS NOT NULL);

COMMENT ON CONSTRAINT purchases_content_id_required ON purchases IS 'content_id is required (bundles are now in contents table)';

-- =====================================================
-- STEP 5: Verification
-- =====================================================

-- Verify bundles table no longer exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_name = 'bundles'
  ) THEN
    RAISE EXCEPTION 'bundles table still exists!';
  END IF;

  RAISE NOTICE 'Verification: bundles table successfully dropped';
END $$;

-- Verify bundle_id column removed from purchases
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'purchases' AND column_name = 'bundle_id'
  ) THEN
    RAISE EXCEPTION 'bundle_id column still exists in purchases table!';
  END IF;

  RAISE NOTICE 'Verification: bundle_id column successfully removed from purchases';
END $$;

-- Verify content_children table exists and has correct structure
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_name = 'content_children'
  ) THEN
    RAISE EXCEPTION 'content_children table does not exist!';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'content_children' AND column_name = 'parent_content_id'
  ) THEN
    RAISE EXCEPTION 'parent_content_id column does not exist in content_children!';
  END IF;

  RAISE NOTICE 'Verification: content_children table structure is correct';
END $$;

-- Verify contents table has bundle fields
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contents' AND column_name = 'discount_pct'
  ) THEN
    RAISE EXCEPTION 'discount_pct column does not exist in contents!';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contents' AND column_name = 'thumbnail_url'
  ) THEN
    RAISE EXCEPTION 'thumbnail_url column does not exist in contents!';
  END IF;

  RAISE NOTICE 'Verification: contents table has bundle-specific fields';
END $$;

-- =====================================================
-- FINAL SUMMARY
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Bundle Integration Complete!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Changes:';
  RAISE NOTICE '  ✅ Dropped bundles table';
  RAISE NOTICE '  ✅ Removed bundle_id from purchases';
  RAISE NOTICE '  ✅ Updated CHECK constraints';
  RAISE NOTICE '';
  RAISE NOTICE 'Current Structure:';
  RAISE NOTICE '  📊 contents table:';
  RAISE NOTICE '     - type can be: doc, tutorial, snippet, bundle, glossary';
  RAISE NOTICE '     - has discount_pct and thumbnail_url for bundles';
  RAISE NOTICE '';
  RAISE NOTICE '  📊 content_children table:';
  RAISE NOTICE '     - parent_content_id → contents(id) where type=bundle';
  RAISE NOTICE '     - content_id → contents(id) for included content';
  RAISE NOTICE '';
  RAISE NOTICE '  📊 purchases table:';
  RAISE NOTICE '     - content_id → contents(id) (bundles and regular content)';
  RAISE NOTICE '';
  RAISE NOTICE 'Next Steps:';
  RAISE NOTICE '  1. Update TypeScript types';
  RAISE NOTICE '  2. Update server actions (remove bundles queries)';
  RAISE NOTICE '  3. Test bundle creation and retrieval';
  RAISE NOTICE '';
END $$;

-- =====================================================
-- ROLLBACK SCRIPT (for reference, do not execute)
-- =====================================================

/*
-- In case you need to rollback:

-- 1. Recreate bundles table
CREATE TABLE bundles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL,
  discount_pct INTEGER,
  thumbnail_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add bundle_id back to purchases
ALTER TABLE purchases
ADD COLUMN bundle_id UUID REFERENCES bundles(id);

-- 3. Recreate CHECK constraint
ALTER TABLE purchases
DROP CONSTRAINT IF EXISTS purchases_content_id_required;

ALTER TABLE purchases
ADD CONSTRAINT purchases_check
CHECK (
  (content_id IS NOT NULL AND bundle_id IS NULL) OR
  (content_id IS NULL AND bundle_id IS NOT NULL)
);

-- Note: Phase 1 changes (content_children table, contents columns)
-- should remain even if you rollback Phase 2/3
*/
