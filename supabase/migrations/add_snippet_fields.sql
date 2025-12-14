-- Add snippet-specific fields to contents table
-- Migration: Add code_snippet, prompt_text, snippet_language

ALTER TABLE contents
ADD COLUMN IF NOT EXISTS code_snippet TEXT,
ADD COLUMN IF NOT EXISTS prompt_text TEXT,
ADD COLUMN IF NOT EXISTS snippet_language VARCHAR(50) DEFAULT 'typescript';

-- Add comments for documentation
COMMENT ON COLUMN contents.code_snippet IS 'Raw code for copy-paste (snippets only)';
COMMENT ON COLUMN contents.prompt_text IS 'AI prompt text for Cursor/Copilot (snippets only)';
COMMENT ON COLUMN contents.snippet_language IS 'Programming language: typescript, python, sql, etc.';

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_contents_type_status ON contents(type, status);
