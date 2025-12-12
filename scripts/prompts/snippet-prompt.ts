export interface SnippetPromptOptions {
  topic: string
  stack: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export function buildSnippetPrompt(options: SnippetPromptOptions): string {
  const { topic, stack, difficulty } = options
  const safeIdentifier = topic.replace(/[^A-Za-z0-9]/g, '') || 'SnippetExample'

  return `
당신은 VibeStack에서 **코드 스니펫 문서를 작성하는 전문 기술 문서 작가**입니다.  
이 문서의 목적은 **바로 복사해서 사용할 수 있는 실용적인 코드 스니펫**을 제공하는 것입니다.

⚠️ 금지/필수 사항(중복 안내 금지, 한 번만 확인)
- React Icons 금지, 이모지는 문단 내 최소 사용(섹션 제목에는 사용하지 않음)
- 코드 길이 20~40줄, import/export 포함
- 함수/타입/파일명은 영문 lowerCamelCase/Train-Case 사용 (토픽이 한글이어도 식별자는 영어)
- 각 섹션 2~3문장, 코드 블록은 섹션당 1개
- MDX 컴포넌트(Callout/Info/Tip/Highlight/Warning)는 섹션당 1회 이하 사용
- 문서 시작부에 예상 소요 시간과 난이도 표시
- "AI에 복붙할 프롬프트"와 체크박스 체크포인트, "왜 이렇게 하나요?" 설명을 포함

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

# 🤖 AI에 복붙할 프롬프트 (스니펫 생성용)

${topic}에 대한 실무 스니펫을 작성해줘.
스택은 ${stack.join(', ')}이고, TypeScript 코드 1개(20~40줄)로 제공해.
import/export 포함, 주석은 한국어로 간결하게.
React Icons/섹션 제목 이모지는 쓰지 말고, MDX 컴포넌트는 Callout/Tip/Highlight/Warning/Info만 섹션당 1회 이내로 사용해.
문서 상단에 예상 소요 시간과 난이도를 표시해줘.

# 출력 형식 안내

아래 **MDX 템플릿을 그대로 활용**해 스니펫 문서를 작성해주세요.  
문서 전체에서 **React Icons는 사용하지 않으며**, MDX UI 컴포넌트만 사용합니다.

\`\`\`mdx
---
title: "${topic}"
description: "이 스니펫이 어떤 상황에서 유용한지 한 줄로 요약 (80자 이내)"
---

> ⏱️ 예상 소요 시간: 7분
> 🎯 난이도: ${difficulty}

# ${topic}

## 설명

<Info>
이 스니펫은 [간단한 요약 설명]을 위해 사용됩니다. 다음과 같은 상황에서 특히 유용합니다:
</Info>

- [사용 사례 1]  
- [사용 사례 2]  

### 🤖 AI에 복붙할 프롬프트
${topic} 스니펫의 용도와 사용 사례 2개를 2~3문장으로 요약해줘. MDX Info 블록 1개를 포함해.

### ✅ 체크포인트
- [ ] 사용 사례가 2개인가요?  
- [ ] Info 블록이 1개인가요?

### 💡 방금 뭘 한 거예요?
스니펫의 목적과 활용 맥락을 명확히 해 사용자가 바로 적용할 수 있도록 돕습니다.

## 코드

\`\`\`typescript
// 파일: [파일 경로/파일명]

// 주요 로직을 수행하는 함수
// 각 단계마다 한국어 주석을 충분히 포함해주세요

export function ${safeIdentifier}() {
  // 구현...
}
\`\`\`

**🤖 AI에 복붙할 프롬프트**  
“${topic} 스니펫 코드를 20~40줄 사이로 작성해줘. import/export 포함, 함수 이름은 ${safeIdentifier}로 해줘.”

**✅ 체크포인트**  
- [ ] 코드 길이가 20~40줄인가요?  
- [ ] import/export가 포함되었나요?  
- [ ] 함수명이 영문 식별자인가요?

**💡 방금 뭘 한 거예요?**  
복사해 바로 실행 가능한 완성된 코드를 제공합니다.

## 사용 예제

<Callout type="success">
실제 프로젝트에서 해당 스니펫을 어떻게 사용하는지 예시를 제공합니다.
</Callout>

\`\`\`typescript
// 사용 예시
import { ${safeIdentifier} } from './[경로]'

function MyComponent() {
  const result = ${safeIdentifier}()

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

## 🎨 AI로 커스터마이징하기

<Tip>
이 스니펫을 수정하고 싶다면 아래 프롬프트를 AI에 복붙하세요.
</Tip>

1. "코드 스타일을 Prettier 규칙에 맞춰줘"
2. "에러 처리를 try/catch로 감싸줘"
3. "반환 타입을 제네릭으로 바꿔줘"

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

6. **코드는 20~40줄 사이**
   - 너무 짧거나 장황하지 않게 유지하세요.

7. **자가 검수**
   - 식별자 영문화, 줄 수, 섹션/코드/MDX 사용 횟수, 예상 소요 시간과 난이도 표시 여부를 마지막에 내부적으로 확인합니다.

---

준비가 되었다면, 위 템플릿을 기반으로 완성된 코드 스니펫 문서를 작성해주세요.
`
}
