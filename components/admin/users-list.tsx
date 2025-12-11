'use client'

import { useState, useMemo } from 'react'
import { Search, FileDown, UserPlus, MoreVertical } from 'lucide-react'
import Image from 'next/image'

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
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState<string>('all')
  const [filterPlan, setFilterPlan] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

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
                        <span className="bg-zinc-800 text-zinc-400 border border-zinc-700 text-xs px-2 py-0.5 rounded">
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
                    <button className="text-zinc-500 hover:text-white p-2 rounded hover:bg-zinc-800 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
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
    </div>
  )
}
