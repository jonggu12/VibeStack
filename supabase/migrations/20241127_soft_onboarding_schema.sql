-- Soft Onboarding Schema Migration
-- Creates tables and fields needed for soft onboarding and behavior tracking

-- 1. Add soft onboarding fields to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS onboarding_dismissed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS inferred_stack JSONB,
ADD COLUMN IF NOT EXISTS content_view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS search_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS project_type VARCHAR(50), -- 'web', 'app', 'backend'
ADD COLUMN IF NOT EXISTS stack_preset VARCHAR(50); -- 'saas-kit', 'ecommerce', 'custom'

-- 2. Create user_behaviors table for tracking user actions
CREATE TABLE IF NOT EXISTS user_behaviors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  behavior_type VARCHAR(50) NOT NULL, -- 'content_view', 'search_query', 'snippet_copy', 'tutorial_start', 'tutorial_complete'
  metadata JSONB, -- Flexible storage for additional data
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_behaviors_user_id ON user_behaviors(user_id);
CREATE INDEX IF NOT EXISTS idx_user_behaviors_type ON user_behaviors(behavior_type);
CREATE INDEX IF NOT EXISTS idx_user_behaviors_created_at ON user_behaviors(created_at);
CREATE INDEX IF NOT EXISTS idx_user_behaviors_user_type ON user_behaviors(user_id, behavior_type);

-- 3. Create onboarding_prompts table for tracking onboarding prompt interactions
CREATE TABLE IF NOT EXISTS onboarding_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  trigger_type VARCHAR(50) NOT NULL, -- 'content_views', 'searches', 'completion'
  prompt_message TEXT,
  shown_at TIMESTAMPTZ DEFAULT NOW(),
  clicked BOOLEAN DEFAULT FALSE,
  dismissed BOOLEAN DEFAULT FALSE,
  clicked_at TIMESTAMPTZ,
  dismissed_at TIMESTAMPTZ
);

-- Indexes for onboarding_prompts
CREATE INDEX IF NOT EXISTS idx_onboarding_prompts_user_id ON onboarding_prompts(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_prompts_trigger ON onboarding_prompts(trigger_type);
CREATE INDEX IF NOT EXISTS idx_onboarding_prompts_shown_at ON onboarding_prompts(shown_at);

-- 4. Create function to update user behavior counts
CREATE OR REPLACE FUNCTION update_user_behavior_counts()
RETURNS TRIGGER AS $$
BEGIN
  -- Update content_view_count
  IF NEW.behavior_type = 'content_view' THEN
    UPDATE users
    SET content_view_count = content_view_count + 1
    WHERE id = NEW.user_id;
  END IF;

  -- Update search_count
  IF NEW.behavior_type = 'search_query' THEN
    UPDATE users
    SET search_count = search_count + 1
    WHERE id = NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Create trigger to auto-update behavior counts
DROP TRIGGER IF EXISTS trigger_update_behavior_counts ON user_behaviors;
CREATE TRIGGER trigger_update_behavior_counts
  AFTER INSERT ON user_behaviors
  FOR EACH ROW
  EXECUTE FUNCTION update_user_behavior_counts();

-- 6. Create function to infer user stack preference based on behavior
CREATE OR REPLACE FUNCTION infer_user_stack(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_stack JSONB;
  v_framework TEXT;
  v_auth TEXT;
  v_database TEXT;
BEGIN
  -- Get most viewed content's stack properties
  WITH user_content_views AS (
    SELECT
      c.stack,
      COUNT(*) as view_count
    FROM user_behaviors ub
    JOIN contents c ON (ub.metadata->>'content_id')::UUID = c.id
    WHERE ub.user_id = p_user_id
      AND ub.behavior_type = 'content_view'
      AND c.stack IS NOT NULL
    GROUP BY c.stack
    ORDER BY view_count DESC
    LIMIT 5
  )
  SELECT
    jsonb_object_agg(key, value ORDER BY value_count DESC)
  INTO v_stack
  FROM (
    SELECT
      key,
      value,
      COUNT(*) as value_count
    FROM user_content_views,
    LATERAL jsonb_each_text(stack)
    GROUP BY key, value
    ORDER BY key, value_count DESC
  ) subquery;

  RETURN COALESCE(v_stack, '{}'::JSONB);
END;
$$ LANGUAGE plpgsql;

-- 7. Add RLS policies for user_behaviors
ALTER TABLE user_behaviors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own behaviors" ON user_behaviors;
CREATE POLICY "Users can view own behaviors" ON user_behaviors
  FOR SELECT USING (
    user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text)
  );

DROP POLICY IF EXISTS "Users can insert own behaviors" ON user_behaviors;
CREATE POLICY "Users can insert own behaviors" ON user_behaviors
  FOR INSERT WITH CHECK (
    user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text)
  );

-- 8. Add RLS policies for onboarding_prompts
ALTER TABLE onboarding_prompts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own onboarding prompts" ON onboarding_prompts;
CREATE POLICY "Users can view own onboarding prompts" ON onboarding_prompts
  FOR SELECT USING (
    user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text)
  );

DROP POLICY IF EXISTS "Users can update own onboarding prompts" ON onboarding_prompts;
CREATE POLICY "Users can update own onboarding prompts" ON onboarding_prompts
  FOR UPDATE USING (
    user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text)
  );

-- 9. Create helper view for user onboarding status
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
  END AS suggested_trigger_type
FROM users u;

-- 10. Grant permissions
GRANT SELECT ON user_onboarding_status TO authenticated;
GRANT ALL ON user_behaviors TO authenticated;
GRANT ALL ON onboarding_prompts TO authenticated;

COMMENT ON TABLE user_behaviors IS 'Tracks user behavior for implicit personalization';
COMMENT ON TABLE onboarding_prompts IS 'Logs when onboarding prompts are shown and user interactions';
COMMENT ON COLUMN users.inferred_stack IS 'Stack preferences inferred from user behavior';
COMMENT ON COLUMN users.content_view_count IS 'Total number of content items viewed';
COMMENT ON COLUMN users.search_count IS 'Total number of searches performed';
