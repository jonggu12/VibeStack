# VibeStack 콘텐츠 생성 자동화

OpenAI API를 활용하여 튜토리얼, 스니펫, 문서, 용어사전을 자동으로 생성합니다.

## 🚀 빠른 시작

### 1. OpenAI API 키 설정

`.env.local` 파일에 다음을 추가하세요:

```env
OPENAI_API_KEY=sk-...your-api-key...
```

> OpenAI API 키는 https://platform.openai.com/api-keys 에서 발급받을 수 있습니다.

### 2. 콘텐츠 생성

```bash
# 튜토리얼 생성
npm run generate -- tutorial "Next.js 14 + Clerk 인증 구현" "nextjs,clerk,typescript" intermediate 45

# 스니펫 생성
npm run generate -- snippet "useDebounce 훅" "react,typescript" beginner

# 문서 생성
npm run generate -- doc "Server Components 가이드" "nextjs,react" beginner

# 용어사전 생성
npm run generate -- glossary "Server Actions" "nextjs" beginner
```

## 📋 명령어 형식

```bash
npm run generate -- <type> <topic> <stack> <difficulty> [estimatedTime] [isPremium]
```

### 파라미터

- **type**: `tutorial` | `snippet` | `doc` | `glossary`
- **topic**: 콘텐츠 주제 (따옴표로 감싸기)
- **stack**: 쉼표로 구분된 기술 스택
- **difficulty**: `beginner` | `intermediate` | `advanced`
- **estimatedTime** (선택): 예상 소요 시간 (분) - 기본값: 30
- **isPremium** (선택): `true` | `false` - 기본값: false

## 📂 생성된 콘텐츠 위치

### 1. Supabase Database
```
contents 테이블에 저장됨
- status: 'draft' (검수 후 'published'로 변경)
```

### 2. Admin 대시보드
```
http://localhost:3000/admin/content
- Draft 필터로 생성된 콘텐츠 확인
- 검수 및 편집 가능
```

### 3. 로컬 백업
```
scripts/generated/
  ├── tutorials/
  │   └── nextjs-14-clerk-authentication.mdx
  ├── snippets/
  │   └── use-debounce-hook.mdx
  ├── docs/
  │   └── server-components-guide.mdx
  └── glossary/
      └── server-actions.mdx
```

## 📝 예제

### 튜토리얼 생성 예제

```bash
npm run generate -- tutorial \
  "Stripe 구독 결제 통합" \
  "nextjs,stripe,typescript" \
  intermediate \
  90 \
  false
```

**출력**:
```
============================================================
🚀 Generating TUTORIAL: Stripe 구독 결제 통합
============================================================

🤖 Calling OpenAI API (gpt-4o)...
✅ Generated 12543 characters
💰 Tokens used: 3421

📋 Metadata:
  Title: Stripe 구독 결제 통합
  Slug: stripe-subscription-payment-integration
  Tags: nextjs, stripe, typescript, javascript

💾 Backup saved: scripts/generated/tutorials/stripe-subscription-payment-integration.mdx

💾 Saving to Supabase...

✅ Successfully generated and saved!

📍 Locations:
  - Database: ID 42
  - Admin UI: http://localhost:3000/admin/content/42
  - Backup: scripts/generated/tutorials/stripe-subscription-payment-integration.mdx
  - Status: draft

============================================================
```

### 스니펫 생성 예제

```bash
npm run generate -- snippet \
  "useLocalStorage 훅" \
  "react,typescript" \
  beginner
```

## 🔄 배치 생성 (예정)

여러 콘텐츠를 한 번에 생성하려면:

```bash
# topics/batch.json 파일 생성 후
npm run generate:batch topics/batch.json
```

`topics/batch.json` 예시:
```json
{
  "tutorials": [
    {
      "topic": "Next.js 14 + Clerk 인증",
      "stack": ["nextjs", "clerk"],
      "difficulty": "intermediate",
      "estimatedTime": 45
    }
  ],
  "snippets": [
    {
      "topic": "useDebounce 훅",
      "stack": ["react", "typescript"],
      "difficulty": "beginner"
    }
  ]
}
```

## 💰 비용 예상 (GPT-4 Omni 기준)

| 콘텐츠 타입 | 평균 토큰 | 예상 비용 |
|-------------|-----------|-----------|
| Tutorial    | 4000      | ~$0.02    |
| Snippet     | 1000      | ~$0.005   |
| Doc         | 2000      | ~$0.01    |
| Glossary    | 500       | ~$0.0025  |

> 100개 콘텐츠 생성 시 약 $1-2 정도 소요 (매우 저렴!)

## 🛠️ 트러블슈팅

### OPENAI_API_KEY is not set

**.env.local**에 API 키를 추가하세요:
```env
OPENAI_API_KEY=sk-...
```

### Supabase credentials not found

**.env.local**에 Supabase 정보를 추가하세요:
```env
NEXT_PUBLIC_SUPABASE_URL=https://...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### 생성된 콘텐츠가 Admin에 보이지 않음

1. Supabase DB에서 `contents` 테이블 확인
2. status가 'draft'인지 확인
3. Admin 페이지에서 "Draft" 필터 선택

## 📚 다음 단계

1. **생성된 콘텐츠 검수**: Admin 대시보드에서 확인
2. **편집 및 수정**: 필요시 내용 수정
3. **Published로 변경**: 검수 완료 후 상태 변경
4. **Algolia 인덱싱**: Published 상태일 때 자동 인덱싱
5. **유저에게 노출**: `/tutorials/[slug]` 등에서 접근 가능

## 🎯 권장 워크플로우

1. **대량 생성**: 스크립트로 초안 생성 (100-200개)
2. **백업 확인**: Git에 백업 파일 커밋
3. **검수**: Admin에서 각 콘텐츠 확인 및 수정
4. **점진적 배포**: 검수 완료된 것부터 Published로 전환
5. **유저 피드백**: 실제 사용 후 개선

## 📖 프롬프트 커스터마이징

프롬프트를 수정하려면 다음 파일을 편집하세요:

- `scripts/prompts/tutorial-prompt.ts`
- `scripts/prompts/snippet-prompt.ts`
- `scripts/prompts/doc-prompt.ts`
- `scripts/prompts/glossary-prompt.ts`

## 🔗 참고 링크

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [VibeStack Admin Dashboard](http://localhost:3000/admin/content)
