'use client'

import { useState, useMemo } from 'react'
import { Search, FileDown, UserPlus, MoreVertical, Ban, Shield, Eye, CheckCircle } from 'lucide-react'
import Image from 'next/image'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { BanUserDialog } from './BanUserDialog'
import { toggleUserBan, toggleUserRole } from '@/app/actions/user'
import { useRouter } from 'next/navigation'

type User = {
  id: string
  clerk_user_id: string
  email: string
  name: string | null
  avatar_url: string | null
  purchase_credits: number
  created_at: string
  updated_at: string
  onboarding_completed: boolean
  banned?: boolean
  // 추가 필드 (subscription 테이블에서 조인)
  role?: 'admin' | 'user'
  plan?: 'pro' | 'free'
  status?: 'active' | 'banned'
  subscriptionEnd?: string | null  // 구독 만료일
  purchaseCount?: number  // 구매 횟수
}

type UsersListProps = {
  users: User[]
  totalCount: number
  hasError?: boolean
}

export function UsersList({ users, totalCount, hasError = false }: UsersListProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState<string>('all')
  const [filterPlan, setFilterPlan] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false)
  const [userToBan, setUserToBan] = useState<User | null>(null)

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchSearch =
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchRole = filterRole === 'all' || user.role === filterRole
      const matchPlan = filterPlan === 'all' || user.plan === filterPlan
      const matchStatus = filterStatus === 'all' || user.status === filterStatus
      return matchSearch && matchRole && matchPlan && matchStatus
    })
  }, [users, searchTerm, filterRole, filterPlan, filterStatus])

  // 아바타 색상 생성 (clerk_user_id 기반 해시)
  const getAvatarColor = (userId: string) => {
    const colors = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-red-500 to-orange-500',
      'from-green-500 to-emerald-500',
      'from-yellow-500 to-amber-500',
      'from-indigo-500 to-purple-500',
    ]
    const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[hash % colors.length]
  }

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  // 구독 만료일 포맷팅
  const formatExpiration = (endDate: string | null) => {
    if (!endDate) return null
    const days = Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    if (days < 0) return '만료됨'
    if (days === 0) return '오늘 만료'
    if (days <= 7) return `${days}일 남음`
    return formatDate(endDate)
  }

  // 사용자 정지/해제
  const handleToggleBan = async (user: User, currentBanned: boolean) => {
    if (currentBanned) {
      // 정지 해제 확인
      const confirmed = confirm('이 사용자의 계정 정지를 해제하시겠습니까?')
      if (!confirmed) return

      const result = await toggleUserBan(user.id)
      if (result.success) {
        router.refresh()
      } else {
        alert(result.error || '오류가 발생했습니다.')
      }
    } else {
      // 정지 다이얼로그 열기
      setUserToBan(user)
      setIsBanDialogOpen(true)
    }
  }

  // 정지 확인 핸들러
  const handleBanConfirm = async (reason: string, duration: '1day' | '3days' | '7days' | '30days' | 'permanent') => {
    if (!userToBan) return

    const durationMap = {
      '1day': 1,
      '3days': 3,
      '7days': 7,
      '30days': 30,
      'permanent': null,
    }

    const durationDays = durationMap[duration]
    const result = await toggleUserBan(userToBan.id, reason, durationDays)

    if (result.success) {
      setIsBanDialogOpen(false)
      setUserToBan(null)
      router.refresh()
    } else {
      alert(result.error || '오류가 발생했습니다.')
    }
  }

  // 사용자 권한 변경
  const handleToggleRole = async (userId: string) => {
    const result = await toggleUserRole(userId)
    if (result.success) {
      router.refresh()
    } else {
      alert(result.error || '오류가 발생했습니다.')
    }
  }

  // 사용자 상세 정보 보기
  const handleViewDetail = (user: User) => {
    setSelectedUser(user)
    setIsDetailOpen(true)
  }

  return (
    <div className="p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">사용자 관리</h1>
          <p className="text-sm text-zinc-400 mt-1">
            총 <span className="text-white font-bold">{totalCount.toLocaleString()}</span>명의 회원이
            등록되어 있습니다.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-2">
            <FileDown className="w-4 h-4" />
            CSV 내보내기
          </button>
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-500/20 transition-colors flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            사용자 초대
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative group w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-zinc-500" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-sm placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white transition-colors"
            placeholder="이름, 이메일 검색..."
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
          >
            <option value="all">모든 권한</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          <select
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
          >
            <option value="all">모든 플랜</option>
            <option value="pro">Pro Plan</option>
            <option value="free">Free Plan</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
          >
            <option value="all">모든 상태</option>
            <option value="active">활동중 (Active)</option>
            <option value="banned">정지됨 (Banned)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-lg">
        <table className="w-full text-sm text-left text-zinc-400">
          <thead className="text-xs text-zinc-500 uppercase bg-zinc-950/50 border-b border-zinc-800">
            <tr>
              <th scope="col" className="px-6 py-4 font-medium">
                사용자 정보
              </th>
              <th scope="col" className="px-6 py-4 font-medium">
                권한 (Role)
              </th>
              <th scope="col" className="px-6 py-4 font-medium">
                구독 플랜
              </th>
              <th scope="col" className="px-6 py-4 font-medium">
                상태
              </th>
              <th scope="col" className="px-6 py-4 font-medium">
                구매 횟수
              </th>
              <th scope="col" className="px-6 py-4 font-medium">
                가입일
              </th>
              <th scope="col" className="px-6 py-4 font-medium text-right">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {hasError ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-400 inline-block">
                    사용자 데이터를 불러오는 중 오류가 발생했습니다.
                  </div>
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                  {searchTerm || filterRole !== 'all' || filterPlan !== 'all' || filterStatus !== 'all'
                    ? '검색 결과가 없습니다.'
                    : '등록된 사용자가 없습니다.'}
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-zinc-800/50 transition-colors group">
                  {/* 사용자 정보 */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {user.avatar_url ? (
                        <Image
                          src={user.avatar_url}
                          alt={user.name || user.email}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      ) : (
                        <div
                          className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarColor(
                            user.clerk_user_id
                          )}`}
                        ></div>
                      )}
                      <div>
                        <div className="font-bold text-white text-sm">{user.name || '이름 없음'}</div>
                        <div className="text-xs text-zinc-500">{user.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* 권한 */}
                  <td className="px-6 py-4">
                    {user.role === 'admin' ? (
                      <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs px-2 py-0.5 rounded font-bold">
                        Admin
                      </span>
                    ) : (
                      <span className="text-zinc-400 text-xs">User</span>
                    )}
                  </td>

                  {/* 구독 플랜 */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {user.plan === 'pro' ? (
                        <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs px-2 py-0.5 rounded font-bold flex w-fit items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3 h-3"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
                          </svg>
                          Pro
                        </span>
                      ) : (
                        <span className="bg-zinc-800 text-zinc-400 border border-zinc-700 text-xs px-2 py-0.5 rounded w-fit">
                          Free
                        </span>
                      )}
                      {/* 구독 만료일 표시 (Pro 사용자만) */}
                      {user.plan === 'pro' && user.subscriptionEnd && (
                        <span className="text-xs text-zinc-500">
                          {formatExpiration(user.subscriptionEnd)}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* 상태 */}
                  <td className="px-6 py-4">
                    {user.status === 'banned' ? (
                      <span className="flex items-center gap-1.5 text-red-400 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                        Banned
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-emerald-400 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        Active
                      </span>
                    )}
                  </td>

                  {/* 구매 횟수 */}
                  <td className="px-6 py-4">
                    <span className="text-xs text-zinc-400">
                      {user.purchaseCount || 0}회
                    </span>
                  </td>

                  {/* 가입일 */}
                  <td className="px-6 py-4 text-xs">{formatDate(user.created_at)}</td>

                  {/* 관리 */}
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="text-zinc-500 hover:text-white p-2 rounded hover:bg-zinc-800 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-zinc-900 border-zinc-800">
                        {/* 사용자 상세 정보 */}
                        <DropdownMenuItem
                          onClick={() => handleViewDetail(user)}
                          className="text-zinc-300 hover:text-white hover:bg-zinc-800 cursor-pointer"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          사용자 상세 정보
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="bg-zinc-800" />

                        {/* 계정 정지/해제 */}
                        {user.status === 'banned' ? (
                          <DropdownMenuItem
                            onClick={() => handleToggleBan(user, true)}
                            className="text-green-400 hover:text-green-300 hover:bg-zinc-800 cursor-pointer"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            계정 정지 해제
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => handleToggleBan(user, false)}
                            className="text-red-400 hover:text-red-300 hover:bg-zinc-800 cursor-pointer"
                          >
                            <Ban className="w-4 h-4 mr-2" />
                            계정 정지
                          </DropdownMenuItem>
                        )}

                        {/* 권한 변경 */}
                        <DropdownMenuItem
                          onClick={() => handleToggleRole(user.id)}
                          className="text-purple-400 hover:text-purple-300 hover:bg-zinc-800 cursor-pointer"
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          {user.role === 'admin' ? 'User로 강등' : 'Admin으로 승격'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-zinc-800 flex justify-between items-center bg-zinc-950/30">
          <span className="text-xs text-zinc-500">
            Showing <span className="text-white font-bold">1-{filteredUsers.length}</span> of{' '}
            <span className="text-white font-bold">{totalCount}</span>
          </span>
          <div className="flex gap-2">
            <button
              disabled
              className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 rounded text-xs text-zinc-300 disabled:opacity-50"
            >
              이전
            </button>
            <button className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 rounded text-xs text-zinc-300">
              다음
            </button>
          </div>
        </div>
      </div>

      {/* 사용자 상세 정보 모달 */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">사용자 상세 정보</DialogTitle>
            <DialogDescription className="text-zinc-400">
              {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6 mt-4">
              {/* 기본 정보 */}
              <div className="flex items-center gap-4 p-4 bg-zinc-950 rounded-lg border border-zinc-800">
                {selectedUser.avatar_url ? (
                  <Image
                    src={selectedUser.avatar_url}
                    alt={selectedUser.name || selectedUser.email}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                ) : (
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${getAvatarColor(
                      selectedUser.clerk_user_id
                    )}`}
                  ></div>
                )}
                <div>
                  <h3 className="text-lg font-bold">{selectedUser.name || '이름 없음'}</h3>
                  <p className="text-sm text-zinc-400">{selectedUser.email}</p>
                </div>
              </div>

              {/* 상세 정보 그리드 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800">
                  <p className="text-xs text-zinc-500 mb-1">권한</p>
                  <p className="text-sm font-bold">
                    {selectedUser.role === 'admin' ? (
                      <span className="text-purple-400">Admin</span>
                    ) : (
                      <span className="text-zinc-300">User</span>
                    )}
                  </p>
                </div>

                <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800">
                  <p className="text-xs text-zinc-500 mb-1">구독 플랜</p>
                  <p className="text-sm font-bold">
                    {selectedUser.plan === 'pro' ? (
                      <span className="text-indigo-400">Pro</span>
                    ) : (
                      <span className="text-zinc-400">Free</span>
                    )}
                  </p>
                </div>

                <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800">
                  <p className="text-xs text-zinc-500 mb-1">상태</p>
                  <p className="text-sm font-bold">
                    {selectedUser.status === 'banned' ? (
                      <span className="text-red-400">Banned</span>
                    ) : (
                      <span className="text-emerald-400">Active</span>
                    )}
                  </p>
                </div>

                <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800">
                  <p className="text-xs text-zinc-500 mb-1">구매 횟수</p>
                  <p className="text-sm font-bold text-zinc-300">{selectedUser.purchaseCount || 0}회</p>
                </div>

                <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800">
                  <p className="text-xs text-zinc-500 mb-1">가입일</p>
                  <p className="text-sm font-bold text-zinc-300">{formatDate(selectedUser.created_at)}</p>
                </div>

                <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800">
                  <p className="text-xs text-zinc-500 mb-1">구매 크레딧</p>
                  <p className="text-sm font-bold text-zinc-300">{selectedUser.purchase_credits || 0}</p>
                </div>
              </div>

              {/* 구독 정보 */}
              {selectedUser.plan === 'pro' && selectedUser.subscriptionEnd && (
                <div className="p-4 bg-indigo-950/20 rounded-lg border border-indigo-800/30">
                  <p className="text-xs text-indigo-400 mb-1">구독 만료일</p>
                  <p className="text-sm font-bold text-indigo-300">
                    {formatExpiration(selectedUser.subscriptionEnd)}
                  </p>
                </div>
              )}

              {/* Clerk ID */}
              <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800">
                <p className="text-xs text-zinc-500 mb-1">Clerk User ID</p>
                <p className="text-xs font-mono text-zinc-400 break-all">{selectedUser.clerk_user_id}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 계정 정지 다이얼로그 */}
      {userToBan && (
        <BanUserDialog
          open={isBanDialogOpen}
          onOpenChange={setIsBanDialogOpen}
          userName={userToBan.name || '이름 없음'}
          userEmail={userToBan.email}
          onConfirm={handleBanConfirm}
        />
      )}
    </div>
  )
}
