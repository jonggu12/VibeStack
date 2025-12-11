# 데이터베이스 정규화 분석 보고서

**분석 대상**: VibeStack Database Schema
**분석 날짜**: 2025-12-11
**분석자**: Claude Code

---

## 📋 요약

전반적으로 **양호한 설계**이지만, 몇 가지 정규화 위반과 개선 필요 사항이 있습니다.

**종합 평가**: ⭐⭐⭐⭐☆ (4/5)

### 주요 발견사항

✅ **잘된 점**:
- 대부분의 테이블이 3NF를 준수
- 적절한 외래 키 설정
- 중복 테이블 없음 (bundles 제외)
- RLS 정책으로 보안 고려

⚠️ **개선 필요**:
1. **1NF 위반**: JSONB 필드로 인한 원자성 위반
2. **3NF 위반**: 계산 가능한 값을 테이블에 저장 (denormalization)
3. **설계 불일치**: bundles가 두 곳에 존재
4. **성능 vs 정규화 트레이드오프**: 의도적 비정규화 존재

---

## 1️⃣ 제1정규형 (1NF) 위반

### ❌ 문제 1: `contents.stack` (JSONB)

```sql
-- 현재 구조
stack JSONB -- {framework: "Next.js 14", auth: "Clerk", db: "Supabase"}
```

**문제점**:
- 비원자적 데이터 (하나의 컬럼에 여러 속성)
- 쿼리 복잡도 증가
- 인덱싱 제한적

**영향도**: 🟡 중간
- 검색 성능 저하 가능
- 스택별 콘텐츠 필터링 시 GIN 인덱스 필요

**개선 방안**:

#### 옵션 A: Stack 정규화 (권장 - 읽기 성능 중요 시)

```sql
-- 새 테이블 생성
CREATE TABLE stack_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL -- 'framework', 'auth', 'db', 'payment'
);

CREATE TABLE stack_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES stack_categories(id),
  name TEXT NOT NULL, -- 'Next.js 14', 'Clerk', 'Supabase'
  slug TEXT UNIQUE NOT NULL,
  icon_url TEXT
);

CREATE TABLE content_stacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES contents(id) ON DELETE CASCADE,
  stack_option_id UUID REFERENCES stack_options(id),
  UNIQUE(content_id, stack_option_id)
);

-- 인덱스
CREATE INDEX idx_content_stacks_content ON content_stacks(content_id);
CREATE INDEX idx_content_stacks_stack ON content_stacks(stack_option_id);
```

**장점**:
- ✅ 1NF 준수
- ✅ 스택 옵션 재사용 (데이터 일관성)
- ✅ 스택별 콘텐츠 검색 빠름
- ✅ 스택 옵션 추가/수정 용이

**단점**:
- ❌ JOIN 증가 (3-way join 필요)
- ❌ 스키마 복잡도 증가

#### 옵션 B: JSONB 유지 + 최적화 (현재 유지 - 쓰기 성능 중요 시)

```sql
-- 현재 구조 유지하되 인덱스 강화
CREATE INDEX idx_contents_stack_gin ON contents USING GIN(stack);

-- 쿼리 예시
SELECT * FROM contents
WHERE stack @> '{"framework": "Next.js 14"}'::jsonb;
```

**장점**:
- ✅ 스키마 단순
- ✅ 쓰기 성능 우수
- ✅ 유연한 스택 구조

**단점**:
- ❌ 1NF 위반
- ❌ 데이터 일관성 보장 어려움
- ❌ 스택 옵션 변경 시 전체 레코드 업데이트 필요

**🎯 권장사항**:
- **현재 MVP 단계**: JSONB 유지 (옵션 B)
- **Product-Market Fit 후**: 정규화 마이그레이션 (옵션 A)
- **이유**: 초기에는 유연성이 중요, 스택 구조가 자주 변경됨

---

### ❌ 문제 2: `users.primary_pain_points` (TEXT[])

```sql
-- 현재 구조
primary_pain_points TEXT[] -- ['auth', 'database', 'payments']
```

**문제점**:
- 배열 타입 사용 (1NF 위반)
- 쿼리 복잡도 증가

**영향도**: 🟢 낮음
- 온보딩 전용 필드 (검색 안 함)
- 읽기 빈도 낮음

**개선 방안**:

```sql
-- 정규화 버전
CREATE TABLE pain_point_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL, -- 'auth', 'database', 'payments'
  label TEXT NOT NULL,
  icon TEXT
);

CREATE TABLE user_pain_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  pain_point_id UUID REFERENCES pain_point_options(id),
  UNIQUE(user_id, pain_point_id)
);
```

**🎯 권장사항**: **유지** (현재 구조로 충분)
- 온보딩 데이터는 정규화 필요성 낮음
- 배열 연산 PostgreSQL에서 충분히 빠름

---

### ❌ 문제 3: `user_progress.last_checkpoint` (JSONB)

```sql
last_checkpoint JSONB -- {phase: 3, step: 2, ...}
```

**영향도**: 🟢 낮음
- 튜토리얼 진행 상태 저장 전용
- 검색/필터링 안 함

**🎯 권장사항**: **유지** (JSONB 적절함)

---

## 2️⃣ 제2정규형 (2NF) - ✅ 준수

모든 테이블이 단일 기본 키를 사용하므로 **2NF 자동 만족**.

복합 키 테이블도 부분 함수 종속성 없음:
- `content_tags(content_id, tag_id)` - 부분 종속성 없음
- `bundle_contents(bundle_id, content_id)` - 부분 종속성 없음

---

## 3️⃣ 제3정규형 (3NF) 위반

### ❌ 문제 4: 계산 가능한 값 저장 (Denormalization)

#### 4.1. `contents.avg_rating`

```sql
avg_rating DECIMAL(3,2) -- ratings 테이블에서 계산 가능
```

**문제점**:
- `ratings` 테이블에서 AVG(rating) 계산 가능
- 이행적 함수 종속성 (Transitive Dependency)
- 데이터 불일치 위험

**영향도**: 🔴 높음
- 평점 업데이트 시 동기화 필요
- Trigger 또는 애플리케이션 로직 필요

**현재 동기화 방법**:
- ❓ 트리거 없음 (확인 필요)
- ❓ 애플리케이션에서 업데이트? (확인 필요)

**개선 방안**:

#### 옵션 A: Materialized View (권장)

```sql
-- avg_rating 컬럼 제거
ALTER TABLE contents DROP COLUMN avg_rating;

-- Materialized View 생성
CREATE MATERIALIZED VIEW content_stats AS
SELECT
  content_id,
  COUNT(*) as rating_count,
  AVG(rating) as avg_rating,
  COUNT(CASE WHEN works = true THEN 1 END) as success_count,
  AVG(time_spent_mins) as avg_time_spent
FROM ratings
GROUP BY content_id;

CREATE UNIQUE INDEX ON content_stats(content_id);

-- 주기적 갱신 (매 시간)
REFRESH MATERIALIZED VIEW CONCURRENTLY content_stats;
```

**장점**:
- ✅ 3NF 준수
- ✅ 읽기 성능 우수
- ✅ 자동 계산 (갱신 시)

**단점**:
- ❌ 실시간 반영 안 됨 (주기적 갱신)

#### 옵션 B: Database Trigger

```sql
-- Trigger로 avg_rating 자동 업데이트
CREATE OR REPLACE FUNCTION update_content_avg_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE contents
  SET avg_rating = (
    SELECT AVG(rating)
    FROM ratings
    WHERE content_id = COALESCE(NEW.content_id, OLD.content_id)
  )
  WHERE id = COALESCE(NEW.content_id, OLD.content_id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ratings_update_avg
AFTER INSERT OR UPDATE OR DELETE ON ratings
FOR EACH ROW
EXECUTE FUNCTION update_content_avg_rating();
```

**장점**:
- ✅ 실시간 반영
- ✅ 애플리케이션 코드 불필요

**단점**:
- ❌ 3NF 여전히 위반
- ❌ 쓰기 성능 저하

#### 옵션 C: 런타임 계산

```sql
-- avg_rating 컬럼 제거하고 매번 계산
SELECT
  c.*,
  AVG(r.rating) as avg_rating
FROM contents c
LEFT JOIN ratings r ON c.id = r.content_id
WHERE c.id = $1
GROUP BY c.id;
```

**장점**:
- ✅ 3NF 준수
- ✅ 항상 정확한 값

**단점**:
- ❌ 매번 JOIN 계산 (성능 저하)

**🎯 권장사항**: **Materialized View (옵션 A)**
- 평점은 실시간 반영 불필요 (1시간 주기면 충분)
- 읽기 성능 중요 (콘텐츠 리스트 페이지)

---

#### 4.2. `contents.views` / `contents.completions`

```sql
views INTEGER DEFAULT 0
completions INTEGER DEFAULT 0
```

**문제점**:
- `events` 테이블에서 카운트 가능
- 3NF 위반

**영향도**: 🟡 중간
- 조회수는 자주 표시됨
- 매번 계산하면 성능 저하

**🎯 권장사항**: **유지** (의도적 비정규화)
- 조회수는 실시간 반영 필요
- Trigger/Application에서 증가
- 성능 vs 정규화 트레이드오프

**개선 방안**:

```sql
-- Trigger로 자동 증가
CREATE OR REPLACE FUNCTION increment_content_views()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.event_type = 'content_view' AND NEW.content_id IS NOT NULL THEN
    UPDATE contents
    SET views = views + 1
    WHERE id = NEW.content_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER event_increment_views
AFTER INSERT ON events
FOR EACH ROW
EXECUTE FUNCTION increment_content_views();
```

---

#### 4.3. `users.purchase_credits`

```sql
purchase_credits INTEGER DEFAULT 0 -- KRW credits from purchases
```

**문제점**:
- `credits` 테이블에서 SUM(balance_cents) 계산 가능
- 3NF 위반

**영향도**: 🟡 중간

**🎯 권장사항**: **계산으로 변경**

```sql
-- users 테이블에서 컬럼 제거
ALTER TABLE users DROP COLUMN purchase_credits;

-- 런타임 계산
SELECT
  u.id,
  u.email,
  COALESCE(SUM(c.balance_cents), 0) as purchase_credits
FROM users u
LEFT JOIN credits c ON u.id = c.user_id
  AND c.source = 'purchase'
  AND c.balance_cents > 0
  AND (c.expires_at IS NULL OR c.expires_at > NOW())
WHERE u.id = $1
GROUP BY u.id;
```

---

#### 4.4. `promo_codes.used_count`

```sql
used_count INTEGER DEFAULT 0
```

**문제점**:
- `promo_uses` 테이블에서 COUNT(*) 가능
- 3NF 위반

**영향도**: 🟢 낮음

**🎯 권장사항**: **유지** (성능 이유)
- 프로모션 검증 시 빠른 조회 필요
- Trigger로 동기화

```sql
CREATE OR REPLACE FUNCTION update_promo_used_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE promo_codes
  SET used_count = (
    SELECT COUNT(*) FROM promo_uses WHERE promo_code_id = NEW.promo_code_id
  )
  WHERE id = NEW.promo_code_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER promo_uses_update_count
AFTER INSERT ON promo_uses
FOR EACH ROW
EXECUTE FUNCTION update_promo_used_count();
```

---

## 4️⃣ BCNF (Boyce-Codd Normal Form) - ✅ 준수

모든 결정자가 슈퍼키이므로 **BCNF 만족**.

---

## 5️⃣ 설계 불일치 문제

### ❌ 문제 5: Bundles 중복 정의

**현재 상태**:
1. `contents` 테이블에 `type='bundle'` enum 값 존재
2. 별도 `bundles` 테이블 존재

```sql
-- contents 테이블
CREATE TYPE content_type AS ENUM ('doc', 'tutorial', 'snippet', 'bundle');

-- 그런데 bundles 테이블도 존재
CREATE TABLE bundles (
  id UUID PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  ...
);
```

**문제점**:
- **설계 불일치**: Bundle을 두 곳에서 관리
- **데이터 중복 위험**: slug, name, price 등 중복
- **혼란**: 어떤 테이블을 사용해야 할지 불명확

**영향도**: 🔴 높음
- 데이터 일관성 문제
- 개발자 혼란

**개선 방안**:

#### 옵션 A: contents 테이블로 통합 (권장)

```sql
-- 1. bundles 테이블 데이터를 contents로 마이그레이션
INSERT INTO contents (type, slug, title, description, price_cents, ...)
SELECT
  'bundle'::content_type,
  slug,
  name as title,
  description,
  price_cents,
  ...
FROM bundles;

-- 2. bundle_contents를 content_bundles로 이름 변경
ALTER TABLE bundle_contents RENAME TO content_bundles;

-- 3. bundle_id를 parent_content_id로 변경
ALTER TABLE content_bundles
RENAME COLUMN bundle_id TO parent_content_id;

ALTER TABLE content_bundles
ADD CONSTRAINT fk_parent_content
FOREIGN KEY (parent_content_id) REFERENCES contents(id);

-- 4. bundles 테이블 삭제
DROP TABLE bundles;

-- 5. content_type에서 'bundle' 제거 (선택사항)
-- 또는 bundle을 contents에서 관리하도록 유지
```

**장점**:
- ✅ 단일 소스 (contents만 사용)
- ✅ 일관성 향상
- ✅ 쿼리 단순화

**단점**:
- ❌ bundle 특화 필드 저장 어려움 (JSONB 필요)

#### 옵션 B: bundles 테이블만 사용

```sql
-- content_type에서 'bundle' 제거
ALTER TYPE content_type RENAME TO content_type_old;
CREATE TYPE content_type AS ENUM ('doc', 'tutorial', 'snippet', 'glossary');

ALTER TABLE contents
ALTER COLUMN type TYPE content_type
USING type::text::content_type;

DROP TYPE content_type_old;
```

**장점**:
- ✅ Bundle은 별도 엔티티로 관리
- ✅ Bundle 특화 필드 자유롭게 추가

**단점**:
- ❌ 일관성 저하 (콘텐츠 vs 번들 구분)

**🎯 권장사항**: **옵션 A (contents로 통합)**
- Bundle도 콘텐츠의 일종
- 접근 권한, 진행률 등 동일한 로직 적용
- ERD 문서와 실제 스키마 불일치 해소

---

### ❌ 문제 6: ERD 문서와 실제 스키마 불일치

**ERD.md에만 존재** (실제 스키마에 없음):
```sql
CREATE TABLE content_types (
  id UUID PRIMARY KEY,
  name TEXT, -- 'doc', 'tutorial', 'snippet', 'bundle'
  slug TEXT
);
```

**영향도**: 🟡 중간
- 문서와 실제 코드 불일치
- 개발자 혼란

**🎯 권장사항**: **ERD 문서 수정**
- content_types 테이블은 enum으로 구현됨
- ERD 다이어그램 업데이트 필요

---

## 6️⃣ 정규화 vs 성능 트레이드오프 분석

### 현재 의도적 비정규화 (Denormalization)

| 컬럼 | 테이블 | 이유 | 판단 |
|------|--------|------|------|
| `avg_rating` | contents | 콘텐츠 리스트 성능 | ⚠️ Materialized View로 개선 |
| `views` | contents | 실시간 조회수 | ✅ 유지 (Trigger로 동기화) |
| `completions` | contents | 실시간 완료 수 | ✅ 유지 (Trigger로 동기화) |
| `purchase_credits` | users | 크레딧 빠른 조회 | ⚠️ 계산으로 변경 |
| `used_count` | promo_codes | 프로모션 검증 | ✅ 유지 (Trigger로 동기화) |
| `stack` | contents | 유연한 스택 관리 | ✅ 유지 (MVP), 추후 정규화 |

**정규화 우선순위**:
1. 🔴 **높음**: bundles 테이블 통합
2. 🟡 **중간**: avg_rating → Materialized View
3. 🟡 **중간**: purchase_credits → 계산
4. 🟢 **낮음**: stack → 정규화 (추후)

---

## 7️⃣ 기타 설계 개선사항

### 💡 개선 1: Payment Provider 필드 분리

**현재 구조**:
```sql
CREATE TABLE subscriptions (
  ...
  payment_provider payment_provider DEFAULT 'stripe',

  -- Stripe fields
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,

  -- Toss fields
  toss_billing_key TEXT,
  toss_customer_key TEXT,
  ...
);
```

**문제점**:
- payment_provider가 'stripe'면 toss 필드 NULL
- payment_provider가 'toss'면 stripe 필드 NULL
- 불필요한 NULL 필드 다수

**영향도**: 🟢 낮음
- 기능적 문제 없음
- 저장 공간 약간 낭비

**개선 방안** (참고용, 필수 아님):

```sql
-- Polymorphic Association 패턴
CREATE TABLE subscription_payment_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES subscriptions(id) UNIQUE,
  provider payment_provider NOT NULL,
  provider_data JSONB NOT NULL -- Provider별 데이터
);

-- 예시:
-- Stripe: {"subscription_id": "sub_xxx", "customer_id": "cus_xxx"}
-- Toss: {"billing_key": "xxx", "customer_key": "xxx"}
```

**🎯 권장사항**: **유지** (현재 구조로 충분)
- MVP에서는 과도한 추상화
- 명확한 컬럼이 디버깅에 유리

---

### 💡 개선 2: credits 테이블 balance_cents 관리

**현재 구조**:
```sql
CREATE TABLE credits (
  ...
  amount_cents INTEGER NOT NULL,      -- 원래 금액
  balance_cents INTEGER NOT NULL,     -- 남은 금액
  ...
);
```

**문제점**:
- balance_cents가 감소하면 업데이트 필요
- 크레딧 사용 내역 추적 어려움

**개선 방안**:

```sql
-- 크레딧 거래 내역 테이블 추가
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  credit_id UUID REFERENCES credits(id),
  amount_cents INTEGER NOT NULL, -- 음수면 사용, 양수면 적립
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- credits.balance_cents는 Materialized View 또는 Trigger로 계산
CREATE OR REPLACE FUNCTION update_credit_balance()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE credits
  SET balance_cents = (
    SELECT amount_cents + COALESCE(SUM(ct.amount_cents), 0)
    FROM credit_transactions ct
    WHERE ct.credit_id = NEW.credit_id
  )
  WHERE id = NEW.credit_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**🎯 권장사항**: **추후 개선**
- 현재는 단순한 구조로 충분
- 크레딧 사용 복잡해지면 도입

---

## 📊 종합 평가

### 정규화 준수도

| 정규형 | 상태 | 점수 |
|--------|------|------|
| 1NF | ⚠️ 부분 위반 (JSONB/배열) | 7/10 |
| 2NF | ✅ 완전 준수 | 10/10 |
| 3NF | ⚠️ 부분 위반 (계산 가능 값) | 6/10 |
| BCNF | ✅ 완전 준수 | 10/10 |

**종합 점수**: **33/40 (82.5%)**

---

## 🎯 권장 개선 작업 우선순위

### Priority 1: 즉시 수정 필요 (Critical)

1. **Bundles 테이블 통합** 🔴
   - contents 테이블로 통합
   - 데이터 일관성 확보
   - 예상 작업: 2-3시간

2. **ERD 문서 업데이트** 🔴
   - content_types 테이블 제거
   - 실제 스키마와 동기화
   - 예상 작업: 30분

### Priority 2: 성능 개선 (High)

3. **avg_rating → Materialized View** 🟡
   - 3NF 준수
   - 읽기 성능 유지
   - 예상 작업: 1-2시간

4. **purchase_credits 제거** 🟡
   - 계산으로 변경
   - 데이터 일관성 확보
   - 예상 작업: 1시간

### Priority 3: 추후 개선 (Medium)

5. **Stack 정규화** 🟢
   - PMF 확보 후 진행
   - 스택 구조 안정화 후
   - 예상 작업: 4-6시간

6. **Trigger 추가** 🟢
   - views, completions 자동 증가
   - used_count 자동 업데이트
   - 예상 작업: 2시간

---

## 📝 결론

**전반적 평가**: VibeStack의 데이터베이스 스키마는 **잘 설계된 편**입니다.

**강점**:
- ✅ 명확한 관계 정의
- ✅ 적절한 인덱싱
- ✅ RLS 보안 정책
- ✅ 확장 가능한 구조

**개선 필요**:
- ⚠️ Bundles 중복 정의 해소
- ⚠️ 의도적 비정규화에 Trigger 추가
- ⚠️ Materialized View 활용

**MVP에서의 판단**:
- 🎯 **현재 구조로 런칭 가능**
- 🎯 **사용자 증가 후 최적화 진행**
- 🎯 **성능 모니터링 후 개선**

---

**작성자**: Claude Code
**분석 일시**: 2025-12-11
**다음 리뷰 예정**: PMF 확보 후 (사용자 1,000명 이상)
