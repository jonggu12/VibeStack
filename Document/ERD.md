
---

## 🗄️ VibeStack ERD 설계

### 핵심 설계 원칙

```yaml
1. 유연성: 단품 구매 + 구독 동시 지원
2. 확장성: 콘텐츠 타입 쉽게 추가
3. 추적성: 사용자 행동 완전 추적
4. 성능: 자주 조회되는 데이터 최적화
```

---

## 📊 ERD 다이어그램

```
┌─────────────────┐
│     users       │
├─────────────────┤
│ id (PK)         │◄─────────┐
│ clerk_user_id   │          │
│ email           │          │
│ name            │          │
│ avatar_url      │          │
│ created_at      │          │
└─────────────────┘          │
         │                   │
         │                   │
         ▼                   │
┌─────────────────┐          │
│ subscriptions   │          │
├─────────────────┤          │
│ id (PK)         │          │
│ user_id (FK)    │──────────┘
│ plan_type       │ (enum: free, pro, team)
│ status          │ (enum: active, canceled, expired)
│ stripe_sub_id   │
│ stripe_cust_id  │
│ current_period_end
│ cancel_at       │
│ created_at      │
│ updated_at      │
└─────────────────┘
         │
         │
         ▼
┌─────────────────┐
│ team_members    │ (Team Plan용)
├─────────────────┤
│ id (PK)         │
│ subscription_id (FK)
│ user_id (FK)    │
│ role            │ (enum: owner, admin, member)
│ joined_at       │
└─────────────────┘


┌─────────────────┐
│ content_types   │ (Lookup Table)
├─────────────────┤
│ id (PK)         │
│ name            │ (doc, tutorial, snippet, bundle)
│ slug            │
└─────────────────┘
         │
         │
         ▼
┌─────────────────┐
│ contents        │ (통합 콘텐츠 테이블)
├─────────────────┤
│ id (PK)         │◄─────────┐
│ type_id (FK)    │          │
│ slug            │          │
│ title           │          │
│ description     │          │
│ content         │ (MDX)    │
│ stack           │ (JSONB)  │
│ difficulty      │ (enum)   │
│ estimated_time  │ (분)     │
│ price_cents     │ (0=무료) │
│ is_premium      │ (boolean)│
│ author_id (FK)  │          │
│ status          │ (enum)   │
│ views           │          │
│ completions     │          │
│ avg_rating      │          │
│ created_at      │          │
│ updated_at      │          │
│ published_at    │          │
└─────────────────┘          │
         │                   │
         │                   │
         ▼                   │
┌─────────────────┐          │
│ content_tags    │          │
├─────────────────┤          │
│ content_id (FK) │──────────┘
│ tag_id (FK)     │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│ tags            │
├─────────────────┤
│ id (PK)         │
│ name            │
│ slug            │
└─────────────────┘


┌─────────────────┐
│ bundles         │
├─────────────────┤
│ id (PK)         │◄─────────┐
│ name            │          │
│ description     │          │
│ price_cents     │          │
│ discount_pct    │          │
│ thumbnail_url   │          │
│ is_active       │          │
└─────────────────┘          │
         │                   │
         │                   │
         ▼                   │
┌─────────────────┐          │
│ bundle_contents │          │
├─────────────────┤          │
│ bundle_id (FK)  │──────────┘
│ content_id (FK) │
│ order           │
└─────────────────┘


┌─────────────────┐
│ purchases       │ (단품 구매)
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │◄─────┐
│ content_id (FK) │      │
│ bundle_id (FK)  │ (nullable)
│ amount_cents    │      │
│ stripe_payment_intent_id
│ status          │ (enum: pending, completed, refunded)
│ purchased_at    │      │
└─────────────────┘      │
         │               │
         │               │
         ▼               │
┌─────────────────┐      │
│ user_contents   │ (사용자 소유 콘텐츠)
├─────────────────┤      │
│ id (PK)         │      │
│ user_id (FK)    │──────┘
│ content_id (FK) │
│ access_type     │ (enum: free, purchased, subscription)
│ granted_at      │
│ expires_at      │ (nullable, 구독 종료 시)
└─────────────────┘
         │
         │
         ▼
┌─────────────────┐
│ user_progress   │ (학습 진행률)
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │
│ content_id (FK) │
│ status          │ (enum: not_started, in_progress, completed)
│ progress_pct    │ (0-100)
│ time_spent_mins │
│ last_checkpoint │ (JSONB)
│ started_at      │
│ completed_at    │
│ updated_at      │
└─────────────────┘


┌─────────────────┐
│ ratings         │
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │
│ content_id (FK) │
│ rating          │ (1-5)
│ works           │ (boolean)
│ time_spent_mins │
│ feedback        │ (text)
│ nextjs_version  │
│ created_at      │
│ updated_at      │
└─────────────────┘
         │
         │ UNIQUE (user_id, content_id)
         │


┌─────────────────┐
│ comments        │
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │
│ content_id (FK) │
│ parent_id (FK)  │ (self-reference)
│ content         │
│ likes           │
│ is_pinned       │
│ is_deleted      │
│ created_at      │
│ updated_at      │
└─────────────────┘


┌─────────────────┐
│ projects        │
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │
│ team_id (FK)    │ (nullable, Team Plan용)
│ name            │
│ description     │
│ stack           │ (JSONB)
│ status          │ (enum: active, completed, archived)
│ created_at      │
│ updated_at      │
└─────────────────┘


┌─────────────────┐
│ error_patterns  │ (에러 진단용)
├─────────────────┤
│ id (PK)         │
│ pattern         │ (regex)
│ diagnosis       │
│ solution        │ (JSONB)
│ confidence      │ (0-100)
│ resolved_count  │
│ priority        │
│ is_active       │
│ created_at      │
│ updated_at      │
└─────────────────┘
         │
         │
         ▼
┌─────────────────┐
│ error_reports   │ (사용자 에러 로그)
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │
│ pattern_id (FK) │ (nullable)
│ error_message   │
│ stack_trace     │
│ context         │ (JSONB)
│ was_solved      │
│ solution_used   │
│ reported_at     │
└─────────────────┘


┌─────────────────┐
│ events          │ (Analytics)
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │ (nullable)
│ event_type      │ (enum)
│ content_id (FK) │ (nullable)
│ metadata        │ (JSONB)
│ session_id      │
│ created_at      │
└─────────────────┘

Index: event_type, content_id, created_at


┌─────────────────┐
│ search_logs     │ (검색 로그)
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │ (nullable)
│ query           │
│ filters         │ (JSONB)
│ results_count   │
│ clicked_result_id
│ created_at      │
└─────────────────┘


┌─────────────────┐
│ credits         │ (크레딧 시스템)
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │
│ amount_cents    │
│ source          │ (enum: purchase, refund, promo)
│ purchase_id (FK)│ (nullable)
│ expires_at      │ (nullable)
│ created_at      │
└─────────────────┘


┌─────────────────┐
│ promo_codes     │ (프로모션 코드)
├─────────────────┤
│ id (PK)         │
│ code            │ (UNIQUE)
│ discount_type   │ (enum: percent, fixed)
│ discount_value  │
│ applies_to      │ (enum: all, subscription, purchase)
│ max_uses        │
│ used_count      │
│ valid_from      │
│ valid_until     │
│ is_active       │
└─────────────────┘
         │
         │
         ▼
┌─────────────────┐
│ promo_uses      │
├─────────────────┤
│ id (PK)         │
│ promo_code_id (FK)
│ user_id (FK)    │
│ purchase_id (FK)│ (nullable)
│ subscription_id │ (nullable)
│ used_at         │
└─────────────────┘
```

---

## 📋 테이블 상세 설명

### 1. 핵심 사용자 테이블

#### `users` (사용자)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_clerk_id ON users(clerk_user_id);
CREATE INDEX idx_users_email ON users(email);
```

**왜 Clerk ID 별도 저장?**

- Clerk에서 사용자 정보 관리
- 우리 DB는 비즈니스 로직만 (구매, 진행률 등)
- Clerk ID로 연결

---

#### `subscriptions` (구독)

```sql
CREATE TYPE subscription_plan AS ENUM ('free', 'pro', 'team');
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'expired');

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan_type subscription_plan DEFAULT 'free',
  status subscription_status DEFAULT 'active',
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  current_period_end TIMESTAMPTZ,
  cancel_at TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id) -- 사용자당 1개 구독만
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_stripe ON subscriptions(stripe_subscription_id);
```

**비즈니스 로직:**

- Free 유저도 레코드 존재 (plan_type='free')
- Pro 전환 시 같은 레코드 업데이트
- Stripe webhook으로 상태 동기화

---

#### `team_members` (팀 멤버)

```sql
CREATE TYPE team_role AS ENUM ('owner', 'admin', 'member');

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
```

---

### 2. 콘텐츠 테이블

#### `contents` (통합 콘텐츠)

```sql
CREATE TYPE content_type AS ENUM ('doc', 'tutorial', 'snippet', 'bundle');
CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived');

CREATE TABLE contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type content_type NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT, -- MDX
  stack JSONB, -- {framework: "Next.js 14", auth: "Clerk", ...}
  difficulty difficulty_level,
  estimated_time_mins INTEGER, -- 예상 소요 시간 (분)
  price_cents INTEGER DEFAULT 0, -- 0 = 무료
  is_premium BOOLEAN DEFAULT false,
  
  author_id UUID REFERENCES users(id),
  status content_status DEFAULT 'draft',
  
  -- 통계
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

-- Full-text search
CREATE INDEX idx_contents_search ON contents USING GIN(
  to_tsvector('english', title || ' ' || COALESCE(description, ''))
);
```

**왜 통합 테이블?**

- 문서/튜토리얼/스니펫 구조 유사
- 타입별로 나누면 JOIN 폭발
- `type` 필드로 구분
- 필요 시 View로 분리

---

#### `bundles` (번들)

```sql
CREATE TABLE bundles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL,
  discount_pct INTEGER, -- 개별 합계 대비 할인율
  thumbnail_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE bundle_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_id UUID REFERENCES bundles(id) ON DELETE CASCADE,
  content_id UUID REFERENCES contents(id) ON DELETE CASCADE,
  display_order INTEGER,
  
  UNIQUE(bundle_id, content_id)
);

CREATE INDEX idx_bundle_contents_bundle ON bundle_contents(bundle_id);
CREATE INDEX idx_bundle_contents_content ON bundle_contents(content_id);
```

---

### 3. 구매 & 접근 권한

#### `purchases` (단품 구매)

```sql
CREATE TYPE purchase_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content_id UUID REFERENCES contents(id),
  bundle_id UUID REFERENCES bundles(id),
  
  amount_cents INTEGER NOT NULL,
  stripe_payment_intent_id TEXT UNIQUE,
  status purchase_status DEFAULT 'pending',
  
  refund_reason TEXT,
  refunded_at TIMESTAMPTZ,
  
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  
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
```

---

#### `user_contents` (사용자 접근 권한)

```sql
CREATE TYPE access_type AS ENUM ('free', 'purchased', 'subscription', 'team');

CREATE TABLE user_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content_id UUID REFERENCES contents(id) ON DELETE CASCADE,
  access_type access_type NOT NULL,
  
  purchase_id UUID REFERENCES purchases(id), -- purchased인 경우
  
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ, -- 구독 종료 시 설정
  
  UNIQUE(user_id, content_id)
);

CREATE INDEX idx_user_contents_user ON user_contents(user_id);
CREATE INDEX idx_user_contents_content ON user_contents(content_id);
CREATE INDEX idx_user_contents_type ON user_contents(access_type);
CREATE INDEX idx_user_contents_expires ON user_contents(expires_at) WHERE expires_at IS NOT NULL;
```

**접근 권한 로직:**

```sql
-- 사용자가 콘텐츠에 접근 가능한지 체크
SELECT EXISTS (
  SELECT 1 FROM user_contents
  WHERE user_id = $1
    AND content_id = $2
    AND (expires_at IS NULL OR expires_at > NOW())
)
OR EXISTS (
  SELECT 1 FROM subscriptions
  WHERE user_id = $1
    AND plan_type IN ('pro', 'team')
    AND status = 'active'
);
```

---

### 4. 학습 추적

#### `user_progress` (진행률)

```sql
CREATE TYPE progress_status AS ENUM ('not_started', 'in_progress', 'completed');

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
```

---

#### `ratings` (평가)

```sql
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content_id UUID REFERENCES contents(id) ON DELETE CASCADE,
  
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  works BOOLEAN, -- ✅/❌ 작동했나요?
  time_spent_mins INTEGER,
  feedback TEXT,
  nextjs_version TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, content_id)
);

CREATE INDEX idx_ratings_content ON ratings(content_id);
CREATE INDEX idx_ratings_works ON ratings(works);
```

---

### 5. 크레딧 시스템

#### `credits` (크레딧)

```sql
CREATE TYPE credit_source AS ENUM ('purchase', 'refund', 'promo', 'referral');

CREATE TABLE credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  amount_cents INTEGER NOT NULL,
  balance_cents INTEGER NOT NULL, -- 잔액
  source credit_source NOT NULL,
  
  purchase_id UUID REFERENCES purchases(id),
  description TEXT,
  
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_credits_user ON credits(user_id);
CREATE INDEX idx_credits_balance ON credits(balance_cents) WHERE balance_cents > 0;
CREATE INDEX idx_credits_expires ON credits(expires_at) WHERE expires_at IS NOT NULL;
```

**크레딧 로직:**

```sql
-- 사용자 총 크레딧 조회
SELECT SUM(balance_cents) 
FROM credits 
WHERE user_id = $1 
  AND balance_cents > 0
  AND (expires_at IS NULL OR expires_at > NOW());

-- Pro 전환 시 크레딧 사용
-- $12 = 1개월, $50 = 4개월
```

---

### 6. Analytics & 로그

#### `events` (이벤트 트래킹)

```sql
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

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  event_type event_type NOT NULL,
  content_id UUID REFERENCES contents(id) ON DELETE SET NULL,
  
  metadata JSONB, -- 추가 데이터
  session_id TEXT,
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partitioning by month (성능)
CREATE INDEX idx_events_type_date ON events(event_type, created_at);
CREATE INDEX idx_events_user_date ON events(user_id, created_at);
CREATE INDEX idx_events_content ON events(content_id) WHERE content_id IS NOT NULL;
```

---

## 🔑 핵심 쿼리 예시

### 1. 사용자 대시보드

```sql
-- 사용자가 접근 가능한 콘텐츠 목록
WITH user_subscription AS (
  SELECT plan_type, status
  FROM subscriptions
  WHERE user_id = $1
)
SELECT 
  c.*,
  uc.access_type,
  up.status as progress_status,
  up.progress_pct
FROM contents c
LEFT JOIN user_contents uc ON c.id = uc.content_id AND uc.user_id = $1
LEFT JOIN user_progress up ON c.id = up.content_id AND up.user_id = $1
WHERE 
  c.status = 'published'
  AND (
    c.is_premium = false -- 무료 콘텐츠
    OR uc.content_id IS NOT NULL -- 구매한 콘텐츠
    OR EXISTS (SELECT 1 FROM user_subscription WHERE plan_type IN ('pro', 'team') AND status = 'active') -- Pro/Team
  )
ORDER BY c.created_at DESC;
```

### 2. 콘텐츠 상세 + 통계

```sql
SELECT 
  c.*,
  COUNT(DISTINCT r.id) as rating_count,
  AVG(r.rating) as avg_rating,
  COUNT(DISTINCT CASE WHEN r.works = true THEN r.id END) as success_count,
  COUNT(DISTINCT up.id) FILTER (WHERE up.status = 'completed') as completion_count,
  AVG(r.time_spent_mins) as avg_time_spent
FROM contents c
LEFT JOIN ratings r ON c.id = r.content_id
LEFT JOIN user_progress up ON c.id = up.content_id
WHERE c.slug = $1
GROUP BY c.id;
```

### 3. 검색 (스택 필터링)

```sql
SELECT 
  c.*,
  ts_rank(
    to_tsvector('english', c.title || ' ' || COALESCE(c.description, '')),
    plainto_tsquery('english', $1)
  ) as rank
FROM contents c
WHERE 
  c.status = 'published'
  AND (
    to_tsvector('english', c.title || ' ' || COALESCE(c.description, '')) @@ plainto_tsquery('english', $1)
    OR c.stack @> $2::jsonb -- 스택 필터: {"framework": "Next.js 14"}
  )
ORDER BY rank DESC, c.views DESC
LIMIT 20;
```

### 4. 단품 → Pro 전환 추천

```sql
-- 사용자가 구매한 총액
WITH user_purchases AS (
  SELECT 
    user_id,
    SUM(amount_cents) as total_spent_cents,
    COUNT(*) as purchase_count
  FROM purchases
  WHERE user_id = $1 AND status = 'completed'
  GROUP BY user_id
)
SELECT 
  total_spent_cents,
  purchase_count,
  CASE 
    WHEN total_spent_cents >= 1200 THEN '지금 Pro로 전환하면 이득!'
    WHEN total_spent_cents >= 600 THEN '곧 Pro가 이득이에요'
    ELSE 'Pro는 3개 이상부터 이득'
  END as message,
  (total_spent_cents / 1200.0)::INTEGER as free_months -- $12 = 1개월
FROM user_purchases;
```

### 5. 실시간 성공률 계산

```sql
SELECT 
  c.id,
  c.title,
  COUNT(DISTINCT r.id) as total_ratings,
  COUNT(DISTINCT CASE WHEN r.works = true THEN r.id END) as success_count,
  (COUNT(DISTINCT CASE WHEN r.works = true THEN r.id END)::DECIMAL / NULLIF(COUNT(DISTINCT r.id), 0) * 100)::INTEGER as success_rate,
  AVG(r.time_spent_mins)::INTEGER as avg_time_mins,
  MAX(r.created_at) as last_verified
FROM contents c
LEFT JOIN ratings r ON c.id = r.content_id AND r.created_at > NOW() - INTERVAL '7 days'
WHERE c.id = $1
GROUP BY c.id;
```

---

## 🎯 인덱싱 전략

### 자주 조회되는 패턴

```sql
-- 1. 사용자 대시보드 (가장 빈번)
CREATE INDEX idx_user_contents_user_expires ON user_contents(user_id, expires_at);
CREATE INDEX idx_subscriptions_user_active ON subscriptions(user_id) WHERE status = 'active';

-- 2. 콘텐츠 목록 (스택 필터)
CREATE INDEX idx_contents_stack_gin ON contents USING GIN(stack);
CREATE INDEX idx_contents_published_date ON contents(published_at DESC) WHERE status = 'published';

-- 3. 검색 성능
CREATE INDEX idx_contents_fulltext ON contents USING GIN(
  to_tsvector('english', title || ' ' || COALESCE(description, ''))
);

-- 4. Analytics (날짜 범위 쿼리)
CREATE INDEX idx_events_created_type ON events(created_at, event_type);
CREATE INDEX idx_purchases_date_status ON purchases(purchased_at, status);

-- 5. 통계 계산 (집계 쿼리)
CREATE INDEX idx_ratings_content_created ON ratings(content_id, created_at);
CREATE INDEX idx_user_progress_content_status ON user_progress(content_id, status);
```

---

## 🔐 Row Level Security (RLS)

Supabase 사용 시 RLS 설정:

```sql
-- users: 자기 정보만 읽기/수정
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = clerk_user_id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = clerk_user_id);

-- subscriptions: 자기 구독만
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription" ON subscriptions
  FOR SELECT USING (
    user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid())
  );

-- contents: 공개 콘텐츠는 모두, 비공개는 작성자만
ALTER TABLE contents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published contents" ON contents
  FOR SELECT USING (status = 'published');

CREATE POLICY "Authors can view own drafts" ON contents
  FOR SELECT USING (
    author_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid())
  );

-- purchases: 자기 구매만
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own purchases" ON purchases
  FOR SELECT USING (
    user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid())
  );
```

---

## 📈 스케일링 고려사항

### 1. Partitioning (파티셔닝)

```sql
-- events 테이블은 월별 파티셔닝
CREATE TABLE events (
  id UUID,
  ...
  created_at TIMESTAMPTZ
) PARTITION BY RANGE (created_at);

CREATE TABLE events_2024_11 PARTITION OF events
  FOR VALUES FROM ('2024-11-01') TO ('2024-12-01');

CREATE TABLE events_2024_12 PARTITION OF events
  FOR VALUES FROM ('2024-12-01') TO ('2025-01-01');
```

### 2. Materialized Views (집계 캐싱)

```sql
-- 콘텐츠별 통계를 Materialized View로
CREATE MATERIALIZED VIEW content_stats AS
SELECT 
  content_id,
  COUNT(DISTINCT user_id) as unique_viewers,
  COUNT(*) FILTER (WHERE works = true) as success_count,
  COUNT(*) as total_ratings,
  AVG(rating) as avg_rating,
  AVG(time_spent_mins) as avg_time
FROM ratings
GROUP BY content_id;

CREATE UNIQUE INDEX ON content_stats(content_id);

-- 매시간 갱신
REFRESH MATERIALIZED VIEW CONCURRENTLY content_stats;
```

### 3. Read Replicas

```
Master (Write) ──┐
                 ├──> App Server
Replica (Read) ──┘

- 쓰기: Master
- 읽기 (대시보드, 검색): Replica
```

---
