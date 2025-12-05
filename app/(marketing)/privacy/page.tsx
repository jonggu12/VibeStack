import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - 개인정보처리방침 | VibeStack',
  description: 'VibeStack 개인정보처리방침',
}

export default function PrivacyPage() {
  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Nav */}
          <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-24 h-fit">
            <nav className="space-y-1">
              <Link
                href="/terms"
                className="block px-4 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
              >
                이용약관
              </Link>
              <Link
                href="/privacy"
                className="block px-4 py-2 rounded-lg bg-zinc-900 text-white font-bold border-l-2 border-indigo-500 transition-colors"
              >
                개인정보처리방침
              </Link>
              <a
                href="#"
                className="block px-4 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
              >
                환불 정책
              </a>
            </nav>

            <div className="mt-8 p-4 bg-zinc-900 rounded-xl border border-zinc-800">
              <p className="text-xs text-zinc-400 mb-2">개인정보 책임자</p>
              <p className="text-sm font-bold text-white">
                privacy@vibestack.com
              </p>
            </div>
          </aside>

          {/* Content */}
          <article className="flex-1 max-w-3xl space-y-8">
            <div className="border-b border-zinc-800 pb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                개인정보처리방침
              </h1>
              <p className="text-zinc-400">최종 수정일: 2024년 11월 28일</p>
            </div>

            <div className="space-y-6 text-zinc-300 leading-relaxed">
              <section>
                <h2 className="text-xl font-bold text-white mb-3">
                  1. 수집하는 개인정보 항목
                </h2>
                <p className="mb-2">
                  회사는 서비스 제공을 위해 최소한의 개인정보를 수집합니다.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-zinc-400">
                  <li>
                    <strong>필수항목:</strong> 이메일 주소, 이름(닉네임), 프로필
                    사진 (소셜 로그인 시)
                  </li>
                  <li>
                    <strong>결제정보:</strong> 신용카드 정보 등은 결제
                    대행사(PG)가 직접 처리하며 회사는 저장하지 않습니다.
                  </li>
                  <li>
                    <strong>자동수집:</strong> 쿠키, 접속 로그, 접속 IP 정보
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-3">
                  2. 개인정보의 이용 목적
                </h2>
                <ul className="list-disc pl-5 space-y-1 text-zinc-400">
                  <li>회원 관리 및 본인 확인</li>
                  <li>서비스 제공 및 요금 결제</li>
                  <li>서비스 개선 및 신규 서비스 개발</li>
                  <li>부정 이용 방지 및 비인가 사용 방지</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-3">
                  3. 개인정보의 제3자 제공
                </h2>
                <p className="mb-2">
                  원칙적으로 이용자의 동의 없이 개인정보를 외부에 제공하지
                  않습니다. 단, 서비스 제공을 위해 필수적인 경우 아래와 같이
                  제공합니다.
                </p>
                <div className="overflow-x-auto bg-zinc-900 border border-zinc-800 rounded-lg mt-4">
                  <table className="w-full text-sm text-left">
                    <thead className="border-b border-zinc-800 text-zinc-500">
                      <tr>
                        <th className="px-4 py-3">제공받는 자</th>
                        <th className="px-4 py-3">제공 목적</th>
                        <th className="px-4 py-3">제공 항목</th>
                      </tr>
                    </thead>
                    <tbody className="text-zinc-300">
                      <tr className="border-b border-zinc-800">
                        <td className="px-4 py-3">Clerk Inc.</td>
                        <td className="px-4 py-3">회원가입 및 인증 관리</td>
                        <td className="px-4 py-3">이메일, 이름</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">Stripe / Toss Payments</td>
                        <td className="px-4 py-3">유료 서비스 결제</td>
                        <td className="px-4 py-3">결제 정보</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-3">
                  4. 개인정보의 파기
                </h2>
                <p>
                  회원은 언제든지 자신의 개인정보를 조회하거나 수정할 수 있으며,
                  회원 탈퇴를 요청할 수 있습니다. 탈퇴 시 수집된 개인정보는 즉시
                  파기되거나, 법령에 따라 일정 기간 보관 후 파기됩니다.
                </p>
              </section>
            </div>
          </article>
        </div>
    </main>
  )
}
