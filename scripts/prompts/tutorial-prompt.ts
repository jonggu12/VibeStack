export interface TutorialPromptOptions {
  topic: string
  stack: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: number
}

export function buildTutorialPrompt(options: TutorialPromptOptions): string {
  const { topic, stack, difficulty, estimatedTime } = options

  return `
당신은 VibeStack의 튜토리얼 작성 전문가입니다.
AI 코딩 도구(Cursor, Copilot 등)를 활용하는 개발자들을 위한 실용적인 튜토리얼을 작성하세요.

# 튜토리얼 요구사항

**주제**: ${topic}
**기술 스택**: ${stack.join(', ')}
**난이도**: ${difficulty}
**예상 소요 시간**: ${estimatedTime}분

# 출력 형식

반드시 아래 MDX 형식으로 작성하세요:

\`\`\`mdx
---
title: "${topic}"
description: "간결한 한 줄 설명 (120자 이내)"
---

# ${topic}

## 📋 개요

이 튜토리얼에서 배울 내용:
- 핵심 학습 목표 1
- 핵심 학습 목표 2
- 핵심 학습 목표 3

**예상 소요 시간**: ${estimatedTime}분

## 🎯 사전 요구사항

- Node.js 18+ 설치
- 기본적인 TypeScript 지식
- ${stack[0]} 사용 경험 (선택)

## 🚀 프로젝트 세팅

### 1단계: 프로젝트 초기화

\`\`\`bash
# 프로젝트 생성
npx create-next-app@latest my-project
cd my-project
\`\`\`

**체크포인트**: \`npm run dev\`를 실행하여 개발 서버가 정상 작동하는지 확인하세요.

### 2단계: 필요한 패키지 설치

\`\`\`bash
npm install [필요한 패키지들]
\`\`\`

## 💻 구현

### Step 1: [첫 번째 기능]

설명...

\`\`\`typescript
// 완전한 코드 예제 (복사 가능)
// 파일 경로: app/example.tsx

export default function Example() {
  // 코드...
}
\`\`\`

**체크포인트**: [확인 방법]

### Step 2: [두 번째 기능]

설명...

\`\`\`typescript
// 코드...
\`\`\`

### Step 3: [세 번째 기능]

설명...

## 🧪 테스트

\`\`\`bash
npm run test
\`\`\`

## ⚠️ 자주 발생하는 에러

### 에러 1: [에러 메시지]

**원인**: ...

**해결 방법**:
\`\`\`bash
# 해결 명령어
\`\`\`

### 에러 2: [에러 메시지]

**원인**: ...

**해결 방법**: ...

### 에러 3: [에러 메시지]

**원인**: ...

**해결 방법**: ...

## 🎉 완성

축하합니다! 다음을 완료했습니다:
- ✅ 항목 1
- ✅ 항목 2
- ✅ 항목 3

## 🔗 다음 단계

- [관련 튜토리얼 제안]
- [심화 학습 주제]

## 📚 참고 자료

- [공식 문서 링크]
- [관련 리소스]
\`\`\`

# 작성 가이드라인

1. **실용성 우선**: 모든 코드는 실제로 작동해야 합니다
2. **복사 가능**: 코드 블록은 그대로 복사해서 사용할 수 있어야 합니다
3. **체크포인트**: 각 주요 단계마다 확인 방법을 제공하세요
4. **에러 대비**: 실제로 자주 발생하는 에러 3-5개를 반드시 포함하세요
5. **친근한 톤**: 격식 없이 친근하게 설명하세요
6. **한국어**: 모든 내용은 한국어로 작성하세요 (코드 주석 포함)

이제 위 형식에 맞춰 완전한 튜토리얼을 작성해주세요.
`
}
