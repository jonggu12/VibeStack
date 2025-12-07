export interface DocPromptOptions {
  topic: string
  stack: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export function buildDocPrompt(options: DocPromptOptions): string {
  const { topic, stack, difficulty } = options

  return `
당신은 VibeStack에서 기술 문서를 작성하는 전문 작가입니다.  
초심자도 이해할 수 있고, 실무에서도 바로 참고할 수 있는 친절한 문서를 만들어주세요.

이번 문서에서는 **이모지 대신 React Icons 컴포넌트**를 사용해 섹션을 구성합니다.  
문서 상단에서 관련 아이콘을 import 한 뒤, 헤더나 강조 구간에 활용해주세요.

예)

\`\`\`mdx
import { AiOutlineBook, AiOutlineQuestionCircle } from "react-icons/ai";
\`\`\`

---

# 📝 문서 정보

- **주제**: ${topic}  
- **기술 스택**: ${stack.join(', ')}  
- **난이도**: ${difficulty}  
- **예상 읽기 시간**: 5~10분  

---

# 📄 출력 형식 안내

아래의 **MDX 템플릿 구조를 그대로 활용**해 문서를 작성해주세요.  
문서 흐름은 부드럽고 자연스럽게, 설명은 명확하게 적어주시면 좋습니다.

\`\`\`mdx
---
title: "${topic}"
description: "이 문서에서 다루는 내용을 100자 이내로 요약"
---

import { 
  AiOutlineBook,
  AiOutlineQuestionCircle,
  AiOutlineCode,
  AiOutlineBulb,
  AiOutlineWarning,
  AiOutlineSwap
} from "react-icons/ai";

# ${topic}

## <AiOutlineBook /> 개요

${topic}는 [간단한 정의]입니다.  
이 문서에서는 아래 내용을 중심으로 살펴봅니다:

- 핵심 개념 1  
- 핵심 개념 2  
- 실무 활용 방법  

읽기 시간: 약 7분

## <AiOutlineQuestionCircle /> 왜 중요한가요?

[이 기술이나 개념이 실무에서 어떤 가치를 가지는지 설명해주세요.]

**실제 활용 예시**
- 사례 1: [구체적인 상황]
- 사례 2: [구체적인 상황]

## <AiOutlineCode /> 핵심 개념

### 1. [첫 번째 핵심 개념]
[내용 설명]
\`\`\`typescript
// 간단한 예제 코드
\`\`\`

### 2. [두 번째 핵심 개념]
[내용 설명]
\`\`\`typescript
// 간단한 예제 코드
\`\`\`

### 3. [세 번째 핵심 개념]
[내용 설명]

## <AiOutlineCode /> 실무 예제

### 기본 사용법
\`\`\`typescript
// 실제 프로젝트에서 자주 사용되는 패턴
\`\`\`

### 고급 사용법
\`\`\`typescript
// 좀 더 깊이 있는 활용 예제
\`\`\`

## <AiOutlineBulb /> 베스트 프랙티스

1. 프랙티스 1: [설명]  
2. 프랙티스 2: [설명]  
3. 프랙티스 3: [설명]  

## <AiOutlineWarning /> 흔히 하는 실수

### 실수 1: [제목]
잘못된 예제  
\`\`\`typescript
// 좋지 않은 코드
\`\`\`

올바른 예제  
\`\`\`typescript
// 권장되는 코드
\`\`\`

### 실수 2: [제목]
[설명]

## <AiOutlineSwap /> 다른 방식과 비교하기

| 특징 | ${topic} | 대안 1 | 대안 2 |
|------|----------|--------|--------|
| 성능 | … | … | … |
| 복잡도 | … | … | … |
| 사용 편의성 | … | … | … |

## 요약

- ${topic}는 [핵심 요약 1]  
- [핵심 요약 2]  
- [핵심 요약 3]  

## 참고 자료

- [출처 1]
- [출처 2]
\`\`\`

---

# 🌿 작성 가이드라인

아래 사항을 지켜주시면 문서 품질이 더욱 좋아집니다:

1. **React Icons 사용하기** – 모든 이모지는 React Icons로 대체해주세요.  
2. **쉽게 읽히는 문장 구성** – 처음 접하는 사람도 자연스럽게 이해할 수 있도록 작성해주세요.  
3. **실무 중심 설명** – 실제 개발 현장에서 어떻게 활용되는지 예제를 중심으로 설명해주세요.  
4. **비교 기반 설명** – 언제 이 기술을 사용하면 좋은지 명확히 구분해 주세요.  
5. **가독성을 높이는 구조** – 섹션을 적절히 나누고 중요한 부분은 명확하게 전달해주세요.  
6. **문서는 한국어로 작성** – 톤은 자연스럽고 읽기 쉽게 유지해주세요.

준비가 되셨다면, 위 템플릿을 기반으로 완성된 MDX 기술 문서를 작성해주세요.
`
}
