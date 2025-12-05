-- =====================================================
-- Finalize Onboarding Schema Updates
-- Migration: 20241205_finalize_onboarding_schema.sql
-- =====================================================

-- 1. First, DROP the existing view (required before dropping column)
DROP VIEW IF EXISTS user_onboarding_status;

-- 2. Now recreate the view WITHOUT stack_preset column
CREATE VIEW user_onboarding_status AS
SELECT
  u.id,
  u.clerk_user_id,
  u.email,
  u.onboarding_completed,
  u.onboarding_dismissed_at,
  u.content_view_count,
  u.search_count,
  u.inferred_stack,
  u.project_type,
  -- stack_preset removed (no longer used)

  -- Calculate if user should see onboarding prompt
  CASE
    WHEN u.onboarding_completed THEN FALSE
    WHEN u.onboarding_dismissed_at IS NOT NULL
      AND u.onboarding_dismissed_at > NOW() - INTERVAL '7 days' THEN FALSE
    WHEN u.content_view_count >= 3 OR u.search_count >= 3 THEN TRUE
    ELSE FALSE
  END AS should_show_onboarding_prompt,

  -- Determine trigger type
  CASE
    WHEN u.content_view_count >= 3 THEN 'content_views'
    WHEN u.search_count >= 3 THEN 'searches'
    ELSE NULL
  END AS suggested_trigger_type,

  -- Onboarding fields (at the end to preserve column order)
  u.experience_level,
  u.primary_pain_points
FROM users u;

-- 3. Now safe to remove deprecated stack_preset column
ALTER TABLE users
DROP COLUMN IF EXISTS stack_preset;

-- 4. Migrate existing project_type values to new schema
--    Old values: 'web', 'app', 'backend' → Clear them (set to NULL)
UPDATE users
SET project_type = NULL
WHERE project_type NOT IN ('ai_saas', 'dashboard', 'community', 'productivity', 'quiz', 'landing')
  AND project_type IS NOT NULL;

-- 5. Add CHECK constraint for project_type (6 valid options)
DO $$
BEGIN
    -- Drop existing constraint if any
    IF EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'users_project_type_check'
    ) THEN
        ALTER TABLE users DROP CONSTRAINT users_project_type_check;
    END IF;

    -- Add new constraint with updated values
    ALTER TABLE users
    ADD CONSTRAINT users_project_type_check
    CHECK (project_type IN ('ai_saas', 'dashboard', 'community', 'productivity', 'quiz', 'landing'));
END $$;

-- 6. Add CHECK constraint for primary_pain_points array values
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'users_primary_pain_points_check'
    ) THEN
        ALTER TABLE users
        ADD CONSTRAINT users_primary_pain_points_check
        CHECK (
            primary_pain_points <@ ARRAY[
                'auth', 'database', 'payments', 'deployment', 'errors', 'ai_prompting',
                'ai_integration', 'file_processing', 'realtime', 'data_visualization',
                'external_api', 'email_setup', 'seo', 'social_sharing', 'not_sure'
            ]::TEXT[]
        );
    END IF;
END $$;

-- 7. Update column comments with new values
COMMENT ON COLUMN users.project_type IS '프로젝트 타입: ai_saas(AI 기반 웹 서비스), dashboard(대시보드/데이터 앱), community(커뮤니티/소셜), productivity(생산성/자동화), quiz(퀴즈/테스트/게임), landing(랜딩 페이지)';

COMMENT ON COLUMN users.experience_level IS '개발 경험 수준: vibe_coder(코딩 처음), beginner(1년 미만), intermediate(1~3년), advanced(3년 이상)';

COMMENT ON COLUMN users.primary_pain_points IS '주요 관심사/고민 배열: auth, database, payments, deployment, errors, ai_prompting, ai_integration, file_processing, realtime, data_visualization, external_api, email_setup, seo, social_sharing, not_sure (15개 옵션, 다중 선택 가능)';

COMMENT ON COLUMN users.inferred_stack IS 'Stack 기능 선택 (JSONB):
{
  "auth": boolean,           -- 회원가입/로그인 (Clerk)
  "database": boolean,       -- 데이터 저장소 (Supabase)
  "payments": boolean,       -- 결제/구독 (Stripe)
  "ai_api": boolean,         -- AI API 연동 (GPT, Claude)
  "file_upload": boolean,    -- 파일 업로드 (Uploadthing)
  "realtime": boolean,       -- 실시간 기능 (Supabase Realtime)
  "email": boolean,          -- 이메일 전송 (Resend)
  "external_api": boolean    -- 외부 API 연동
}';

-- 8. Grant permissions
GRANT SELECT ON user_onboarding_status TO authenticated;

-- Migration complete
