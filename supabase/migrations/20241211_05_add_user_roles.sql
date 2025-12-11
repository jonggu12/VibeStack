-- =====================================================
-- Migration: Add role column to users table
-- Purpose: Enable role-based access control (RBAC)
-- =====================================================

-- Step 1: Create user_role enum
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- Step 2: Add role column to users table
ALTER TABLE users
ADD COLUMN role user_role NOT NULL DEFAULT 'user';

-- Step 3: Create index for role-based queries
CREATE INDEX idx_users_role ON users(role) WHERE role = 'admin';

-- Step 4: Comment for documentation
COMMENT ON COLUMN users.role IS 'User role for RBAC: user (default) or admin';

-- =====================================================
-- Post-Migration Instructions:
-- =====================================================
-- 1. Set your first admin user:
--    UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
--
-- 2. Now you can use role-based RLS policies:
--    CREATE POLICY "Admins can manage content"
--    ON contents FOR ALL TO authenticated
--    USING (
--      EXISTS (
--        SELECT 1 FROM users
--        WHERE users.id = auth.uid() AND users.role = 'admin'
--      )
--    );
-- =====================================================
