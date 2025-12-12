export interface SnippetPromptOptions {
  topic: string
  stack: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export function buildSnippetPrompt(options: SnippetPromptOptions): string {
  const { topic, stack, difficulty } = options

  return `
당신은 VibeStack에서 **코드 스니펫 문서를 작성하는 전문 기술 문서 작가**입니다.  
이 문서의 목적은 **바로 복사해서 사용할 수 있는 실용적인 코드 스니펫**을 제공하는 것입니다.

이 문서에서는 **React Icons를 사용하지 않습니다.**  
대신 **Callout, Info, Tip, Highlight, Warning 등의 MDX 컴포넌트를 활용**해 섹션을 구조화해주세요.

예시:

\`\`\`mdx
<Callout type="info">
이 스니펫은 바로 실행 가능한 형태로 작성되었습니다.
</Callout>
\`\`\`

---

# 스니펫 정보

- **주제**: ${topic}  
- **기술 스택**: ${stack.join(', ')}  
- **난이도**: ${difficulty}  

---

# 출력 형식 안내

아래 **MDX 템플릿을 그대로 활용**해 스니펫 문서를 작성해주세요.  
문서 전체에서 **React Icons는 사용하지 않으며**, MDX UI 컴포넌트만 사용합니다.

\`\`\`mdx
---
title: "${topic}"
description: "이 스니펫이 어떤 상황에서 유용한지 한 줄로 요약 (80자 이내)"
---

# ${topic}

## 설명

<Info>
이 스니펫은 [간단한 요약 설명]을 위해 사용됩니다. 다음과 같은 상황에서 특히 유용합니다:
</Info>

- [사용 사례 1]  
- [사용 사례 2]  

## 코드

\`\`\`typescript
// 파일: [파일 경로/파일명]

// 주요 로직을 수행하는 함수
// 각 단계마다 한국어 주석을 충분히 포함해주세요

export function ${topic.replace(/\s+/g, '')}() {
  // 구현...
}
\`\`\`

## 사용 예제

<Callout type="success">
실제 프로젝트에서 해당 스니펫을 어떻게 사용하는지 예시를 제공합니다.
</Callout>

\`\`\`typescript
// 사용 예시
import { ${topic.replace(/\s+/g, '')} } from './[경로]'

function MyComponent() {
  const result = ${topic.replace(/\s+/g, '')}()

  // 사용 로직...
}
\`\`\`

## 필요한 패키지

\`\`\`bash
npm install [필요한 패키지들]
\`\`\`

<Tip>
별도의 패키지 설치 없이도 사용 가능하다면 아래처럼 안내해주세요.
</Tip>

- 추가 패키지 설치 없이 바로 사용할 수 있습니다.

## 타입 정의

\`\`\`typescript
// 필요한 TypeScript 타입 정의
interface Options {
  // ...
}
\`\`\`

## 팁

<Tip>
스니펫을 효율적으로 사용하기 위한 팁을 제공합니다.
</Tip>

- 팁 1: [유용한 사용 팁]  
- 팁 2: [주의사항]  
- 팁 3: [확장 또는 최적화 팁]  

## 관련 스니펫

<Highlight>
함께 보면 유용한 관련 스니펫입니다.
</Highlight>

- [관련 스니펫 1]  
- [관련 스니펫 2]  
\`\`\`

---

# ✍️ 작성 가이드라인

스니펫 문서를 작성할 때 아래 사항을 준수해주세요:

1. **React Icons를 완전히 제거하고 MDX 컴포넌트만 사용합니다.**  
   - Callout, Info, Tip, Warning, Highlight 등을 자유롭게 사용하세요.

2. **IDE에서 바로 사용할 수 있도록 완전한 코드로 작성**  
   - import/export 포함, 붙여넣으면 동작해야 합니다.

3. **한국어 주석 충분히 포함**  
   - 각 단계의 의도를 명확히 전달해주세요.

4. **TypeScript 타입 명시**  
   - 스니펫의 기능을 이해하는 데 필요한 타입을 정의해주세요.

5. **실용적인 패턴 제공**  
   - 실제 프로젝트에서 쓸 수 있는 구조 위주로 작성합니다.

6. **코드는 10~50줄 사이**  
   - 짧고 실용적으로 유지하세요.

---

준비가 되었다면, 위 템플릿을 기반으로 완성된 코드 스니펫 문서를 작성해주세요.
`
}
