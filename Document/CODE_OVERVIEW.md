# VibeStack 코드 구조 설명서

비개발자도 이해할 수 있도록 현재 구현된 코드들을 쉽게 설명합니다.

---

## 목차

1. [전체 구조 한눈에 보기](#1-전체-구조-한눈에-보기)
2. [인증 시스템 (로그인/회원가입)](#2-인증-시스템-로그인회원가입)
3. [결제 시스템](#3-결제-시스템)
4. [검색 시스템](#4-검색-시스템)
5. [데이터베이스](#5-데이터베이스)
6. [보안 설정](#6-보안-설정)
7. [관리자 기능](#7-관리자-기능)
8. [콘텐츠 관리 시스템 (CMS)](#8-콘텐츠-관리-시스템-cms)

---

## 1. 전체 구조 한눈에 보기

```
VibeStack/
├── app/                    # 📱 화면(페이지)들
│   ├── (marketing)/       # 홍보 페이지 (랜딩, 가격표 등)
│   ├── (auth)/            # 로그인/회원가입 페이지
│   ├── (dashboard)/       # 로그인 후 사용하는 메인 화면
│   ├── (checkout)/        # 결제 관련 페이지
│   ├── (tools)/           # 부가 기능 (에러 클리닉 등)
│   └── api/               # 🔌 서버 기능 (보이지 않는 뒷단)
│
├── components/            # 🧩 재사용 가능한 화면 조각들
├── lib/                   # 🔧 핵심 기능 코드
├── types/                 # 📝 데이터 형식 정의
└── middleware.ts          # 🚪 접근 제어 (경비원 역할)
```

### 비유로 이해하기

- **app/**: 건물의 각 방 (고객이 보는 화면)
- **api/**: 건물의 기계실 (눈에 안 보이지만 모든 걸 처리)
- **components/**: 가구 (여러 방에서 재사용)
- **lib/**: 건물의 설비 (전기, 수도 같은 핵심 인프라)
- **middleware.ts**: 건물 경비원 (누가 어디 갈 수 있는지 체크)

---

## 2. 인증 시스템 (로그인/회원가입)

### 사용 서비스: Clerk

**Clerk**이란? 로그인/회원가입을 대신 처리해주는 외부 서비스. 우리가 직접 비밀번호를 저장하지 않아도 됨.

### 어떻게 작동하나요?

```
[사용자] → [Clerk 로그인 화면] → [Clerk 서버에서 인증] → [우리 서비스 접속 허용]
```

### 관련 파일

| 파일 | 역할 |
|------|------|
| `middleware.ts` | 로그인 안 한 사람이 들어오면 막음 |
| `app/(auth)/sign-in` | 로그인 페이지 |
| `app/(auth)/sign-up` | 회원가입 페이지 |
| `lib/clerk.ts` | Clerk 설정 |

### 보호되는 페이지 (로그인 필수)

```
/dashboard/*      → 대시보드 전체
/onboarding/*     → 온보딩 (첫 사용자 안내)
/checkout/*       → 결제 페이지
/tools/ai-chat    → AI 채팅 (Pro 기능)
/tools/project-map → 프로젝트 맵 (Pro 기능)
```

### 누구나 볼 수 있는 페이지

```
/                 → 메인 랜딩 페이지
/pricing          → 가격표
/about            → 소개
/blog             → 블로그
```

---

## 3. 결제 시스템

### 이중 결제 시스템

VibeStack은 **한국 사용자**와 **해외 사용자** 모두를 위해 두 가지 결제 시스템을 운영합니다.

| 대상 | 결제 서비스 | 통화 |
|------|-------------|------|
| 한국 | 토스페이먼츠 | KRW (원화) |
| 해외 | Stripe | USD (달러) |

### 가격 정책

**한국 (토스페이먼츠)**
| 플랜 | 가격 | 설명 |
|------|------|------|
| Pro | ₩15,000/월 | 개인용 무제한 |
| Team | ₩65,000/월 | 5명 팀용 |
| 단건 구매 | ₩15,000 | 콘텐츠 1개 영구 소유 |

**해외 (Stripe)**
| 플랜 | 가격 |
|------|------|
| Pro | $12/월 |
| Team | $50/월 |
| 단건 구매 | $12 |

### 결제 흐름 (토스페이먼츠 예시)

```
1. 사용자가 "구독하기" 클릭
     ↓
2. 서버가 토스페이먼츠에 결제 정보 전송
     ↓
3. 토스 결제창 열림 (카드/카카오페이/네이버페이 등)
     ↓
4. 결제 완료 → 토스가 우리 서버에 알림 (Webhook)
     ↓
5. DB에 구독 정보 저장
     ↓
6. 사용자에게 Pro 기능 열림
```

### 정기결제 (구독) 작동 방식

```
1. 첫 결제 시: 카드 정보를 "빌링키"로 암호화해서 저장
2. 다음 달: 빌링키로 자동 결제 (카드번호 저장 X)
3. 해지: 다음 결제일까지 사용 가능, 이후 중단
```

### 관련 파일

| 파일 | 역할 |
|------|------|
| `lib/toss-payments.ts` | 토스페이먼츠 핵심 기능 |
| `lib/stripe.ts` | Stripe 핵심 기능 |
| `lib/pricing.ts` | 가격 정보 통합 관리 |
| `api/toss/confirm` | 토스 결제 승인 |
| `api/toss/billing/issue` | 정기결제용 빌링키 발급 |
| `api/toss/billing/renew` | 자동 갱신 결제 |
| `api/toss/billing/cancel` | 구독 해지 |
| `api/toss/webhook` | 토스에서 오는 알림 수신 |
| `api/stripe/checkout` | Stripe 결제창 생성 |
| `api/stripe/webhook` | Stripe에서 오는 알림 수신 |

---

## 4. 검색 시스템

### 사용 서비스: Algolia

**Algolia**란? 초고속 검색 서비스. 구글처럼 빠른 검색을 제공.

### 왜 Algolia를 쓰나요?

- 우리 DB에서 직접 검색: 느림 (0.5~2초)
- Algolia 검색: 빠름 (0.01~0.05초)

### 작동 방식

```
[콘텐츠 등록/수정]
     ↓
[Algolia에 복사본 저장] ← 인덱싱
     ↓
[사용자 검색]
     ↓
[Algolia가 즉시 결과 반환]
```

### 검색 가능한 항목

- 제목
- 설명
- 태그
- 작성자

### 필터 가능한 항목

- 콘텐츠 타입 (문서/튜토리얼/스니펫)
- 난이도 (초급/중급/고급)
- 유료/무료

### 관련 파일

| 파일 | 역할 |
|------|------|
| `lib/algolia.ts` | Algolia 핵심 기능 |
| `api/admin/algolia/configure` | 검색 설정 초기화 (최초 1회) |
| `api/admin/algolia/index` | 콘텐츠를 Algolia에 등록 |
| `api/content/search` | 검색 API |
| `components/search/search-bar.tsx` | 검색창 UI |

---

## 5. 데이터베이스

### 사용 서비스: Supabase

**Supabase**란? PostgreSQL 데이터베이스를 쉽게 쓸 수 있게 해주는 서비스.

### 주요 테이블 (데이터 저장소)

| 테이블 | 저장 내용 |
|--------|----------|
| `users` | 사용자 정보 |
| `contents` | 문서, 튜토리얼, 스니펫 |
| `subscriptions` | 구독 정보 (Pro/Team) |
| `purchases` | 단건 구매 내역 |
| `user_contents` | 사용자별 접근 권한 |
| `user_progress` | 학습 진행률 |
| `ratings` | 평점/리뷰 |

### 두 가지 접속 방식

| 방식 | 용도 | 권한 |
|------|------|------|
| `supabase` (일반) | 사용자 요청 처리 | 제한적 (본인 데이터만) |
| `supabaseAdmin` (관리자) | 서버 내부 작업 | 모든 데이터 접근 가능 |

### RLS (Row Level Security)

**RLS**란? 데이터베이스 수준의 보안. 사용자가 자기 데이터만 볼 수 있게 제한.

```
예시:
- 김철수가 로그인 → 김철수의 구매내역만 볼 수 있음
- 박영희의 구매내역은 볼 수 없음
```

### 관련 파일

| 파일 | 역할 |
|------|------|
| `lib/supabase.ts` | DB 연결 설정 |
| `lib/db.ts` | DB 쿼리 함수들 |
| `types/database.ts` | 테이블 구조 정의 |

---

## 6. 보안 설정

### 환경 변수 (.env.local)

**환경 변수**란? 비밀번호, API 키 같은 민감한 정보를 코드에 직접 쓰지 않고 따로 보관하는 방식.

```
⛔ 나쁜 예: 코드에 직접 작성
const apiKey = "sk_live_abc123..."

✅ 좋은 예: 환경 변수 사용
const apiKey = process.env.STRIPE_SECRET_KEY
```

### 현재 사용 중인 환경 변수

| 변수명 | 용도 |
|--------|------|
| `CLERK_SECRET_KEY` | Clerk 인증 |
| `STRIPE_SECRET_KEY` | Stripe 결제 |
| `TOSS_SECRET_KEY` | 토스 결제 |
| `ALGOLIA_ADMIN_KEY` | 검색 인덱싱 |
| `SUPABASE_SERVICE_ROLE_KEY` | DB 관리자 접근 |

### 접두사 규칙

| 접두사 | 의미 |
|--------|------|
| `NEXT_PUBLIC_*` | 브라우저에서 볼 수 있음 (공개 가능한 것만!) |
| 접두사 없음 | 서버에서만 사용 (절대 공개 X) |

```
예시:
NEXT_PUBLIC_ALGOLIA_APP_ID=HQGKPFZFY9  ← 공개 OK
ALGOLIA_ADMIN_KEY=210964939b...        ← 비공개!
```

---

## 7. 관리자 기능

### 관리자 인증 방식

Clerk의 **메타데이터**를 사용해서 관리자를 구분합니다.

```
일반 사용자: { }
관리자:     { "role": "admin" }
```

### 관리자만 사용 가능한 API

| API | 기능 |
|-----|------|
| `/api/admin/algolia/configure` | 검색 설정 초기화 |
| `/api/admin/algolia/index` | 콘텐츠 검색 등록 |

### 관리자 추가 방법

1. Clerk 대시보드 접속 (dashboard.clerk.com)
2. Users → 대상 사용자 클릭
3. Metadata → Public metadata 편집
4. `{ "role": "admin" }` 입력 후 저장

### 보안 코드 예시

```typescript
// 관리자만 통과할 수 있는 검문소
const user = await currentUser()

// 1단계: 로그인 체크
if (!user) {
    return { error: 'Unauthorized' }  // 로그인 안 함
}

// 2단계: 관리자 체크
if (user.publicMetadata?.role !== 'admin') {
    return { error: 'Forbidden' }     // 관리자 아님
}

// 여기까지 온 사람만 관리자 기능 사용 가능
```

---

## 부록: 자주 쓰는 용어 정리

| 용어 | 설명 |
|------|------|
| **API** | 서버에 요청을 보내는 주소. 화면 없이 데이터만 주고받음 |
| **Webhook** | 외부 서비스가 우리 서버에 "이런 일이 생겼어요" 알려주는 것 |
| **인덱싱** | 검색을 빠르게 하기 위해 데이터를 정리해두는 것 |
| **빌링키** | 카드번호 대신 사용하는 암호화된 결제 토큰 |
| **RLS** | 데이터베이스에서 "너는 네 데이터만 봐" 규칙 |
| **환경 변수** | 비밀번호, API 키 등을 안전하게 보관하는 방법 |
| **미들웨어** | 요청이 들어올 때 먼저 검사하는 코드 (경비원) |

---

## 파일 위치 빠른 참조

### 핵심 설정 파일

```
lib/
├── algolia.ts        # 검색 시스템
├── supabase.ts       # 데이터베이스
├── toss-payments.ts  # 토스 결제
├── stripe.ts         # Stripe 결제
├── clerk.ts          # 인증
└── pricing.ts        # 가격 정보
```

### API 엔드포인트

```
app/api/
├── admin/algolia/    # 관리자용 검색 관리
├── toss/             # 토스 결제 처리
├── stripe/           # Stripe 결제 처리
├── content/          # 콘텐츠 조회/검색
├── auth/             # 인증 webhook
└── rating/           # 평점 처리
```

---

## 8. 콘텐츠 관리 시스템 (CMS)

### MDX란?

**MDX** = Markdown + JSX (React 컴포넌트)

일반 마크다운에 React 컴포넌트를 넣을 수 있는 형식입니다.

```
일반 마크다운:
# 제목
이것은 **굵은** 글씨입니다.

MDX:
# 제목
이것은 **굵은** 글씨입니다.
<Callout type="warning">주의하세요!</Callout>  ← React 컴포넌트
```

### 콘텐츠 저장 구조

```
1. 작성자가 MDX 형식으로 콘텐츠 작성
     ↓
2. 데이터베이스(Supabase)에 저장
     ↓
3. 사용자가 페이지 방문
     ↓
4. 서버에서 MDX를 HTML로 변환 (렌더링)
     ↓
5. 사용자 화면에 표시
```

### 사용 가능한 MDX 컴포넌트

콘텐츠 작성 시 사용할 수 있는 특수 컴포넌트들:

| 컴포넌트 | 용도 | 예시 |
|----------|------|------|
| `<Callout>` | 주의/팁/정보 박스 | 중요한 안내 표시 |
| `<CodeBlock>` | 코드 블록 (복사 버튼 포함) | 예제 코드 표시 |
| `<Checkpoint>` | 학습 진행 체크 | "여기까지 완료했다면 체크" |
| `<Quiz>` | 퀴즈 문제 | 이해도 확인 |
| `<Steps>` / `<Step>` | 단계별 안내 | 튜토리얼 순서 |

### Callout 종류

```mdx
<Callout type="info">일반 정보</Callout>
<Callout type="tip">유용한 팁</Callout>
<Callout type="warning">주의 사항</Callout>
<Callout type="error">위험/에러</Callout>
<Callout type="success">성공/완료</Callout>
```

### 콘텐츠 타입별 페이지

| 타입 | URL | 용도 |
|------|-----|------|
| 문서 (Doc) | `/docs/[slug]` | 개념 설명 (5-10분) |
| 튜토리얼 | `/tutorials/[slug]` | 프로젝트 완성 (30분-3시간) |
| 스니펫 | `/snippets/[slug]` | 코드 조각 (복붙용) |

### 관리자 기능

관리자만 접근할 수 있는 콘텐츠 관리 페이지:

| 페이지 | URL | 기능 |
|--------|-----|------|
| 콘텐츠 목록 | `/admin/content` | 전체 콘텐츠 조회/검색 |
| 새 콘텐츠 | `/admin/content/new` | 새 콘텐츠 작성 |
| 콘텐츠 편집 | `/admin/content/[id]` | MDX 편집기 |

### MDX 편집기 기능

```
┌─────────────────────────────────────────────┐
│ [← 목록으로]                      [🗑 삭제]  │
├─────────────────────────────────────────────┤
│ 기본 정보                                    │
│ ┌─────────────────────────────────────────┐ │
│ │ 제목: [Next.js 14 시작하기          ]   │ │
│ │ Slug: [nextjs-14-getting-started    ]   │ │
│ │ 설명: [Next.js 14의 새로운 기능...  ]   │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ 타입: [문서] [튜토리얼] [스니펫]             │
│ 난이도: [초급] [중급] [고급]                 │
│ 상태: [초안 ▼]  접근: [🌐 무료 공개]         │
├─────────────────────────────────────────────┤
│ 콘텐츠 (MDX)                    [미리보기]   │
│ ┌─────────────────────────────────────────┐ │
│ │ # 시작하기                              │ │
│ │                                         │ │
│ │ 여기에 콘텐츠를 작성하세요.             │ │
│ │ ...                                     │ │
│ └─────────────────────────────────────────┘ │
│                         [취소] [💾 저장]     │
└─────────────────────────────────────────────┘
```

### 편집기 버튼 기능

| 버튼 | 기능 |
|------|------|
| 목록으로 | `/admin/content` 페이지로 이동 |
| 삭제 | 콘텐츠 삭제 (확인 모달 표시) |
| 미리보기 | MDX를 실제 렌더링된 형태로 미리보기 |
| 취소 | 목록 페이지로 이동 |
| 저장 | 새 콘텐츠면 생성, 기존 콘텐츠면 수정 |

### 콘텐츠 CRUD

```
생성 (Create):
1. /admin/content/new 접속
2. 제목, Slug, 콘텐츠 입력
3. "생성" 버튼 클릭
     ↓
DB에 새 콘텐츠 저장

수정 (Update):
1. /admin/content/[id] 접속
2. 내용 수정
3. "저장" 버튼 클릭
     ↓
DB 콘텐츠 업데이트

삭제 (Delete):
1. /admin/content/[id] 접속
2. "삭제" 버튼 클릭
3. 확인 모달에서 "삭제" 클릭
     ↓
DB에서 콘텐츠 삭제
```

### 코드 블록 복사 기능

MDX 콘텐츠 내 모든 코드 블록에 복사 버튼이 자동으로 표시됩니다.

```
┌─────────────────────────────────────────────┐
│ const greeting = 'Hello, World!'        [📋]│  ← 복사 버튼
│ console.log(greeting)                       │
└─────────────────────────────────────────────┘

버튼 클릭 시:
1. 클립보드에 코드 복사
2. 버튼 아이콘 체크(✓)로 변경
3. 2초 후 원래 아이콘으로 복원
```

### 목차(TOC) 앵커 링크

MDX 콘텐츠의 헤딩(h1, h2, h3)에 자동으로 앵커 ID가 생성됩니다.

```
콘텐츠:
# 시작하기           → <h1 id="시작하기">
## 설치 방법         → <h2 id="설치-방법">
### 기본 설정        → <h3 id="기본-설정">

목차에서 링크 클릭 시:
1. 해당 섹션으로 스크롤
2. 상단 네비게이션 여백 확보 (scroll-mt-20)
3. URL에 #앵커 추가
```

### 미리보기 API

관리자 편집기에서 MDX를 실시간으로 미리볼 수 있습니다.

```
편집기에서 "미리보기" 클릭
    ↓
/api/admin/preview 호출
    ↓
1. 관리자 권한 확인
2. MDX 컴포넌트 → HTML 변환
3. Markdown → HTML 변환 (marked 사용)
    ↓
렌더링된 HTML 반환
    ↓
미리보기 영역에 표시
```

**지원하는 MDX 컴포넌트 변환**:
- `<Callout>` → 색상별 박스로 변환
- `<Checkpoint>` → 체크 박스로 변환
- 기타 컴포넌트 → 내부 텍스트만 추출

### 관련 파일

| 파일 | 역할 |
|------|------|
| `lib/mdx.ts` | MDX 컴파일 및 유틸리티 함수 |
| `components/mdx/index.tsx` | MDX HTML 요소 컴포넌트 (h1~h3, p, code 등) |
| `components/mdx/pre-block.tsx` | 코드 블록 + 복사 버튼 |
| `components/mdx/copy-button.tsx` | 복사 버튼 컴포넌트 |
| `components/mdx/callout.tsx` | Callout 컴포넌트 |
| `components/mdx/checkpoint.tsx` | Checkpoint 컴포넌트 |
| `components/admin/content-editor.tsx` | MDX 편집기 UI |
| `components/admin/mdx-preview.tsx` | MDX 미리보기 컴포넌트 |
| `app/api/admin/preview/route.ts` | 미리보기 API |
| `app/(dashboard)/admin/content/` | 관리자 콘텐츠 페이지 |
| `app/(dashboard)/docs/[slug]/page.tsx` | 문서 상세 페이지 |
| `app/(dashboard)/tutorials/[slug]/page.tsx` | 튜토리얼 상세 페이지 |
| `app/(dashboard)/snippets/[slug]/page.tsx` | 스니펫 상세 페이지 |
| `app/actions/content.ts` | 콘텐츠 CRUD 서버 액션 |

### 프론트매터 (Frontmatter)

MDX 파일 최상단에 메타데이터를 정의합니다:

```mdx
---
title: Supabase 인증 구현하기
description: Next.js 앱에 Supabase 인증을 구현합니다.
difficulty: intermediate
estimatedTime: 30
tags:
  - Supabase
  - Auth
  - Next.js
---

# 본문 시작...
```

| 필드 | 설명 |
|------|------|
| `title` | 제목 |
| `description` | 짧은 설명 |
| `difficulty` | 난이도 (beginner/intermediate/advanced) |
| `estimatedTime` | 예상 소요 시간 (분) |
| `tags` | 관련 태그 목록 |

---

## 9. Clerk-Supabase 유저 동기화 시스템

### Webhook이란?

**Webhook**은 외부 서비스(Clerk)가 우리 서버에 "이런 일이 생겼어요!"라고 알려주는 자동 알림 시스템입니다.

```
[사용자가 Clerk에서 회원가입]
         ↓
[Clerk이 우리 서버로 알림 전송] ← Webhook
         ↓
[우리 서버가 Supabase에 유저 정보 저장]
         ↓
[온보딩 페이지에서 "User Not Found" 에러 없음!]
```

### 처리하는 이벤트

| 이벤트 | 발생 시점 | 수행 작업 |
|--------|----------|----------|
| `user.created` | 새로운 유저가 회원가입 | Supabase `users` 테이블에 유저 추가 |
| `user.updated` | 유저가 프로필 수정 | Supabase 유저 정보 업데이트 |
| `user.deleted` | 유저가 계정 삭제 | Supabase에서 유저 삭제 (CASCADE) |

### 저장되는 정보

회원가입 시 Supabase에 저장되는 데이터:

```typescript
{
  clerk_user_id: "user_2abc123...",  // Clerk의 유저 ID
  email: "user@example.com",         // 이메일
  name: "홍길동",                     // 이름
  avatar_url: "https://...",         // 프로필 사진
  created_at: "2025-11-27...",       // 생성 시간
  updated_at: "2025-11-27..."        // 수정 시간
}
```

### Webhook 보안

외부에서 오는 요청이므로 보안이 중요합니다:

```
1. Clerk이 Webhook 요청 전송
2. 요청에 서명(signature) 포함
3. 우리 서버에서 서명 검증 (Svix 라이브러리 사용)
4. ✅ 검증 성공 → 처리 진행
   ❌ 검증 실패 → 요청 거부
```

### 관련 파일

| 파일 | 역할 |
|------|------|
| `app/api/auth/webhook/route.ts` | Clerk webhook 처리 엔드포인트 |
| `app/api/auth/webhook/__tests__/route.test.ts` | Webhook 테스트 (9개 테스트 통과) |
| `Document/CLERK_WEBHOOK_SETUP.md` | Clerk Dashboard 설정 가이드 |

### Clerk Dashboard 설정

Webhook이 작동하려면 Clerk Dashboard에서 설정이 필요합니다:

1. **Clerk Dashboard** → **Webhooks** 메뉴
2. **Add Endpoint** 클릭
3. **URL 입력**: `https://your-domain.com/api/auth/webhook`
4. **이벤트 선택**:
   - ✅ `user.created`
   - ✅ `user.updated`
   - ✅ `user.deleted`
5. **Signing Secret** 복사
6. `.env.local`에 추가: `CLERK_WEBHOOK_SECRET=whsec_...`

### 트러블슈팅

**"User Not Found" 에러가 계속 발생한다면?**

1. Clerk Dashboard → Webhooks → Logs 확인
2. Webhook이 전송되었는지 확인
3. 서버 로그에서 에러 확인
4. 환경 변수 `CLERK_WEBHOOK_SECRET` 확인
5. Supabase `users` 테이블에 유저가 있는지 확인

---

## 10. Soft Onboarding 시스템

### Soft Onboarding이란?

**강제 온보딩 ❌**: 회원가입 후 바로 긴 설문 → 이탈률 높음
**Soft Onbo딩 ✅**: 콘텐츠 먼저 보여주고 → 자연스럽게 맞춤 추천 유도 → 이탈률 낮음

### 작동 방식

```
[회원가입 완료]
      ↓
[즉시 홈 화면 진입] ← 인기 튜토리얼, 복사 가능한 코드 표시
      ↓
[사용자 행동 추적] ← 무엇을 보는지, 무엇을 검색하는지 기록
      ↓
[전략적 프롬프트 표시] ← 콘텐츠 3개 본 후 "Next.js에 관심 있으시네요! 맞춤 추천 받으실래요?"
      ↓
[온보딩 완료 or 나중에]
```

### 사용자 행동 추적

자동으로 추적되는 행동:

| 행동 타입 | 추적 내용 | 사용처 |
|----------|----------|--------|
| `content_view` | 콘텐츠 조회 | 관심 스택 추론 |
| `search_query` | 검색어 | 관심 주제 파악 |
| `snippet_copy` | 스니펫 복사 | 실제 사용 패턴 |
| `tutorial_start` | 튜토리얼 시작 | 학습 의지 파악 |
| `tutorial_complete` | 튜토리얼 완료 | 실력 레벨 추정 |

### 스택 추론 (Inferred Stack)

사용자가 본 콘텐츠를 분석해서 자동으로 관심 기술 스택을 추론합니다:

```
사용자가 본 콘텐츠:
- Next.js 튜토리얼 3개
- Clerk 인증 문서 2개
- Supabase 문서 1개

→ 추론된 스택:
{
  "framework": "Next.js",
  "auth": "Clerk",
  "database": "Supabase"
}

→ 추천 콘텐츠:
"Next.js + Clerk + Supabase로 SaaS 만들기" 튜토리얼
```

### 전략적 온보딩 프롬프트 트리거

| 트리거 조건 | 프롬프트 메시지 | 목적 |
|------------|----------------|------|
| 콘텐츠 3개 이상 조회 | "Next.js에 관심 있으시네요! 맞춤 추천 받으시겠어요?" | 관심사 기반 맞춤화 |
| 검색 3회 이상 | "자주 찾으시는 주제로 추천드릴까요?" | 검색 → 큐레이션 전환 |
| 튜토리얼 1개 완료 | "첫 프로젝트 완성! 다음 단계 추천받기" | 학습 동기 강화 |

### 데이터베이스 스키마

**users 테이블 추가 필드**:

| 필드 | 타입 | 설명 |
|------|------|------|
| `onboarding_completed` | BOOLEAN | 온보딩 완료 여부 |
| `onboarding_dismissed_at` | TIMESTAMP | 온보딩 dismiss 시간 (7일간 재표시 X) |
| `inferred_stack` | JSONB | 추론된 기술 스택 |
| `content_view_count` | INTEGER | 콘텐츠 조회 수 |
| `search_count` | INTEGER | 검색 횟수 |
| `project_type` | VARCHAR | 프로젝트 타입 (web/app/backend) |
| `stack_preset` | VARCHAR | 스택 프리셋 (saas-kit/ecommerce/custom) |

**user_behaviors 테이블**:

```sql
CREATE TABLE user_behaviors (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  behavior_type VARCHAR(50),  -- 'content_view', 'search_query', etc.
  metadata JSONB,              -- 추가 데이터 (content_id, query, etc.)
  created_at TIMESTAMPTZ
)
```

**onboarding_prompts 테이블**:

```sql
CREATE TABLE onboarding_prompts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  trigger_type VARCHAR(50),    -- 'content_views', 'searches', 'completion'
  prompt_message TEXT,
  shown_at TIMESTAMPTZ,
  clicked BOOLEAN,
  dismissed BOOLEAN
)
```

### 자동 카운트 업데이트

사용자 행동이 기록되면 자동으로 카운트가 증가합니다:

```sql
-- user_behaviors에 INSERT가 발생하면
-- users 테이블의 카운트가 자동 증가
TRIGGER: update_user_behavior_counts

content_view 행동 → content_view_count + 1
search_query 행동 → search_count + 1
```

### 온보딩 상태 뷰 (user_onboarding_status)

관리자가 쉽게 온보딩 상태를 확인할 수 있는 뷰:

```sql
SELECT
  user_id,
  email,
  onboarding_completed,
  content_view_count,
  search_count,
  -- 온보딩 프롬프트를 보여줘야 하는지 자동 계산
  should_show_onboarding_prompt,
  -- 어떤 트리거로 보여줄지 추천
  suggested_trigger_type
FROM user_onboarding_status
```

### 관련 파일

| 파일 | 역할 |
|------|------|
| `supabase/migrations/20241127_soft_onboarding_schema.sql` | Soft Onboarding 스키마 생성 |
| `app/actions/onboarding.ts` | 온보딩 완료/스킵 서버 액션 |
| `app/actions/behavior-tracking.ts` | 사용자 행동 추적 액션 |
| `components/onboarding/strategic-onboarding-modal.tsx` | 전략적 온보딩 모달 |
| `components/onboarding/onboarding-wizard.tsx` | 온보딩 마법사 UI |

### A/B 테스트 지표

Soft Onboarding 효과를 측정하는 지표:

| 지표 | 목표 | 현재 상태 |
|------|------|----------|
| 회원가입 후 첫 콘텐츠 조회율 | 80%+ | 측정 예정 |
| 온보딩 완료율 | 45%+ | 측정 예정 |
| D7 리텐션 (7일 후 재방문율) | 38%+ | 측정 예정 |
| 회원가입 이탈률 | <25% | 측정 예정 |

---

## 11. Dashboard UI 및 Navigation

### Header 컴포넌트

상단 헤더에는 다음 요소들이 표시됩니다:

```
┌──────────────────────────────────────────────────┐
│  VibeStack  Docs  Tutorials  Snippets    [👤]   │ ← Header
└──────────────────────────────────────────────────┘
```

| 요소 | 기능 |
|------|------|
| VibeStack 로고 | 클릭 시 `/dashboard`로 이동 |
| Docs 링크 | `/docs` 페이지로 이동 |
| Tutorials 링크 | `/tutorials` 페이지로 이동 |
| Snippets 링크 | `/snippets` 페이지로 이동 |
| UserButton (👤) | Clerk 유저 메뉴 |

### UserButton 기능

Clerk의 `<UserButton />` 컴포넌트가 제공하는 기능:

**로그인 상태 (SignedIn)**:
- 유저 프로필 아이콘 표시
- 클릭 시 드롭다운 메뉴:
  - Manage account (계정 관리)
  - Sign out (로그아웃)

**로그아웃 상태 (SignedOut)**:
- "Sign In" 버튼 표시
- 클릭 시 Clerk 로그인 모달

### Sidebar 네비게이션

왼쪽 사이드바 메뉴:

```
┌────────────┐
│ 🏠 Dashboard│
│ 📚 Docs     │
│ 🎓 Tutorials│
│ 💻 Snippets │
│ 📂 Library  │
│ 🔍 Search   │
│ ⚙️  Settings│
└────────────┘
```

| 메뉴 | URL | 아이콘 | 설명 |
|------|-----|--------|------|
| Dashboard | `/dashboard` | Home | 메인 대시보드 |
| Docs | `/docs` | BookOpen | 문서 목록 |
| Tutorials | `/tutorials` | GraduationCap | 튜토리얼 목록 |
| Snippets | `/snippets` | Code2 | 코드 스니펫 목록 |
| Library | `/library` | FolderOpen | 내 라이브러리 |
| Search | `/search` | Search | 검색 페이지 |
| Settings | `/settings` | Settings | 설정 페이지 |

### 레이아웃 구조

```
┌─────────────────────────────────────────────┐
│              Header (고정)                  │
├──────────┬──────────────────────────────────┤
│          │                                  │
│ Sidebar  │        Main Content             │
│ (고정)   │        (스크롤 가능)             │
│          │                                  │
│          │                                  │
└──────────┴──────────────────────────────────┘
```

### 관련 파일

| 파일 | 역할 |
|------|------|
| `components/layout/header.tsx` | 상단 헤더 컴포넌트 |
| `components/layout/sidebar.tsx` | 왼쪽 사이드바 컴포넌트 |
| `components/layout/__tests__/header.test.tsx` | Header 테스트 (5개 통과) |
| `app/(dashboard)/layout.tsx` | Dashboard 레이아웃 |

### Header 테스트 커버리지

모든 테스트 통과 (5/5):

✅ Header가 렌더링되는지
✅ VibeStack 로고가 표시되는지
✅ Clerk UserButton이 렌더링되는지
✅ 네비게이션 구조가 올바른지
✅ 유저 메뉴가 오른쪽에 위치하는지

---

## 12. 관리자(Admin) 콘텐츠 관리

### Admin 권한 체크

관리자 페이지는 `publicMetadata.role === 'admin'`인 유저만 접근 가능합니다:

```typescript
const user = await currentUser()
if (!user || user.publicMetadata?.role !== 'admin') {
  redirect('/')  // 홈으로 강제 이동
}
```

### Admin으로 설정하는 방법

1. **Clerk Dashboard** 접속 (dashboard.clerk.com)
2. **Users** → 대상 유저 선택
3. **Metadata** 탭
4. **Public metadata**에 추가:
   ```json
   {
     "role": "admin"
   }
   ```
5. **Save** 클릭

### Admin 전용 페이지

| URL | 기능 |
|-----|------|
| `/admin/content` | 모든 콘텐츠 목록 (draft/published/archived) |
| `/admin/content/new` | 새 콘텐츠 생성 |
| `/admin/content/[id]` | 콘텐츠 편집 |

### 콘텐츠 상태

| 상태 | 의미 | 배지 색상 |
|------|------|----------|
| `draft` | 초안 (작성 중) | 노란색 |
| `published` | 발행됨 (공개) | 초록색 |
| `archived` | 보관됨 (비공개) | 회색 |

### RLS Bypass

관리자 페이지에서는 Supabase의 RLS(Row Level Security)를 우회하여 모든 콘텐츠를 조회할 수 있습니다:

```typescript
// 일반 사용자: 자신이 접근 가능한 콘텐츠만
await getContents({ status: 'published' })

// 관리자: 모든 상태의 콘텐츠 조회
await getContents({ status: 'draft', bypassRLS: true })
```

---

## 부록: 구현 완료 vs 예정 기능

### ✅ 구현 완료

- [x] Next.js 14 프로젝트 셋업
- [x] TypeScript, Tailwind CSS, Shadcn/ui
- [x] Clerk 인증 (로그인/회원가입/로그아웃)
- [x] Clerk-Supabase 유저 동기화 (Webhook)
- [x] Stripe 결제 시스템 (해외)
- [x] Toss Payments 결제 시스템 (한국)
- [x] 구독 관리 (Pro/Team 플랜)
- [x] 단건 구매 시스템
- [x] Algolia 자연어 검색
- [x] Supabase 데이터베이스 스키마
- [x] RLS (Row Level Security) 정책
- [x] MDX 콘텐츠 시스템
- [x] 콘텐츠 관리 시스템 (CMS)
- [x] 관리자 페이지 (`/admin/content`)
- [x] Soft Onboarding 스키마
- [x] 사용자 행동 추적 시스템
- [x] Dashboard UI (Header + Sidebar)
- [x] Vercel 배포

### 📋 구현 예정

- [ ] Soft Onboarding UI (Dismissable Banner, Strategic Prompts)
- [ ] 홈 화면 UI (인기 튜토리얼, 시작 가이드)
- [ ] 비개발자용 콘텐츠 30개 작성
  - [ ] AI Tool Usage Docs (10개)
  - [ ] Quick Start Docs (10개)
  - [ ] Error Solution Docs (10개)
- [ ] Prompt-First 튜토리얼 5개
  - [ ] 45분 Todo App
  - [ ] 30분 Waitlist Landing Page
  - [ ] 1.5시간 MDX Blog
  - [ ] 2시간 Stripe Subscription SaaS
  - [ ] 3시간 Fullstack App (종합편)
- [ ] Copy-Paste 스니펫 50개
  - [ ] Auth (10개)
  - [ ] Database (15개)
  - [ ] Payments (10개)
  - [ ] UI Components (15개)
- [ ] PostHog 분석 (Real-time Metrics)
- [ ] Sentry 에러 추적
- [ ] 피드백 & 퀴즈 시스템
- [ ] 베타 테스트 (100명)
- [ ] Product Hunt 런칭

---

*마지막 업데이트: 2025년 11월 27일*
