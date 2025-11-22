-- =====================================================
-- VibeStack Initial Database Schema
-- Based on ERD.md + Toss Payments Integration
-- =====================================================

-- =====================================================
-- 1. ENUM TYPES
-- =====================================================

-- Subscription
CREATE TYPE subscription_plan AS ENUM ('free', 'pro', 'team');
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'expired', 'trialing', 'unpaid', 'incomplete', 'incomplete_expired');

-- Content
CREATE TYPE content_type AS ENUM ('doc', 'tutorial', 'snippet', 'bundle');
CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived');

-- Purchase
CREATE TYPE purchase_status AS ENUM ('pending', 'completed', 'failed', 'refunded', 'partially_refunded', 'aborted', 'expired');

-- Access
CREATE TYPE access_type AS ENUM ('free', 'purchased', 'subscription', 'team');

-- Progress
CREATE TYPE progress_status AS ENUM ('not_started', 'in_progress', 'completed');

-- Team
CREATE TYPE team_role AS ENUM ('owner', 'admin', 'member');

-- Credits
CREATE TYPE credit_source AS ENUM ('purchase', 'refund', 'promo', 'referral');

-- Events
CREATE TYPE event_type AS ENUM (
    'page_view',
    'content_view',
    'content_start',
    'content_complete',
    'search',
    'error_diagnose',
    'purchase_start',
    'purchase_complete',
    'subscription_start',
    'subscription_cancel'
);

-- Promo
CREATE TYPE discount_type AS ENUM ('percent', 'fixed');
CREATE TYPE promo_applies_to AS ENUM ('all', 'subscription', 'purchase');

-- Payment Provider
CREATE TYPE payment_provider AS ENUM ('stripe', 'toss');

-- =====================================================
-- 2. CORE TABLES
-- =====================================================

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_user_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar_url TEXT,
    purchase_credits INTEGER DEFAULT 0, -- KRW credits from single purchases
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_clerk_id ON users(clerk_user_id);
CREATE INDEX idx_users_email ON users(email);

-- Subscriptions
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_type subscription_plan DEFAULT 'free',
    status subscription_status DEFAULT 'active',
    payment_provider payment_provider DEFAULT 'stripe',
    currency VARCHAR(3) DEFAULT 'krw',

    -- Stripe fields
    stripe_subscription_id TEXT UNIQUE,
    stripe_customer_id TEXT,
    stripe_price_id TEXT,

    -- Toss Payments fields
    toss_payment_key TEXT,
    toss_order_id TEXT,
    toss_billing_key TEXT,
    toss_customer_key TEXT,
    card_last_four VARCHAR(4),
    card_brand VARCHAR(50),

    -- Period tracking
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,

    -- Cancellation
    cancel_at TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT false,
    canceled_at TIMESTAMPTZ,
    cancel_reason TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(user_id) -- One subscription per user
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_stripe ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_toss_billing ON subscriptions(toss_billing_key) WHERE toss_billing_key IS NOT NULL;
CREATE INDEX idx_subscriptions_renewal ON subscriptions(status, cancel_at_period_end, current_period_end)
    WHERE status = 'active' AND cancel_at_period_end = false;

-- Team Members
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role team_role DEFAULT 'member',
    joined_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(subscription_id, user_id)
);

CREATE INDEX idx_team_members_sub ON team_members(subscription_id);
CREATE INDEX idx_team_members_user ON team_members(user_id);

-- =====================================================
-- 3. CONTENT TABLES
-- =====================================================

-- Contents (Unified table for docs, tutorials, snippets)
CREATE TABLE contents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type content_type NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT, -- MDX content
    stack JSONB, -- {framework: "Next.js 14", auth: "Clerk", ...}
    difficulty difficulty_level,
    estimated_time_mins INTEGER,
    price_cents INTEGER DEFAULT 0, -- 0 = free
    is_premium BOOLEAN DEFAULT false,

    author_id UUID REFERENCES users(id),
    status content_status DEFAULT 'draft',

    -- Statistics
    views INTEGER DEFAULT 0,
    completions INTEGER DEFAULT 0,
    avg_rating DECIMAL(3,2),

    -- SEO
    meta_title TEXT,
    meta_description TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

CREATE INDEX idx_contents_slug ON contents(slug);
CREATE INDEX idx_contents_type ON contents(type);
CREATE INDEX idx_contents_status ON contents(status);
CREATE INDEX idx_contents_is_premium ON contents(is_premium);
CREATE INDEX idx_contents_stack ON contents USING GIN(stack);
CREATE INDEX idx_contents_published ON contents(published_at) WHERE status = 'published';
CREATE INDEX idx_contents_search ON contents USING GIN(
    to_tsvector('english', title || ' ' || COALESCE(description, ''))
);

-- Tags
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL
);

-- Content Tags (Junction)
CREATE TABLE content_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID REFERENCES contents(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,

    UNIQUE(content_id, tag_id)
);

CREATE INDEX idx_content_tags_content ON content_tags(content_id);
CREATE INDEX idx_content_tags_tag ON content_tags(tag_id);

-- Bundles
CREATE TABLE bundles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price_cents INTEGER NOT NULL,
    discount_pct INTEGER, -- Discount compared to individual prices
    thumbnail_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bundle Contents (Junction)
CREATE TABLE bundle_contents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bundle_id UUID REFERENCES bundles(id) ON DELETE CASCADE,
    content_id UUID REFERENCES contents(id) ON DELETE CASCADE,
    display_order INTEGER,

    UNIQUE(bundle_id, content_id)
);

CREATE INDEX idx_bundle_contents_bundle ON bundle_contents(bundle_id);
CREATE INDEX idx_bundle_contents_content ON bundle_contents(content_id);

-- =====================================================
-- 4. PURCHASE & ACCESS TABLES
-- =====================================================

-- Purchases
CREATE TABLE purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content_id UUID REFERENCES contents(id),
    bundle_id UUID REFERENCES bundles(id),

    amount_cents INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'krw',
    status purchase_status DEFAULT 'pending',
    payment_provider payment_provider DEFAULT 'stripe',
    payment_method VARCHAR(50),

    -- Stripe fields
    stripe_payment_intent_id TEXT UNIQUE,
    stripe_checkout_session_id TEXT,

    -- Toss Payments fields
    toss_payment_key TEXT,
    toss_order_id TEXT,

    refund_reason TEXT,
    refunded_at TIMESTAMPTZ,

    purchased_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CHECK (
        (content_id IS NOT NULL AND bundle_id IS NULL) OR
        (content_id IS NULL AND bundle_id IS NOT NULL)
    )
);

CREATE INDEX idx_purchases_user ON purchases(user_id);
CREATE INDEX idx_purchases_content ON purchases(content_id);
CREATE INDEX idx_purchases_bundle ON purchases(bundle_id);
CREATE INDEX idx_purchases_status ON purchases(status);
CREATE INDEX idx_purchases_date ON purchases(purchased_at);
CREATE INDEX idx_purchases_toss_payment ON purchases(toss_payment_key) WHERE toss_payment_key IS NOT NULL;
CREATE INDEX idx_purchases_toss_order ON purchases(toss_order_id) WHERE toss_order_id IS NOT NULL;

-- User Contents (Access Rights)
CREATE TABLE user_contents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content_id UUID REFERENCES contents(id) ON DELETE CASCADE,
    access_type access_type NOT NULL,

    purchase_id UUID REFERENCES purchases(id),

    granted_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,

    UNIQUE(user_id, content_id)
);

CREATE INDEX idx_user_contents_user ON user_contents(user_id);
CREATE INDEX idx_user_contents_content ON user_contents(content_id);
CREATE INDEX idx_user_contents_type ON user_contents(access_type);
CREATE INDEX idx_user_contents_expires ON user_contents(expires_at) WHERE expires_at IS NOT NULL;

-- =====================================================
-- 5. LEARNING PROGRESS TABLES
-- =====================================================

-- User Progress
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content_id UUID REFERENCES contents(id) ON DELETE CASCADE,

    status progress_status DEFAULT 'not_started',
    progress_pct INTEGER DEFAULT 0, -- 0-100
    time_spent_mins INTEGER DEFAULT 0,

    last_checkpoint JSONB, -- {phase: 3, step: 2, ...}

    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(user_id, content_id)
);

CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_user_progress_content ON user_progress(content_id);
CREATE INDEX idx_user_progress_status ON user_progress(status);

-- Ratings
CREATE TABLE ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content_id UUID REFERENCES contents(id) ON DELETE CASCADE,

    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    works BOOLEAN, -- Did it work?
    time_spent_mins INTEGER,
    feedback TEXT,
    nextjs_version TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(user_id, content_id)
);

CREATE INDEX idx_ratings_content ON ratings(content_id);
CREATE INDEX idx_ratings_works ON ratings(works);
CREATE INDEX idx_ratings_content_created ON ratings(content_id, created_at);

-- Comments
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content_id UUID REFERENCES contents(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- Self-reference for replies

    content TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    is_pinned BOOLEAN DEFAULT false,
    is_deleted BOOLEAN DEFAULT false,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_comments_content ON comments(content_id);
CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_comments_parent ON comments(parent_id);

-- =====================================================
-- 6. PROJECTS & ERROR DIAGNOSIS
-- =====================================================

-- Projects
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    team_id UUID REFERENCES subscriptions(id), -- For team projects

    name TEXT NOT NULL,
    description TEXT,
    stack JSONB, -- Project tech stack
    status TEXT DEFAULT 'active', -- active, completed, archived

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_projects_user ON projects(user_id);
CREATE INDEX idx_projects_team ON projects(team_id);

-- Error Patterns (For error diagnosis feature)
CREATE TABLE error_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pattern TEXT NOT NULL, -- Regex pattern
    diagnosis TEXT NOT NULL,
    solution JSONB, -- Structured solution steps
    confidence INTEGER CHECK (confidence BETWEEN 0 AND 100),
    resolved_count INTEGER DEFAULT 0,
    priority INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_error_patterns_active ON error_patterns(is_active) WHERE is_active = true;

-- Error Reports (User error logs)
CREATE TABLE error_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    pattern_id UUID REFERENCES error_patterns(id) ON DELETE SET NULL,

    error_message TEXT NOT NULL,
    stack_trace TEXT,
    context JSONB, -- Additional context
    was_solved BOOLEAN,
    solution_used TEXT,

    reported_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_error_reports_user ON error_reports(user_id);
CREATE INDEX idx_error_reports_pattern ON error_reports(pattern_id);

-- =====================================================
-- 7. CREDITS & PROMOS
-- =====================================================

-- Credits
CREATE TABLE credits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,

    amount_cents INTEGER NOT NULL,
    balance_cents INTEGER NOT NULL, -- Remaining balance
    source credit_source NOT NULL,

    purchase_id UUID REFERENCES purchases(id),
    description TEXT,

    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_credits_user ON credits(user_id);
CREATE INDEX idx_credits_balance ON credits(balance_cents) WHERE balance_cents > 0;
CREATE INDEX idx_credits_expires ON credits(expires_at) WHERE expires_at IS NOT NULL;

-- Promo Codes
CREATE TABLE promo_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    discount_type discount_type NOT NULL,
    discount_value INTEGER NOT NULL,
    applies_to promo_applies_to DEFAULT 'all',
    max_uses INTEGER,
    used_count INTEGER DEFAULT 0,
    valid_from TIMESTAMPTZ DEFAULT NOW(),
    valid_until TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_promo_codes_code ON promo_codes(code);
CREATE INDEX idx_promo_codes_active ON promo_codes(is_active, valid_from, valid_until);

-- Promo Uses
CREATE TABLE promo_uses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    promo_code_id UUID REFERENCES promo_codes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    purchase_id UUID REFERENCES purchases(id),
    subscription_id UUID REFERENCES subscriptions(id),

    used_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_promo_uses_code ON promo_uses(promo_code_id);
CREATE INDEX idx_promo_uses_user ON promo_uses(user_id);

-- =====================================================
-- 8. ANALYTICS & LOGS
-- =====================================================

-- Events (Analytics tracking)
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,

    event_type event_type NOT NULL,
    content_id UUID REFERENCES contents(id) ON DELETE SET NULL,

    metadata JSONB,
    session_id TEXT,
    ip_address INET,
    user_agent TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_type_date ON events(event_type, created_at);
CREATE INDEX idx_events_user_date ON events(user_id, created_at);
CREATE INDEX idx_events_content ON events(content_id) WHERE content_id IS NOT NULL;

-- Search Logs
CREATE TABLE search_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,

    query TEXT NOT NULL,
    filters JSONB,
    results_count INTEGER,
    clicked_result_id UUID REFERENCES contents(id) ON DELETE SET NULL,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_search_logs_user ON search_logs(user_id);
CREATE INDEX idx_search_logs_date ON search_logs(created_at);

-- =====================================================
-- 9. HELPER FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contents_updated_at BEFORE UPDATE ON contents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bundles_updated_at BEFORE UPDATE ON bundles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchases_updated_at BEFORE UPDATE ON purchases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ratings_updated_at BEFORE UPDATE ON ratings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_error_patterns_updated_at BEFORE UPDATE ON error_patterns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 10. COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE users IS 'User accounts synced from Clerk';
COMMENT ON COLUMN users.purchase_credits IS 'KRW credits from single purchases, applied when converting to Pro';

COMMENT ON TABLE subscriptions IS 'User subscription information supporting both Stripe and Toss Payments';
COMMENT ON COLUMN subscriptions.payment_provider IS 'Payment provider: stripe or toss';
COMMENT ON COLUMN subscriptions.toss_billing_key IS 'Toss Payments billing key for recurring payments';
COMMENT ON COLUMN subscriptions.toss_customer_key IS 'Toss Payments customer identifier';
COMMENT ON COLUMN subscriptions.cancel_at_period_end IS 'If true, subscription will cancel at period end';

COMMENT ON TABLE contents IS 'Unified content table for docs, tutorials, and snippets';
COMMENT ON COLUMN contents.stack IS 'Tech stack as JSONB: {framework: "Next.js 14", auth: "Clerk", ...}';

COMMENT ON TABLE purchases IS 'Single content purchases supporting both Stripe and Toss Payments';
COMMENT ON COLUMN purchases.payment_provider IS 'Payment provider: stripe or toss';

COMMENT ON TABLE user_contents IS 'User access rights to content (free, purchased, subscription)';
COMMENT ON TABLE user_progress IS 'Learning progress tracking for tutorials';
COMMENT ON TABLE ratings IS 'User ratings with "works" boolean for success rate tracking';
COMMENT ON TABLE credits IS 'Credit system for purchase-to-Pro conversion';
COMMENT ON TABLE error_patterns IS 'Error patterns for AI error diagnosis feature';
