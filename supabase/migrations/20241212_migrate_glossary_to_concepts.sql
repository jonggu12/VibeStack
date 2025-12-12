-- Migrate glossary entries to doc type with concepts category
-- Migration: 20241212_migrate_glossary_to_concepts
--
-- Strategy: Keep glossary-specific fields (term_category, related_terms, synonyms, analogy)
-- They will be nullable and used for enhanced UI rendering when present

-- Step 1: Update all glossary entries to doc type with concepts category
UPDATE contents
SET
  type = 'doc',
  category = 'concepts',
  updated_at = NOW()
WHERE type = 'glossary';

-- Step 2: Set default estimated_time_mins for concepts without it
UPDATE contents
SET estimated_time_mins = 5
WHERE type = 'doc'
  AND category = 'concepts'
  AND estimated_time_mins IS NULL;

-- Step 3: Add helpful indexes
CREATE INDEX IF NOT EXISTS idx_contents_concepts
ON contents(category, created_at DESC)
WHERE type = 'doc' AND category = 'concepts';

-- Index for finding glossary-style docs (with term_category)
CREATE INDEX IF NOT EXISTS idx_contents_glossary_fields
ON contents(term_category)
WHERE type = 'doc' AND category = 'concepts' AND term_category IS NOT NULL;

-- Step 4: Verification query
DO $$
DECLARE
  total_concepts INTEGER;
  glossary_style INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_concepts
  FROM contents
  WHERE type = 'doc' AND category = 'concepts';

  SELECT COUNT(*) INTO glossary_style
  FROM contents
  WHERE type = 'doc' AND category = 'concepts' AND term_category IS NOT NULL;

  RAISE NOTICE 'Migration complete!';
  RAISE NOTICE 'Total concepts docs: %', total_concepts;
  RAISE NOTICE 'Glossary-style docs (with term_category): %', glossary_style;
  RAISE NOTICE 'Regular concept docs: %', total_concepts - glossary_style;
END $$;

-- Note: glossary-specific fields are kept as nullable columns:
-- - term_category (text)
-- - related_terms (text[])
-- - synonyms (text[])
-- - analogy (text)
--
-- These fields will be used in the UI to render enhanced glossary cards
-- when present. Regular concept docs can leave these fields NULL.
