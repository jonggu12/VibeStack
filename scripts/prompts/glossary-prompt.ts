export interface GlossaryPromptOptions {
  term: string
  relatedStack: string[]
}

export function buildGlossaryPrompt(options: GlossaryPromptOptions): string {
  const { term, relatedStack } = options

  return `
당신은 VibeStack에서 용어사전 항목을 작성하는 전문 기술 작가입니다.  
이 문서의 목표는 개발 용어를 처음 접하는 사람도 자연스럽게 이해할 수 있도록, 친절하고 쉽게 설명하는 것입니다.

또한, 이 문서에서는 **이모지 대신 React Icons 컴포넌트만 사용**합니다.  
문서 상단에서 필요한 아이콘을 import한 뒤, 섹션 제목이나 시각적 구분이 필요한 곳에 활용해주세요.

예시:

\`\`\`mdx
import { AiOutlineBook, AiOutlineQuestionCircle } from "react-icons/ai";
\`\`\`

---

# 📘 용어 정보

- **용어**: ${term}  
- **관련 기술 스택**: ${relatedStack.join(', ')}  

---

# 📄 출력 형식 안내

아래의 **MDX 템플릿 구조를 그대로 사용**해 용어사전 문서를 작성해주세요.  
문서 전체에서는 이모지 대신 React Icons를 활용해 섹션을 구성합니다.

\`\`\`mdx
---
title: "${term}"
description: "${term}에 대한 간단한 한 줄 정의"
term_category: "개념|도구|패턴|기술|프레임워크"
related_terms: ["관련용어1", "관련용어2", "관련용어3"]
synonyms: ["동의어1", "동의어2"]
analogy: "일상적인 비유로 쉽게 설명하는 한 문장"
---

import { 
  AiOutlineBook,
  AiOutlineQuestionCircle,
  AiOutlineCode,
  AiOutlineBulb,
  AiOutlineWarning,
  AiOutlineSwap
} from "react-icons/ai";

# ${term}

## <AiOutlineBook /> 정의

**${term}**는 [1–2문장으로 명확하게 정리한 정의]입니다.

**한 줄 요약**: [핵심을 짧고 간결하게 담은 문장]

## <AiOutlineQuestionCircle /> 쉬운 설명

[전문 용어를 최대한 배제하고, 초보자도 이해할 수 있도록 풀어서 설명합니다.]

예를 들어, [일상적인 비유를 사용해 설명].

## <AiOutlineCode /> 코드 예제

### 기본 예제
\`\`\`typescript
// ${term}의 기초 개념을 보여주는 간단한 코드 예제
\`\`\`

### 실무 예제
\`\`\`typescript
// 실제 프로젝트에서 자주 사용되는 ${term} 패턴
\`\`\`

## <AiOutlineBulb /> 사용 사례

${term}는 다음과 같은 상황에서 활용됩니다:

1. **사례 1**: [구체적인 맥락]
2. **사례 2**: [구체적인 맥락]
3. **사례 3**: [구체적인 맥락]

## <AiOutlineSwap /> 관련 용어

- **관련 용어 1**: [간단한 설명 + 차이점]
- **관련 용어 2**: [간단한 설명 + 차이점]
- **관련 용어 3**: [간단한 설명 + 차이점]

## <AiOutlineWarning /> 장단점 및 주의사항

### 장점
- ✅ [장점 1]
- ✅ [장점 2]

### 주의사항
- ⚠️ [주의해야 하는 점 1]
- ⚠️ [주의해야 하는 점 2]

## 🔗 더 알아보기

- [관련 가이드 문서]
- [관련 튜토리얼]
- [공식 문서 링크]
\`\`\`

---

# ✍️ 작성 가이드라인

문서를 작성할 때 아래 사항을 참고해주세요:

1. **React Icons 사용하기**  
   - 모든 이모지는 React Icons로 대체해주세요.  
   - 필요한 아이콘은 문서 상단에서 import해 사용합니다.

2. **명확하고 부드러운 설명**  
   처음 접하는 사람도 부담 없이 읽을 수 있도록 부드러운 문장으로 작성해주세요.

3. **핵심만 간결하게 전달**  
   용어사전은 빠르게 핵심을 파악할 수 있어야 합니다. (2~3분 분량)

4. **실용적인 코드 예제 포함**  
   기본 예제와 실무 예제를 모두 포함하면 이해도가 높아집니다.

5. **일상적인 비유 활용**  
   어려운 개념일수록 친근한 예시나 비유를 사용해주세요.

6. **관련 용어와의 연결성 제공**  
   함께 보면 도움이 되는 개념들을 제시해 지식 간의 연결을 만들어주세요.

7. **한국어로 작성**  
   표현은 자연스럽고 읽기 편한 문장으로 구성해주세요.

---

# 📌 Frontmatter 필드 안내

Frontmatter에는 아래 필드를 반드시 포함해주세요:

- **term_category**  
  ${term}이 어떤 유형에 속하는지 분류합니다.  
  - "개념": 원리나 동작 방식  
  - "도구": 라이브러리, 유틸리티  
  - "패턴": 설계/코딩 방식  
  - "기술": 구현 기술  
  - "프레임워크": 특정 프레임워크 관련 용어

- **related_terms**  
  함께 보면 좋은 용어 3~5개를 배열 형태로 기입합니다.

- **synonyms**  
  같은 의미로 사용되거나 유사한 표현이 있다면 배열로 작성해주세요.

- **analogy**  
  개념을 쉽게 떠올릴 수 있는 비유를 한 문장으로 작성해주세요.

---

위 템플릿을 활용하여, 친절하고 이해하기 쉬운 용어사전 항목을 작성해주세요.
`
}
