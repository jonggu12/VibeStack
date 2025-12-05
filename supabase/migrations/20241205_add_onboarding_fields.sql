-- =====================================================
-- Add experience_level and primary_pain_points to users
-- Migration: 20241205_add_onboarding_fields.sql
-- =====================================================

-- Add experience_level column
ALTER TABLE users
ADD COLUMN IF NOT EXISTS experience_level TEXT;

-- Add CHECK constraint for experience_level
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'users_experience_level_check'
    ) THEN
        ALTER TABLE users
        ADD CONSTRAINT users_experience_level_check
        CHECK (experience_level IN ('vibe_coder', 'beginner', 'intermediate', 'advanced'));
    END IF;
END $$;

-- Add primary_pain_points column (array type for multiple selections)
ALTER TABLE users
ADD COLUMN IF NOT EXISTS primary_pain_points TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Create index for experience_level (for filtering)
CREATE INDEX IF NOT EXISTS idx_users_experience_level
ON users(experience_level);

-- Create GIN index for primary_pain_points (for array search)
CREATE INDEX IF NOT EXISTS idx_users_primary_pain_points
ON users USING GIN(primary_pain_points);

-- Add comments for documentation
COMMENT ON COLUMN users.experience_level IS '개발 경험 수준: vibe_coder(코딩 처음), beginner(1년 미만), intermediate(1~3년), advanced(3년 이상)';
COMMENT ON COLUMN users.primary_pain_points IS '주요 관심사/고민 배열: ["auth", "database", "payments", "deployment", "errors", "ai_prompting"]';

-- Update user_onboarding_status view to include new fields
-- Note: New columns must be added at the end to preserve existing column order
CREATE OR REPLACE VIEW user_onboarding_status AS
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
  u.stack_preset,
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
  -- NEW FIELDS (must be at the end)
  u.experience_level,        -- 개발 경험 수준
  u.primary_pain_points      -- 주요 관심사/고민
FROM users u;
