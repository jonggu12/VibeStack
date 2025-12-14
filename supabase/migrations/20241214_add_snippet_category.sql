-- Add snippet_category and tags columns to contents table

-- Step 1: Create snippet_category ENUM type
CREATE TYPE snippet_category AS ENUM (
  'auth',        -- 인증/권한
  'payment',     -- 결제
  'database',    -- 데이터베이스
  'storage',     -- 파일 저장소
  'email',       -- 이메일
  'ui',          -- UI 컴포넌트
  'hooks',       -- React Hooks / 유틸리티 함수
  'api',         -- API Routes / 엔드포인트
  'validation',  -- 폼/데이터 검증
  'integration'  -- 외부 서비스 연동
);

-- Step 2: Add snippet_category column (only for snippets)
ALTER TABLE contents
ADD COLUMN snippet_category snippet_category;

-- Step 3: Add tags column (for all content types)
ALTER TABLE contents
ADD COLUMN tags TEXT[];

-- Step 4: Create indexes for better query performance
CREATE INDEX idx_contents_snippet_category
ON contents(snippet_category)
WHERE type = 'snippet';

CREATE INDEX idx_contents_tags
ON contents USING GIN(tags)
WHERE type = 'snippet';

-- Step 5: Add comments
COMMENT ON COLUMN contents.snippet_category IS 'Category classification for snippet type content (auth, payment, database, etc.)';
COMMENT ON COLUMN contents.tags IS 'Tags array for detailed classification and search (e.g., [''google'', ''oauth'', ''clerk''])';
