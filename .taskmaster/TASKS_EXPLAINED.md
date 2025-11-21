# 🎯 VibeStack 프로젝트 작업 내역 상세 설명

## 📋 전체 개요

이 문서는 VibeStack 프로젝트에서 수행한 모든 작업을 단계별로 상세히 설명합니다.
각 작업(Task)은 여러 하위 작업(Subtask)으로 구성되어 있으며, 순차적으로 진행됩니다.

**프로젝트 목표**: AI 시대 개발자를 위한 실전 학습 플랫폼 구축
**기술 스택**: Next.js 14, TypeScript, Tailwind CSS, Supabase, Clerk, Stripe

---

## ✅ Task 1: Next.js 프로젝트 설정 (완료)

**목적**: 프로젝트의 기반이 되는 Next.js 환경을 구축하고 필수 라이브러리 설치

### 📁 생성된 주요 파일
```
package.json          # 프로젝트 의존성 관리
tsconfig.json         # TypeScript 설정
tailwind.config.ts    # Tailwind CSS 설정
next.config.js        # Next.js 설정
app/layout.tsx        # 루트 레이아웃
app/page.tsx          # 홈 페이지
```

### 🔨 Subtask 1.1: Next.js 프로젝트 초기화 (완료)
```bash
# 실행한 명령어
npx create-next-app@14.2 vibestack --typescript --tailwind --app
```
**설명**:
- Next.js 14.2 버전으로 새 프로젝트 생성
- TypeScript와 Tailwind CSS를 기본으로 포함
- App Router 방식 사용 (Pages Router가 아님)

**결과물**:
- 기본 폴더 구조 생성 (app/, public/, etc.)
- package.json에 next, react, react-dom 설치

---

### 🔨 Subtask 1.2: TypeScript 설정 (완료)
```json
// tsconfig.json - 주요 설정
{
  "compilerOptions": {
    "target": "ES2017",           // 최신 JavaScript 기능 사용
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,              // .js 파일도 허용
    "skipLibCheck": true,         // 타입 체크 속도 향상
    "strict": true,               // 엄격한 타입 체크
    "noEmit": true,               // 컴파일 결과물 생성 안 함 (Next.js가 처리)
    "esModuleInterop": true,      // CommonJS/ES 모듈 호환
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",            // JSX를 그대로 유지 (Next.js가 변환)
    "incremental": true,          // 증분 컴파일로 속도 향상
    "paths": {
      "@/*": ["./*"]              // @/ 경로로 루트 디렉토리 참조 가능
    }
  }
}
```
**설명**: TypeScript로 타입 안정성을 확보하여 런타임 에러 감소

---

### 🔨 Subtask 1.3: Tailwind CSS 통합 (완료)
```javascript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 커스텀 컬러 추가 가능
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
        },
      },
    },
  },
  plugins: [],
};
```
**설명**:
- Utility-first CSS 프레임워크
- 클래스명으로 스타일링 (예: `className="bg-blue-500 text-white p-4"`)
- 빠른 UI 개발 가능

---

### 🔨 Subtask 1.4: Shadcn/ui 설치 (완료)
```bash
# 실행한 명령어
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card
```

```typescript
// components/ui/button.tsx - 예시
import * as React from "react"
import { cn } from "@/lib/utils"

// 재사용 가능한 Button 컴포넌트
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md",
          // variant에 따라 다른 스타일 적용
          variant === "default" && "bg-primary text-white",
          variant === "destructive" && "bg-red-500 text-white",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
```
**설명**:
- 고품질 UI 컴포넌트 라이브러리
- Tailwind CSS 기반으로 커스터마이징 가능
- 접근성(a11y) 내장

---

### 🔨 Subtask 1.5: Vercel 배포 (완료)
```bash
# 배포 과정
1. GitHub 리포지토리 생성 및 코드 푸시
2. Vercel 계정 연결
3. 자동 배포 설정 (main 브랜치 푸시 시 자동 배포)
```
**설명**:
- Vercel은 Next.js 제작사의 호스팅 플랫폼
- 자동 CI/CD 파이프라인 제공
- HTTPS, CDN 자동 설정

**결과**: https://vibestack.vercel.app (예시 URL)

---

## ✅ Task 2: Clerk 인증 시스템 통합 (완료)

**목적**: 사용자 회원가입, 로그인, 로그아웃 기능 구현

### 📁 생성된 주요 파일
```
middleware.ts                               # 인증 미들웨어
app/(auth)/sign-in/[[...sign-in]]/page.tsx # 로그인 페이지
app/(auth)/sign-up/[[...sign-up]]/page.tsx # 회원가입 페이지
components/providers/clerk-provider.tsx     # Clerk Provider
```

---

### 🔨 Subtask 2.1: Clerk 계정 및 API 키 설정 (완료)
```bash
# .env.local 파일
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```
**설명**:
- Clerk 대시보드에서 API 키 발급
- 환경 변수로 안전하게 키 관리
- `.env.local`은 Git에 커밋하지 않음 (.gitignore에 포함)

---

### 🔨 Subtask 2.2: 회원가입 기능 구현 (완료)
```typescript
// app/(auth)/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      {/* Clerk가 제공하는 회원가입 UI */}
      <SignUp
        appearance={{
          elements: {
            // 커스텀 스타일 적용 가능
            formButtonPrimary: "bg-primary-500 hover:bg-primary-600",
          }
        }}
      />
    </div>
  );
}
```
**설명**:
- Clerk가 제공하는 UI 컴포넌트 사용
- 이메일 인증, 소셜 로그인 자동 지원
- 폼 검증 자동 처리

**사용자 흐름**:
1. 사용자가 /sign-up 접속
2. 이메일 입력 및 비밀번호 설정
3. 이메일 인증 링크 클릭
4. 자동으로 /onboarding으로 리다이렉트

---

### 🔨 Subtask 2.3: 로그인/로그아웃 구현 (완료)
```typescript
// app/(auth)/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn />
    </div>
  );
}
```

```typescript
// 로그아웃 버튼 예시
import { UserButton } from "@clerk/nextjs";

export function Header() {
  return (
    <header>
      {/* 자동으로 로그인 상태 표시 및 로그아웃 버튼 제공 */}
      <UserButton afterSignOutUrl="/" />
    </header>
  );
}
```
**설명**:
- `<SignIn />`: 로그인 UI 자동 생성
- `<UserButton />`: 프로필 아이콘 + 로그아웃 버튼
- 세션 관리 자동 처리

---

### 🔨 Subtask 2.4: 세션 보안 설정 (완료)
```typescript
// middleware.ts
import { authMiddleware } from "@clerk/nextjs";

// 보호할 라우트 설정
export default authMiddleware({
  publicRoutes: [
    "/",              // 랜딩 페이지 (공개)
    "/pricing",       // 가격 페이지 (공개)
    "/sign-in(.*)",   // 로그인 페이지 (공개)
    "/sign-up(.*)",   // 회원가입 페이지 (공개)
  ],
  // 나머지 모든 경로는 인증 필요
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
```
**설명**:
- 인증되지 않은 사용자가 /dashboard 접근 시 자동 리다이렉트
- 세션 토큰 자동 검증
- CSRF 공격 방어

---

### 🔨 Subtask 2.5: 인증 UI 컴포넌트 통합 (완료)
```typescript
// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="ko">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
```
**설명**:
- 전체 앱을 ClerkProvider로 감싸기
- 모든 페이지에서 인증 상태 접근 가능
- SSR(Server-Side Rendering) 지원

---

## ✅ Task 3: Stripe 결제 시스템 구현 (완료)

**목적**: 단품 구매 및 구독 결제 기능 구현

### 📁 생성된 주요 파일
```
lib/stripe.ts                      # Stripe 클라이언트 설정
app/api/stripe/checkout/route.ts  # 결제 세션 생성 API
app/api/stripe/webhook/route.ts   # Webhook 처리
components/checkout/pricing-card.tsx # 가격 카드 UI
```

---

### 🔨 Subtask 3.1: Stripe 계정 및 API 키 설정 (완료)
```bash
# .env.local에 추가
STRIPE_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

```typescript
// lib/stripe.ts
import Stripe from 'stripe';

// Stripe 클라이언트 초기화
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
});
```
**설명**:
- Stripe 대시보드에서 API 키 발급
- 테스트 모드와 프로덕션 모드 구분
- Webhook Secret으로 요청 검증

---

### 🔨 Subtask 3.2: 결제 게이트웨이 통합 (완료)
```typescript
// app/api/stripe/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { currentUser } from '@clerk/nextjs';

export async function POST(req: NextRequest) {
  try {
    // 1. 현재 로그인한 사용자 확인
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. 요청 본문 파싱
    const { priceId, mode } = await req.json();

    // 3. Stripe Checkout Session 생성
    const session = await stripe.checkout.sessions.create({
      mode: mode || 'payment', // 'payment' (단품) 또는 'subscription' (구독)
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,  // Stripe 대시보드에서 생성한 가격 ID
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/checkout/canceled`,
      customer_email: user.emailAddresses[0].emailAddress,
      metadata: {
        userId: user.id,  // 나중에 Webhook에서 사용
      },
    });

    // 4. 세션 URL 반환
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: 'Payment failed' }, { status: 500 });
  }
}
```

```typescript
// 클라이언트에서 결제 시작
async function handleCheckout(priceId: string) {
  const response = await fetch('/api/stripe/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceId, mode: 'subscription' }),
  });

  const { url } = await response.json();
  window.location.href = url; // Stripe 결제 페이지로 이동
}
```
**설명**:
- **Checkout Session**: Stripe가 제공하는 결제 UI
- **mode**: 'payment' (일회성) vs 'subscription' (정기 결제)
- **metadata**: 나중에 Webhook에서 사용자 식별에 사용

---

### 🔨 Subtask 3.3: 구독 관리 구현 (완료)
```typescript
// Stripe 대시보드에서 상품 및 가격 생성
Products:
  - Pro Plan (월간): $12/month → price_xxxxx
  - Pro Plan (연간): $99/year  → price_yyyyy
  - Team Plan: $39/month       → price_zzzzz
```

```typescript
// 구독 생성 예시
const session = await stripe.checkout.sessions.create({
  mode: 'subscription',
  line_items: [
    {
      price: 'price_xxxxx', // Pro Plan 월간
      quantity: 1,
    },
  ],
  // ... 기타 설정
});
```
**설명**:
- Stripe가 자동으로 구독 갱신 처리
- 결제 실패 시 자동 재시도
- 구독 취소 가능

---

### 🔨 Subtask 3.4: 보안 거래 처리 (완료)
```typescript
// app/api/stripe/webhook/route.ts
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  // 1. Webhook 시그니처 검증
  const body = await req.text();
  const signature = headers().get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    // Stripe가 보낸 요청인지 검증 (보안 중요!)
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new Response('Webhook signature verification failed', { status: 400 });
  }

  // 2. 이벤트 타입별 처리
  switch (event.type) {
    case 'checkout.session.completed':
      // 결제 성공
      const session = event.data.object as Stripe.Checkout.Session;
      await handlePaymentSuccess(session);
      break;

    case 'customer.subscription.updated':
      // 구독 업데이트
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionUpdate(subscription);
      break;

    case 'customer.subscription.deleted':
      // 구독 취소
      await handleSubscriptionCancel(event.data.object);
      break;
  }

  return new Response(JSON.stringify({ received: true }));
}

// 결제 성공 처리
async function handlePaymentSuccess(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;

  // Supabase에 구매 정보 저장
  // await supabase.from('purchases').insert({
  //   user_id: userId,
  //   stripe_session_id: session.id,
  //   amount: session.amount_total,
  //   status: 'completed',
  // });
}
```
**설명**:
- **Webhook**: Stripe가 이벤트 발생 시 자동으로 서버에 알림
- **시그니처 검증**: 위조 요청 방지 (매우 중요!)
- **이벤트 처리**: 결제 성공/실패/구독 변경 등 처리

**Webhook 설정**:
1. Stripe 대시보드 → Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/stripe/webhook`
3. 이벤트 선택: checkout.session.completed, subscription 관련 등

---

### 🔨 Subtask 3.5: 결제/구독 UI 개발 (완료)
```typescript
// components/checkout/pricing-card.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface PricingCardProps {
  title: string;
  price: string;
  priceId: string;
  features: string[];
}

export function PricingCard({ title, price, priceId, features }: PricingCardProps) {
  const handleSubscribe = async () => {
    // 결제 시작
    const response = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priceId,
        mode: 'subscription'
      }),
    });

    const { url } = await response.json();
    window.location.href = url;
  };

  return (
    <Card className="p-6">
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="text-3xl font-bold mt-4">{price}/월</p>

      <ul className="mt-6 space-y-2">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center">
            <span className="mr-2">✅</span>
            {feature}
          </li>
        ))}
      </ul>

      <Button
        onClick={handleSubscribe}
        className="w-full mt-6"
      >
        구독하기
      </Button>
    </Card>
  );
}
```

```typescript
// 사용 예시
<PricingCard
  title="Pro Plan"
  price="$12"
  priceId="price_xxxxx"
  features={[
    "모든 문서 무제한",
    "모든 튜토리얼 무제한",
    "AI 챗봇 월 100회",
    "우선 지원",
  ]}
/>
```
**설명**:
- 사용자 친화적인 가격 카드 UI
- 클릭 한 번으로 결제 시작
- 로딩 상태 및 에러 처리

---

## ⏳ Task 4: 프로젝트 선택 및 온보딩 UI (진행 중)

**목적**: 신규 사용자의 첫 경험을 안내하는 온보딩 플로우

### 📁 생성된 주요 파일
```
app/(onboarding)/welcome/page.tsx          # 환영 페이지
app/(onboarding)/stack/page.tsx            # 스택 선택 페이지
components/onboarding/project-selection.tsx # 프로젝트 타입 선택
components/onboarding/onboarding-stepper.tsx # 진행 단계 표시
```

---

### 🔨 Subtask 4.1-4.5: UI 디자인 및 구현 (완료)
```typescript
// app/(onboarding)/welcome/page.tsx
export default function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">
        VibeStack에 오신 것을 환영합니다! 🎉
      </h1>

      <p className="text-xl text-gray-600 mb-12">
        어떤 프로젝트를 만들고 싶으신가요?
      </p>

      {/* 프로젝트 타입 선택 */}
      <div className="grid grid-cols-3 gap-6">
        <ProjectTypeCard
          icon="🌐"
          title="웹 애플리케이션"
          description="SaaS, 블로그, E-commerce"
          href="/onboarding/stack?type=web"
        />
        <ProjectTypeCard
          icon="📱"
          title="모바일 앱"
          description="React Native, PWA"
          href="/onboarding/stack?type=mobile"
        />
        <ProjectTypeCard
          icon="⚙️"
          title="백엔드 API"
          description="REST, GraphQL"
          href="/onboarding/stack?type=backend"
        />
      </div>
    </div>
  );
}
```

```typescript
// app/(onboarding)/stack/page.tsx
export default function StackSelectionPage() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">
        기술 스택을 선택하세요
      </h1>

      {/* 프리셋 선택 */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <StackPreset
          name="💎 SaaS Kit"
          stack={["Next.js 14", "Clerk", "Supabase", "Stripe"]}
          onClick={() => handleSelectStack('saas')}
        />
        <StackPreset
          name="⚡ E-commerce"
          stack={["Next.js 14", "Shopify", "Stripe"]}
          onClick={() => handleSelectStack('ecommerce')}
        />
      </div>

      {/* 또는 커스텀 선택 */}
      <Button variant="outline">
        🛠️ 직접 선택하기
      </Button>
    </div>
  );
}
```
**설명**:
- **프로젝트 타입 선택**: 사용자의 목표 파악
- **스택 선택**: 맞춤형 콘텐츠 제공을 위한 정보 수집
- **진행 단계 표시**: 사용자가 현재 위치 파악

**사용자 흐름**:
1. 회원가입 완료 → /onboarding/welcome
2. 프로젝트 타입 선택 (웹/앱/백엔드)
3. 기술 스택 선택 (프리셋 또는 커스텀)
4. 완료 → /dashboard (맞춤형 대시보드)

---

## ⏳ Task 5-10: 향후 구현 예정

### Task 5: Algolia 자연어 검색 (대기 중)
- 문서, 튜토리얼, 스니펫 통합 검색
- "Stripe 결제 만들기" → 관련 콘텐츠 자동 검색

### Task 6: 콘텐츠 관리 시스템 (대기 중)
- MDX 렌더링으로 인터랙티브 문서 작성
- 코드 블록 하이라이팅 (Shiki)
- 체크포인트 & 퀴즈 시스템

### Task 7: 실시간 성공 지표 (대기 중)
- PostHog: 사용자 행동 분석
- Sentry: 에러 추적 및 모니터링
- "✅ 94% 성공률 (562명 완성)" 표시

### Task 8: 피드백 & 퀴즈 시스템 (대기 중)
- 튜토리얼 완료 후 피드백 수집
- 이해도 확인 퀴즈

### Task 9: 인프라 & 배포 (대기 중)
- Supabase 데이터베이스 구성
- 환경 변수 관리
- 스테이징 환경 구축

### Task 10: 베타 테스트 (대기 중)
- 100명 얼리 액세스
- 피드백 수집 및 버그 수정

---

## 📊 현재 진행 상황

### ✅ 완료된 작업 (3/10)
1. ✅ Next.js 프로젝트 설정
2. ✅ Clerk 인증 시스템
3. ✅ Stripe 결제 시스템

### 🚧 진행 중 (1/10)
4. 🚧 온보딩 UI (5/5 서브태스크 완료, 테스트 대기)

### ⏳ 대기 중 (6/10)
5. ⏳ Algolia 검색
6. ⏳ 콘텐츠 CMS
7. ⏳ 성공 지표
8. ⏳ 피드백 시스템
9. ⏳ 인프라
10. ⏳ 베타 테스트

---

## 🏗️ 프로젝트 아키텍처 요약

```
VibeStack/
├── app/                        # Next.js App Router
│   ├── (marketing)/           # 마케팅 페이지 (공개)
│   ├── (auth)/                # 인증 페이지 (Clerk)
│   ├── (onboarding)/          # 온보딩 플로우
│   ├── (dashboard)/           # 메인 대시보드 (인증 필요)
│   ├── (tools)/               # 도구 (에러 진단, AI 챗봇)
│   ├── (checkout)/            # 결제 페이지
│   ├── api/                   # API Routes
│   │   ├── stripe/            # Stripe Webhook 등
│   │   └── auth/              # Clerk Webhook
│   └── actions/               # Server Actions
│
├── components/                 # React 컴포넌트
│   ├── ui/                    # Shadcn/ui 기본 컴포넌트
│   ├── layout/                # Header, Footer, Sidebar
│   ├── content/               # 콘텐츠 관련 컴포넌트
│   └── checkout/              # 결제 관련 컴포넌트
│
├── lib/                        # 유틸리티 & 설정
│   ├── stripe.ts              # Stripe 클라이언트
│   ├── supabase.ts            # Supabase 클라이언트
│   └── utils.ts               # 헬퍼 함수
│
└── types/                      # TypeScript 타입 정의
    ├── database.ts            # DB 타입
    ├── content.ts             # 콘텐츠 타입
    └── user.ts                # 사용자 타입
```

---

## 🔑 핵심 기술 및 라이브러리

### 프론트엔드
- **Next.js 14.2**: React 프레임워크 (App Router)
- **TypeScript**: 타입 안정성
- **Tailwind CSS**: 유틸리티 CSS 프레임워크
- **Shadcn/ui**: 고품질 UI 컴포넌트

### 백엔드 & 인증
- **Clerk**: 사용자 인증 (회원가입, 로그인)
- **Supabase**: PostgreSQL 데이터베이스
- **Stripe**: 결제 및 구독 관리

### 배포 & 인프라
- **Vercel**: 호스팅 플랫폼
- **GitHub**: 버전 관리 및 CI/CD

---

## 📝 다음 단계

### 우선순위 높음
1. ✅ 폴더 구조 완성 (완료!)
2. 🎯 Supabase 데이터베이스 스키마 구현
3. 🎯 콘텐츠 CRUD 기능 (문서, 튜토리얼, 스니펫)
4. 🎯 MDX 렌더링 시스템

### 우선순위 중간
5. 🔍 Algolia 검색 통합
6. 📊 실시간 성공률 표시
7. 🛠️ 에러 진단 도구

### 우선순위 낮음
8. 💬 피드백 & 퀴즈 시스템
9. 🧪 베타 테스트 준비
10. 🚀 공식 론칭

---

## 💡 참고 사항

### 개발 환경 실행
```bash
npm run dev     # 개발 서버 시작 (http://localhost:3000)
npm run build   # 프로덕션 빌드
npm run start   # 프로덕션 서버 시작
```

### 환경 변수 (.env.local)
```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Supabase (향후 추가)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
```

### 중요 링크
- **Clerk Dashboard**: https://dashboard.clerk.com
- **Stripe Dashboard**: https://dashboard.stripe.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://app.supabase.com

---

## 🎓 배운 교훈 & 베스트 프랙티스

1. **환경 변수 관리**: `.env.local`은 절대 Git에 커밋하지 않기
2. **API 키 보안**: 클라이언트에서는 `NEXT_PUBLIC_*` 키만 사용
3. **Webhook 검증**: Stripe Webhook은 반드시 시그니처 검증
4. **타입 안정성**: TypeScript로 런타임 에러 사전 방지
5. **컴포넌트 재사용**: Shadcn/ui로 일관된 UI 유지
6. **인증 미들웨어**: Clerk로 라우트별 접근 제어 간단히 구현

---

생성일: 2025-11-21
마지막 업데이트: 2025-11-21
