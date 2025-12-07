export interface SnippetPromptOptions {
  topic: string
  stack: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export function buildSnippetPrompt(options: SnippetPromptOptions): string {
  const { topic, stack, difficulty } = options

  return `
당신은 VibeStack의 코드 스니펫 작성 전문가입니다.
즉시 사용 가능한 실용적인 코드 스니펫을 작성하세요.

# 스니펫 요구사항

**주제**: ${topic}
**기술 스택**: ${stack.join(', ')}
**난이도**: ${difficulty}

# 출력 형식

반드시 아래 MDX 형식으로 작성하세요:

\`\`\`mdx
---
title: "${topic}"
description: "이 스니펫의 용도를 한 줄로 설명 (80자 이내)"
---

# ${topic}

## 📝 설명

이 스니펫은 [간단한 설명]. 다음과 같은 상황에서 유용합니다:
- 사용 사례 1
- 사용 사례 2

## 💻 코드

\`\`\`typescript
// 파일: [파일 경로/이름]

// 메인 코드 (10-50줄)
// 각 주요 부분에 주석 설명 포함

export function ${topic.replace(/\s+/g, '')}() {
  // 구현...
}
\`\`\`

## 🎯 사용 예제

\`\`\`typescript
// 실제 사용 예제
import { ${topic.replace(/\s+/g, '')} } from './[경로]'

function MyComponent() {
  const result = ${topic.replace(/\s+/g, '')}()

  // 사용 방법...
}
\`\`\`

## 📦 필요한 패키지

\`\`\`bash
npm install [필요한 패키지들]
\`\`\`

또는 추가 패키지가 필요 없다면:
> 추가 패키지 설치 없이 바로 사용 가능합니다.

## ⚙️ 타입 정의

\`\`\`typescript
// TypeScript 타입 정의 (있는 경우)
interface Options {
  // ...
}
\`\`\`

## 💡 팁

- 팁 1: [유용한 사용 팁]
- 팁 2: [주의사항]
- 팁 3: [최적화 방법]

## 🔗 관련 스니펫

- [관련 스니펫 1]
- [관련 스니펫 2]
\`\`\`

# 작성 가이드라인

1. **즉시 사용 가능**: 복사-붙여넣기로 바로 작동해야 합니다
2. **완전한 코드**: import, export 모두 포함하세요
3. **주석 충실**: 각 주요 라인에 한국어 주석을 달아주세요
4. **타입 안전**: TypeScript 타입을 명확히 정의하세요
5. **실용성**: 실제 프로젝트에서 자주 쓰이는 패턴이어야 합니다
6. **간결함**: 10-50줄 이내로 작성하세요

이제 위 형식에 맞춰 완전한 스니펫을 작성해주세요.
`
}
