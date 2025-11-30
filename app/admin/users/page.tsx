import { requireAdmin } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { UsersList } from '@/components/admin/users-list'

// 빌드 시 정적 생성 방지
export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  // Require admin access
  await requireAdmin()

  // DB에서 사용자 데이터 가져오기
  const { data: users, error, count } = await supabaseAdmin
    .from('users')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    console.error('Error fetching users:', error)
    // 에러가 있어도 UI는 표시하고, 빈 데이터와 에러 플래그 전달
    return <UsersList users={[]} totalCount={0} hasError={true} />
  }

  // Mock data for role, plan, status (실제로는 subscriptions 테이블과 조인 필요)
  const usersWithMetadata = (users || []).map((user) => ({
    ...user,
    role: user.email?.includes('root') || user.email?.includes('admin') ? 'admin' : 'user',
    plan: Math.random() > 0.5 ? 'pro' : 'free', // TODO: subscriptions 테이블에서 가져오기
    status: 'active', // TODO: 실제 상태 관리 필요
  }))

  return <UsersList users={usersWithMetadata} totalCount={count || 0} hasError={false} />
}
