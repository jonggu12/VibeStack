-- =====================================================
-- Migration: Add banned_until column for temporary bans
-- Purpose: Support time-limited account suspensions
-- =====================================================

-- Step 1: Add banned_until column (only if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'banned_until'
  ) THEN
    ALTER TABLE users
    ADD COLUMN banned_until TIMESTAMPTZ;
  END IF;
END $$;

-- Step 2: Add comment for documentation
COMMENT ON COLUMN users.banned_until IS 'Ban expiration timestamp (NULL = permanent ban)';

-- =====================================================
-- Usage Examples:
-- =====================================================

-- Temporary ban (7 days):
--   UPDATE users
--   SET banned = true,
--       ban_reason = '스팸 행위 반복',
--       banned_at = NOW(),
--       banned_until = NOW() + INTERVAL '7 days',
--       banned_by = (SELECT id FROM users WHERE email = 'admin@vibestack.com')
--   WHERE email = 'spammer@example.com';

-- Permanent ban (banned_until = NULL):
--   UPDATE users
--   SET banned = true,
--       ban_reason = '심각한 서비스 악용',
--       banned_at = NOW(),
--       banned_until = NULL,
--       banned_by = (SELECT id FROM users WHERE email = 'admin@vibestack.com')
--   WHERE email = 'bad-user@example.com';

-- Check expired bans:
--   SELECT email, banned_until, ban_reason
--   FROM users
--   WHERE banned = true
--     AND banned_until IS NOT NULL
--     AND banned_until < NOW();

-- Auto-unban expired users (should be done by middleware):
--   UPDATE users
--   SET banned = false,
--       ban_reason = NULL,
--       banned_at = NULL,
--       banned_until = NULL,
--       banned_by = NULL
--   WHERE banned = true
--     AND banned_until IS NOT NULL
--     AND banned_until < NOW();

-- =====================================================
