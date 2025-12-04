

---
title: VibeStack PRD (Product Requirements Document)
version: 2.2 - 비개발자 특화 (Non-Technical Focused)
date: 2024-11-27
author: Head of Product
status: Major Update - 100% Vibe Coder Content Strategy

---

# 📋 VibeStack PRD

## 📌 한 줄 요약

**"AI 시대 개발자를 위한 실전 학습 플랫폼"**
- 문서 읽기만 → 프로젝트 완성까지
- 이론 중심 → 실전 80%
- 복붙만 → 이해하면서 만들기

---

## 1. 제품 개요 (Product Overview)

### 1.1 문제 정의

**바이브 코딩의 현실:**
```

AI(Cursor, Copilot)로 코드는 짜는데... 
❌ 프로젝트는 완성 못 함 (30% 포기율) 
❌ 에러 나면 혼자서 해결 못 함 (평균 3시간 소요) 
❌ 내 코드인데 이해 못 함 ("주객전도")

```

**기존 솔루션의 한계:**
- **Stack Overflow**: 파편화, 버전 불명확
- **공식 문서**: 이론 중심, AI 비친화적
- **Udemy/강의**: 강의만 보고 끝, 실전 적용 어려움
- **ChatGPT**: 할루시네이션, 일관성 부재

### 1.2 솔루션

**VibeStack = 문서 + 튜토리얼 + 코드 스니펫**

```

┌─────────────────────────────────────┐
│ 1. 가입 → 즉시 콘텐츠 탐색 가능         │
│ ↓                                   │
│ 2. (선택) 맞춤 추천 받기               │
│    - 프로젝트 선택 (웹/앱/백엔드)      │
│    - 스택 선정 (Next.js + Clerk...)  │
│ ↓                                  │
│ 3. 맞춤형 콘텐츠 또는 일반 탐색         │
│ 📚 문서 (개념 이해)                    │
│ 🎯 튜토리얼 (완성 경험)                  │
│ 🔧 스니펫 (빠른 적용)                    │
│ ↓                                    │
│ 4. 프로젝트 완성! 🎉
│
└─────────────────────────────────────┘

```

---

## 2. 타겟 사용자 (Target Users)

### Primary Persona (핵심 타겟: 비개발자 바이브 코더)

**창업자 민준 (비개발자, 29세) - 80% 비중**
- **배경**: 디자이너 출신, 코딩 경험 전무
- **목표**: 2주 안에 SaaS MVP 출시
- **도구**: Cursor (주), Claude (보조)
- **Pain**:
  - "코드는 AI가 짜주는데 완성을 못 해"
  - "에러 나면 뭔 말인지 하나도 모름"
  - "Stack Overflow 봐도 이해 못함"
- **니즈**:
  - "프롬프트만 알려주면 돼"
  - "에러 나면 AI한테 뭐라고 물어볼지"
  - "코드 몰라도 프로젝트 완성하고 싶어"

**부업러 수진 (마케터, 26세) - 15% 비중**
- **배경**: 마케터, HTML/CSS 조금
- **목표**: 주말에 사이드 프로젝트 만들기
- **도구**: Cursor, ChatGPT
- **Pain**: "튜토리얼 따라해도 내 프로젝트엔 어떻게?"
- **니즈**: "빠르게 복붙해서 작동만 되면 돼"

**주니어 개발자 지혜 (1년차, 25세) - 5% 비중**
- **배경**: 부트캠프 6개월 수료
- **목표**: AI 쓰면서도 실력 늘리기
- **도구**: Cursor, Copilot
- **Pain**: "AI가 짠 코드인데 왜인지 모름"
- **니즈**: "이해하면서 빠르게"

### 시장 규모

```
TAM: AI 코딩 도구 사용자 5M+
SAM: 비개발자 + 프로젝트 만드는 사람 1M+
SOM: 한국 + 영어권 비개발자 바이브 코더 100K

주요 채널:
  - Cursor Discord (40K+ 활성 사용자)
  - Reddit r/cursor (25K+ 멤버)
  - Twitter/X #VibeCode 커뮤니티
  - YouTube "코딩 몰라도 AI로 앱 만들기" 시청자
```

---

## 3. 제품 카테고리 (Category)

```yaml
Primary: No-Code 2.0 / Vibe Coding Platform
  "코딩 몰라도 AI로 프로젝트 완성"

Secondary: AI-First Learning Platform
  "프롬프트 중심 개발 교육"

Emerging: Non-Technical Founder Platform (장기)
  "비개발자 창업자의 필수 도구"

핵심 차별점:
  vs Bubble/Webflow (No-Code):
    → 우리: 진짜 코드 프로젝트 (확장성 ∞)

  vs 개발자 부트캠프:
    → 우리: 코딩 배우지 않고 바로 만들기

  vs ChatGPT:
    → 우리: 검증된 프롬프트 + 단계별 가이드

한국어 태그라인:
  "코딩 몰라도 AI로 내 서비스 만들기"
  "프롬프트만 복붙하면 프로젝트 완성"

영문 태그라인:
  "Build Real Projects with AI, Zero Coding Required"
  "From Prompt to Product in Minutes, Not Months"
```

---

## 4. 핵심 기능 (Key Features)

### 4.1 콘텐츠 3-Pillar

#### 📚 Pillar 1: 문서 (Docs) - 비개발자 특화

**목적:** "코드 몰라도 OK" 이해 & 실행

**특징:**

- 프롬프트 80% + 이해 20% (순서 역전!)
- 전문 용어 최소화 ("컴포넌트" → "화면 조각")
- 실시간 성공률 표시 (94%, 562명이 성공)
- 에러 TOP 3 + AI한테 물어볼 질문
- 5-10분 분량 (읽기만 하면 끝)

**예시:**

```markdown
# 5분 만에 로그인 페이지 만들기

> 💬 "코드 몰라도 복붙만 하면 돼요!"

📊 562명이 성공했어요 (94%)
⏱️ 평균 5분
🎯 필요한 것: Cursor만 켜져 있으면 됩니다

## 1단계: Cursor에 이 프롬프트 복붙

```
Clerk를 사용해서 Next.js 로그인 페이지 만들어줘.
/sign-in 경로에 만들고, 로그인 후 /dashboard로 이동.
```
[📋 복사하기]

## 2단계: 이렇게 됐나요?

✅ 체크리스트
□ /sign-in 주소에 로그인 폼 보임
□ 구글 로그인 버튼 있음
□ 로그인하면 대시보드로 이동

## 💡 왜 이렇게 됐나요?

Clerk = 로그인 기능 도구
프롬프트에서 "/sign-in"이라고 하면...
[간단한 설명 2-3줄]

## 🐛 에러 났나요?

1️⃣ "CLERK_SECRET_KEY is missing" (68%가 겪음)
   → AI한테 이렇게 물어보세요:
   "CLERK_SECRET_KEY 환경변수 어떻게 설정해?"

2️⃣ 페이지가 안 뜸
   → 체크: npm run dev 실행했나요?

3️⃣ 구글 버튼이 안 보임
   → [해결 프롬프트 복사]
```

#### 🎯 Pillar 2: 튜토리얼 프로젝트 (Tutorial Projects) - 비개발자용

**목적:** "코드 한 줄 안 봐도" 처음부터 배포까지

**특징:**

- 0 → 배포까지 전체 과정 (코드 이해 0% 필요)
- 단계별 프롬프트 (Cursor 복붙만)
- 체크포인트 (작동하나요? ✅/❌)
- "왜 이렇게 됐나요?" 간단 설명
- 30분 ~ 3시간

**예시:**

```
# 🎯 45분 만에 만드는 Todo 앱

✅ 892명 완성 (코딩 몰라도!)
⏱️ 평균 43분
⭐ 4.8/5.0

> "진짜 코드 몰라도 되나요?"
> → 네! 562명이 처음이었어요

## 준비물
□ Cursor 설치됨 (무료 OK)
□ 45분 시간
□ 그게 다입니다!

## Phase 1: 프로젝트 생성 (5분)

### 1-1. Cursor에서 이거 복붙
```
Next.js 14 프로젝트 만들어줘.
이름은 my-todo-app으로.
```
[📋 복사]

### 1-2. 이렇게 됐나요?
✅ 체크포인트
□ 폴더가 생겼나요?
□ 터미널에 "success" 보이나요?

❌ 안 됐어요?
→ [에러 해결 프롬프트]

### 💡 방금 뭐 한 거예요?
Cursor가 AI로 프로젝트 폴더를 만들었어요.
"Next.js 14" = 웹사이트 만드는 도구
앞으로 이 폴더에서 작업합니다!

## Phase 2: 로그인 기능 (10분)
[같은 방식으로...]

## Phase 3: Todo 기능 (20분)
[프롬프트 복붙...]

## Phase 4: 배포하기 (10분)
[Vercel 배포 프롬프트...]

## 🎉 완성!
이제 진짜 웹사이트 주소가 생겼어요!
친구한테 보여줄 수 있어요
```

#### 🔧 Pillar 3: 코드 스니펫 (Code Snippets) - 복붙 즉시 작동

**목적:** "그냥 복사해서 붙여넣으면 돼요"

**특징:**

- 복붙 즉시 작동 (설정 최소화)
- "이게 뭐하는 코드에요?" 주석
- "여기만 바꾸세요" 표시
- AI한테 물어볼 커스터마이징 프롬프트 포함
- 10-50줄

**예시:**

```tsx
// 🔧 결제 버튼 (Stripe)
// 복사 → 붙여넣기 → 바로 작동!

'use client'
export function CheckoutButton() {
  // 이 함수가 결제 창을 띄워요
  const handleClick = async () => {
    // Stripe 결제 페이지로 이동
    const response = await fetch('/api/checkout')
    // ...
  }

  return (
    <button onClick={handleClick}>
      지금 결제하기
    </button>
  )
}

// 📝 커스터마이징 하려면?
// AI한테 이렇게 물어보세요:
// "버튼 색깔 파란색으로 바꿔줘"
// "가격을 $29로 바꾸려면?"
```

**각 스니펫마다 포함:**
- ✅ 복붙만 하면 작동
- 💡 이게 뭐하는 코드인지 (1줄)
- 🎨 커스터마이징 프롬프트 3개
- 🐛 자주 나는 에러 1개

### 4.2 핵심 UX 기능

#### Feature 1: Soft Onboarding (부드러운 온보딩)

**핵심 원칙:** 강제 없이 탐색 → 가치 경험 → 자발적 맞춤화

**흐름:**

```
1. 회원가입 완료
   ↓
2. 홈화면 (즉시 접근 가능)
   [상단 배너] "💡 맞춤 추천 받으시겠어요? [3분 설정] [나중에]"

   🔥 인기 튜토리얼 (코딩 몰라도 완성!)
   • 45분 Todo 앱 (892명 완성, 코딩 처음이어도 OK)
   • 30분 대기자 명단 (562명 완성, 이메일 수집)
   • 블로그 만들기 (234명 완성, 글 쓰기만 하면 됨)

   📚 코딩 몰라도 시작하기
   • "Cursor가 뭐예요?" - 5분 가이드
   • AI한테 프롬프트 쓰는 법
   • AI가 자주 틀리는 부분 TOP 10
   • "에러 메시지 읽는 법" (초보자용)
   • "localhost가 뭐예요?" - 용어 쉽게

   🔧 가장 많이 복사한 코드
   • 로그인 버튼 (복붙 즉시 작동)
   • DB 연결 코드 (5초 설정)
   • 결제 버튼 (Stripe)
   ↓
3-A. 바로 탐색 경로
   → 콘텐츠 조회
   → 행동 기반 암묵적 개인화
   → 전략적 온보딩 유도 (3개 조회 후)

3-B. "맞춤 추천 받기" 클릭
   → 프로젝트 선택 (웹/앱/백엔드)
   → 스택 선정 (SaaS Kit/E-commerce/커스텀)
   → 맞춤 대시보드
```

**전략적 온보딩 유도 시점:**
- 콘텐츠 3개 이상 조회 시
- 검색 3회 이상 시
- 첫 튜토리얼 완성 시

#### Feature 2: 자연어 검색

```
검색: "로그인 페이지 만들기"

결과:
🎯 튜토리얼 (2개)
  • 30분 만에 Clerk 로그인
  
📚 문서 (3개)
  • Clerk 설정 가이드
  
🔧 스니펫 (5개)
  • 로그인 폼 컴포넌트
```

#### Feature 3: 실시간 신뢰 지표

```
📊 이 문서는...
✅ 94% 성공 (562명이 완성)
⏱️ 평균 23분 소요
📅 2시간 전 검증
⭐ 4.8/5.0
```

#### Feature 4: 에러 진단기

```
┌─────────────────────────────┐
│ 🚨 에러 붙여넣기           │
│ [Error: Module not found]  │
│                             │
│ [진단하기]                  │
├─────────────────────────────┤
│ 🔍 진단 결과 (99%)          │
│ 원인: 패키지 미설치         │
│                             │
│ 해결 (1분):                 │
│ npm install [패키지]        │
│ [📋 복사]                   │
│                             │
│ 562명이 해결했어요!         │
└─────────────────────────────┘
```

#### Feature 5: 체크리스트 & 퀴즈

```
✅ 체크포인트
□ 파일이 생성되었나요?
□ 에러가 없나요?
□ 브라우저에서 확인했나요?

💡 이해도 퀴즈
Q: 왜 'use client'를 써야 할까요?
a) 보안 때문
b) useState 같은 훅 쓰려고 ✅
[정답 확인]
```

---

## 5. 사용자 여정 (User Journey)

### Journey 1: 첫 방문 → 프로젝트 완성 (Soft Onboarding)

```
Day 1 (50분):
  랜딩 → 회원가입 → 홈화면 (즉시 접근)

  [A경로: 바로 시작 - 70%]
  → 인기 튜토리얼 보고 바로 클릭
  → 🎯 "45분 Todo 앱" 시작
  → 완성! 성취감 ↑
  → 시스템: 행동 기반 Next.js 선호도 감지

  [B경로: 맞춤 설정 - 30%]
  → "맞춤 추천 받기" 클릭
  → 프로젝트 선택 (웹)
  → 스택 선정 (SaaS Kit)
  → 맞춤 대시보드 → 튜토리얼 시작

Day 2-3:
  콘텐츠 3개 이상 조회
  → [온보딩 안 한 경우]
     "Next.js에 관심 있으시네요! 맞춤 추천 받으시겠어요?"
  → 튜토리얼 2개 더 완성 (블로그, 대기자 명단)
  → 패턴 학습 → 자신감 상승

Day 4-7:
  내 아이디어 시작
  → 막힐 때 📚 문서 검색
  → 🔧 스니펫으로 빠르게
  → "혼자서도 되네!"
  → [첫 튜토리얼 완성 시]
     "🎉 완성! 다음 프로젝트 추천받으시겠어요?"

Week 2:
  프로젝트 80% 완성
  → "이제 결제 기능 추가하고 싶은데"
  → Paywall: Pro 전환 유도
  → 전환! ($12/월)
```

### Journey 2: 탐색형 사용자 (온보딩 스킵)

```
Day 1:
  회원가입 → 홈화면
  → "일단 둘러볼게요" (온보딩 배너 닫기)
  → 문서 5개 읽기 (Cursor, Next.js, Clerk...)
  → 시스템: 암묵적 개인화 시작

Day 3:
  검색 "로그인 구현"
  → [전략적 유도]
     "자주 검색하시네요! 맞춤 설정하면 더 빨라요"
  → 온보딩 완료 → 맞춤 콘텐츠 경험

Day 7:
  프로젝트 완성 → 높은 만족도
  → "처음엔 귀찮았는데, 맞춤 추천 진짜 편하네"
```

---

## 6. MVP 범위 (Release Scope)

### 6.1 Phase 1 (Week 1-10): MVP 출시

#### Must Have (P0)

**콘텐츠 (100% 바이브 코더 특화):**

```yaml
문서 (📚): 40개 - 전체가 바이브 코더용으로 재구성

  AI 도구 활용 (10개):
    • Cursor 프롬프트 작성법 (기초편)
    • Cursor 프롬프트 작성법 (고급편)
    • AI가 자주 틀리는 부분 TOP 10
    • Copilot vs Cursor: 언제 뭘 쓸까?
    • 프롬프트 디버깅 가이드
    • AI 코드 리뷰 체크리스트
    • "AI가 이해 못하는 상황" 대처법
    • Cursor Composer 완벽 활용법
    • AI에게 효과적으로 에러 설명하기
    • 코드 이해 없이 프로젝트 관리하기

  빠른 시작 (10개):
    • 5분 만에 Next.js 프로젝트 시작
    • Clerk 인증 복붙 가이드 (코드 이해 불필요)
    • Supabase DB 5분 설정 (프롬프트로만)
    • Vercel 배포 체크리스트
    • Stripe 결제 붙이기 (복붙용)
    • 환경변수 설정 (초보자용)
    • Git 기본 명령어 (AI 시대 버전)
    • "localhost가 뭐에요?" - 개발 용어 쉽게
    • 내 컴퓨터에서 웹사이트 띄우기
    • 에러 메시지 읽는 법 (비개발자용)

  에러 해결 (10개):
    • "Module not found" 해결법
    • "use client" 에러 (3분 해결)
    • Hydration 에러 (프롬프트로 해결)
    • 환경변수 안 먹을 때
    • "npm install 안 돼요" 해결
    • 페이지 안 뜰 때 체크리스트
    • "TypeError" 읽는 법
    • 빌드 에러 해결 가이드
    • DB 연결 안 될 때
    • 배포 후 안 될 때

  개발 용어 사전 (10개): - NEW!
    • API가 뭐예요? (초등학생 비유)
    • 웹훅이 뭐예요? (택배 알림 비유)
    • 데이터베이스가 뭐예요? (엑셀 비유)
    • 컴포넌트가 뭐예요? (레고 블록 비유)
    • 환경변수가 뭐예요? (비밀 메모 비유)
    • 빌드가 뭐예요? (요리 준비 비유)
    • 배포가 뭐예요? (가게 오픈 비유)
    • CORS가 뭐예요? (경비원 비유)
    • SSR vs CSR이 뭐예요? (주문 방식 비유)
    • npm이 뭐예요? (앱스토어 비유)

튜토리얼 (🎯): 5개 - 프롬프트 중심 + 이해 설명
  - 45분 Todo SaaS (프롬프트 복붙 → 이해)
  - 대기자 명단 (30분, 이메일 수집)
  - 블로그 만들기 (1.5시간, MDX)
  - Stripe 구독 SaaS (2시간)
  - 풀스택 앱 (3시간, 종합편)

스니펫 (🔧): 50개 - 복붙 즉시 작동 + "왜?" 주석
  - 인증 (10): 로그인, 회원가입, 보호 페이지...
  - DB (15): CRUD, 검색, 필터링, 페이지네이션...
  - 결제 (10): Stripe Checkout, 구독, 환불...
  - UI (15): 버튼, 폼, 카드, 모달, 토스트...

모든 콘텐츠 공통 특징:
  ✅ "코드 몰라도 OK" 전제
  ✅ 프롬프트 먼저, 설명은 나중에
  ✅ "왜 이렇게 했나요?" 섹션 필수
  ✅ "AI한테 이렇게 물어보세요" 포함
  ✅ 에러 TOP 3 + 해결 프롬프트
```

**기능:**

```yaml
✅ Soft Onboarding (선택적 맞춤화) - NEW!
  • 회원가입 후 즉시 홈화면 접근
  • 상단 배너로 온보딩 유도 (강제 아님)
  • 행동 기반 암묵적 개인화
  • 전략적 온보딩 유도 (3개 조회, 3회 검색 시)
✅ 프로젝트 타입 선택 (온보딩 내)
✅ 스택 선정 (3개 프리셋)
✅ 맞춤형 대시보드
✅ 일반 홈화면 (인기 콘텐츠 나열) - NEW!
✅ 바이브 코더 필수 문서 섹션 - NEW!
✅ 자연어 검색 (Algolia)
✅ 실시간 신뢰 지표
✅ 에러 진단기 (기본)
✅ 체크리스트 & 퀴즈
✅ 피드백 수집
✅ 회원 가입/로그인 (Clerk)
✅ 유료 결제 (Stripe)
```

#### Nice to Have (P1)

```yaml
□ AI 챗봇
□ 프로젝트 맵 생성
□ 코드 플레이그라운드
□ 커뮤니티 Q&A
□ IDE 통합 (Cursor)
```

### 6.2 개발 일정

```
Week 1-2: 기반 구축
  - Next.js 14 프로젝트 셋업
  - Supabase, Clerk, Stripe 통합
  - 디자인 시스템

Week 3-4: Soft Onboarding & 검색
  - 홈화면 (인기 콘텐츠 나열) - NEW!
  - 온보딩 배너 (dismissable) - NEW!
  - 프로젝트 선택 UI (온보딩 내)
  - 스택 선정 UI (온보딩 내)
  - 검색 (Algolia)

Week 5-7: 콘텐츠 시스템
  - MDX 렌더링
  - 문서/튜토리얼/스니펫 템플릿
  - 40개 문서 작성 (개발 용어 사전 10개 포함) - UPDATED!
  - 개발자 용어 사전 페이지 구현 - NEW!
  - 행동 기반 개인화 로직 - NEW!

Week 8: 피드백 & 신뢰
  - 실시간 통계
  - 에러 진단기
  - 피드백 시스템

Week 9: 베타 테스트
  - 100명 얼리 액세스
  - 버그 수정
  - 피드백 반영

Week 10: 공식 출시
  - Product Hunt 론칭
  - 커뮤니티 공지
```

---

## 7. 기술 스택 (Tech Stack)

```yaml
Frontend:
  - Next.js 14.2 (App Router)
  - TypeScript 5.3
  - Tailwind CSS 3.4
  - Shadcn/ui

Backend:
  - Next.js API Routes
  - Server Actions
  - Supabase (PostgreSQL)

Auth & Payment:
  - Clerk (인증)
  - Stripe (결제)

Infrastructure:
  - Vercel (호스팅)
  - Supabase (DB + Storage)
  - Algolia (검색)
  - PostHog (분석)
  - Sentry (에러 트래킹)
```

---

## 8. 성공 지표 (Success Metrics)

### 8.1 북극성 지표

```
주간 프로젝트 완성 수
(Weekly Project Completions)
```

### 8.2 핵심 지표 (Month 3 목표)

```yaml
획득 (Acquisition):
  - 신규 가입: 200/주
  - 가입 전환율: 15%+
  - 가입 후 이탈률: < 25% (Soft Onboarding 효과) - NEW!

활성화 (Activation):
  - 첫 콘텐츠 조회: 80%+ (즉시 접근 가능) - NEW!
  - 첫 튜토리얼 시작: 75%+ (기존 70% → 상향) - UPDATED!
  - 첫 프로젝트 완성: 40%
  - 온보딩 완료율: 45% (강제 아니므로 낮음) - NEW!

재방문 (Retention):
  - D7 Retention: 38%+ (기존 30% → 상향) - UPDATED!
  - DAU/MAU: 35%+ (기존 30% → 상향) - UPDATED!

수익 (Revenue):
  - MRR: $300+
  - 유료 전환율: 3%+
  - Churn: < 10%

추천 (Referral):
  - NPS: 50+
  - 소셜 공유: 100/월

온보딩 관련 (추가 트래킹): - NEW!
  - A경로 (바로 시작): 70%
  - B경로 (맞춤 설정): 30%
  - 전략적 유도 후 온보딩 완료율: 60%
  - 온보딩 완료자 D7 Retention: 50%+
  - 온보딩 미완료자 D7 Retention: 25%+
```

### 8.3 품질 지표

```yaml
문서 품질:
  - 평균 평점: 4.5+/5.0
  - 성공률: 90%+
  - 완료 시간: 예상의 120% 이내

사용자 만족:
  - NPS: 50+
  - "작동함" 비율: 90%+
  - 에러 해결 시간: < 30분
```

---

## 9. 리스크 & 대응 (Risks & Mitigation)

### Risk 1: 콘텐츠 품질 저하

**위험:** 오래된 문서, 잘못된 정보

**대응:**

```
✅ 에디터 수동 검토
✅ 자동 코드 테스트 (CI/CD)
✅ 3개월마다 검증
✅ 성공률 < 80% 시 알림
```

### Risk 2: 수익화 실패

**위험:** 유료 전환율 < 2%

**대응:**

```
✅ 무료로 성공 경험 제공
✅ 명확한 가치 구분 (배포, 결제 등)
✅ 첫 달 50% 할인
✅ Affiliate 수익으로 보완
```

### Risk 3: 경쟁자 출현

**위험:** 대형 플랫폼 (Stack Overflow, GitHub) 진입

**대응:**

```
✅ 빠른 실행 (10주 MVP)
✅ 커뮤니티 조기 구축
✅ "바이브 코딩" 포지셔닝 선점
✅ 품질로 차별화
```

---

## 10. 론칭 전략 (Launch Strategy)

### Phase 1: Soft Launch (Week 9)

```
타겟: 얼리 액세스 100명

채널:
  - 개인 네트워크
  - Cursor Discord
  - Reddit (r/cursor, r/webdev)
  
목표:
  - 피드백 수집
  - 버그 발견
  - 초기 콘텐츠 검증
```

### Phase 2: Product Hunt (Week 10)

```
준비:
  - 론칭 영상 (2분)
  - 스크린샷 (10장)
  - 첫 댓글 준비
  
목표:
  - Top 10 진입
  - 500명 가입
  - 언론 보도 1건
```

### Phase 3: Community (Week 11+)

```
채널:
  - Hacker News
  - Dev.to
  - YouTube (개발자 유튜버)
  - Twitter/X
  
목표:
  - MAU 1,000+
  - 입소문 (Organic)
```

---

## 11. 출시 체크리스트 (Launch Checklist)

### 기술

```
□ 40개 문서 작성 및 검증 (개발 용어 사전 10개 포함)
□ 5개 튜토리얼 테스트 완료
□ 50개 스니펫 작동 확인
□ 개발자 용어 사전 페이지 구현 및 검색 기능
□ Lighthouse 점수 > 90
□ 모바일 반응형 확인
□ 크로스 브라우저 테스트
□ Stripe 테스트 → Live 전환
□ 에러 트래킹 설정 (Sentry)
```

### 법률

```
□ 이용약관
□ 개인정보처리방침
□ 콘텐츠 가이드라인
□ 변호사 검토 ($1,000)
```

### 마케팅

```
□ Product Hunt 페이지
□ 론칭 영상 (2분)
□ 소셜 미디어 계정
□ 프레스 킷
□ 100명 얼리 액세스 확보
```

### 운영

```
□ 고객 지원 이메일
□ Discord 커뮤니티
□ FAQ 페이지 (10개)
□ 온보딩 가이드
□ 주간 리포트 자동화
```

---

## 12. 팀 & 역할 (Team & Roles)

```yaml
필수 인원 (MVP):
  - PM/Founder: 1명 (전체 총괄)
  - 풀스택 개발자: 1명 (제품 개발)
  - 콘텐츠 작성자: 1명 (문서 작성)
  
권장 인원:
  - 디자이너: 1명 (UI/UX)
  - 마케터: 1명 (론칭, 성장)
  
외주 가능:
  - 법률 검토: 변호사
  - 영상 제작: 프리랜서
```

---

## 13. 예산 (Budget)

### MVP 예산 (10주)

```yaml
개발 비용:
  - 인건비 (3명 × 10주): $30,000
  - 프리랜서 (디자인): $3,000

서비스 비용:
  - Vercel Pro: $20/월 × 3 = $60
  - Supabase Pro: $25/월 × 3 = $75
  - Algolia: $0 (무료 티어)
  - Clerk: $25/월 × 3 = $75
  - 도메인: $20

법률 & 행정:
  - 변호사 검토: $1,000
  - 법인 설립: $500

마케팅:
  - Product Hunt 프로모션: $500
  - 인플루언서: $1,000

총액: ~$36,230

런웨이: 3개월 (MRR $500 달성 목표)
```

---

## 14. Soft Onboarding 상세 전략 (NEW!)

### 14.1 왜 Soft Onboarding인가?

**기존 방식 (Forced Onboarding)의 문제:**
```
회원가입 → 즉시 온보딩 폼 → 완료 전까지 콘텐츠 접근 불가
↓
문제점:
❌ 심리적 압박 ("뭘 만들지 지금 결정해야 해?")
❌ 가치 경험 전 이탈 ("온보딩 귀찮아, 나가자")
❌ 완료율 낮음 (40-50%)
```

**Soft Onboarding의 장점:**
```
회원가입 → 즉시 콘텐츠 접근 → (선택) 맞춤화
↓
장점:
✅ 즉시 가치 제공 (인기 튜토리얼, 문서 탐색)
✅ 자연스러운 탐색 ("일단 둘러보고 판단")
✅ 높은 첫 콘텐츠 조회율 (80%+)
✅ 전략적 유도로 온보딩 완료 (60%+)
✅ 높은 D7 Retention (38%+)
```

### 14.2 구현 세부사항

#### 홈화면 구조
```yaml
상단 배너 (dismissable):
  텍스트: "💡 3분만 투자하면 맞춤 추천을 받을 수 있어요"
  CTA: [맞춤 추천 받기] [나중에]

인기 튜토리얼 섹션:
  정렬: 완성 수 (completion_count DESC)
  표시: 상위 5개
  각 카드: 제목, 완성자 수, 평균 시간, 평점

바이브 코더 필수 문서:
  큐레이션: 수동 선택 (5-8개)
  내용:
    - Cursor 프롬프트 작성법
    - AI가 자주 틀리는 부분 TOP 10
    - Next.js App Router 가이드
    - Clerk 인증 빠른 시작

가장 많이 복사한 스니펫:
  정렬: 복사 횟수 (copy_count DESC)
  표시: 상위 6개
```

#### 행동 기반 개인화 로직
```typescript
// 사용자 행동 추적
interface UserBehavior {
  viewedContents: ContentView[]
  searchQueries: SearchQuery[]
  copiedSnippets: string[]
}

// 암묵적 스택 추론
function inferUserStack(behavior: UserBehavior) {
  const frameworks = behavior.viewedContents
    .map(c => c.stack?.framework)
    .filter(Boolean)

  const mostViewed = getMostFrequent(frameworks)

  if (countOccurrences(mostViewed) >= 3) {
    updateUserPreferences({
      inferredStack: { framework: mostViewed }
    })
  }
}
```

#### 전략적 온보딩 유도
```typescript
// 트리거 조건
const shouldPromptOnboarding = (user: User) => {
  if (user.onboardingCompleted) return false

  return (
    user.contentViewCount >= 3 ||
    user.searchCount >= 3 ||
    user.completedTutorialCount >= 1
  )
}

// 유도 메시지
const onboardingPrompts = {
  contentViews: "Next.js에 관심 있으시네요! 맞춤 추천 받으시면 더 빠르게 찾으실 수 있어요",
  searches: "자주 검색하시는 것 같아요. 맞춤 설정하면 딱 맞는 콘텐츠만 볼 수 있어요",
  completion: "🎉 완성 축하드려요! 다음 프로젝트 추천받으시겠어요?"
}
```

### 14.3 A/B 테스트 계획

**Phase 1 (Week 9-10): 출시 시**
- 100% Soft Onboarding
- 데이터 수집 (2주)

**Phase 2 (Week 11-12): A/B 테스트**
```yaml
Group A (50%): Soft Onboarding
  - 회원가입 → 홈화면
  - 선택적 온보딩

Group B (50%): Forced Onboarding
  - 회원가입 → 온보딩
  - 완료 필수

측정 지표:
  - 가입 후 이탈률
  - 첫 콘텐츠 조회율
  - 온보딩 완료율
  - 첫 튜토리얼 완성율
  - D7 Retention
```

**기대 결과:**
```
               Soft    Forced
가입 후 이탈    25%     40%
첫 콘텐츠 조회   80%     60%
온보딩 완료     45%     60%
튜토리얼 완성   35%     24%
D7 Retention   38%     30%
```

### 14.4 데이터베이스 스키마 추가

```sql
-- users 테이블에 추가 필드
ALTER TABLE users ADD COLUMN onboarding_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN onboarding_dismissed_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN inferred_stack JSONB;
ALTER TABLE users ADD COLUMN content_view_count INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN search_count INTEGER DEFAULT 0;

-- 행동 추적 테이블
CREATE TABLE user_behaviors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  behavior_type VARCHAR(50), -- 'content_view', 'search', 'snippet_copy'
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 온보딩 유도 로그
CREATE TABLE onboarding_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  trigger_type VARCHAR(50), -- 'content_views', 'searches', 'completion'
  shown_at TIMESTAMPTZ DEFAULT NOW(),
  clicked BOOLEAN DEFAULT FALSE,
  dismissed BOOLEAN DEFAULT FALSE
);
```

---

## 부록 (Appendix)

### A. 경쟁 분석

|플랫폼|강점|약점|우리 차별점|
|---|---|---|---|
|Stack Overflow|방대한 DB|파편화, 버전 불명|통합 경험, 바이브 코딩 초점|
|Udemy|강의 형식|완강률 낮음|직접 만들기, 빠른 완성|
|공식 문서|정확성|이론 중심|실전 80%, 프롬프트 제공|
|Cursor Docs|Cursor 최적화|범용성 부족|멀티 AI 도구, 통합 가이드|

### B. 용어 정의

```yaml
바이브 코딩 (Vibe Coding):
  AI 도구에 크게 의존하여 코드를 작성하는 개발 방식

주객전도 (Alienation):
  자신의 프로젝트를 이해하지 못하게 되는 현상

프롬프트 중심 (Prompt-First):
  코드 대신 AI에게 줄 프롬프트를 제공하는 접근

할루시네이션 (Hallucination):
  AI가 존재하지 않는 API, 함수를 생성하는 현상
```

---

## 승인 (Approval)

|역할|이름|날짜|서명|
|---|---|---|---|
|CEO|[ ]|____|____|
|CTO|[ ]|____|____|
|Head of Product|[ ]|____|____|

---

**문서 버전:** 2.3 - 개발자 용어 사전 추가
**최종 수정:** 2024-12-04
**다음 검토:** 2025-02-04

**주요 변경사항 (v2.3):**
- 📖 개발자 용어 사전 10개 추가 (API, 웹훅, 데이터베이스 등)
- 📚 문서 개수: 30개 → 40개로 확장
- 🎯 초등학생도 이해할 수 있는 비유 중심 설명
- 🔍 용어 사전 전용 페이지 및 검색 기능 구현 계획
- ✨ 콘텐츠 내 용어 자동 링크 및 툴팁 기능 추가

**주요 변경사항 (v2.2):**
- 🎯 타겟 명확화: 비개발자 바이브 코더 80% 집중
- 📚 전체 콘텐츠 100% 비개발자 특화로 전환
  - AI 도구 활용 (10개)
  - 빠른 시작 (10개)
  - 에러 해결 (10개)
- 💬 톤 변경: "개발자" → "코딩 몰라도 OK"
- 📝 문서 구조: 프롬프트 80% + 이해 20%
- 🎨 제품 카테고리: "No-Code 2.0 / Vibe Coding Platform"
- ✅ 모든 예시에 "AI한테 물어볼 질문" 추가

**v2.1 대비 핵심 변화:**
- 개발자 콘텐츠 → 비개발자 콘텐츠
- 이론 중심 → 프롬프트 중심
- "배우기" → "바로 만들기"

**연락처:** product@vibestack.dev

---

> [!success] 다음 단계
>
> 1. 이해관계자 검토 (3일)
> 2. PRD v2.3 승인 (1일)
> 3. 비개발자 친화 콘텐츠 작성 가이드 작성
> 4. 개발자 용어 사전 2개 샘플 작성 (API, 웹훅)
> 5. 첫 문서 3개 샘플 작성 (검증용)
> 6. 홈화면 UI 디자인 (비개발자 UX 중심)
> 7. 용어 사전 페이지 UI 디자인
> 8. 개발 시작 (Week 1)
> 9. 10주 후 론칭! 🚀
