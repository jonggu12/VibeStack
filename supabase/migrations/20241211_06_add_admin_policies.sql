-- =====================================================
-- Migration: Add admin role policies to RLS
-- Prerequisite: Run after 20241211_05_add_user_roles.sql
-- Purpose: Enable admin users to manage data via UI
-- =====================================================

-- Step 1: Add admin policy to search_logs
CREATE POLICY "Admin users can manage search logs"
ON search_logs
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Step 2: Add admin policy to user_contents
CREATE POLICY "Admin users can manage user access"
ON user_contents
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Step 3: Add admin policy to contents (for content management)
CREATE POLICY "Admin users can manage all contents"
ON contents
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Step 4: Add admin policy to purchases (for refund management)
CREATE POLICY "Admin users can view all purchases"
ON purchases
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Step 5: Add admin policy to subscriptions (for subscription management)
CREATE POLICY "Admin users can view all subscriptions"
ON subscriptions
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- =====================================================
-- Post-Migration Notes:
-- =====================================================
-- Admin users (role='admin') can now:
-- 1. View and manage all search logs
-- 2. Grant/revoke user access to contents
-- 3. Create/edit/delete contents
-- 4. View all purchases and subscriptions
--
-- To set a user as admin:
-- UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
-- =====================================================
