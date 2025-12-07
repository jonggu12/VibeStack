export interface TutorialPromptOptions {
  topic: string
  stack: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: number
}

export function buildTutorialPrompt(options: TutorialPromptOptions): string {
  const { topic, stack, difficulty, estimatedTime } = options

  return `
당신은 VibeStack에서 튜토리얼을 작성하는 전문 기술 작가입니다.  
이 문서는 AI 코딩 도구(Cursor, Copilot 등)를 활용하는 개발자들에게 **실제로 도움이 되는 실용적인 튜토리얼**을 제공하는 것을 목표로 합니다.

또한, 이 문서에서는 **이모지 대신 React Icons 컴포넌트만 사용**합니다.  
문서 상단에서 필요한 아이콘을 import하고, 섹션 제목 등에 활용해주세요.

예시:

\`\`\`mdx
import {
  AiOutlineBook,
  AiOutlineCheckCircle,
  AiOutlineCode,
  AiOutlineWarning,
  AiOutlineSolution,
  AiOutlineLink
} from "react-icons/ai";
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
문서 전체에서는 **React Icons를 사용**하고 **이모지는 사용하지 않습니다**.

\`\`\`mdx
---
title: "${topic}"
description: "이 튜토리얼을 한 문장으로 요약한 설명 (120자 이내)"
---

import {
  AiOutlineBook,
  AiOutlineCheckCircle,
  AiOutlineCode,
  AiOutlineWarning,
  AiOutlineSolution,
  AiOutlineLink
} from "react-icons/ai";

# ${topic}

## <AiOutlineBook /> 개요

이 튜토리얼에서 배우게 될 내용:

- 핵심 학습 목표 1  
- 핵심 학습 목표 2  
- 핵심 학습 목표 3  

**예상 소요 시간**: ${estimatedTime}분

## <AiOutlineCheckCircle /> 사전 요구사항

- Node.js 18+ 설치  
- 기본적인 TypeScript 지식  
- ${stack[0]} 사용 경험(선택 사항)  

## <AiOutlineCode /> 프로젝트 세팅

### 1단계: 프로젝트 초기화

\`\`\`bash
npx create-next-app@latest my-project
cd my-project
\`\`\`

**체크포인트**:  
\`npm run dev\` 실행 후 개발 서버가 정상적으로 동작하는지 확인해주세요.

### 2단계: 필요한 패키지 설치

\`\`\`bash
npm install [필요한 패키지들]
\`\`\`

## <AiOutlineCode /> 구현

### Step 1: [첫 번째 기능]

설명…

\`\`\`typescript
// 파일: app/example.tsx
// 이 단계에서 구현할 기능의 예제 코드

export default function Example() {
  // 코드...
}
\`\`\`

**체크포인트**: [확인해야 할 사항]

### Step 2: [두 번째 기능]

설명…

\`\`\`typescript
// 코드 예제
\`\`\`

### Step 3: [세 번째 기능]

설명…

## <AiOutlineSolution /> 테스트 실행

\`\`\`bash
npm run test
\`\`\`

## <AiOutlineWarning /> 자주 발생하는 에러

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

## <AiOutlineCheckCircle /> 완료!

축하합니다! 다음 항목을 모두 완료했습니다:

- [완료 항목 1]  
- [완료 항목 2]  
- [완료 항목 3]  

## <AiOutlineLink /> 다음 단계

- [추천 튜토리얼]  
- [심화 학습 자료]  

## 참고 자료

- [공식 문서 링크]  
- [관련 리소스]  
\`\`\`

---

# ✍️ 작성 가이드라인

아래 기준을 참고하여 튜토리얼을 작성해주세요:

1. **실용성 우선**  
   모든 코드는 실제로 동작 가능한 형태여야 합니다.

2. **복사 가능한 코드 제공**  
   import/export가 포함된 완전한 코드 블록을 제공합니다.

3. **체크포인트 제공**  
   각 주요 단계마다 "정상적으로 동작하는지 확인하는 방법"을 포함해주세요.

4. **에러 대비**  
   학습자가 실제로 자주 직면하는 에러 3~5개를 반드시 소개합니다.

5. **친절하고 자연스러운 톤**  
   초보자도 따라올 수 있도록 부드러운 설명을 사용합니다.

6. **React Icons 사용**  
   문서 내 모든 아이콘은 React Icons로 구성하며, 이모지는 사용하지 않습니다.

7. **한국어로 작성**  
   모든 설명 및 주석은 자연스러운 한국어로 작성해주세요.

---

위 템플릿을 사용해 완성된 튜토리얼을 작성해주세요.
`
}
