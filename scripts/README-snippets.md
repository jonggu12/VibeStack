# 📦 스니펫 일괄 생성 가이드

## 🎯 목적

이 스크립트는 **10개의 추천 스니펫**을 자동으로 생성하고 Supabase에 저장합니다.

각 스니펫은 다음을 포함합니다:
- ✅ **MDX 문서** (`content`)
- ✅ **복사 가능한 코드** (`code_snippet`)
- ✅ **AI 프롬프트** (`prompt_text`)

---

## 📋 생성될 스니펫 목록

1. **Google 소셜 로그인** (Clerk) - Auth
2. **Stripe 결제 체크아웃** - Payment
3. **Supabase 클라이언트 설정** - Database
4. **useDebounce 훅** - React Hook
5. **Shadcn 버튼 컴포넌트** - UI
6. **Nodemailer 이메일 발송** - API
7. **S3 파일 업로드** - Storage
8. **JWT 토큰 검증** - Auth
9. **Zod 폼 유효성 검사** - Validation
10. **Toast 알림** (Sonner) - UI

---

## 🚀 실행 방법

### 1️⃣ Supabase 마이그레이션 실행

먼저 테이블에 필요한 컬럼을 추가합니다:

```bash
# Supabase CLI로 마이그레이션 실행
npx supabase migration up

# 또는 Supabase Dashboard에서 직접 SQL 실행
# (supabase/migrations/add_snippet_fields.sql 내용 복사해서 실행)
```

### 2️⃣ 환경변수 확인

`.env.local` 파일에 다음 환경변수가 설정되어 있는지 확인:

```bash
# Claude API Key (https://console.anthropic.com)
ANTHROPIC_API_KEY=sk-ant-...

# Supabase (https://supabase.com)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
```

### 3️⃣ 스크립트 실행

```bash
# 스크립트 실행
npx tsx scripts/generate-snippets-batch.ts
```

### 4️⃣ 진행 상황 확인

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 스니펫 일괄 생성 스크립트
총 10개 스니펫 생성 예정
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[1/10] 처리 중: "Google 소셜 로그인"
─────────────────────────────────────────
🤖 Claude API 호출 중: "Google 소셜 로그인"...
✅ 생성 완료!
   - 문서 길이: 2456자
   - 코드 길이: 324자
   - 프롬프트 길이: 187자

💾 Supabase에 저장 중: "Google 소셜 로그인"...
✅ 저장 완료! slug: google-login

⏳ 2초 대기 중...

[2/10] 처리 중: "Stripe 결제 체크아웃"
...
```

### 5️⃣ 결과 확인

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 최종 결과
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 성공: 10개
❌ 실패: 0개
📦 총 10개 처리 완료
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 생성된 스니펫은 /snippets 페이지에서 확인할 수 있습니다!
```

---

## 🛠️ 주제 커스터마이징

다른 주제로 스니펫을 생성하고 싶다면 `scripts/generate-snippets-batch.ts` 파일에서 `snippetTopics` 배열을 수정하세요:

```typescript
const snippetTopics: SnippetPromptOptions[] = [
  {
    topic: '새로운 스니펫 주제',
    category: 'Auth', // Auth | Payment | Database | UI | Hook | API | Storage | Validation
    stack: ['Next.js', 'Firebase'],
    difficulty: 'beginner', // beginner | intermediate | advanced
  },
  // ... 추가 주제
]
```

---

## ⚠️ 주의사항

1. **API 비용**: Claude API 사용 시 비용이 발생합니다 (약 10개 스니펫 = $1-2 예상)
2. **Rate Limit**: API 호출 간 2초 대기로 제한됩니다
3. **실패 처리**: 일부 스니펫이 실패해도 나머지는 계속 진행됩니다
4. **중복 방지**: 같은 slug가 이미 존재하면 에러가 발생할 수 있습니다

---

## 🐛 트러블슈팅

### "환경변수가 설정되지 않았습니다" 에러

→ `.env.local` 파일 확인 후 터미널 재시작

### "JSON 파싱 실패" 에러

→ Claude API 응답 형식이 예상과 다름. 수동으로 재시도하거나 프롬프트 조정

### "저장 실패" 에러

→ Supabase 테이블 스키마 확인. 마이그레이션이 제대로 실행되었는지 확인

---

## 📚 관련 파일

- `scripts/prompts/snippet-prompt.ts` - 프롬프트 템플릿
- `scripts/generate-snippets-batch.ts` - 배치 실행 스크립트
- `supabase/migrations/add_snippet_fields.sql` - DB 마이그레이션

---

**Happy Coding! 🚀**
