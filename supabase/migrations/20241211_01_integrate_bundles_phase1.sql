-- =====================================================
-- Bundle Integration - Phase 1: Schema Changes
-- Migration: 20241211_01_integrate_bundles_phase1.sql
-- Date: 2025-12-11
-- =====================================================

-- Purpose: Integrate bundles table into contents table
-- This is Phase 1 of 3: Schema changes only (no data migration)

-- =====================================================
-- STEP 1: Add bundle-specific fields to contents table
-- =====================================================

-- Add bundle-specific columns (optional fields)
ALTER TABLE contents
ADD COLUMN IF NOT EXISTS discount_pct INTEGER,
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- Add comments for documentation
COMMENT ON COLUMN contents.discount_pct IS 'Bundle discount percentage compared to sum of individual content prices (bundle only)';
COMMENT ON COLUMN contents.thumbnail_url IS 'Bundle thumbnail image URL (bundle only)';

-- =====================================================
-- STEP 2: Rename bundle_contents to content_children
-- =====================================================

-- Rename the junction table for clarity
-- "content_children" better represents the parent-child relationship
ALTER TABLE bundle_contents RENAME TO content_children;

-- =====================================================
-- STEP 3: Rename bundle_id to parent_content_id
-- =====================================================

-- Rename column to reflect that it now points to contents table
ALTER TABLE content_children
RENAME COLUMN bundle_id TO parent_content_id;

-- =====================================================
-- STEP 4: Update foreign key constraints
-- =====================================================

-- Drop old constraint (references bundles table)
ALTER TABLE content_children
DROP CONSTRAINT IF EXISTS bundle_contents_bundle_id_fkey;

-- Add new constraint (references contents table)
-- Note: This will fail if there are existing bundle_ids that don't exist in contents
-- We'll migrate data in Phase 2 before this becomes an issue
ALTER TABLE content_children
ADD CONSTRAINT content_children_parent_content_id_fkey
FOREIGN KEY (parent_content_id) REFERENCES contents(id) ON DELETE CASCADE;

-- Keep the existing content_id constraint
-- (Already exists as bundle_contents_content_id_fkey, should auto-rename)

-- Update unique constraint
ALTER TABLE content_children
DROP CONSTRAINT IF EXISTS bundle_contents_bundle_id_content_id_key;

ALTER TABLE content_children
ADD CONSTRAINT content_children_parent_content_id_content_id_key
UNIQUE (parent_content_id, content_id);

-- =====================================================
-- STEP 5: Recreate indexes with new names
-- =====================================================

-- Drop old indexes
DROP INDEX IF EXISTS idx_bundle_contents_bundle;
DROP INDEX IF EXISTS idx_bundle_contents_content;

-- Create new indexes with updated names
CREATE INDEX IF NOT EXISTS idx_content_children_parent
ON content_children(parent_content_id);

CREATE INDEX IF NOT EXISTS idx_content_children_content
ON content_children(content_id);

-- Optional: Create composite index for common queries
CREATE INDEX IF NOT EXISTS idx_content_children_parent_order
ON content_children(parent_content_id, display_order);

-- =====================================================
-- STEP 6: Add partial indexes for bundle-specific fields
-- =====================================================

-- Index for bundle discount searches (only for bundles with discount)
CREATE INDEX IF NOT EXISTS idx_contents_bundle_discount
ON contents(discount_pct)
WHERE type = 'bundle' AND discount_pct IS NOT NULL;

-- Index for bundle listings (common query pattern)
CREATE INDEX IF NOT EXISTS idx_contents_bundle_published
ON contents(published_at DESC)
WHERE type = 'bundle' AND status = 'published';

-- =====================================================
-- STEP 7: Update table comments
-- =====================================================

COMMENT ON TABLE content_children IS 'Parent-child relationship for bundles. Parent is a bundle (type=bundle in contents), children are included contents';
COMMENT ON COLUMN content_children.parent_content_id IS 'Reference to parent content (must be type=bundle)';
COMMENT ON COLUMN content_children.content_id IS 'Reference to child content included in the bundle';
COMMENT ON COLUMN content_children.display_order IS 'Order in which content appears in the bundle (1, 2, 3, ...)';

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check that new columns exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'contents' AND column_name = 'discount_pct'
    ) THEN
        RAISE EXCEPTION 'discount_pct column was not created';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'contents' AND column_name = 'thumbnail_url'
    ) THEN
        RAISE EXCEPTION 'thumbnail_url column was not created';
    END IF;

    RAISE NOTICE 'Phase 1 verification: All columns created successfully';
END $$;

-- Check that table was renamed
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'content_children'
    ) THEN
        RAISE EXCEPTION 'content_children table does not exist';
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'bundle_contents'
    ) THEN
        RAISE EXCEPTION 'bundle_contents table still exists (should be renamed)';
    END IF;

    RAISE NOTICE 'Phase 1 verification: Table renamed successfully';
END $$;

-- Check that foreign key exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'content_children_parent_content_id_fkey'
    ) THEN
        RAISE EXCEPTION 'Foreign key constraint was not created';
    END IF;

    RAISE NOTICE 'Phase 1 verification: Foreign key created successfully';
END $$;

-- =====================================================
-- ROLLBACK SCRIPT (for reference, do not execute)
-- =====================================================

/*
-- In case you need to rollback Phase 1:

-- Remove bundle-specific fields
ALTER TABLE contents DROP COLUMN IF EXISTS discount_pct;
ALTER TABLE contents DROP COLUMN IF EXISTS thumbnail_url;

-- Rename back
ALTER TABLE content_children RENAME TO bundle_contents;
ALTER TABLE bundle_contents RENAME COLUMN parent_content_id TO bundle_id;

-- Drop new constraints
ALTER TABLE bundle_contents DROP CONSTRAINT IF EXISTS content_children_parent_content_id_fkey;
ALTER TABLE bundle_contents DROP CONSTRAINT IF EXISTS content_children_parent_content_id_content_id_key;

-- Recreate old constraints
ALTER TABLE bundle_contents
ADD CONSTRAINT bundle_contents_bundle_id_fkey
FOREIGN KEY (bundle_id) REFERENCES bundles(id) ON DELETE CASCADE;

ALTER TABLE bundle_contents
ADD CONSTRAINT bundle_contents_bundle_id_content_id_key
UNIQUE (bundle_id, content_id);

-- Drop new indexes
DROP INDEX IF EXISTS idx_content_children_parent;
DROP INDEX IF EXISTS idx_content_children_content;
DROP INDEX IF EXISTS idx_content_children_parent_order;
DROP INDEX IF EXISTS idx_contents_bundle_discount;
DROP INDEX IF EXISTS idx_contents_bundle_published;

-- Recreate old indexes
CREATE INDEX idx_bundle_contents_bundle ON bundle_contents(bundle_id);
CREATE INDEX idx_bundle_contents_content ON bundle_contents(content_id);
*/

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

-- Phase 1 complete!
-- Next: Phase 2 - Data migration (move bundles data to contents)
-- Note: bundles table still exists and can be used until Phase 2
