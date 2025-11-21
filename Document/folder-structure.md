
---
tags:
  - project/vibestack
  - nextjs/14
  - architecture
  - folder-structure
status: planning
priority: high
created: 2025-05-21

---

# 📁 VibeStack 폴더 구조

> [!info] 프로젝트 개요
> **Next.js 14 App Router** 기준의 VibeStack 프로젝트 구조 및 개발 로드맵입니다.

## 1. 🏗️ 전체 폴더 구조 (Folder Structure)

> [!example]- 📂 전체 트리 펼치기
> ```bash
> vibestack/
> ├── app/
> │   ├── (marketing)/              # 마케팅 페이지 그룹
> │   │   ├── layout.tsx            # 마케팅 레이아웃 (헤더, 푸터)
> │   │   ├── page.tsx              # 🏠 랜딩 페이지
> │   │   ├── pricing/
> │   │   │   └── page.tsx          # 💰 가격 정책 페이지
> │   │   ├── about/
> │   │   │   └── page.tsx          # ℹ️ 소개 페이지
> │   │   └── blog/
> │   │       ├── page.tsx          # 📝 블로그 목록
> │   │       └── [slug]/
> │   │           └── page.tsx      # 📝 블로그 글
> │   │
> │   ├── (auth)/                   # 인증 페이지 그룹
> │   │   ├── layout.tsx            # 인증 레이아웃 (심플)
> │   │   ├── sign-in/
> │   │   │   └── page.tsx          # 🔐 로그인
> │   │   └── sign-up/
> │   │       └── page.tsx          # ✍️ 회원가입
> │   │
> │   ├── (onboarding)/             # 온보딩 그룹 (로그인 후 첫 설정)
> │   │   ├── layout.tsx            # 온보딩 레이아웃
> │   │   ├── welcome/
> │   │   │   └── page.tsx          # 👋 환영 (프로젝트 타입 선택)
> │   │   └── stack/
> │   │       └── page.tsx          # 🛠️ 스택 선택
> │   │
> │   ├── (dashboard)/              # 메인 대시보드 그룹 ⭐
> │   │   ├── layout.tsx            # 대시보드 레이아웃 (사이드바)
> │   │   ├── page.tsx              # 📊 대시보드 홈
> │   │   │
> │   │   ├── docs/                 # 📚 문서 섹션
> │   │   │   ├── page.tsx          # 문서 목록
> │   │   │   └── [slug]/
> │   │   │       └── page.tsx      # 문서 상세
> │   │   │
> │   │   ├── tutorials/            # 🎯 튜토리얼 섹션
> │   │   │   ├── page.tsx          # 튜토리얼 목록
> │   │   │   └── [slug]/
> │   │   │       └── page.tsx      # 튜토리얼 상세
> │   │   │
> │   │   ├── snippets/             # 🔧 스니펫 섹션
> │   │   │   ├── page.tsx          # 스니펫 목록
> │   │   │   └── [slug]/
> │   │   │       └── page.tsx      # 스니펫 상세
> │   │   │
> │   │   ├── bundles/              # 📦 번들 섹션
> │   │   │   ├── page.tsx          # 번들 목록
> │   │   │   └── [slug]/
> │   │   │       └── page.tsx      # 번들 상세
> │   │   │
> │   │   ├── search/               # 🔍 검색 결과
> │   │   │   └── page.tsx
> │   │   │
> │   │   ├── projects/             # 📁 내 프로젝트
> │   │   │   ├── page.tsx          # 프로젝트 목록
> │   │   │   ├── new/
> │   │   │   │   └── page.tsx      # 새 프로젝트
> │   │   │   └── [id]/
> │   │   │       └── page.tsx      # 프로젝트 상세
> │   │   │
> │   │   ├── library/              # 📖 내 라이브러리 (구매/완료한 것)
> │   │   │   └── page.tsx
> │   │   │
> │   │   ├── progress/             # 📈 학습 진행률
> │   │   │   └── page.tsx
> │   │   │
> │   │   └── settings/             # ⚙️ 설정
> │   │       ├── page.tsx          # 계정 설정
> │   │       ├── subscription/
> │   │       │   └── page.tsx      # 구독 관리
> │   │       ├── billing/
> │   │       │   └── page.tsx      # 결제 내역
> │   │       └── team/
> │   │           └── page.tsx      # 팀 관리 (Team Plan)
> │   │
> │   ├── (tools)/                  # 도구 페이지 그룹
> │   │   ├── error-clinic/
> │   │   │   └── page.tsx          # 🚨 에러 진단기
> │   │   ├── project-map/
> │   │   │   └── page.tsx          # 🗺️ 프로젝트 맵 생성 (Pro)
> │   │   └── ai-chat/
> │   │       └── page.tsx          # 💬 AI 챗봇 (Pro)
> │   │
> │   ├── (checkout)/               # 결제 페이지 그룹
> │   │   ├── buy/
> │   │   │   └── [contentId]/
> │   │   │       └── page.tsx      # 💳 단품 구매
> │   │   ├── subscribe/
> │   │   │   └── page.tsx          # 💳 Pro 구독
> │   │   ├── success/
> │   │   │   └── page.tsx          # ✅ 결제 성공
> │   │   └── canceled/
> │   │       └── page.tsx          # ❌ 결제 취소
> │   │
> │   ├── api/                      # API 라우트
> │   │   ├── auth/
> │   │   │   └── webhook/
> │   │   │       └── route.ts      # Clerk Webhook
> │   │   ├── stripe/
> │   │   │   ├── checkout/
> │   │   │   │   └── route.ts      # Stripe Checkout 세션 생성
> │   │   │   ├── subscription/
> │   │   │   │   └── route.ts      # 구독 생성
> │   │   │   └── webhook/
> │   │   │       └── route.ts      # Stripe Webhook
> │   │   ├── content/
> │   │   │   ├── [id]/
> │   │   │   │   └── route.ts      # 콘텐츠 조회
> │   │   │   └── search/
> │   │   │       └── route.ts      # 검색 (Algolia 프록시)
> │   │   ├── progress/
> │   │   │   └── route.ts          # 진행률 저장
> │   │   ├── rating/
> │   │   │   └── route.ts          # 평가 제출
> │   │   └── error-diagnose/
> │   │       └── route.ts          # 에러 진단
> │   │
> │   ├── actions/                  # Server Actions
> │   │   ├── auth.ts               # 인증 관련
> │   │   ├── content.ts            # 콘텐츠 CRUD
> │   │   ├── purchase.ts           # 구매 처리
> │   │   ├── subscription.ts       # 구독 관리
> │   │   ├── progress.ts           # 진행률 업데이트
> │   │   └── project.ts            # 프로젝트 관리
> │   │
> │   ├── layout.tsx                # 루트 레이아웃
> │   ├── not-found.tsx             # 404 페이지
> │   ├── error.tsx                 # 에러 페이지
> │   └── loading.tsx               # 로딩 페이지
> │
> ├── components/                   # 컴포넌트
> │   ├── ui/                       # Shadcn/ui 컴포넌트
> │   │   ├── button.tsx
> │   │   ├── card.tsx
> │   │   ├── input.tsx
> │   │   ├── dialog.tsx
> │   │   ├── badge.tsx
> │   │   └── ...
> │   │
> │   ├── layout/                   # 레이아웃 컴포넌트
> │   │   ├── header.tsx            # 헤더
> │   │   ├── footer.tsx            # 푸터
> │   │   ├── sidebar.tsx           # 사이드바
> │   │   └── mobile-nav.tsx        # 모바일 네비게이션
> │   │
> │   ├── content/                  # 콘텐츠 관련
> │   │   ├── content-card.tsx      # 콘텐츠 카드
> │   │   ├── tutorial-steps.tsx    # 튜토리얼 단계
> │   │   ├── code-block.tsx        # 코드 블록
> │   │   ├── copy-button.tsx       # 복사 버튼
> │   │   ├── checkpoint.tsx        # 체크포인트
> │   │   ├── progress-bar.tsx      # 프로그레스 바
> │   │   └── rating-widget.tsx     # 평가 위젯
> │   │
> │   ├── dashboard/                # 대시보드 전용
> │   │   ├── stats-card.tsx        # 통계 카드
> │   │   ├── recent-activity.tsx   # 최근 활동
> │   │   └── recommended.tsx       # 추천 콘텐츠
> │   │
> │   ├── search/                   # 검색 관련
> │   │   ├── search-bar.tsx        # 검색 바
> │   │   ├── search-filters.tsx    # 필터
> │   │   └── search-results.tsx    # 결과
> │   │
> │   ├── checkout/                 # 결제 관련
> │   │   ├── pricing-card.tsx      # 가격 카드
> │   │   ├── payment-modal.tsx     # 결제 모달
> │   │   └── credit-display.tsx    # 크레딧 표시
> │   │
> │   └── tools/                    # 도구 컴포넌트
> │       ├── error-diagnostics.tsx # 에러 진단
> │       ├── project-map.tsx       # 프로젝트 맵
> │       └── ai-chatbot.tsx        # AI 챗봇
> │
> ├── lib/                          # 유틸리티 & 설정
> │   ├── supabase.ts               # Supabase 클라이언트
> │   ├── stripe.ts                 # Stripe 클라이언트
> │   ├── algolia.ts                # Algolia 검색
> │   ├── clerk.ts                  # Clerk 설정
> │   ├── db.ts                     # DB 쿼리 헬퍼
> │   ├── utils.ts                  # 유틸리티 함수
> │   └── constants.ts              # 상수
> │
> ├── types/                        # TypeScript 타입
> │   ├── database.ts               # DB 타입 (Supabase 생성)
> │   ├── content.ts                # 콘텐츠 타입
> │   ├── user.ts                   # 사용자 타입
> │   └── index.ts                  # 통합
> │
> ├── hooks/                        # Custom Hooks
> │   ├── use-user.ts               # 사용자 정보
> │   ├── use-subscription.ts       # 구독 상태
> │   ├── use-content-access.ts     # 콘텐츠 접근 권한
> │   ├── use-search.ts             # 검색
> │   └── use-progress.ts           # 진행률
> │
> ├── styles/
> │   └── globals.css               # 전역 스타일 (Tailwind)
> │
> ├── public/
> │   ├── images/
> │   ├── icons/
> │   └── fonts/
> │
> ├── middleware.ts                 # Next.js 미들웨어 (인증)
> ├── next.config.js
> ├── tailwind.config.js
> ├── tsconfig.json
> └── package.json
> ```

---

## 2. 📄 핵심 페이지 상세 (Page Details)

### 1. 마케팅 페이지 (미인증)
```
/ (랜딩)
├─ Hero 섹션 (문제 제기 + CTA)
├─ Social Proof (통계)
├─ Features (3-Pillar)
├─ Pricing
└─ FAQ

/pricing
├─ 가격 비교표
├─ FAQ
└─ CTA

/about
└─ 팀, 비전, 스토리
```

### 2. 인증 페이지
```
/sign-in
└─ Clerk <SignIn /> 컴포넌트

/sign-up
└─ Clerk <SignUp /> 컴포넌트
```

### 3. 온보딩 (첫 로그인)
```
/welcome
└─ 프로젝트 타입 선택
   [웹] [앱] [백엔드]

/stack
└─ 스택 선택
   [프리셋 3개] [커스텀]
```

### 4. 대시보드 (메인)
```
/dashboard
├─ 환영 메시지
├─ 추천 튜토리얼 (1-2개)
├─ 필수 문서 (3-5개)
├─ 최근 활동
└─ 학습 통계

/dashboard/docs
├─ 필터 (무료/프리미엄, 난이도)
├─ 정렬 (인기순, 최신순)
└─ 카드 그리드

/dashboard/docs/[slug]
├─ 제목 + 메타 (시간, 난이도)
├─ 신뢰 지표 (성공률, 평점)
├─ 체크리스트
├─ MDX 본문
├─ 코드 블록 (복사 버튼)
├─ 에러 TOP 5
└─ 평가 위젯

/dashboard/tutorials/[slug]
├─ 제목 + 메타
├─ 진행률 (1/5, 2/5...)
├─ Phase별 콘텐츠
│   ├─ 설명
│   ├─ 프롬프트 (복사 버튼)
│   ├─ 예상 결과
│   └─ 체크포인트
├─ 에러 TOP 5
├─ 이해도 퀴즈 (선택)
└─ 평가 위젯

/dashboard/snippets/[slug]
├─ 제목 + 설명
├─ 코드 (복사 버튼)
├─ 사용법
├─ 커스터마이징 가이드
└─ 관련 문서 링크

/dashboard/library
├─ 구매한 콘텐츠
├─ 완료한 튜토리얼
└─ 북마크
```

### 5. 도구 페이지
```
/error-clinic
├─ 에러 입력 영역
├─ [진단하기] 버튼
├─ 진단 결과
│   ├─ 원인
│   ├─ 해결 방법 (복사 가능)
│   ├─ 예상 시간
│   └─ 해결한 사용자 수
└─ 피드백 ([해결됨] [아직 안 됨])

/project-map (Pro)
├─ 프로젝트 선택
├─ [맵 생성] 버튼
├─ 생성된 트리 구조
└─ 데이터 흐름 다이어그램

/ai-chat (Pro)
└─ 채팅 인터페이스
   (월 100회 제한 표시)
```

### 6. 결제 페이지
```
/buy/[contentId]
├─ 콘텐츠 정보
├─ 가격
├─ [구매하기] ($12)
└─ [Pro로 전환하기] (추천)

/subscribe
├─ Pro 플랜 상세
├─ 가격 (월/연)
├─ 포함 내용
├─ [구독하기]
└─ FAQ

/checkout/success
├─ 🎉 축하 메시지
├─ 구매/구독 정보
└─ [시작하기] CTA

/checkout/canceled
├─ 취소 안내
└─ [다시 시도] CTA
```

### 7. 설정 페이지
```
/settings
├─ 프로필 수정
├─ 이메일 변경
└─ 비밀번호 변경

/settings/subscription
├─ 현재 플랜
├─ 사용 통계
├─ [플랜 변경]
└─ [취소하기]

/settings/billing
├─ 결제 내역
├─ 영수증 다운로드
└─ 결제 수단 관리

/settings/team (Team Plan)
├─ 팀원 목록
├─ [초대하기]
└─ 권한 관리
```

---

## 3. 🎯 개발 우선순위 (Roadmap)

### Phase 1 (Week 1-4): MVP 핵심
> [!todo] **필수 구현 항목**
> - [ ] **1. 마케팅**: `/` (랜딩 페이지)
> - [ ] **2. 인증**: `/sign-in`, `/sign-up` (Clerk 연동)
> - [ ] **3. 온보딩**: `/welcome`, `/stack`
> - [ ] **4. 대시보드 홈**: `/dashboard`
> - [ ] **5. 상세 페이지**: `/dashboard/tutorials/[slug]`, `/dashboard/docs/[slug]`
> - [ ] **6. 구독**: `/subscribe` (Pro 구독)
> - [ ] **7. 도구**: `/error-clinic` (에러 진단)
> 
> **🔧 API 구현**
> - [ ] `/api/stripe/checkout`
> - [ ] `/api/stripe/webhook`
> - [ ] `/api/content/[id]`
> - [ ] `/api/progress`

### Phase 2 (Week 5-8): 확장
> [!note] **추가 기능**
> - [ ] **1. 콘텐츠 확장**: `/dashboard/snippets` (스니펫), `/dashboard/bundles` (번들)
> - [ ] **2. 단품 구매**: `/buy/[contentId]`
> - [ ] **3. 라이브러리**: `/dashboard/library`
> - [ ] **4. 진행률 시스템**: `/dashboard/progress`
> - [ ] **5. 설정 페이지**: `/settings` (전체)

### Phase 3 (Week 9-10): 완성
> [!check] **최종 완성**
> - [ ] **1. Pro 도구**: `/project-map`
> - [ ] **2. Pro 도구**: `/ai-chat`
> - [ ] **3. Team**: `/settings/team` (팀 관리)
> - [ ] **4. 상세 페이지**: `/pricing` 고도화
> - [ ] **5. 최적화**: 검색(Algolia) 및 성능 튜닝

---

## 4. 📊 요약 및 전략

### 페이지 수 요약
```yaml
총 페이지: ~35개

그룹별:
  마케팅: 4개 (/, /pricing, /about, /blog)
  인증: 2개 (/sign-in, /sign-up)
  온보딩: 2개 (/welcome, /stack)
  대시보드: 15개 (홈, 콘텐츠, 프로젝트, 라이브러리 등)
  도구: 3개 (에러 진단, 프로젝트 맵, AI 챗봇)
  결제: 4개 (구매, 구독, 성공, 취소)
  설정: 5개 (계정, 구독, 결제, 팀 등)

API 라우트: ~10개
Server Actions: ~6개
```

### 컴포넌트 재사용 전략
> [!tip] **공통 컴포넌트**
> - **ContentCard**: 문서, 튜토리얼, 스니펫 모두 사용
> - **CopyButton**: 코드 블록마다 적용
> - **ProgressBar**: 튜토리얼, 대시보드 진행률
> - **RatingWidget**: 모든 콘텐츠 하단
> - **PricingCard**: 가격 페이지, 업그레이드 모달
> - **Checkpoint**: 튜토리얼 단계별 체크

> [!tip] **레이아웃**
> - **MarketingLayout**: 랜딩, 가격, 소개
> - **DashboardLayout**: 대시보드 전체 (Sidebar 포함)
> - **SimpleLayout**: 인증, 결제 (집중 모드)

---

> [!success] **결론**
> - **Next.js 14 App Router** 구조를 충실히 따름
> - **Route Groups** `(folder)`로 논리적 분리 완벽
> - **Server Components** 우선 설계
> - **API Routes**와 **Server Actions**의 적절한 혼용
> 
> **🚀 바로 개발 시작 가능한 구조입니다!**
```