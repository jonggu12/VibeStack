'use client'

import { useState } from 'react'
import Link from 'next/link'
import { User, Shield, Bell, CreditCard, Plus, Download, Trash2, ChevronRight } from 'lucide-react'

export default function BillingPage() {
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  return (
    <>
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-64 shrink-0">
            <h1 className="text-2xl font-bold text-white mb-6 lg:mb-8 px-2">설정</h1>
            <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 border-b lg:border-b-0 border-zinc-800">
              <Link
                href="/settings"
                className="text-left px-4 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors flex items-center gap-3 whitespace-nowrap"
              >
                <User className="w-4 h-4" /> 프로필
              </Link>
              <Link
                href="/settings"
                className="text-left px-4 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors flex items-center gap-3 whitespace-nowrap"
              >
                <Shield className="w-4 h-4" /> 계정 및 보안
              </Link>
              <Link
                href="/settings"
                className="text-left px-4 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors flex items-center gap-3 whitespace-nowrap"
              >
                <Bell className="w-4 h-4" /> 알림
              </Link>
              <div className="h-px bg-zinc-800 my-2 hidden lg:block"></div>
              <Link
                href="/settings/billing"
                className="text-left px-4 py-2.5 rounded-lg text-sm font-medium bg-zinc-800 text-white transition-colors flex items-center gap-3 whitespace-nowrap"
              >
                <CreditCard className="w-4 h-4" /> 구독 및 결제
              </Link>
            </nav>
          </aside>

          {/* Content Area */}
          <div className="flex-1 max-w-4xl space-y-10">
            {/* Current Plan Section */}
            <section>
              <h2 className="text-lg font-bold text-white mb-4">현재 구독 플랜</h2>

              {/* Pro Plan Card */}
              <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800 rounded-xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all"></div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-white">VibeStack Pro</h3>
                      <span className="bg-indigo-500 text-white text-xs font-bold px-2 py-0.5 rounded-full border border-indigo-400">
                        Active
                      </span>
                    </div>
                    <p className="text-zinc-400 text-sm">
                      <span className="text-white font-bold">₩16,000 / 월</span> • 다음 결제일: 2025년 12월 27일
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Link
                      href="/pricing"
                      className="px-4 py-2.5 bg-white text-black text-sm font-bold rounded-lg hover:bg-zinc-200 transition-colors"
                    >
                      플랜 변경
                    </Link>
                    <button className="px-4 py-2.5 bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm font-medium rounded-lg hover:bg-zinc-700 hover:text-white transition-colors">
                      구독 취소
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Methods Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">결제 수단</h2>
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> 수단 추가
                </button>
              </div>

              <div className="space-y-3">
                {/* Card 1: Toss Payments (Main) */}
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center justify-between group hover:border-zinc-600 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 bg-zinc-800 rounded border border-zinc-700 flex items-center justify-center">
                      <span className="font-bold text-[#3282F6] italic text-sm">toss</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-white">현대카드 (1234)</p>
                        <span className="bg-zinc-800 text-zinc-400 text-[10px] px-1.5 py-0.5 rounded border border-zinc-700">
                          기본
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500">Toss Payments • 만료 12/28</p>
                    </div>
                  </div>
                  <button className="text-zinc-500 hover:text-red-400 p-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Card 2: Stripe */}
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center justify-between group hover:border-zinc-600 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 bg-zinc-800 rounded border border-zinc-700 flex items-center justify-center text-white text-lg">
                      💳
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-300">Visa (4242)</p>
                      <p className="text-xs text-zinc-500">Stripe • 만료 08/26</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-xs text-zinc-500 hover:text-white px-2 py-1">기본으로 설정</button>
                    <button className="text-zinc-500 hover:text-red-400 p-2">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Billing History Section */}
            <section>
              <h2 className="text-lg font-bold text-white mb-4">결제 내역</h2>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-zinc-950/50 text-zinc-500 border-b border-zinc-800 uppercase text-xs">
                      <tr>
                        <th className="px-6 py-4 font-medium">날짜</th>
                        <th className="px-6 py-4 font-medium">금액</th>
                        <th className="px-6 py-4 font-medium">PG사</th>
                        <th className="px-6 py-4 font-medium">상태</th>
                        <th className="px-6 py-4 font-medium text-right">인보이스</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800 text-zinc-300">
                      <tr className="hover:bg-zinc-800/50 transition-colors">
                        <td className="px-6 py-4">2025. 11. 27</td>
                        <td className="px-6 py-4 text-white font-medium">₩16,000</td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-1.5 text-xs text-[#3282F6]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#3282F6]"></span> Toss
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2 py-0.5 rounded border border-emerald-500/20">
                            결제됨
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-zinc-500 hover:text-white">
                            <Download className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                      <tr className="hover:bg-zinc-800/50 transition-colors">
                        <td className="px-6 py-4">2025. 10. 27</td>
                        <td className="px-6 py-4 text-white font-medium">$12.00</td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-1.5 text-xs text-[#635BFF]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#635BFF]"></span> Stripe
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2 py-0.5 rounded border border-emerald-500/20">
                            결제됨
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-zinc-500 hover:text-white">
                            <Download className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Modal: Add Payment Method */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowPaymentModal(false)}
          ></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800">
              <h3 className="text-xl font-bold text-white">결제 수단 추가</h3>
              <p className="text-sm text-zinc-400 mt-1">원하시는 결제 방식을 선택해주세요.</p>
            </div>

            <div className="p-6 space-y-3">
              {/* Option: Toss */}
              <button className="w-full flex items-center justify-between p-4 bg-zinc-950 border border-zinc-700 rounded-xl hover:border-[#3282F6] hover:bg-blue-900/10 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#3282F6] font-bold italic text-lg shadow-sm">
                    toss
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-white group-hover:text-[#3282F6]">
                      한국 카드 / 간편결제
                    </div>
                    <div className="text-xs text-zinc-500">토스페이, 카카오페이, 네이버페이 지원</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-[#3282F6]" />
              </button>

              {/* Option: Stripe */}
              <button className="w-full flex items-center justify-between p-4 bg-zinc-950 border border-zinc-700 rounded-xl hover:border-[#635BFF] hover:bg-indigo-900/10 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#635BFF] rounded-lg flex items-center justify-center text-white text-xl shadow-sm">
                    S
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-white group-hover:text-[#635BFF]">
                      해외 카드 (Stripe)
                    </div>
                    <div className="text-xs text-zinc-500">Visa, Mastercard, Amex 지원</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-[#635BFF]" />
              </button>
            </div>

            <div className="p-4 bg-zinc-950/50 border-t border-zinc-800 text-center">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-sm text-zinc-500 hover:text-white transition-colors"
              >
                취소하기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
