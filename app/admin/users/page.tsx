import { requireAdmin } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { UsersList } from '@/components/admin/users-list'

// 빌드 시 정적 생성 방지
export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  // Require admin access
  await requireAdmin()

  // DB에서 사용자 데이터 + 구독 정보 + 구매 횟수 가져오기 (JOIN)
  const { data: users, error, count } = await supabaseAdmin
    .from('users')
    .select(`
      *,
      subscriptions!user_id (
        id,
        plan_type,
        status,
        current_period_end,
        created_at
      ),
      purchases:purchases(count)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    console.error('Error fetching users:', error)
    // 에러가 있어도 UI는 표시하고, 빈 데이터와 에러 플래그 전달
    return <UsersList users={[]} totalCount={0} hasError={true} />
  }

  // 실제 DB 데이터로 매핑
  const usersWithMetadata = (users || []).map((user) => {
    // subscriptions 처리: 배열, 객체, null 모두 처리
    let subscription = null
    if (user.subscriptions) {
      if (Array.isArray(user.subscriptions)) {
        // 배열인 경우: 첫 번째 요소
        subscription = user.subscriptions[0]
      } else if (typeof user.subscriptions === 'object') {
        // 객체인 경우: 직접 사용
        subscription = user.subscriptions
      }
    }

    // purchases count (aggregate count)
    const purchaseCount = user.purchases?.[0]?.count || 0

    return {
      ...user,
      // ✅ users.role 컬럼 사용 (마이그레이션 05에서 추가됨)
      role: user.role as 'admin' | 'user',

      // ✅ subscriptions.plan_type에서 가져오기
      plan: subscription?.plan_type === 'pro' || subscription?.plan_type === 'team'
        ? 'pro' as const
        : 'free' as const,

      // ✅ banned 우선, 그 다음 subscription 상태로 판단
      status: user.banned
        ? 'banned' as const
        : subscription?.status === 'active'
          ? 'active' as const
          : 'active' as const,

      // ✅ 구독 만료일 (Pro/Team 사용자만)
      subscriptionEnd: subscription?.current_period_end || null,

      // ✅ 구매 횟수
      purchaseCount: purchaseCount as number,
    }
  })

  return <UsersList users={usersWithMetadata} totalCount={count || 0} hasError={false} />
}
