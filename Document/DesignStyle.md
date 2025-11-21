

---

## 🎨 VibeStack Design System

### 핵심 디자인 철학

```yaml
Modern: 2024 트렌드 반영
Clean: 불필요한 요소 제거
Accessible: WCAG 2.1 AA 준수
Fast: 성능 우선
Developer-friendly: 개발자가 편안하게 느끼는 UI
```

---

## 🎨 컬러 시스템

### Primary Colors (브랜드 컬러)

```css
/* Vibrant Blue - 신뢰감 + 기술감 */
--primary-50: #eff6ff;   /* 매우 연한 배경 */
--primary-100: #dbeafe;  /* 연한 배경 */
--primary-200: #bfdbfe;  /* 호버 배경 */
--primary-300: #93c5fd;  /* 비활성 */
--primary-400: #60a5fa;  /* 링크 */
--primary-500: #3b82f6;  /* 메인 버튼 ⭐ */
--primary-600: #2563eb;  /* 버튼 호버 */
--primary-700: #1d4ed8;  /* 버튼 Active */
--primary-800: #1e40af;
--primary-900: #1e3a8a;

/* 사용 예시 */
.btn-primary {
  background: var(--primary-500);
  hover: var(--primary-600);
  active: var(--primary-700);
}
```

### Secondary Colors (보조 컬러)

```css
/* Purple Accent - 프리미엄, 특별함 */
--secondary-50: #faf5ff;
--secondary-100: #f3e8ff;
--secondary-200: #e9d5ff;
--secondary-300: #d8b4fe;
--secondary-400: #c084fc;
--secondary-500: #a855f7;  /* Pro 배지 ⭐ */
--secondary-600: #9333ea;
--secondary-700: #7e22ce;
--secondary-800: #6b21a8;
--secondary-900: #581c87;

/* 사용 예시 */
.badge-pro {
  background: linear-gradient(135deg, var(--secondary-500), var(--primary-500));
}
```

### Semantic Colors (상태 컬러)

```css
/* Success - 성공, 완료 */
--success-50: #f0fdf4;
--success-500: #10b981;  /* ✅ 체크, 성공 */
--success-600: #059669;

/* Warning - 주의, 권장 */
--warning-50: #fffbeb;
--warning-500: #f59e0b;  /* ⚠️ 경고 */
--warning-600: #d97706;

/* Error - 에러, 실패 */
--error-50: #fef2f2;
--error-500: #ef4444;    /* ❌ 에러 */
--error-600: #dc2626;

/* Info - 정보, 팁 */
--info-50: #eff6ff;
--info-500: #3b82f6;     /* 💡 정보 */
--info-600: #2563eb;
```

### Neutral Colors (회색조)

```css
/* Light Mode */
--gray-50: #f9fafb;      /* 배경 */
--gray-100: #f3f4f6;     /* 카드 배경 */
--gray-200: #e5e7eb;     /* Border */
--gray-300: #d1d5db;     /* 비활성 텍스트 */
--gray-400: #9ca3af;
--gray-500: #6b7280;     /* 보조 텍스트 */
--gray-600: #4b5563;
--gray-700: #374151;     /* 본문 텍스트 */
--gray-800: #1f2937;     /* 제목 */
--gray-900: #111827;     /* 강조 제목 */

/* Dark Mode */
--dark-bg: #0a0a0a;      /* 배경 */
--dark-surface: #1a1a1a; /* 카드 */
--dark-border: #2a2a2a;  /* Border */
--dark-text: #e5e5e5;    /* 텍스트 */
```

---

## 🔤 타이포그래피

### 폰트 패밀리

```css
/* Primary Font - 본문 */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             sans-serif;

/* Code Font - 코드, 프롬프트 */
--font-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', 
             'Consolas', monospace;

/* Display Font - 큰 제목 (옵션) */
--font-display: 'Cal Sans', 'Inter', sans-serif;
```

**왜 Inter?**

- 가독성 최고 (특히 작은 크기)
- 숫자 구분 명확
- 무료 오픈소스
- Variable Font 지원

**왜 JetBrains Mono?**

- 코드용 최적화
- Ligature 지원 (→, =>, !=)
- 무료

### 폰트 크기

```css
/* Fluid Typography (반응형) */
--text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);    /* 12-14px */
--text-sm: clamp(0.875rem, 0.85rem + 0.25vw, 1rem);      /* 14-16px */
--text-base: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);    /* 16-18px */
--text-lg: clamp(1.125rem, 1.05rem + 0.375vw, 1.25rem);  /* 18-20px */
--text-xl: clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem);      /* 20-24px */
--text-2xl: clamp(1.5rem, 1.35rem + 0.75vw, 1.875rem);   /* 24-30px */
--text-3xl: clamp(1.875rem, 1.65rem + 1.125vw, 2.25rem); /* 30-36px */
--text-4xl: clamp(2.25rem, 1.95rem + 1.5vw, 3rem);       /* 36-48px */
--text-5xl: clamp(3rem, 2.55rem + 2.25vw, 3.75rem);      /* 48-60px */

/* 사용 예시 */
h1 { font-size: var(--text-4xl); }
h2 { font-size: var(--text-3xl); }
h3 { font-size: var(--text-2xl); }
body { font-size: var(--text-base); }
small { font-size: var(--text-sm); }
```

### 폰트 웨이트

```css
--font-light: 300;
--font-normal: 400;    /* 본문 */
--font-medium: 500;    /* 강조 */
--font-semibold: 600;  /* 버튼, 제목 */
--font-bold: 700;      /* 큰 제목 */
```

### 줄 간격

```css
--leading-tight: 1.25;   /* 제목 */
--leading-normal: 1.5;   /* 본문 */
--leading-relaxed: 1.75; /* 긴 글 */
```

---

## 📏 스페이싱 시스템

```css
/* 8px 기반 시스템 */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px ⭐ 기본 */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */

/* 컴포넌트 간격 */
--gap-xs: var(--space-2);   /* 8px */
--gap-sm: var(--space-3);   /* 12px */
--gap-md: var(--space-4);   /* 16px */
--gap-lg: var(--space-6);   /* 24px */
--gap-xl: var(--space-8);   /* 32px */
```

---

## 🎭 컴포넌트 스타일

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: var(--primary-500);
  color: white;
  padding: 0.75rem 1.5rem; /* 12px 24px */
  border-radius: 0.5rem; /* 8px */
  font-weight: 600;
  font-size: var(--text-base);
  
  transition: all 0.2s ease;
  
  /* 호버 효과 */
  &:hover {
    background: var(--primary-600);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  /* 비활성 */
  &:disabled {
    background: var(--gray-300);
    cursor: not-allowed;
    transform: none;
  }
}

/* Secondary Button */
.btn-secondary {
  background: white;
  color: var(--gray-700);
  border: 1px solid var(--gray-300);
  
  &:hover {
    background: var(--gray-50);
    border-color: var(--gray-400);
  }
}

/* Ghost Button */
.btn-ghost {
  background: transparent;
  color: var(--gray-700);
  
  &:hover {
    background: var(--gray-100);
  }
}

/* Icon Button */
.btn-icon {
  padding: 0.5rem;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
}
```

### Cards

```css
.card {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: 0.75rem; /* 12px - 부드러운 느낌 */
  padding: 1.5rem; /* 24px */
  
  /* 은은한 그림자 */
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.05),
    0 1px 2px rgba(0, 0, 0, 0.1);
  
  transition: all 0.2s ease;
  
  /* 호버 시 약간 떠오르는 효과 */
  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 4px 12px rgba(0, 0, 0, 0.08),
      0 2px 4px rgba(0, 0, 0, 0.06);
    border-color: var(--gray-300);
  }
}

/* 프리미엄 카드 */
.card-premium {
  position: relative;
  border: 2px solid transparent;
  background: 
    linear-gradient(white, white) padding-box,
    linear-gradient(135deg, var(--secondary-500), var(--primary-500)) border-box;
  
  &::before {
    content: '✨ PRO';
    position: absolute;
    top: -12px;
    right: 16px;
    background: linear-gradient(135deg, var(--secondary-500), var(--primary-500));
    color: white;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
  }
}
```

### Inputs

```css
.input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--gray-300);
  border-radius: 0.5rem;
  font-size: var(--text-base);
  font-family: var(--font-sans);
  
  transition: all 0.2s ease;
  
  /* 포커스 */
  &:focus {
    outline: none;
    border-color: var(--primary-500);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  /* 에러 */
  &.error {
    border-color: var(--error-500);
    &:focus {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
  }
  
  /* 플레이스홀더 */
  &::placeholder {
    color: var(--gray-400);
  }
}

/* 검색 바 */
.search-input {
  padding-left: 3rem; /* 아이콘 공간 */
  background-image: url('data:image/svg+xml,...'); /* 돋보기 아이콘 */
  background-position: 1rem center;
  background-repeat: no-repeat;
}
```

### Badges

```css
/* 기본 배지 */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px; /* 완전 둥글게 */
  font-size: var(--text-xs);
  font-weight: 600;
  
  /* 초급 */
  &.beginner {
    background: var(--success-50);
    color: var(--success-700);
  }
  
  /* 중급 */
  &.intermediate {
    background: var(--warning-50);
    color: var(--warning-700);
  }
  
  /* 고급 */
  &.advanced {
    background: var(--error-50);
    color: var(--error-700);
  }
  
  /* Pro */
  &.pro {
    background: linear-gradient(135deg, var(--secondary-500), var(--primary-500));
    color: white;
  }
}
```

### Code Blocks

```css
/* 인라인 코드 */
code {
  font-family: var(--font-mono);
  font-size: 0.875em;
  background: var(--gray-100);
  color: var(--error-600);
  padding: 0.2em 0.4em;
  border-radius: 0.25rem;
}

/* 코드 블록 */
pre {
  background: var(--gray-900);
  color: var(--gray-50);
  padding: 1.5rem;
  border-radius: 0.75rem;
  overflow-x: auto;
  
  /* 복사 버튼 공간 */
  position: relative;
  
  code {
    background: transparent;
    color: inherit;
    padding: 0;
    font-size: 0.875rem;
    line-height: 1.7;
  }
}

/* 복사 버튼 */
.copy-button {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.375rem;
  color: white;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
}

/* Syntax Highlighting (Shiki 테마) */
.shiki {
  /* One Dark Pro 테마 추천 */
  --shiki-color-text: #abb2bf;
  --shiki-token-keyword: #c678dd;
  --shiki-token-string: #98c379;
  --shiki-token-function: #61afef;
  --shiki-token-comment: #5c6370;
}
```

---

## 🎪 레이아웃 시스템

### Container

```css
.container {
  width: 100%;
  max-width: 1280px; /* 최대 너비 */
  margin: 0 auto;
  padding: 0 1.5rem; /* 모바일 여백 */
  
  /* 태블릿 */
  @media (min-width: 768px) {
    padding: 0 2rem;
  }
  
  /* 데스크톱 */
  @media (min-width: 1024px) {
    padding: 0 3rem;
  }
}

/* Narrow Container (문서, 블로그) */
.container-narrow {
  max-width: 768px;
}

/* Wide Container (대시보드) */
.container-wide {
  max-width: 1536px;
}
```

### Grid

```css
/* 2-Column Layout */
.grid-2 {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 3-Column Layout */
.grid-3 {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Sidebar Layout */
.sidebar-layout {
  display: grid;
  gap: 2rem;
  
  @media (min-width: 1024px) {
    grid-template-columns: 250px 1fr; /* 사이드바 고정 너비 */
  }
  
  @media (min-width: 1280px) {
    grid-template-columns: 280px 1fr 280px; /* 양쪽 사이드바 */
  }
}
```

---

## 🌊 애니메이션 & 트랜지션

### 기본 트랜지션

```css
/* 부드러운 기본 */
--transition-fast: 150ms ease;
--transition-base: 200ms ease;
--transition-slow: 300ms ease;

/* Easing Functions */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Micro Interactions

```css
/* 버튼 클릭 피드백 */
@keyframes button-press {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(0.95); }
}

.btn:active {
  animation: button-press 0.2s ease;
}

/* 체크박스 체크 */
@keyframes check-bounce {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.checkbox:checked::after {
  animation: check-bounce 0.3s var(--ease-bounce);
}

/* 알림 등장 */
@keyframes slide-in-right {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.toast {
  animation: slide-in-right 0.3s var(--ease-out);
}

/* 스켈레톤 로딩 */
@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--gray-200) 25%,
    var(--gray-100) 50%,
    var(--gray-200) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
}
```

### Page Transitions

```css
/* Framer Motion 설정 */
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

const pageTransition = {
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1]
}
```

---

## 🎨 실제 컴포넌트 예시

### 1. 콘텐츠 카드

```tsx
<div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-gray-300 hover:shadow-lg">
  {/* Pro 배지 */}
  {isPremium && (
    <div className="absolute -right-8 -top-8 h-16 w-16 rotate-45 bg-gradient-to-br from-purple-500 to-blue-500">
      <span className="absolute bottom-2 left-0 right-0 text-center text-xs font-bold text-white">
        PRO
      </span>
    </div>
  )}
  
  {/* 아이콘 */}
  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
    🎯
  </div>
  
  {/* 제목 */}
  <h3 className="mb-2 text-xl font-semibold text-gray-900">
    구독 SaaS 만들기
  </h3>
  
  {/* 설명 */}
  <p className="mb-4 text-gray-600">
    Stripe 구독 결제를 처음부터 끝까지 구현합니다
  </p>
  
  {/* 메타 정보 */}
  <div className="flex items-center gap-4 text-sm text-gray-500">
    <div className="flex items-center gap-1">
      ⭐ 4.8 <span className="text-gray-400">(892)</span>
    </div>
    <div className="flex items-center gap-1">
      ⏱️ 2시간
    </div>
    <div className="flex items-center gap-1">
      ✅ 92%
    </div>
  </div>
  
  {/* 호버 시 나타나는 버튼 */}
  <div className="mt-4 opacity-0 transition-opacity group-hover:opacity-100">
    <button className="w-full rounded-lg bg-primary-500 py-2 text-white font-semibold hover:bg-primary-600">
      시작하기 →
    </button>
  </div>
</div>
```

### 2. 검색 바

```tsx
<div className="relative w-full max-w-2xl">
  {/* 검색 아이콘 */}
  <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
    <svg width="20" height="20" fill="currentColor">
      <path d="M9 2a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm5.7-1.3a1 1 0 0 1 1.4 1.4l2.8 2.8a1 1 0 0 1-1.4 1.4l-2.8-2.8z"/>
    </svg>
  </div>
  
  {/* 입력 필드 */}
  <input
    type="text"
    placeholder="Stripe 결제 만들기, Next.js 배포..."
    className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-12 pr-4 text-gray-900 placeholder-gray-400 shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10"
  />
  
  {/* 단축키 힌트 */}
  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-gray-400">
    <kbd className="rounded border border-gray-300 px-2 py-1">⌘</kbd>
    <kbd className="rounded border border-gray-300 px-2 py-1">K</kbd>
  </div>
</div>
```

### 3. 프로그레스 바

```tsx
<div className="space-y-2">
  {/* 라벨 */}
  <div className="flex items-center justify-between text-sm">
    <span className="font-medium text-gray-700">
      Phase 3: Webhook 설정
    </span>
    <span className="text-gray-500">
      3/5 완료
    </span>
  </div>
  
  {/* 프로그레스 바 */}
  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
    <div 
      className="h-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-500"
      style={{ width: '60%' }}
    />
  </div>
</div>
```

### 4. 체크리스트

```tsx
<div className="space-y-3">
  {['환경 설정', '패키지 설치', 'Stripe 초기화'].map((item, i) => (
    <label 
      key={i}
      className="flex items-start gap-3 cursor-pointer group"
    >
      {/* 체크박스 */}
      <input
        type="checkbox"
        className="mt-1 h-5 w-5 rounded border-gray-300 text-primary-500 transition focus:ring-2 focus:ring-primary-500/20"
      />
      
      {/* 텍스트 */}
      <div className="flex-1">
        <div className="font-medium text-gray-900 group-hover:text-primary-600 transition">
          {item}
        </div>
        <div className="text-sm text-gray-500">
          약 5분 소요
        </div>
      </div>
    </label>
  ))}
</div>
```

### 5. 실시간 통계

```tsx
<div className="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6">
  <h3 className="mb-4 text-sm font-semibold text-gray-500 uppercase tracking-wide">
    📊 실시간 통계
  </h3>
  
  <div className="space-y-4">
    {/* 성공률 */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success-50 text-success-600">
          ✅
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">94%</div>
          <div className="text-sm text-gray-500">성공률</div>
        </div>
      </div>
    </div>
    
    {/* 사용자 수 */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary-600">
          👥
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">562명</div>
          <div className="text-sm text-gray-500">완성</div>
        </div>
      </div>
    </div>
    
    {/* 평균 시간 */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning-50 text-warning-600">
          ⏱️
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">23분</div>
          <div className="text-sm text-gray-500">평균 소요</div>
        </div>
      </div>
    </div>
  </div>
  
  {/* 최종 검증 */}
  <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
    📅 최종 검증: 2시간 전
  </div>
</div>
```

---

## 📱 반응형 브레이크포인트

```css
/* Tailwind 기본 */
--screen-sm: 640px;   /* 모바일 가로 */
--screen-md: 768px;   /* 태블릿 */
--screen-lg: 1024px;  /* 데스크톱 */
--screen-xl: 1280px;  /* 큰 데스크톱 */
--screen-2xl: 1536px; /* 초대형 */

/* 사용 예시 */
@media (min-width: 768px) {
  .sidebar {
    display: block;
  }
}
```

---

## 🌓 다크 모드

```css
/* 자동 감지 */
@media (prefers-color-scheme: dark) {
  :root {
    --bg: var(--dark-bg);
    --surface: var(--dark-surface);
    --text: var(--dark-text);
  }
}

/* 수동 토글 */
[data-theme="dark"] {
  --bg: var(--dark-bg);
  --surface: var(--dark-surface);
  --text: var(--dark-text);
}

/* 컴포넌트 */
.card {
  background: var(--surface);
  color: var(--text);
}
```

---

## 🎯 접근성 (A11y)

```css
/* 포커스 인디케이터 */
:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}

/* 스킵 링크 */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--primary-500);
  color: white;
  padding: 8px;
  
  &:focus {
    top: 0;
  }
}

/* 스크린 리더 전용 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* 고대비 모드 */
@media (prefers-contrast: high) {
  :root {
    --primary-500: #0066cc;
    --gray-700: #000000;
  }
}

/* 애니메이션 끄기 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 🎨 디자인 토큰 (Design Tokens)

### Tailwind Config

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          // ...
        },
        secondary: {
          500: '#a855f7',
          // ...
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
        'medium': '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.06)',
      }
    }
  }
}
```

---

## 🎯 참고 영감 사이트

```yaml
컬러 & 톤:
  - Linear (https://linear.app) - 모던, 미니멀
  - Vercel (https://vercel.com) - 깔끔, 기술적
  - Stripe (https://stripe.com) - 프로페셔널

레이아웃:
  - Notion (https://notion.so) - 정돈된 콘텐츠
  - GitHub (https://github.com) - 개발자 친화적
  - Tailwind UI (https://tailwindui.com) - 컴포넌트

인터랙션:
  - Framer (https://framer.com) - 부드러운 애니메이션
  - Apple (https://apple.com) - 섬세한 디테일
```

---

