'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Minus, Zap, ChevronDown, ChevronUp } from 'lucide-react'

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  return (
    <main className="flex-1 w-full bg-zinc-950">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-6 text-white">
          아이디어를 <span className="text-indigo-400">현실로</span> 만드는 비용
        </h1>
        <p className="text-zinc-400 max-w-2xl mx-auto mb-10 text-lg">
          커피 3잔 값이면 당신만의 서비스를 완성할 수 있습니다.
          <br className="hidden sm:block" />
          더 이상 외주 개발에 수천만 원을 쓰지 마세요.
        </p>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <span className={`text-sm font-medium ${!isYearly ? 'text-white' : 'text-zinc-400'}`}>
            월 결제
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className="relative inline-block w-12 h-6 align-middle select-none transition duration-200 ease-in"
          >
            <input
              type="checkbox"
              checked={isYearly}
              onChange={() => setIsYearly(!isYearly)}
              className="sr-only"
            />
            <div
              className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${
                isYearly ? 'bg-indigo-600' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`absolute block w-6 h-6 rounded-full bg-white border-4 transition-transform ${
                  isYearly
                    ? 'translate-x-6 border-indigo-600'
                    : 'translate-x-0 border-zinc-600'
                }`}
              ></div>
            </div>
          </button>
          <span className={`text-sm font-medium ${isYearly ? 'text-white' : 'text-zinc-400'}`}>
            연 결제
          </span>
          <span className="bg-indigo-500/10 text-indigo-400 text-xs font-bold px-2 py-0.5 rounded-full border border-indigo-500/20">
            20% SAVE
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {/* Card 1: Hobby */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex flex-col text-left hover:border-zinc-700 transition-colors">
            <h3 className="text-lg font-bold text-white mb-2">Hobby</h3>
            <p className="text-zinc-400 text-sm mb-6">바이브 코딩을 처음 시작하는 분들을 위해</p>

            <div className="mb-8">
              <span className="text-4xl font-bold text-white">₩0</span>
              <span className="text-zinc-500">/ 월</span>
            </div>

            <Link
              href="/sign-up"
              className="block w-full py-3 rounded-xl border border-zinc-700 text-zinc-300 text-center text-sm font-bold hover:bg-zinc-800 hover:text-white transition-colors"
            >
              무료로 시작하기
            </Link>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-sm text-zinc-300">
                <Check className="w-5 h-5 text-zinc-500" />
                <span>기본 튜토리얼 3개</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-300">
                <Check className="w-5 h-5 text-zinc-500" />
                <span>일일 프롬프트 복사 5회</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-300">
                <Check className="w-5 h-5 text-zinc-500" />
                <span>커뮤니티 지원</span>
              </div>
            </div>
          </div>

          {/* Card 2: Pro Creator (Highlight) */}
          <div className="bg-zinc-900 border-2 border-indigo-500 rounded-2xl p-8 flex flex-col text-left relative transform md:-translate-y-4 shadow-2xl shadow-indigo-500/10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              MOST POPULAR
            </div>

            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              Pro Creator
              <Zap className="w-5 h-5 text-indigo-400" />
            </h3>
            <p className="text-zinc-400 text-sm mb-6">실제 서비스를 출시하고 싶은 메이커를 위해</p>

            <div className="mb-8">
              {!isYearly ? (
                <>
                  <span className="text-4xl font-bold text-white">₩16,000</span>
                  <span className="text-zinc-500">/ 월</span>
                </>
              ) : (
                <>
                  <span className="text-4xl font-bold text-white">₩12,800</span>
                  <span className="text-zinc-500">/ 월</span>
                  <div className="text-xs text-indigo-400 mt-1">연간 ₩153,600 결제</div>
                </>
              )}
            </div>

            <Link
              href="/subscribe"
              className="block w-full py-3 rounded-xl bg-indigo-600 text-white text-center text-sm font-bold hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/25"
            >
              지금 업그레이드
            </Link>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-sm text-zinc-300">
                <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
                <span className="font-bold text-white">모든 프리미엄 튜토리얼</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-300">
                <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
                <span>무제한 프롬프트 복사</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-300">
                <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
                <span>AI 에러 진단기 무제한</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-300">
                <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
                <span>비공개 Discord 채널</span>
              </div>
            </div>
          </div>

          {/* Card 3: Team */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex flex-col text-left hover:border-zinc-700 transition-colors">
            <h3 className="text-lg font-bold text-white mb-2">Team</h3>
            <p className="text-zinc-400 text-sm mb-6">작은 스타트업이나 동아리를 위해</p>

            <div className="mb-8">
              <span className="text-4xl font-bold text-white">₩32,000</span>
              <span className="text-zinc-500">/ 1인</span>
            </div>

            <Link
              href="/settings/team"
              className="block w-full py-3 rounded-xl border border-zinc-700 text-zinc-300 text-center text-sm font-bold hover:bg-zinc-800 hover:text-white transition-colors"
            >
              팀 생성하기
            </Link>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-sm text-zinc-300">
                <Check className="w-5 h-5 text-zinc-500" />
                <span>모든 Pro 기능 포함</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-300">
                <Check className="w-5 h-5 text-zinc-500" />
                <span>프로젝트 공유 및 협업</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-300">
                <Check className="w-5 h-5 text-zinc-500" />
                <span>중앙 결제 관리</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 border-t border-zinc-800">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white text-center mb-12">기능 상세 비교</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-zinc-500 border-b border-zinc-800">
                <tr>
                  <th className="py-4 pl-4 w-1/3">기능</th>
                  <th className="py-4 text-center w-1/5">Hobby</th>
                  <th className="py-4 text-center w-1/5 text-indigo-400 font-bold">Pro Creator</th>
                  <th className="py-4 text-center w-1/5">Team</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-300">
                <tr className="hover:bg-zinc-900/50">
                  <td className="py-4 pl-4 font-medium">프로젝트 튜토리얼</td>
                  <td className="text-center text-zinc-500">기본 3개</td>
                  <td className="text-center font-bold text-white">무제한</td>
                  <td className="text-center">무제한</td>
                </tr>
                <tr className="hover:bg-zinc-900/50">
                  <td className="py-4 pl-4 font-medium">코드 스니펫 복사</td>
                  <td className="text-center text-zinc-500">일일 5회</td>
                  <td className="text-center font-bold text-white">무제한</td>
                  <td className="text-center">무제한</td>
                </tr>
                <tr className="hover:bg-zinc-900/50">
                  <td className="py-4 pl-4 font-medium">
                    AI 에러 진단기
                    <span className="ml-1 text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">
                      Beta
                    </span>
                  </td>
                  <td className="text-center text-zinc-500">
                    <Minus className="w-4 h-4 mx-auto" />
                  </td>
                  <td className="text-center text-indigo-400">
                    <Check className="w-4 h-4 mx-auto" />
                  </td>
                  <td className="text-center">
                    <Check className="w-4 h-4 mx-auto" />
                  </td>
                </tr>
                <tr className="hover:bg-zinc-900/50">
                  <td className="py-4 pl-4 font-medium">프로젝트 맵 (로드맵)</td>
                  <td className="text-center text-zinc-500">
                    <Minus className="w-4 h-4 mx-auto" />
                  </td>
                  <td className="text-center text-indigo-400">
                    <Check className="w-4 h-4 mx-auto" />
                  </td>
                  <td className="text-center">
                    <Check className="w-4 h-4 mx-auto" />
                  </td>
                </tr>
                <tr className="hover:bg-zinc-900/50">
                  <td className="py-4 pl-4 font-medium">지원 (Support)</td>
                  <td className="text-center">커뮤니티</td>
                  <td className="text-center">이메일 우선 지원</td>
                  <td className="text-center">전담 매니저</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-zinc-900/30 border-t border-zinc-800">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white text-center mb-10">자주 묻는 질문</h2>

          <div className="space-y-4">
            {/* FAQ Item 1 */}
            <div className="border border-zinc-800 rounded-xl bg-zinc-900 overflow-hidden">
              <button
                onClick={() => toggleFaq(0)}
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
              >
                <span className="font-bold text-zinc-200">결제는 언제 이루어지나요?</span>
                {openFaqIndex === 0 ? (
                  <ChevronUp className="w-5 h-5 text-zinc-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-zinc-500" />
                )}
              </button>
              {openFaqIndex === 0 && (
                <div className="px-6 pb-4 text-sm text-zinc-400">
                  구독을 시작하는 즉시 결제되며, 이후 매월(또는 매년) 동일한 날짜에 자동으로 갱신됩니다.
                  언제든지 설정 페이지에서 해지할 수 있습니다.
                </div>
              )}
            </div>

            {/* FAQ Item 2 */}
            <div className="border border-zinc-800 rounded-xl bg-zinc-900 overflow-hidden">
              <button
                onClick={() => toggleFaq(1)}
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
              >
                <span className="font-bold text-zinc-200">환불이 가능한가요?</span>
                {openFaqIndex === 1 ? (
                  <ChevronUp className="w-5 h-5 text-zinc-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-zinc-500" />
                )}
              </button>
              {openFaqIndex === 1 && (
                <div className="px-6 pb-4 text-sm text-zinc-400">
                  결제 후 7일 이내에 콘텐츠를 이용하지 않은 경우 전액 환불이 가능합니다.
                  support@vibestack.com으로 문의해주세요.
                </div>
              )}
            </div>

            {/* FAQ Item 3 */}
            <div className="border border-zinc-800 rounded-xl bg-zinc-900 overflow-hidden">
              <button
                onClick={() => toggleFaq(2)}
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
              >
                <span className="font-bold text-zinc-200">코딩을 전혀 몰라도 Pro가 필요할까요?</span>
                {openFaqIndex === 2 ? (
                  <ChevronUp className="w-5 h-5 text-zinc-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-zinc-500" />
                )}
              </button>
              {openFaqIndex === 2 && (
                <div className="px-6 pb-4 text-sm text-zinc-400">
                  네, 오히려 코딩을 모를수록 Pro 기능(에러 진단기, 완성형 프로젝트)이 더 유용합니다.
                  시행착오를 줄이고 결과물을 빠르게 만들 수 있습니다.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 text-center px-4">
        <h2 className="text-3xl font-bold text-white mb-4">준비되셨나요?</h2>
        <p className="text-zinc-400 mb-8">지금 바로 첫 번째 프로젝트를 시작하세요.</p>
        <Link
          href="/sign-up"
          className="inline-block bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]"
        >
          무료로 시작하기
        </Link>
      </section>
    </main>
  )
}
