import { getCurrentUser } from '@/app/actions/user'
import { redirect } from 'next/navigation'
import { Ban, Mail, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function BannedPage() {
  const user = await getCurrentUser()

  // 로그인하지 않은 경우
  if (!user) {
    redirect('/sign-in')
  }

  // 정지되지 않은 사용자는 홈으로
  if (!user.banned) {
    redirect('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <div className="max-w-md w-full">
        {/* 카드 */}
        <div className="p-8 bg-zinc-900 border border-red-800 rounded-xl shadow-lg shadow-red-500/10">
          {/* 아이콘 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-red-500/20">
              <Ban className="w-8 h-8 text-red-400" />
            </div>

            {/* 제목 */}
            <h1 className="text-2xl font-bold text-white mb-2">
              계정이 정지되었습니다
            </h1>

            {/* 설명 */}
            <p className="text-zinc-400 mb-6">
              서비스 이용 약관 위반으로 인해 계정이 일시 정지되었습니다.
              <br />
              콘텐츠 조회 및 신규 구매가 제한됩니다.
            </p>
          </div>

          {/* 정지 정보 */}
          <div className="mb-6 p-4 bg-zinc-950 rounded-lg border border-zinc-800">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">계정</span>
                <span className="text-zinc-300 font-mono">{user.email}</span>
              </div>
              {user.banned_at && (
                <div className="flex justify-between">
                  <span className="text-zinc-500">정지 일시</span>
                  <span className="text-zinc-300">
                    {new Date(user.banned_at).toLocaleString('ko-KR')}
                  </span>
                </div>
              )}
              {user.banned_until && (
                <div className="flex justify-between">
                  <span className="text-zinc-500">해제 예정</span>
                  <span className="text-emerald-400 font-bold">
                    {new Date(user.banned_until).toLocaleString('ko-KR')}
                  </span>
                </div>
              )}
              {!user.banned_until && (
                <div className="flex justify-between">
                  <span className="text-zinc-500">정지 기간</span>
                  <span className="text-red-400 font-bold">영구 정지</span>
                </div>
              )}
              {user.ban_reason && (
                <div className="pt-2 border-t border-zinc-800">
                  <p className="text-zinc-500 mb-1">정지 사유</p>
                  <p className="text-red-400 text-sm">{user.ban_reason}</p>
                </div>
              )}
            </div>
          </div>

          {/* 허용된 기능 안내 */}
          <div className="mb-6 p-4 bg-emerald-950/20 rounded-lg border border-emerald-800/30">
            <p className="text-xs text-emerald-400 mb-2 font-bold">✅ 이용 가능한 기능</p>
            <ul className="text-xs text-emerald-300 space-y-1">
              <li>• 프로필 조회 및 수정</li>
              <li>• 구매 내역 확인</li>
              <li>• 고객 지원 문의</li>
            </ul>
          </div>

          {/* 액션 버튼 */}
          <div className="space-y-3">
            <a
              href="mailto:support@vibestack.com?subject=계정 정지 문의"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold transition-colors"
            >
              <Mail className="w-4 h-4" />
              고객지원 문의
            </a>

            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full px-4 py-2 text-zinc-500 hover:text-zinc-400 text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              홈으로 돌아가기
            </Link>
          </div>
        </div>

        {/* 하단 안내 */}
        <p className="text-center text-xs text-zinc-600 mt-6">
          문의 사항이 있으시면 언제든지 고객지원팀으로 연락주세요.
          <br />
          영업일 기준 24시간 내 답변드리겠습니다.
        </p>
      </div>
    </div>
  )
}
