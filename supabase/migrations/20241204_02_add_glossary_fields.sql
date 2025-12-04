-- =====================================================
-- Part 2: Add glossary-specific fields and indexes
-- Migration: 20241204_02_add_glossary_fields.sql
-- =====================================================

-- Add optional glossary-specific fields to contents table
ALTER TABLE contents
ADD COLUMN IF NOT EXISTS term_category TEXT,
ADD COLUMN IF NOT EXISTS related_terms JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS synonyms TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS analogy TEXT;

-- Create index for glossary term search (category)
CREATE INDEX IF NOT EXISTS idx_contents_glossary_category
ON contents(term_category)
WHERE type = 'glossary';

-- Create index for alphabetical sorting
CREATE INDEX IF NOT EXISTS idx_contents_glossary_title
ON contents(title)
WHERE type = 'glossary';

-- Create GIN index for related terms JSONB search
CREATE INDEX IF NOT EXISTS idx_contents_related_terms
ON contents USING GIN(related_terms)
WHERE type = 'glossary';

-- Add comments for documentation
COMMENT ON COLUMN contents.term_category IS '용어 카테고리: 기본 개념, Next.js 용어, 개발 도구, 에러 용어';
COMMENT ON COLUMN contents.related_terms IS '연관 용어 ID 배열 (JSONB): ["uuid-1", "uuid-2"]';
COMMENT ON COLUMN contents.synonyms IS '동의어 배열: ["API", "Application Programming Interface"]';
COMMENT ON COLUMN contents.analogy IS '초등학생 비유: "음식점 주문 시스템"';
