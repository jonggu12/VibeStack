'use client'

import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { User, Shield, Bell, CreditCard, Camera, Mail, Check, ArrowUpRight, Loader2 } from 'lucide-react'

export default function SettingsPage() {
  const { user, isLoaded } = useUser()
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'notifications'>('profile')
  const [isSaving, setIsSaving] = useState(false)
  const [showToast, setShowToast] = useState(false)

  // Form states
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')

  // Update form when user data loads
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '')
      setLastName(user.lastName || '')
      setUsername(user.username || '')
    }
  }, [user])

  const handleSave = async () => {
    setIsSaving(true)

    try {
      // Update Clerk user data
      await user?.update({
        firstName,
        lastName,
        username,
      })

      // Show success toast
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    } catch (error) {
      console.error('Failed to update profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    )
  }

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-8">설정</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-64 shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 border-b lg:border-b-0 border-zinc-800">
            <button
              onClick={() => setActiveTab('profile')}
              className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <User className="w-4 h-4" /> 프로필
            </button>
            <button
              onClick={() => setActiveTab('account')}
              className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 whitespace-nowrap ${
                activeTab === 'account'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Shield className="w-4 h-4" /> 계정 및 보안
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 whitespace-nowrap ${
                activeTab === 'notifications'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Bell className="w-4 h-4" /> 알림
            </button>
            <div className="h-px bg-zinc-800 my-2 hidden lg:block"></div>
            <Link
              href="/settings/billing"
              className="text-left px-4 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors flex items-center gap-3 whitespace-nowrap"
            >
              <CreditCard className="w-4 h-4" /> 구독 및 결제
              <ArrowUpRight className="w-3 h-3 ml-auto" />
            </Link>
          </nav>
        </aside>

        {/* Content Area */}
        <div className="flex-1 max-w-3xl">
          {/* Tab: Profile */}
          {activeTab === 'profile' && (
            <div className="space-y-8">
              {/* Avatar Section */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <h2 className="text-lg font-bold text-white mb-1">프로필 이미지</h2>
                <p className="text-sm text-zinc-400 mb-6">다른 사용자들에게 보여지는 모습입니다.</p>

                <div className="flex items-center gap-6">
                  <div className="relative group">
                    {user?.imageUrl ? (
                      <Image
                        src={user.imageUrl}
                        alt={user.fullName || 'User'}
                        width={96}
                        height={96}
                        className="rounded-full border-4 border-zinc-800 shadow-xl"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border-4 border-zinc-800 shadow-xl flex items-center justify-center text-white text-2xl font-bold">
                        {user?.firstName?.[0] || 'U'}
                      </div>
                    )}
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-zinc-800 border border-zinc-700 rounded-full flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <button className="px-4 py-2 bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-bold rounded-lg hover:bg-zinc-700 hover:text-white transition-colors">
                        이미지 업로드
                      </button>
                      <button className="px-4 py-2 text-red-400 text-xs font-bold hover:text-red-300 transition-colors">
                        제거
                      </button>
                    </div>
                    <p className="text-xs text-zinc-500">JPG, GIF or PNG. 1MB Max.</p>
                  </div>
                </div>
              </div>

              {/* Basic Info Form */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <h2 className="text-lg font-bold text-white mb-6">기본 정보</h2>

                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 mb-1.5">이름</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 mb-1.5">성</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1.5">닉네임</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1.5">이메일</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3 text-zinc-500 w-4 h-4" />
                      <input
                        type="email"
                        value={user?.primaryEmailAddress?.emailAddress || ''}
                        disabled
                        className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-zinc-500 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1.5">자기소개</label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      maxLength={160}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                      placeholder="자신을 간단히 소개해주세요."
                    />
                    <p className="text-right text-[10px] text-zinc-600 mt-1">{bio.length} / 160</p>
                  </div>
                </div>

                <div className="mt-8 flex justify-end pt-6 border-t border-zinc-800">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> 저장 중...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" /> 변경사항 저장
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Account */}
          {activeTab === 'account' && (
            <div className="space-y-8">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <h2 className="text-lg font-bold text-white mb-4">비밀번호 변경</h2>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1.5">현재 비밀번호</label>
                    <input
                      type="password"
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1.5">새 비밀번호</label>
                    <input
                      type="password"
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <button className="px-4 py-2 bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-bold rounded-lg hover:bg-zinc-700 transition-colors">
                    비밀번호 업데이트
                  </button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
                <h2 className="text-lg font-bold text-red-500 mb-2">Danger Zone</h2>
                <p className="text-sm text-zinc-400 mb-6">
                  계정을 삭제하면 모든 프로젝트와 데이터가 영구적으로 제거됩니다.
                </p>

                <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-lg border border-red-500/10">
                  <div>
                    <div className="font-bold text-zinc-200 text-sm">계정 삭제</div>
                    <div className="text-xs text-zinc-500">이 작업은 되돌릴 수 없습니다.</div>
                  </div>
                  <button className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-bold rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                    계정 삭제하기
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-8">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <h2 className="text-lg font-bold text-white mb-6">이메일 알림</h2>

                <div className="space-y-6">
                  {/* Toggle Item 1 */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-zinc-200 text-sm">제품 업데이트</div>
                      <div className="text-xs text-zinc-500">새로운 기능 및 업데이트 소식을 받습니다.</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-10 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-600 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  {/* Toggle Item 2 */}
                  <div className="flex items-center justify-between opacity-50">
                    <div>
                      <div className="font-bold text-zinc-200 text-sm">보안 알림</div>
                      <div className="text-xs text-zinc-500">비밀번호 변경 등 보안 관련 알림 (필수)</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-not-allowed">
                      <input type="checkbox" checked disabled className="sr-only peer" />
                      <div className="w-10 h-5 bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:border-zinc-600 after:border after:rounded-full after:h-4 after:w-4 peer-checked:bg-zinc-700"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 right-8 bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-in fade-in slide-in-from-bottom-4">
          <div className="w-6 h-6 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm">저장되었습니다!</h4>
            <p className="text-xs text-zinc-400">프로필 정보가 업데이트되었습니다.</p>
          </div>
        </div>
      )}
    </main>
  )
}
