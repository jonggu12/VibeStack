-- Add category column to contents table for doc organization
-- Migration: 20241212_add_doc_categories

-- Create enum for doc categories
CREATE TYPE doc_category AS ENUM (
  'getting-started',    -- 시작 가이드
  'implementation',     -- 기능 구현 가이드
  'prompts',            -- 프롬프트 작성법
  'errors',             -- 에러 해결
  'concepts'            -- 개념 & 용어
);

-- Add category column to contents table
ALTER TABLE contents
ADD COLUMN category doc_category;

-- Create index for faster category filtering
CREATE INDEX idx_contents_category ON contents(category) WHERE type = 'doc';

-- Add comment for documentation
COMMENT ON COLUMN contents.category IS 'Category classification for doc type content (getting-started, implementation, prompts, errors, concepts)';

-- Update existing docs to have a default category (optional)
-- UPDATE contents SET category = 'concepts' WHERE type = 'doc' AND category IS NULL;
