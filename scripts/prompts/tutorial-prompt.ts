export interface TutorialPromptOptions {
  topic: string
  stack: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: number
}

export function buildTutorialPrompt(options: TutorialPromptOptions): string {
  const { topic, stack, difficulty, estimatedTime } = options

  return `
당신은 VibeStack에서 **튜토리얼을 작성하는 전문 기술 문서 작가**입니다.  
이 문서는 AI 코딩 도구(Cursor, Copilot 등)를 활용하는 개발자들에게 **실제로 도움이 되는 실용적인 학습 경험**을 제공해야 합니다.

이 문서에서는 **React Icons를 사용하지 않습니다.**
대신 **MDX 커스텀 컴포넌트를 적극 활용**하여 섹션 구조를 표현해주세요.

**사용 가능한 주요 컴포넌트:**
- \`Callout\`, \`Tip\`, \`Warning\`, \`Info\`, \`Highlight\` - 정보 박스
- \`Tabs\`, \`Tab\` - 코드/설명 전환
- \`StackBadge\` - 기술 스택 표시
- \`Do\`, \`Dont\` - 베스트 프랙티스 강조
- \`Terminal\` - 터미널 출력
- \`PromptBlock\` - AI 프롬프트 복사
- \`Steps\`, \`Step\` - 단계별 가이드

예시:

\`\`\`mdx
<StackBadge stack={["Next.js 14", "Supabase"]} />

<Callout type="info">
이 튜토리얼은 실제 프로젝트 기반으로 진행됩니다.
</Callout>

<PromptBlock title="Cursor에게 요청하기">
프로젝트 초기 설정을 자동으로 완료해줘
</PromptBlock>
\`\`\`

---

# 튜토리얼 정보

- **주제**: ${topic}  
- **기술 스택**: ${stack.join(', ')}  
- **난이도**: ${difficulty}  
- **예상 소요 시간**: ${estimatedTime}분  

---

# 출력 형식 안내

아래 **MDX 템플릿 구조를 그대로 사용**해 튜토리얼을 작성해주세요.  
문서 전체에서는 **React Icons를 사용하지 않고**, MDX 컴포넌트를 활용해 정보 구조를 구분합니다.

\`\`\`mdx
---
title: "${topic}"
description: "이 튜토리얼을 한 문장으로 요약한 설명 (120자 이내)"
---

# ${topic}

<StackBadge stack={${JSON.stringify(stack)}} />

## 개요

<Info>
이 튜토리얼에서 배우게 될 내용:
</Info>

- 핵심 학습 목표 1  
- 핵심 학습 목표 2  
- 핵심 학습 목표 3  

**예상 소요 시간**: ${estimatedTime}분

## 사전 요구사항

<Callout type="success">
다음 준비 사항을 갖추면 학습이 더 수월해집니다.
</Callout>

- Node.js 18+ 설치  
- 기본적인 TypeScript 지식  
- ${stack[0]} 사용 경험(선택 사항)

## 프로젝트 세팅

### 1단계: 프로젝트 초기화

\`\`\`bash
npx create-next-app@latest my-project
cd my-project
\`\`\`

<Highlight>
체크포인트: \`npm run dev\` 실행 후 정상적으로 개발 서버가 동작하는지 확인하세요.
</Highlight>

### 2단계: 필요한 패키지 설치

\`\`\`bash
npm install [필요한 패키지들]
\`\`\`

## 구현

### Step 1: [첫 번째 기능]

설명…

\`\`\`typescript
// 파일: app/example.tsx
// 이 단계에서 구현할 기능의 예제 코드

export default function Example() {
  // 코드...
}
\`\`\`

<Callout type="info">
체크포인트: [확인해야 할 사항]
</Callout>

### Step 2: [두 번째 기능]

설명…

\`\`\`typescript
// 코드 예제
\`\`\`

### Step 3: [세 번째 기능]

설명…

\`\`\`typescript
// 필요 시 코드 추가
\`\`\`

## 테스트 실행

\`\`\`bash
npm run test
\`\`\`

## 자주 발생하는 에러

<Warning>
아래 에러들은 학습자가 실제로 자주 겪는 문제들입니다. 해결 방법을 함께 제시해주세요.
</Warning>

### 에러 1: [에러 메시지]

**원인**: 설명  
**해결 방법**:

\`\`\`bash
# 해결 명령어
\`\`\`

### 에러 2: [에러 메시지]

**원인**: 설명  
**해결 방법**: 설명  

### 에러 3: [에러 메시지]

**원인**: 설명  
**해결 방법**: 설명  

## 완료!

<Callout type="success">
축하합니다! 아래 항목을 모두 완료했습니다:
</Callout>

- [완료 항목 1]  
- [완료 항목 2]  
- [완료 항목 3]  

## 다음 단계

<Highlight>
더 깊이 배우고 싶다면 아래 문서를 확인해보세요.
</Highlight>

- [추천 튜토리얼]  
- [심화 학습 자료]  

## 참고 자료

- [공식 문서 링크]  
- [관련 리소스]  
\`\`\`

---

# ✍️ 작성 가이드라인

튜토리얼 작성 시 아래 기준을 참고해주세요:

1. **실용성 우선**  
   - 모든 코드는 실제로 복사해 실행 가능한 형태여야 합니다.

2. **정확하고 완전한 코드 제공**  
   - import/export까지 포함된 형태로 제공하세요.

3. **체크포인트 포함**  
   - 각 단계마다 “정상 작동 여부를 확인하는 방법”을 넣어주세요.

4. **에러 상황 안내**  
   - 학습자가 실제로 마주칠 수 있는 에러 3~5개를 포함합니다.

5. **부드러운 설명**  
   - 초보자도 따라올 수 있도록 자연스럽고 이해하기 쉬운 문장으로 작성합니다.

6. **React Icons 금지**  
   - 대신 Info, Callout, Warning, Tip, Highlight 등 MDX 컴포넌트를 적극 사용합니다.

7. **한국어로 작성**  
   - 설명은 자연스럽고 쉽게 이해할 수 있는 한국어로 작성해주세요.

---

위 템플릿을 기반으로 완성된 튜토리얼을 작성해주세요.
`
}
