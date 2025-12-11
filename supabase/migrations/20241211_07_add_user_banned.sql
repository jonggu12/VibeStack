-- =====================================================
-- Migration: Add banned column to users table
-- Purpose: Support user account suspension/ban feature
-- =====================================================

-- Step 1: Add banned column
ALTER TABLE users
ADD COLUMN banned BOOLEAN NOT NULL DEFAULT false;

-- Step 2: Create partial index (only for banned users)
CREATE INDEX idx_users_banned ON users(banned) WHERE banned = true;

-- Step 3: Comment for documentation
COMMENT ON COLUMN users.banned IS 'True if user account is suspended/banned by admin';

-- =====================================================
-- Usage:
-- =====================================================
-- Ban a user:
--   UPDATE users SET banned = true WHERE email = 'spammer@example.com';
--
-- Unban a user:
--   UPDATE users SET banned = false WHERE id = 'user-uuid';
--
-- List all banned users:
--   SELECT email, banned, created_at FROM users WHERE banned = true;
-- =====================================================
