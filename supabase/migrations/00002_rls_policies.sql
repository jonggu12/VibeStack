-- =====================================================
-- VibeStack Row Level Security (RLS) Policies
-- =====================================================

-- =====================================================
-- 1. USERS TABLE
-- =====================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can view their own data
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (clerk_user_id = auth.uid()::text);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (clerk_user_id = auth.uid()::text);

-- Service role can do anything (for webhooks, admin operations)
CREATE POLICY "Service role full access to users" ON users
    FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- 2. SUBSCRIPTIONS TABLE
-- =====================================================
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscription
CREATE POLICY "Users can view own subscription" ON subscriptions
    FOR SELECT USING (
        user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text)
    );

-- Service role can manage subscriptions (webhooks)
CREATE POLICY "Service role full access to subscriptions" ON subscriptions
    FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- 3. TEAM MEMBERS TABLE
-- =====================================================
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Users can view team members of their subscription
CREATE POLICY "Users can view own team members" ON team_members
    FOR SELECT USING (
        subscription_id IN (
            SELECT id FROM subscriptions
            WHERE user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text)
        )
        OR user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text)
    );

-- Team owners/admins can manage members
CREATE POLICY "Team owners can manage members" ON team_members
    FOR ALL USING (
        subscription_id IN (
            SELECT tm.subscription_id FROM team_members tm
            JOIN users u ON tm.user_id = u.id
            WHERE u.clerk_user_id = auth.uid()::text
            AND tm.role IN ('owner', 'admin')
        )
    );

CREATE POLICY "Service role full access to team_members" ON team_members
    FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- 4. CONTENTS TABLE
-- =====================================================
ALTER TABLE contents ENABLE ROW LEVEL SECURITY;

-- Anyone can view published content
CREATE POLICY "Anyone can view published content" ON contents
    FOR SELECT USING (status = 'published');

-- Authors can view their own drafts
CREATE POLICY "Authors can view own drafts" ON contents
    FOR SELECT USING (
        author_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text)
    );

-- Authors can update their own content
CREATE POLICY "Authors can update own content" ON contents
    FOR UPDATE USING (
        author_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text)
    );

-- Service role for admin operations
CREATE POLICY "Service role full access to contents" ON contents
    FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- 5. TAGS & CONTENT_TAGS
-- =====================================================
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_tags ENABLE ROW LEVEL SECURITY;

-- Anyone can view tags
CREATE POLICY "Anyone can view tags" ON tags
    FOR SELECT USING (true);

CREATE POLICY "Anyone can view content_tags" ON content_tags
    FOR SELECT USING (true);

CREATE POLICY "Service role full access to tags" ON tags
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to content_tags" ON content_tags
    FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- 6. BUNDLES & BUNDLE_CONTENTS
-- =====================================================
ALTER TABLE bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundle_contents ENABLE ROW LEVEL SECURITY;

-- Anyone can view active bundles
CREATE POLICY "Anyone can view active bundles" ON bundles
    FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view bundle_contents" ON bundle_contents
    FOR SELECT USING (true);

CREATE POLICY "Service role full access to bundles" ON bundles
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to bundle_contents" ON bundle_contents
    FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- 7. PURCHASES TABLE
-- =====================================================
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Users can view their own purchases
CREATE POLICY "Users can view own purchases" ON purchases
    FOR SELECT USING (
        user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text)
    );

-- Service role for payment processing
CREATE POLICY "Service role full access to purchases" ON purchases
    FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- 8. USER_CONTENTS TABLE
-- =====================================================
ALTER TABLE user_contents ENABLE ROW LEVEL SECURITY;

-- Users can view their own access rights
CREATE POLICY "Users can view own content access" ON user_contents
    FOR SELECT USING (
        user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text)
    );

-- Service role for granting access
CREATE POLICY "Service role full access to user_contents" ON user_contents
    FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- 9. USER_PROGRESS TABLE
-- =====================================================
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Users can view their own progress
CREATE POLICY "Users can view own progress" ON user_progress
    FOR SELECT USING (
        user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text)
    );

-- Users can update their own progress
CREATE POLICY "Users can update own progress" ON user_progress
    FOR UPDATE USING (
        user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text)
    );

-- Users can insert their own progress
CREATE POLICY "Users can insert own progress" ON user_progress
    FOR INSERT WITH CHECK (
        user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text)
    );

CREATE POLICY "Service role full access to user_progress" ON user_progress
    FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- 10. RATINGS TABLE
-- =====================================================
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Anyone can view ratings (for trust indicators)
CREATE POLICY "Anyone can view ratings" ON ratings
    FOR SELECT USING (true);

-- Users can create/update their own ratings
CREATE POLICY "Users can manage own ratings" ON ratings
    FOR ALL USING (
        user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text)
    );

CREATE POLICY "Service role full access to ratings" ON ratings
    FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- 11. COMMENTS TABLE
-- =====================================================
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Anyone can view non-deleted comments
CREATE POLICY "Anyone can view comments" ON comments
    FOR SELECT USING (is_deleted = false);

-- Users can create comments
CREATE POLICY "Users can create comments" ON comments
    FOR INSERT WITH CHECK (
        user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text)
    );

-- Users can update their own comments
CREATE POLICY "Users can update own comments" ON comments
    FOR UPDATE USING (
        user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text)
    );

CREATE POLICY "Service role full access to comments" ON comments
    FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- 12. PROJECTS TABLE
-- =====================================================
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Users can view their own projects
CREATE POLICY "Users can view own projects" ON projects
    FOR SELECT USING (
        user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text)
        OR team_id IN (
            SELECT subscription_id FROM team_members
            WHERE user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text)
        )
    );

-- Users can manage their own projects
CREATE POLICY "Users can manage own projects" ON projects
    FOR ALL USING (
        user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text)
    );

CREATE POLICY "Service role full access to projects" ON projects
    FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- 13. ERROR_PATTERNS & ERROR_REPORTS
-- =====================================================
ALTER TABLE error_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_reports ENABLE ROW LEVEL SECURITY;

-- Anyone can view active error patterns (for diagnosis)
CREATE POLICY "Anyone can view error patterns" ON error_patterns
    FOR SELECT USING (is_active = true);

-- Users can view their own error reports
CREATE POLICY "Users can view own error reports" ON error_reports
    FOR SELECT USING (
        user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text)
    );

-- Users can create error reports
CREATE POLICY "Users can create error reports" ON error_reports
    FOR INSERT WITH CHECK (
        user_id IS NULL OR user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text)
    );

CREATE POLICY "Service role full access to error_patterns" ON error_patterns
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to error_reports" ON error_reports
    FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- 14. CREDITS TABLE
-- =====================================================
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;

-- Users can view their own credits
CREATE POLICY "Users can view own credits" ON credits
    FOR SELECT USING (
        user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text)
    );

CREATE POLICY "Service role full access to credits" ON credits
    FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- 15. PROMO_CODES & PROMO_USES
-- =====================================================
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_uses ENABLE ROW LEVEL SECURITY;

-- Anyone can view active promo codes (for validation)
CREATE POLICY "Anyone can view active promo codes" ON promo_codes
    FOR SELECT USING (
        is_active = true
        AND (valid_from IS NULL OR valid_from <= NOW())
        AND (valid_until IS NULL OR valid_until >= NOW())
    );

-- Users can view their own promo uses
CREATE POLICY "Users can view own promo uses" ON promo_uses
    FOR SELECT USING (
        user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text)
    );

CREATE POLICY "Service role full access to promo_codes" ON promo_codes
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to promo_uses" ON promo_uses
    FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- 16. EVENTS & SEARCH_LOGS (Analytics)
-- =====================================================
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own events
CREATE POLICY "Users can view own events" ON events
    FOR SELECT USING (
        user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text)
    );

-- Users can create events
CREATE POLICY "Users can create events" ON events
    FOR INSERT WITH CHECK (
        user_id IS NULL OR user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text)
    );

-- Users can create search logs
CREATE POLICY "Users can create search logs" ON search_logs
    FOR INSERT WITH CHECK (
        user_id IS NULL OR user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text)
    );

CREATE POLICY "Service role full access to events" ON events
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to search_logs" ON search_logs
    FOR ALL USING (auth.role() = 'service_role');
