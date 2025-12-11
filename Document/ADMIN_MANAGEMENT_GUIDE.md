# Admin 관리 가이드

## 📋 목차
1. [Admin 사용자 설정](#1-admin-사용자-설정)
2. [코드에서 Admin 체크](#2-코드에서-admin-체크)
3. [Admin UI 구현](#3-admin-ui-구현)
4. [실전 예제](#4-실전-예제)

---

## 1. Admin 사용자 설정

### Supabase SQL Editor에서 직접 관리

```sql
-- ✅ 사용자를 Admin으로 승격
UPDATE users
SET role = 'admin'
WHERE email = 'admin@vibestack.io';

-- ✅ 현재 Admin 목록 확인
SELECT id, email, name, role, created_at
FROM users
WHERE role = 'admin'
ORDER BY created_at DESC;

-- ✅ Admin 권한 회수 (다시 일반 사용자로)
UPDATE users
SET role = 'user'
WHERE email = 'user@example.com';

-- ✅ 전체 사용자 role 분포 확인
SELECT role, COUNT(*) as count
FROM users
GROUP BY role;
```

### 처음 Admin 설정 방법

1. **회원가입**: 먼저 일반 사용자로 가입
2. **Supabase 콘솔** → SQL Editor 접속
3. **자신의 이메일로 Admin 설정**:
   ```sql
   UPDATE users
   SET role = 'admin'
   WHERE email = 'your@email.com';
   ```
4. **확인**: 브라우저 새로고침 후 `/admin` 접속

---

## 2. 코드에서 Admin 체크

### Server Component에서 사용

```typescript
import { getCurrentUser, requireAdmin } from '@/app/actions/user'

// 방법 1: 현재 사용자 정보 가져오기
export default async function MyPage() {
  const user = await getCurrentUser()

  if (user?.role === 'admin') {
    return <AdminDashboard />
  }

  return <UserDashboard />
}

// 방법 2: Admin 필수 (아니면 에러)
export default async function AdminOnlyPage() {
  const admin = await requireAdmin() // 일반 사용자면 에러 발생

  return <div>Welcome, Admin {admin.name}!</div>
}
```

### Server Action에서 사용

```typescript
'use server'

import { requireAdmin } from '@/app/actions/user'
import { supabaseAdmin } from '@/lib/supabase'

export async function deleteAllUsers() {
  // Admin만 실행 가능
  await requireAdmin()

  // 위험한 작업 수행
  await supabaseAdmin.from('users').delete().neq('role', 'admin')

  return { success: true }
}
```

### Client Component에서 사용

```tsx
'use client'

import { AdminOnly } from '@/components/admin/AdminOnly'

export default function ContentCard({ content }) {
  return (
    <div className="card">
      <h2>{content.title}</h2>

      {/* Admin에게만 삭제 버튼 표시 */}
      <AdminOnly>
        <button onClick={() => deleteContent(content.id)}>
          Delete
        </button>
      </AdminOnly>
    </div>
  )
}
```

---

## 3. Admin UI 구현

### Admin Layout (자동 접근 제한)

```typescript
// app/(dashboard)/admin/layout.tsx
import { requireAdmin } from '@/app/actions/user'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }) {
  try {
    await requireAdmin()
  } catch {
    redirect('/') // Admin 아니면 홈으로 리다이렉트
  }

  return (
    <div className="admin-layout">
      <AdminHeader />
      {children}
    </div>
  )
}
```

### Admin Navigation 추가

```tsx
// components/layout/Header.tsx
import { getCurrentUser } from '@/app/actions/user'
import Link from 'next/link'

export default async function Header() {
  const user = await getCurrentUser()

  return (
    <header>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/docs">Docs</Link>

        {/* Admin에게만 Admin 메뉴 표시 */}
        {user?.role === 'admin' && (
          <Link href="/admin" className="text-red-600">
            🔐 Admin
          </Link>
        )}
      </nav>
    </header>
  )
}
```

---

## 4. 실전 예제

### 예제 1: Content 관리 페이지

```typescript
// app/(dashboard)/admin/contents/page.tsx
import { requireAdmin } from '@/app/actions/user'
import { supabaseAdmin } from '@/lib/supabase'

export default async function AdminContentsPage() {
  await requireAdmin()

  // Admin은 draft 콘텐츠도 조회 가능
  const { data: contents } = await supabaseAdmin
    .from('contents')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1>All Contents (Including Draft)</h1>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Views</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contents?.map(content => (
            <tr key={content.id}>
              <td>{content.title}</td>
              <td>
                <span className={
                  content.status === 'published'
                    ? 'text-green-600'
                    : 'text-yellow-600'
                }>
                  {content.status}
                </span>
              </td>
              <td>{content.views}</td>
              <td>
                <Link href={`/admin/contents/${content.id}/edit`}>
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

### 예제 2: User 관리 페이지

```typescript
// app/(dashboard)/admin/users/page.tsx
import { requireAdmin } from '@/app/actions/user'
import { supabaseAdmin } from '@/lib/supabase'

export default async function AdminUsersPage() {
  await requireAdmin()

  const { data: users } = await supabaseAdmin
    .from('users')
    .select(`
      *,
      subscriptions(plan_type, status),
      purchases:purchases(count)
    `)
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1>User Management</h1>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Subscription</th>
            <th>Purchases</th>
            <th>Joined</th>
          </tr>
        </thead>
        <tbody>
          {users?.map(user => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>
                {user.role === 'admin' ? '🔐 Admin' : 'User'}
              </td>
              <td>{user.subscriptions?.[0]?.plan_type || 'Free'}</td>
              <td>{user.purchases?.[0]?.count || 0}</td>
              <td>{new Date(user.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

### 예제 3: 환불 처리

```typescript
// app/actions/admin.ts
'use server'

import { requireAdmin } from './user'
import { supabaseAdmin } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function handleRefund(purchaseId: string) {
  // Admin 권한 확인
  await requireAdmin()

  // Purchase 상태를 refunded로 변경
  const { error } = await supabaseAdmin
    .from('purchases')
    .update({ status: 'refunded' })
    .eq('id', purchaseId)

  if (error) {
    throw new Error(`Refund failed: ${error.message}`)
  }

  // ✅ Trigger가 자동으로 user_contents의 is_active를 false로 변경
  // ✅ 사용자는 더 이상 해당 콘텐츠에 접근 불가

  revalidatePath('/admin/purchases')
  return { success: true }
}
```

---

## 5. RLS 정책 동작 방식

마이그레이션 06번에서 추가된 정책들:

```sql
-- Admin은 모든 search_logs 조회 가능
CREATE POLICY "Admin users can manage search logs"
ON search_logs FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

-- Admin은 모든 user_contents 관리 가능
CREATE POLICY "Admin users can manage user access"
ON user_contents FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

-- Admin은 모든 contents 관리 가능 (draft 포함)
CREATE POLICY "Admin users can manage all contents"
ON contents FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);
```

**동작 원리:**
- `auth.uid()`로 현재 로그인한 사용자의 ID 확인
- `users` 테이블에서 해당 사용자의 `role` 확인
- `role='admin'`이면 → 모든 데이터 접근 허용
- `role='user'`이면 → 일반 정책 적용 (자신의 데이터만)

---

## 6. 체크리스트

### ✅ Admin 설정 완료 확인

```sql
-- 1. Role 컬럼이 존재하는지 확인
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'users' AND column_name = 'role';

-- 2. Admin 사용자가 있는지 확인
SELECT email, role FROM users WHERE role = 'admin';

-- 3. RLS 정책이 생성되었는지 확인
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE policyname LIKE '%admin%';
```

### ✅ Admin 기능 테스트

1. **일반 사용자로 로그인**
   - `/admin` 접속 → 홈으로 리다이렉트 되어야 함

2. **Admin 사용자로 로그인**
   - `/admin` 접속 → Admin 대시보드 표시
   - Draft 콘텐츠 조회 가능
   - 다른 사용자 데이터 조회 가능

3. **환불 테스트**
   ```sql
   -- Purchase를 refunded로 변경
   UPDATE purchases SET status = 'refunded' WHERE id = '...';

   -- user_contents의 is_active가 자동으로 false가 되는지 확인
   SELECT * FROM user_contents WHERE purchase_id = '...';
   ```

---

## 7. 보안 주의사항

### ❌ 절대 하지 말 것

```typescript
// ❌ 클라이언트에서 직접 Admin 체크 (우회 가능)
'use client'
export function DeleteButton() {
  const { user } = useUser()
  if (user?.publicMetadata?.role === 'admin') {
    return <button onClick={deleteAll}>Delete All</button>
  }
}
```

### ✅ 올바른 방법

```typescript
// ✅ Server Action에서 Admin 체크
'use server'
export async function deleteAll() {
  await requireAdmin() // 서버에서 확인
  // 삭제 작업
}

// ✅ 클라이언트는 UI만 조건부 렌더링
'use client'
export function DeleteButton() {
  return (
    <AdminOnly>
      <button onClick={() => deleteAll()}>Delete All</button>
    </AdminOnly>
  )
}
```

**핵심:**
- 클라이언트의 role 체크는 **UI 표시용**
- 실제 권한 체크는 **서버(Server Action, API Route)에서 필수**

---

## 8. 요약

| 작업 | 방법 |
|------|------|
| **Admin 설정** | `UPDATE users SET role = 'admin' WHERE email = '...'` |
| **Server에서 체크** | `await requireAdmin()` |
| **UI 조건부 렌더링** | `<AdminOnly>...</AdminOnly>` |
| **페이지 접근 제한** | `AdminLayout`에서 `requireAdmin()` |
| **API 보호** | Server Action 시작 부분에 `await requireAdmin()` |

Admin 관리는 이제 준비 완료! 🎉
