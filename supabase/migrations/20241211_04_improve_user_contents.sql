-- =====================================================
-- Migration: Improve user_contents relationship tracking
-- Priority: 5/5 (Critical bug fix for refunds)
-- Issue: Current structure can't revoke access on refund/cancellation
-- =====================================================

-- Step 1: Create access_source enum
CREATE TYPE access_source AS ENUM (
  'free',           -- Free content
  'purchase',       -- One-time purchase
  'subscription',   -- Active Pro/Team subscription
  'admin_grant'     -- Manual admin grant
);

-- Step 2: Rename existing table
ALTER TABLE user_contents RENAME TO user_contents_old;

-- Step 3: Create new user_contents table with proper relationships
CREATE TABLE user_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
  access_source access_source NOT NULL,

  -- Foreign key references (nullable - only one should be set based on access_source)
  purchase_id UUID REFERENCES purchases(id) ON DELETE CASCADE,  -- When access_source = 'purchase'
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,  -- When access_source = 'subscription'

  -- Revocation tracking
  is_active BOOLEAN NOT NULL DEFAULT true,
  revoked_at TIMESTAMPTZ,
  revoke_reason TEXT,  -- 'refund', 'subscription_cancelled', 'admin_revoked'

  -- Metadata
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT user_contents_unique_access UNIQUE (user_id, content_id, access_source),
  CONSTRAINT user_contents_purchase_required
    CHECK (access_source != 'purchase' OR purchase_id IS NOT NULL),
  CONSTRAINT user_contents_subscription_required
    CHECK (access_source != 'subscription' OR subscription_id IS NOT NULL),
  CONSTRAINT user_contents_revoked_consistency
    CHECK ((is_active = true AND revoked_at IS NULL) OR (is_active = false AND revoked_at IS NOT NULL))
);

-- Step 4: Migrate existing data
-- Free content access (is_premium = false)
INSERT INTO user_contents (user_id, content_id, access_source, is_active, granted_at)
SELECT DISTINCT uco.user_id, uco.content_id, 'free'::access_source, true, uco.granted_at
FROM user_contents_old uco
INNER JOIN contents c ON c.id = uco.content_id
WHERE c.is_premium = false
  AND uco.access_type = 'free';

-- Purchase-based access
INSERT INTO user_contents (user_id, content_id, access_source, purchase_id, is_active, granted_at)
SELECT DISTINCT uco.user_id, uco.content_id, 'purchase'::access_source, p.id, true, uco.granted_at
FROM user_contents_old uco
INNER JOIN purchases p ON p.user_id = uco.user_id AND p.content_id = uco.content_id
WHERE uco.access_type = 'purchased'
  AND p.status = 'completed';

-- Subscription-based access (users with active Pro/Team subscription)
INSERT INTO user_contents (user_id, content_id, access_source, subscription_id, is_active, granted_at)
SELECT DISTINCT u.id, c.id, 'subscription'::access_source, s.id, true, NOW()
FROM users u
CROSS JOIN contents c
INNER JOIN subscriptions s ON s.user_id = u.id
WHERE s.status = 'active'
  AND s.plan_type IN ('pro', 'team')
  AND c.is_premium = true
  AND NOT EXISTS (
    -- Don't duplicate if already has purchase access
    SELECT 1 FROM user_contents uc2
    WHERE uc2.user_id = u.id
      AND uc2.content_id = c.id
      AND uc2.access_source = 'purchase'
  );

-- Step 5: Drop old table
DROP TABLE user_contents_old;

-- Step 6: Create indexes
CREATE INDEX idx_user_contents_user_active ON user_contents(user_id, is_active) WHERE is_active = true;
CREATE INDEX idx_user_contents_content_active ON user_contents(content_id, is_active) WHERE is_active = true;
CREATE INDEX idx_user_contents_purchase ON user_contents(purchase_id) WHERE purchase_id IS NOT NULL;
CREATE INDEX idx_user_contents_subscription ON user_contents(subscription_id) WHERE subscription_id IS NOT NULL;
CREATE INDEX idx_user_contents_revoked ON user_contents(revoked_at) WHERE revoked_at IS NOT NULL;

-- Step 7: Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_user_contents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_contents_updated_at
BEFORE UPDATE ON user_contents
FOR EACH ROW
EXECUTE FUNCTION update_user_contents_updated_at();

-- Step 8: Create function to revoke access on refund
CREATE OR REPLACE FUNCTION revoke_access_on_refund()
RETURNS TRIGGER AS $$
BEGIN
  -- When purchase is refunded, revoke access
  IF NEW.status = 'refunded' AND OLD.status != 'refunded' THEN
    UPDATE user_contents
    SET
      is_active = false,
      revoked_at = NOW(),
      revoke_reason = 'refund'
    WHERE purchase_id = NEW.id
      AND is_active = true;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER purchases_revoke_on_refund
AFTER UPDATE ON purchases
FOR EACH ROW
EXECUTE FUNCTION revoke_access_on_refund();

-- Step 9: Create function to revoke access on subscription cancellation
CREATE OR REPLACE FUNCTION revoke_access_on_subscription_cancel()
RETURNS TRIGGER AS $$
BEGIN
  -- When subscription is cancelled or expired, revoke access
  IF NEW.status IN ('cancelled', 'expired') AND OLD.status = 'active' THEN
    UPDATE user_contents
    SET
      is_active = false,
      revoked_at = NOW(),
      revoke_reason = CASE
        WHEN NEW.status = 'cancelled' THEN 'subscription_cancelled'
        ELSE 'subscription_expired'
      END
    WHERE subscription_id = NEW.id
      AND is_active = true;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER subscriptions_revoke_on_cancel
AFTER UPDATE ON subscriptions
FOR EACH ROW
EXECUTE FUNCTION revoke_access_on_subscription_cancel();

-- Step 10: Create helper function to grant subscription access
CREATE OR REPLACE FUNCTION grant_subscription_access(sub_id UUID)
RETURNS void AS $$
DECLARE
  sub_user_id UUID;
BEGIN
  -- Get subscription user_id
  SELECT user_id INTO sub_user_id
  FROM subscriptions
  WHERE id = sub_id AND status = 'active';

  IF sub_user_id IS NULL THEN
    RAISE EXCEPTION 'Subscription % not found or not active', sub_id;
  END IF;

  -- Grant access to all premium content
  INSERT INTO user_contents (user_id, content_id, access_source, subscription_id, is_active)
  SELECT sub_user_id, c.id, 'subscription'::access_source, sub_id, true
  FROM contents c
  WHERE c.is_premium = true
    AND c.status = 'published'
    AND NOT EXISTS (
      SELECT 1 FROM user_contents uc
      WHERE uc.user_id = sub_user_id
        AND uc.content_id = c.id
        AND uc.is_active = true
    )
  ON CONFLICT (user_id, content_id, access_source)
  DO UPDATE SET is_active = true, revoked_at = NULL, revoke_reason = NULL;
END;
$$ LANGUAGE plpgsql;

-- Step 11: Enable RLS
ALTER TABLE user_contents ENABLE ROW LEVEL SECURITY;

-- Step 12: Create RLS policies
-- Users can view their own active access
CREATE POLICY "Users can view their own access"
ON user_contents
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Service role can manage all access (for admin operations and triggers)
CREATE POLICY "Service role can manage access"
ON user_contents
FOR ALL
TO service_role
USING (true);

-- Note: Admin role policies will be added in migration 20241211_06

-- Step 13: Comments for documentation
COMMENT ON TABLE user_contents IS 'Tracks user access to content with proper revocation support. access_source determines which FK is used.';
COMMENT ON COLUMN user_contents.access_source IS 'Determines access origin: free, purchase, subscription, or admin_grant';
COMMENT ON COLUMN user_contents.purchase_id IS 'FK to purchases table (required when access_source=purchase)';
COMMENT ON COLUMN user_contents.subscription_id IS 'FK to subscriptions table (required when access_source=subscription)';
COMMENT ON COLUMN user_contents.is_active IS 'False when access is revoked (refund/cancellation)';
COMMENT ON COLUMN user_contents.revoked_at IS 'Timestamp when access was revoked';
COMMENT ON COLUMN user_contents.revoke_reason IS 'Reason for revocation: refund, subscription_cancelled, admin_revoked';

-- =====================================================
-- Post-Migration Notes:
-- =====================================================
-- 1. BREAKING CHANGE: access_type column removed, replaced with access_source enum
-- 2. Refunds now automatically revoke access via trigger
-- 3. Subscription cancellation automatically revokes access via trigger
-- 4. Use grant_subscription_access(sub_id) to grant access for new subscriptions
-- 5. Example query to check active access:
--    SELECT * FROM user_contents WHERE user_id = $1 AND is_active = true
-- =====================================================
