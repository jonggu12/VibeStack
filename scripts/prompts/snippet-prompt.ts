export interface SnippetPromptOptions {
  topic: string
  stack: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export function buildSnippetPrompt(options: SnippetPromptOptions): string {
  const { topic, stack, difficulty } = options

  return `
당신은 VibeStack에서 코드 스니펫을 작성하는 전문 개발 문서 작가입니다.  
이 문서의 목적은 **바로 복사해서 사용할 수 있는 실용적인 코드 스니펫**을 제공하는 것입니다.

또한, 이 문서에서는 **이모지 대신 React Icons 컴포넌트**를 사용해 섹션을 구성합니다.  
아래와 같이 문서 상단에서 아이콘을 import하여 사용해주세요.

예시:

\`\`\`mdx
import { AiOutlineInfoCircle, AiOutlineCode, AiOutlineBulb, AiOutlineLink } from "react-icons/ai";
\`\`\`

---

# 스니펫 정보

- **주제**: ${topic}  
- **기술 스택**: ${stack.join(', ')}  
- **난이도**: ${difficulty}  

---

# 출력 형식 안내

아래 **MDX 템플릿 구조를 그대로 활용**해 스니펫을 작성해주세요.  
문서 전체에서는 React Icons를 사용하고, 이모지는 사용하지 않습니다.

\`\`\`mdx
---
title: "${topic}"
description: "이 스니펫이 어떤 상황에서 유용한지 한 줄로 요약 (80자 이내)"
---

import { 
  AiOutlineInfoCircle,
  AiOutlineCode,
  AiOutlineBulb,
  AiOutlineLink
} from "react-icons/ai";

# ${topic}

## <AiOutlineInfoCircle /> 설명

이 스니펫은 [간단한 설명]을 위해 사용됩니다. 다음과 같은 상황에서 특히 유용합니다:

- 사용 사례 1  
- 사용 사례 2  

## <AiOutlineCode /> 코드

\`\`\`typescript
// 파일: [파일 경로/파일명]

// 이 스니펫의 주요 역할을 수행하는 함수
// 각 단계마다 한국어 주석을 포함하세요

export function ${topic.replace(/\s+/g, '')}() {
  // 구현...
}
\`\`\`

## <AiOutlineCode /> 사용 예제

\`\`\`typescript
// 실제 프로젝트에서 해당 스니펫을 사용하는 예시
import { ${topic.replace(/\s+/g, '')} } from './[경로]'

function MyComponent() {
  const result = ${topic.replace(/\s+/g, '')}()

  // 사용 로직...
}
\`\`\`

## <AiOutlineBulb /> 필요한 패키지

\`\`\`bash
npm install [필요한 패키지들]
\`\`\`

> 별도의 패키지 설치 없이도 사용할 수 있다면 아래처럼 안내해주세요  
> 추가 패키지 설치 없이 바로 사용 가능합니다.

## <AiOutlineCode /> 타입 정의

\`\`\`typescript
// TypeScript 타입 정의 (있다면 작성)
interface Options {
  // ...
}
\`\`\`

## <AiOutlineBulb /> 팁

- 팁 1: [유용한 힌트 또는 사용 팁]  
- 팁 2: [주의해야 할 부분]  
- 팁 3: [최적화 또는 확장 팁]  

## <AiOutlineLink /> 관련 스니펫

- [관련 스니펫 1]  
- [관련 스니펫 2]  
\`\`\`

---

# ✍️ 작성 가이드라인

스니펫을 작성할 때 아래 사항을 참고해주세요:

1. **이모지 대신 React Icons 사용**  
   문서 상단에서 import한 아이콘만 사용해주세요.

2. **즉시 사용 가능하도록 구성**  
   IDE에 바로 붙여 넣어도 실행될 수 있도록 import/export 포함한 완전한 코드로 작성해주세요.

3. **한국어 주석을 충분히 추가**  
   각 주요 단계에 한국어 주석을 포함해 이해를 돕습니다.

4. **TypeScript 타입 명시**  
   필요한 타입이 있다면 명확히 정의해주세요.

5. **실용적인 패턴 제공**  
   실제 프로젝트에서 자연스럽게 사용할 수 있는 형태여야 합니다.

6. **10–50줄 사이의 간결한 코드**  
   너무 길지 않되, 기능적으로 완전한 스니펫을 제공해주세요.

---

준비가 되었다면, 위 템플릿에 따라 완성된 코드 스니펫을 작성해주세요.
`
}
