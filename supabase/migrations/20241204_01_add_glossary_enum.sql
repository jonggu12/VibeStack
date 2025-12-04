-- =====================================================
-- Part 1: Add 'glossary' to content_type enum
-- Migration: 20241204_01_add_glossary_enum.sql
-- =====================================================

-- Add 'glossary' enum value
-- This must be done in a separate transaction
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type t
        JOIN pg_enum e ON t.oid = e.enumtypid
        WHERE t.typname = 'content_type'
        AND e.enumlabel = 'glossary'
    ) THEN
        ALTER TYPE content_type ADD VALUE 'glossary';
    END IF;
END $$;
