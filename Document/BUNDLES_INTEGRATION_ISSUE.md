# Bundles 테이블 통합 이슈 상세 분석

**작성일**: 2025-12-11
**우선순위**: 🔴 Critical (즉시 수정 필요)
**예상 작업 시간**: 2-3시간

---

## 📌 문제 요약

현재 **"Bundle"을 표현하는 방법이 2가지**가 존재하여 데이터 일관성과 코드 복잡도에 문제가 발생합니다.

```
❌ 현재 상태:
1. contents 테이블에서 type='bundle' 사용 가능
2. 별도 bundles 테이블 존재

→ 같은 개념을 두 곳에서 다르게 관리
```

---

## 🔍 현재 구조 상세 분석

### 1. Contents 테이블의 Bundle 정의

**위치**: `supabase/migrations/00001_initial_schema.sql:15`

```sql
-- content_type ENUM에 'bundle' 포함
CREATE TYPE content_type AS ENUM ('doc', 'tutorial', 'snippet', 'bundle');

CREATE TABLE contents (
  id UUID PRIMARY KEY,
  type content_type NOT NULL,  -- ← 여기서 'bundle' 사용 가능
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER DEFAULT 0,
  ...
);
```

**TypeScript 타입 정의**: `types/content.ts:2`

```typescript
export type ContentType = 'doc' | 'tutorial' | 'snippet' | 'bundle' | 'glossary'

export interface Content {
  id: string
  type: ContentType  // ← 'bundle' 타입 사용 가능
  slug: string
  title: string
  priceCents: number
  ...
}
```

**상수 정의**: `lib/constants.ts:11`

```typescript
export const CONTENT_TYPES = {
  DOC: 'doc',
  TUTORIAL: 'tutorial',
  SNIPPET: 'snippet',
  BUNDLE: 'bundle',  // ← 번들을 content type으로 정의
} as const
```

---

### 2. 별도 Bundles 테이블 정의

**위치**: `supabase/migrations/00001_initial_schema.sql:198`

```sql
-- 완전히 별도의 bundles 테이블
CREATE TABLE bundles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,         -- ❌ contents.slug와 중복 가능성
  name TEXT NOT NULL,                -- ❌ contents.title과 같은 역할
  description TEXT,                  -- ❌ contents.description과 중복
  price_cents INTEGER NOT NULL,      -- ❌ contents.price_cents와 중복
  discount_pct INTEGER,              -- ✅ bundle 전용 필드
  thumbnail_url TEXT,                -- ✅ bundle 전용 필드
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bundle과 Content의 관계 (Junction Table)
CREATE TABLE bundle_contents (
  id UUID PRIMARY KEY,
  bundle_id UUID REFERENCES bundles(id) ON DELETE CASCADE,  -- ❌ bundles 테이블 참조
  content_id UUID REFERENCES contents(id) ON DELETE CASCADE,
  display_order INTEGER,
  UNIQUE(bundle_id, content_id)
);
```

---

### 3. 애플리케이션 라우팅

**Bundle 전용 페이지 존재**:
- `app/(dashboard)/bundles/page.tsx` - 번들 목록 페이지
- `app/(dashboard)/bundles/[slug]/page.tsx` - 번들 상세 페이지

```typescript
// bundles/[slug]/page.tsx
export default function BundleDetailPage({ params }: { params: { slug: string } }) {
  return (
    <div>
      <h1>Bundle: {params.slug}</h1>  // ← 현재 placeholder
    </div>
  )
}
```

**현재 상태**: 페이지만 있고 실제 구현은 안 됨 (placeholder)

---

## ❌ 구체적인 문제점

### 문제 1: 데이터 중복 및 불일치 위험

#### 시나리오 A: contents에 bundle 생성

```sql
-- contents 테이블에 번들 생성
INSERT INTO contents (type, slug, title, description, price_cents)
VALUES ('bundle', 'nextjs-starter', 'Next.js Starter Bundle', 'Complete Next.js bundle', 5000);
```

**문제**:
- ❌ `bundle_contents` 테이블과 연결 불가 (외래 키가 `bundles.id` 참조)
- ❌ Bundle의 개별 콘텐츠 포함 관계 표현 불가
- ❌ `discount_pct`, `thumbnail_url` 같은 번들 전용 필드 사용 불가

#### 시나리오 B: bundles에 번들 생성

```sql
-- bundles 테이블에 번들 생성
INSERT INTO bundles (slug, name, description, price_cents, discount_pct)
VALUES ('nextjs-starter', 'Next.js Starter Bundle', 'Complete Next.js bundle', 5000, 20);

-- 포함된 콘텐츠 연결
INSERT INTO bundle_contents (bundle_id, content_id, display_order)
VALUES ('bundle-uuid', 'doc1-uuid', 1),
       ('bundle-uuid', 'tutorial1-uuid', 2);
```

**문제**:
- ❌ contents 테이블과 별개로 관리됨
- ❌ 검색 시 contents만 조회하면 bundle이 안 나옴
- ❌ 접근 권한 관리가 복잡 (contents 기반 vs bundles 기반)

---

### 문제 2: 검색 및 필터링 복잡도 증가

**현재 검색 로직 문제**:

```typescript
// 콘텐츠 검색 시
const results = await supabase
  .from('contents')
  .select('*')
  .eq('status', 'published')
  .in('type', ['doc', 'tutorial', 'snippet', 'bundle'])  // ← bundle 포함

// ❌ 하지만 실제 bundle 데이터는 bundles 테이블에 있을 수도 있음!
```

**두 테이블을 동시에 검색해야 하는 문제**:

```typescript
// 올바른 검색을 하려면 두 번 쿼리해야 함
const contentsResults = await supabase
  .from('contents')
  .select('*')
  .eq('status', 'published')

const bundlesResults = await supabase
  .from('bundles')
  .select('*')
  .eq('is_active', true)

// 두 결과를 합쳐야 함 (복잡!)
const allResults = [...contentsResults, ...bundlesResults]
```

---

### 문제 3: 접근 권한 관리 불일치

**현재 접근 권한 테이블**: `user_contents`

```sql
CREATE TABLE user_contents (
  user_id UUID REFERENCES users(id),
  content_id UUID REFERENCES contents(id),  -- ❌ contents만 참조
  access_type access_type NOT NULL,
  ...
);
```

**문제**:
- ✅ contents 테이블의 bundle → 접근 권한 관리 가능
- ❌ bundles 테이블의 bundle → 접근 권한 관리 불가

**복잡한 로직 필요**:

```typescript
// 사용자가 bundle에 접근 가능한지 확인
async function canAccessBundle(userId: string, bundleId: string) {
  // 1. bundle_contents에서 포함된 콘텐츠 조회
  const { data: bundleContents } = await supabase
    .from('bundle_contents')
    .select('content_id')
    .eq('bundle_id', bundleId)

  // 2. 각 콘텐츠에 대한 접근 권한 확인 (N+1 쿼리!)
  const hasAccess = await Promise.all(
    bundleContents.map(bc => checkContentAccess(userId, bc.content_id))
  )

  // 3. 모든 콘텐츠에 접근 가능해야 번들 접근 가능
  return hasAccess.every(Boolean)
}
```

---

### 문제 4: 구매 로직 복잡도

**현재 구매 테이블**: `purchases`

```sql
CREATE TABLE purchases (
  user_id UUID REFERENCES users(id),
  content_id UUID REFERENCES contents(id),    -- contents만 참조
  bundle_id UUID REFERENCES bundles(id),      -- bundles도 참조
  ...
  CHECK (
    (content_id IS NOT NULL AND bundle_id IS NULL) OR
    (content_id IS NULL AND bundle_id IS NOT NULL)
  )  -- ← XOR 제약 (하나만 있어야 함)
);
```

**문제**:
- ✅ 두 테이블 모두 구매 가능하도록 설계됨
- ❌ 하지만 이후 로직이 복잡해짐

**예시 - 사용자가 구매한 콘텐츠 조회**:

```typescript
// 두 가지 경우를 모두 처리해야 함
const purchases = await supabase
  .from('purchases')
  .select(`
    *,
    content:contents(*),       -- content_id가 있는 경우
    bundle:bundles(*)          -- bundle_id가 있는 경우
  `)
  .eq('user_id', userId)

// 결과 처리 복잡
purchases.forEach(p => {
  if (p.content) {
    // contents 테이블에서 구매한 경우
  } else if (p.bundle) {
    // bundles 테이블에서 구매한 경우
  }
})
```

---

### 문제 5: 라우팅 및 URL 불일치

**현재 URL 구조**:

```
/docs/[slug]           → contents 테이블 (type='doc')
/tutorials/[slug]      → contents 테이블 (type='tutorial')
/snippets/[slug]       → contents 테이블 (type='snippet')
/bundles/[slug]        → bundles 테이블? contents 테이블?  ← ❌ 혼란
```

**문제**:
- Bundle이 `contents`에 있으면 `/bundles/[slug]`로 접근 불가?
- Bundle이 `bundles`에 있으면 검색 결과에 안 나옴?
- 같은 slug로 두 곳에 동시에 존재할 수도 있음 (충돌!)

```sql
-- 충돌 가능성
INSERT INTO contents (type, slug, ...) VALUES ('bundle', 'nextjs-pro', ...);
INSERT INTO bundles (slug, ...) VALUES ('nextjs-pro', ...);  -- ❌ 다른 테이블이라 UNIQUE 제약 안 걸림
```

---

### 문제 6: 통계 및 분석 복잡도

**콘텐츠 통계 조회 시**:

```sql
-- 전체 콘텐츠 수
SELECT COUNT(*) FROM contents WHERE status = 'published';
-- ❌ bundles 테이블의 번들은 포함 안 됨!

-- 올바른 쿼리
SELECT
  (SELECT COUNT(*) FROM contents WHERE status = 'published') +
  (SELECT COUNT(*) FROM bundles WHERE is_active = true) as total_content_count;
```

**수익 분석 시**:

```sql
-- 콘텐츠별 수익
SELECT
  c.title,
  SUM(p.amount_cents) as revenue
FROM purchases p
LEFT JOIN contents c ON p.content_id = c.id
LEFT JOIN bundles b ON p.bundle_id = b.id  -- ❌ 두 테이블 모두 조인
GROUP BY c.title, b.name;  -- ❌ 복잡함
```

---

## ✅ 해결 방안: Contents 테이블로 통합

### 통합 후 구조

```sql
-- 1. contents 테이블에 bundle 전용 필드 추가
ALTER TABLE contents
ADD COLUMN discount_pct INTEGER,
ADD COLUMN thumbnail_url TEXT;

-- 2. bundle_contents 테이블 이름 변경 (의미 명확화)
ALTER TABLE bundle_contents RENAME TO content_children;

-- 3. bundle_id를 parent_content_id로 변경
ALTER TABLE content_children
RENAME COLUMN bundle_id TO parent_content_id;

-- 4. 외래 키 변경
ALTER TABLE content_children
DROP CONSTRAINT bundle_contents_bundle_id_fkey,
ADD CONSTRAINT content_children_parent_content_id_fkey
  FOREIGN KEY (parent_content_id) REFERENCES contents(id) ON DELETE CASCADE;

-- 5. bundles 테이블 데이터를 contents로 마이그레이션
INSERT INTO contents (type, slug, title, description, price_cents, discount_pct, thumbnail_url, status, created_at, updated_at)
SELECT
  'bundle'::content_type,
  slug,
  name as title,
  description,
  price_cents,
  discount_pct,
  thumbnail_url,
  CASE WHEN is_active THEN 'published'::content_status ELSE 'archived'::content_status END,
  created_at,
  updated_at
FROM bundles;

-- 6. bundle_contents의 bundle_id를 새 content id로 업데이트
-- (이 부분은 실제 데이터 있을 때만 필요)

-- 7. 기존 bundles 테이블 삭제
DROP TABLE bundles;
```

---

### 통합 후 장점

#### ✅ 1. 일관된 데이터 모델

```typescript
// 모든 콘텐츠를 동일하게 처리
interface Content {
  id: string
  type: 'doc' | 'tutorial' | 'snippet' | 'bundle'
  slug: string
  title: string
  priceCents: number
  // Bundle 전용 필드 (optional)
  discountPct?: number
  thumbnailUrl?: string
}
```

#### ✅ 2. 단순한 검색 로직

```typescript
// 하나의 테이블만 검색
const results = await supabase
  .from('contents')
  .select('*')
  .eq('status', 'published')
  .or('type.eq.doc,type.eq.tutorial,type.eq.snippet,type.eq.bundle')
```

#### ✅ 3. 통일된 접근 권한 관리

```sql
-- 모든 콘텐츠 타입에 동일한 로직 적용
SELECT * FROM user_contents
WHERE user_id = $1
  AND content_id = $2;  -- ✅ bundle도 동일하게 처리
```

#### ✅ 4. 단순한 구매 로직

```sql
-- purchases 테이블 단순화
CREATE TABLE purchases (
  user_id UUID REFERENCES users(id),
  content_id UUID REFERENCES contents(id),  -- ✅ 하나만 사용
  amount_cents INTEGER NOT NULL,
  ...
);

-- bundle_id 컬럼 제거 가능
ALTER TABLE purchases DROP COLUMN bundle_id;
```

#### ✅ 5. 일관된 URL 구조

```typescript
// 타입별 라우팅 통일
function getContentUrl(content: Content): string {
  const typeRoutes = {
    doc: '/docs',
    tutorial: '/tutorials',
    snippet: '/snippets',
    bundle: '/bundles',
  }
  return `${typeRoutes[content.type]}/${content.slug}`
}
```

#### ✅ 6. 단순한 통계 쿼리

```sql
-- 타입별 콘텐츠 수
SELECT type, COUNT(*) as count
FROM contents
WHERE status = 'published'
GROUP BY type;

-- ✅ bundle도 자동으로 포함됨
```

---

## 🚀 마이그레이션 계획

### Phase 1: 스키마 변경 (30분)

```sql
-- migration: 00003_integrate_bundles.sql

-- 1. contents에 bundle 전용 필드 추가
ALTER TABLE contents
ADD COLUMN IF NOT EXISTS discount_pct INTEGER,
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- 2. bundle_contents를 content_children으로 변경
ALTER TABLE bundle_contents RENAME TO content_children;
ALTER TABLE content_children RENAME COLUMN bundle_id TO parent_content_id;

-- 3. 외래 키 재설정
ALTER TABLE content_children
DROP CONSTRAINT IF EXISTS bundle_contents_bundle_id_fkey;

ALTER TABLE content_children
ADD CONSTRAINT content_children_parent_content_id_fkey
FOREIGN KEY (parent_content_id) REFERENCES contents(id) ON DELETE CASCADE;

-- 4. 인덱스 재생성
CREATE INDEX IF NOT EXISTS idx_content_children_parent
ON content_children(parent_content_id);
```

### Phase 2: 데이터 마이그레이션 (30분)

```sql
-- bundles 데이터가 있는 경우만 실행
DO $$
DECLARE
  bundle_record RECORD;
  new_content_id UUID;
BEGIN
  -- bundles 테이블의 각 레코드를 contents로 이동
  FOR bundle_record IN SELECT * FROM bundles LOOP
    -- contents에 삽입
    INSERT INTO contents (
      type, slug, title, description, price_cents,
      discount_pct, thumbnail_url, is_premium, status,
      created_at, updated_at
    )
    VALUES (
      'bundle'::content_type,
      bundle_record.slug,
      bundle_record.name,
      bundle_record.description,
      bundle_record.price_cents,
      bundle_record.discount_pct,
      bundle_record.thumbnail_url,
      CASE WHEN bundle_record.price_cents > 0 THEN true ELSE false END,
      CASE WHEN bundle_record.is_active THEN 'published'::content_status ELSE 'archived'::content_status END,
      bundle_record.created_at,
      bundle_record.updated_at
    )
    RETURNING id INTO new_content_id;

    -- content_children의 parent_content_id 업데이트
    UPDATE content_children
    SET parent_content_id = new_content_id
    WHERE parent_content_id = bundle_record.id;

    RAISE NOTICE 'Migrated bundle % to content %', bundle_record.slug, new_content_id;
  END LOOP;
END $$;
```

### Phase 3: 기존 테이블 정리 (15분)

```sql
-- bundles 테이블 삭제
DROP TABLE IF EXISTS bundles;

-- purchases 테이블에서 bundle_id 컬럼 제거 (나중에)
-- ALTER TABLE purchases DROP COLUMN IF EXISTS bundle_id;

-- 코멘트 추가
COMMENT ON COLUMN contents.discount_pct IS 'Bundle discount percentage compared to individual prices';
COMMENT ON COLUMN contents.thumbnail_url IS 'Bundle thumbnail image URL';
COMMENT ON TABLE content_children IS 'Parent-child relationship for bundles (parent is bundle, children are included contents)';
```

### Phase 4: 애플리케이션 코드 수정 (1-2시간)

#### 4.1. TypeScript 타입 업데이트

```typescript
// types/content.ts
export interface Content {
  id: string
  type: ContentType
  slug: string
  title: string
  description?: string
  priceCents: number
  isPremium: boolean

  // Bundle 전용 필드
  discountPct?: number      // type='bundle'일 때만 사용
  thumbnailUrl?: string     // type='bundle'일 때만 사용

  status: ContentStatus
  createdAt: string
  updatedAt: string
}

// Bundle children 관계
export interface ContentChild {
  id: string
  parentContentId: string   // bundle content id
  contentId: string         // 포함된 content id
  displayOrder: number
}
```

#### 4.2. Server Actions 수정

```typescript
// app/actions/content.ts

// ❌ 이전: bundles 테이블 조회
export async function getBundleBySlug(slug: string) {
  const { data } = await supabase
    .from('bundles')  // ← 삭제될 테이블
    .select('*')
    .eq('slug', slug)
    .single()
  return data
}

// ✅ 이후: contents 테이블 조회
export async function getBundleBySlug(slug: string) {
  const { data } = await supabase
    .from('contents')
    .select(`
      *,
      children:content_children(
        content_id,
        content:contents(*),
        display_order
      )
    `)
    .eq('slug', slug)
    .eq('type', 'bundle')
    .single()
  return data
}
```

#### 4.3. Bundle 페이지 구현

```typescript
// app/(dashboard)/bundles/[slug]/page.tsx

import { getBundleBySlug } from '@/app/actions/content'

export default async function BundleDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const bundle = await getBundleBySlug(params.slug)

  if (!bundle) {
    notFound()
  }

  return (
    <div>
      <h1>{bundle.title}</h1>
      <p>{bundle.description}</p>

      {/* 할인율 표시 */}
      {bundle.discountPct && (
        <div className="badge">{bundle.discountPct}% OFF</div>
      )}

      {/* 포함된 콘텐츠 목록 */}
      <div className="bundle-contents">
        <h2>포함된 콘텐츠</h2>
        {bundle.children?.map((child) => (
          <ContentCard key={child.content_id} content={child.content} />
        ))}
      </div>

      {/* 구매 버튼 */}
      <PurchaseButton contentId={bundle.id} price={bundle.priceCents} />
    </div>
  )
}
```

---

## 📋 체크리스트

### 마이그레이션 전 확인사항

- [ ] 현재 bundles 테이블에 실제 데이터가 있는지 확인
- [ ] 기존 bundle_contents에 관계 데이터가 있는지 확인
- [ ] purchases 테이블에 bundle_id 참조가 있는지 확인
- [ ] 백업 생성 (`pg_dump`)

### 마이그레이션 실행

- [ ] Phase 1: 스키마 변경 실행
- [ ] Phase 2: 데이터 마이그레이션 (데이터 있는 경우만)
- [ ] Phase 3: 기존 테이블 정리
- [ ] Phase 4: 애플리케이션 코드 수정
- [ ] 테스트 실행 (bundle 생성, 조회, 구매)

### 마이그레이션 후 검증

- [ ] Bundle 목록 페이지 정상 작동 확인
- [ ] Bundle 상세 페이지 정상 작동 확인
- [ ] Bundle 검색 결과 포함 확인
- [ ] Bundle 구매 플로우 정상 작동 확인
- [ ] 접근 권한 로직 정상 작동 확인

---

## 🎯 최종 상태 비교

### Before (현재)

```
❌ 문제점:
- 2개 테이블 (contents + bundles)
- 검색 시 두 번 쿼리 필요
- 접근 권한 로직 복잡
- 구매 로직 복잡 (XOR 제약)
- URL 구조 혼란
- 통계 쿼리 복잡
```

### After (통합 후)

```
✅ 개선점:
- 1개 테이블 (contents만)
- 검색 시 한 번만 쿼리
- 접근 권한 로직 단순
- 구매 로직 단순
- URL 구조 일관성
- 통계 쿼리 단순
```

---

## 💡 추가 고려사항

### Q1: Bundle 전용 필드가 많아지면?

**A**: JSONB 컬럼 사용 고려

```sql
ALTER TABLE contents
ADD COLUMN bundle_metadata JSONB;

-- 예시
{
  "discountPct": 20,
  "thumbnailUrl": "...",
  "featured": true,
  "bundleType": "complete"
}
```

### Q2: Bundle이 아닌 콘텐츠에 discount_pct가 들어가면?

**A**: 애플리케이션 레벨에서 validation

```typescript
function validateContent(content: Content) {
  if (content.type !== 'bundle' && content.discountPct) {
    throw new Error('discount_pct는 bundle에만 사용 가능합니다')
  }
}
```

또는 CHECK 제약 추가:

```sql
ALTER TABLE contents
ADD CONSTRAINT check_bundle_fields
CHECK (
  (type = 'bundle') OR
  (discount_pct IS NULL AND thumbnail_url IS NULL)
);
```

### Q3: 기존 코드에서 bundles 테이블 사용하는 곳은?

**A**: 현재 조사 결과 **사용하는 곳 없음** (placeholder 페이지만 존재)

```
✅ app/actions/ - bundles 참조 없음
✅ components/ - bundles 참조 없음
✅ lib/ - CONTENT_TYPES.BUNDLE만 사용 (유지 가능)
```

---

## 🚦 실행 타이밍

**권장**: 다음 배포 전에 실행

**이유**:
1. 현재 bundles 테이블에 실제 데이터 없음
2. Bundle 기능 아직 구현 안 됨 (placeholder)
3. 지금 고치면 나중에 복잡도 증가 방지

**예상 다운타임**: 없음 (데이터 없으므로)

---

**작성자**: Claude Code
**검토 필요**: DB 마이그레이션 전 백업 필수
