-- =====================================================
-- Migration: Add ban tracking columns to users table
-- Purpose: Track ban reason, timing, and admin who banned
-- =====================================================

-- Step 1: Add ban tracking columns
ALTER TABLE users
ADD COLUMN ban_reason TEXT,                        -- 정지 사유
ADD COLUMN banned_at TIMESTAMPTZ,                  -- 정지 일시
ADD COLUMN banned_by UUID REFERENCES users(id);    -- 정지 처리한 관리자

-- Step 2: Add comments for documentation
COMMENT ON COLUMN users.ban_reason IS 'Reason for account suspension';
COMMENT ON COLUMN users.banned_at IS 'Timestamp when account was banned';
COMMENT ON COLUMN users.banned_by IS 'Admin user ID who banned this account';

-- Step 3: Create index for banned_by (for admin audit logs)
CREATE INDEX idx_users_banned_by ON users(banned_by) WHERE banned_by IS NOT NULL;

-- =====================================================
-- Usage Examples:
-- =====================================================

-- Ban a user with reason:
--   UPDATE users
--   SET banned = true,
--       ban_reason = '스팸 행위 반복',
--       banned_at = NOW(),
--       banned_by = (SELECT id FROM users WHERE email = 'admin@vibestack.com')
--   WHERE email = 'spammer@example.com';

-- Unban a user:
--   UPDATE users
--   SET banned = false,
--       ban_reason = NULL,
--       banned_at = NULL,
--       banned_by = NULL
--   WHERE id = 'user-uuid';

-- Find all users banned by specific admin:
--   SELECT email, ban_reason, banned_at
--   FROM users
--   WHERE banned_by = 'admin-uuid';

-- =====================================================
