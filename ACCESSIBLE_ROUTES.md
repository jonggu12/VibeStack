# 🗺️ VibeStack - 접근 가능한 페이지 URL 목록

## 생성일: 2025-11-21

---

## 🏠 랜딩 페이지 (공개)

### 메인
- **/** - 홈 페이지 (랜딩)
  - 파일: `app/page.tsx`
  - 로그인/회원가입 버튼 포함

---

## 🎨 마케팅 페이지 (공개)

### 정보 페이지
- **/about** - 소개 페이지
  - 파일: `app/(marketing)/about/page.tsx`

- **/pricing** - 가격 정책
  - 파일: `app/(marketing)/pricing/page.tsx`
  - Pro Plan: $12/월
  - Team Plan: $39/월

### 블로그
- **/blog** - 블로그 목록
  - 파일: `app/(marketing)/blog/page.tsx`

- **/blog/[slug]** - 블로그 글 상세
  - 파일: `app/(marketing)/blog/[slug]/page.tsx`
  - 예: `/blog/getting-started`

---

## 🔐 인증 페이지 (공개)

### Clerk 인증
- **/sign-in** - 로그인
  - 파일: `app/(auth)/sign-in/[[...sign-in]]/page.tsx`
  - Clerk UI 사용

- **/sign-up** - 회원가입
  - 파일: `app/(auth)/sign-up/[[...sign-up]]/page.tsx`
  - 이메일/소셜 로그인 지원

---

## 👋 온보딩 (로그인 필요)

### 첫 설정
- **/onboarding** - 프로젝트 선택 및 온보딩
  - 파일: `app/(onboarding)/page.tsx`
  - 3단계 프로세스:
    1. 프로젝트 타입 선택 (웹/앱/백엔드)
    2. 설정 구성
    3. 검토 및 생성
  - 완료 후 `/dashboard`로 이동

**참고**: `/welcome`, `/stack` 라우트는 제거되었습니다.

---

## 📊 대시보드 (로그인 필요)

### 메인
- **/dashboard** - 대시보드 홈
  - 파일: `app/(dashboard)/page.tsx`
  - 환영 메시지, 추천 콘텐츠, 최근 활동

### 문서 (Docs)
- **/docs** - 문서 목록
  - 파일: `app/(dashboard)/docs/page.tsx`
  - 필터: 무료/프리미엄, 난이도

- **/docs/[slug]** - 문서 상세
  - 파일: `app/(dashboard)/docs/[slug]/page.tsx`
  - 예: `/docs/nextjs-app-router`
  - MDX 렌더링, 코드 블록, 체크리스트

### 튜토리얼 (Tutorials)
- **/tutorials** - 튜토리얼 목록
  - 파일: `app/(dashboard)/tutorials/page.tsx`

- **/tutorials/[slug]** - 튜토리얼 상세
  - 파일: `app/(dashboard)/tutorials/[slug]/page.tsx`
  - 예: `/tutorials/stripe-subscription`
  - Phase별 진행, 체크포인트, 진행률 추적

### 스니펫 (Code Snippets)
- **/snippets** - 스니펫 목록
  - 파일: `app/(dashboard)/snippets/page.tsx`

- **/snippets/[slug]** - 스니펫 상세
  - 파일: `app/(dashboard)/snippets/[slug]/page.tsx`
  - 예: `/snippets/auth-middleware`
  - 복사 버튼, 사용법

### 번들 (Bundles)
- **/bundles** - 번들 목록
  - 파일: `app/(dashboard)/bundles/page.tsx`

- **/bundles/[slug]** - 번들 상세
  - 파일: `app/(dashboard)/bundles/[slug]/page.tsx`
  - 예: `/bundles/payment-master-pack`

### 검색
- **/search** - 검색 결과
  - 파일: `app/(dashboard)/search/page.tsx`
  - Algolia 자연어 검색 (예정)

### 프로젝트
- **/projects** - 내 프로젝트 목록
  - 파일: `app/(dashboard)/projects/page.tsx`

- **/projects/new** - 새 프로젝트 생성
  - 파일: `app/(dashboard)/projects/new/page.tsx`

- **/projects/[id]** - 프로젝트 상세
  - 파일: `app/(dashboard)/projects/[id]/page.tsx`
  - 예: `/projects/123`

### 라이브러리
- **/library** - 내 라이브러리 (구매/완료한 콘텐츠)
  - 파일: `app/(dashboard)/library/page.tsx`

### 진행률
- **/progress** - 학습 진행률
  - 파일: `app/(dashboard)/progress/page.tsx`
  - 완료한 튜토리얼, 통계

### 설정
- **/settings** - 계정 설정
  - 파일: `app/(dashboard)/settings/page.tsx`
  - 프로필, 이메일, 비밀번호

- **/settings/subscription** - 구독 관리
  - 파일: `app/(dashboard)/settings/subscription/page.tsx`
  - 현재 플랜, 사용 통계, 플랜 변경

- **/settings/billing** - 결제 내역
  - 파일: `app/(dashboard)/settings/billing/page.tsx`
  - 영수증, 결제 수단 관리

- **/settings/team** - 팀 관리 (Team Plan만)
  - 파일: `app/(dashboard)/settings/team/page.tsx`
  - 팀원 초대, 권한 관리

---

## 🛠️ 도구 (Tools)

### Pro 전용 도구
- **/error-clinic** - 에러 진단기
  - 파일: `app/(tools)/error-clinic/page.tsx`
  - AI 기반 에러 해결

- **/project-map** - 프로젝트 맵 생성 (Pro)
  - 파일: `app/(tools)/project-map/page.tsx`
  - 프로젝트 구조 시각화

- **/ai-chat** - AI 챗봇 (Pro)
  - 파일: `app/(tools)/ai-chat/page.tsx`
  - 월 100회 제한

---

## 💳 결제 (Checkout)

### 단품 구매
- **/buy/[contentId]** - 콘텐츠 구매
  - 파일: `app/(checkout)/buy/[contentId]/page.tsx`
  - 예: `/buy/doc_stripe_guide`
  - 가격: $3-29

### 구독
- **/subscribe** - Pro 구독
  - 파일: `app/(checkout)/subscribe/page.tsx`
  - Pro: $12/월 또는 $99/년
  - Team: $39/월

### 결제 결과
- **/checkout/success** - 결제 성공
  - 파일: `app/(checkout)/success/page.tsx`
  - 구매 정보, 시작하기 버튼

- **/checkout/canceled** - 결제 취소
  - 파일: `app/(checkout)/canceled/page.tsx`
  - 다시 시도 버튼

---

## 🚨 특수 페이지

### 에러 페이지
- **404** - 페이지 없음
  - 파일: `app/not-found.tsx`

- **500** - 서버 에러
  - 파일: `app/error.tsx`

---

## 🔒 접근 제어

### 공개 페이지 (인증 불필요)
```
/
/about
/pricing
/blog
/blog/[slug]
/sign-in
/sign-up
```

### 보호된 페이지 (로그인 필요)
```
/onboarding
/dashboard
/dashboard/** (모든 하위 경로)
/docs
/tutorials
/snippets
/bundles
/search
/projects
/library
/progress
/settings
/error-clinic
/project-map
/ai-chat
/buy/**
/subscribe
```

**미들웨어 설정**: `middleware.ts`
- Clerk가 자동으로 인증 확인
- 미인증 시 `/sign-in`으로 리다이렉트

---

## 📋 테스트 체크리스트

### ✅ 현재 동작 확인 가능한 페이지

#### 공개 페이지
- [ ] `/` - 홈 (로그인 버튼 확인)
- [ ] `/pricing` - 가격표
- [ ] `/about` - 소개
- [ ] `/sign-in` - 로그인 (Clerk UI)
- [ ] `/sign-up` - 회원가입 (Clerk UI)

#### 인증 필요 페이지 (로그인 후)
- [ ] `/onboarding` - 온보딩 플로우
- [ ] `/dashboard` - 대시보드 홈
- [ ] `/docs` - 문서 목록
- [ ] `/tutorials` - 튜토리얼 목록
- [ ] `/snippets` - 스니펫 목록
- [ ] `/projects` - 프로젝트 목록
- [ ] `/settings` - 설정 페이지

### ⏳ 아직 구현되지 않은 기능
- [ ] 실제 콘텐츠 데이터 (현재 빈 페이지)
- [ ] 검색 기능 (Algolia)
- [ ] 결제 플로우 (Stripe 연동 필요)
- [ ] AI 도구 (에러 진단, 챗봇)

---

## 🚀 개발 서버 실행

```bash
# 개발 서버 시작
npm run dev

# 브라우저에서 접속
http://localhost:3000

# 빌드 확인 (에러 체크)
npm run build
```

---

## 💡 라우트 구조 설명

### 라우트 그룹 `(폴더명)`
- URL에 포함되지 않음
- 논리적 그룹화만 수행

**예시**:
```
app/(marketing)/pricing/page.tsx  → /pricing
app/(dashboard)/docs/page.tsx     → /docs
app/(auth)/sign-in/page.tsx       → /sign-in
```

**NOT**:
```
❌ /marketing/pricing
❌ /dashboard/docs
❌ /auth/sign-in
```

---

## 🎯 다음 단계

1. **현재 확인 가능한 것**:
   - `/` - 홈 페이지
   - `/onboarding` - 온보딩 (로그인 필요)
   - `/dashboard` - 대시보드 (로그인 필요)

2. **개발 서버 재시작**:
   ```bash
   npm run dev
   ```

3. **테스트 순서**:
   1. `/` 접속 → Sign In 버튼 클릭
   2. 로그인 완료 → `/onboarding`으로 이동
   3. 온보딩 완료 → `/dashboard`로 이동
   4. `/docs`, `/tutorials` 등 탐색

---

생성일: 2025-11-21
마지막 업데이트: 2025-11-21
