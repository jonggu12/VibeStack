import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - 이용약관 | VibeStack',
  description: 'VibeStack 서비스 이용약관',
}

export default function TermsPage() {
  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Nav */}
          <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-24 h-fit">
            <nav className="space-y-1">
              <Link
                href="/terms"
                className="block px-4 py-2 rounded-lg bg-zinc-900 text-white font-bold border-l-2 border-indigo-500 transition-colors"
              >
                이용약관
              </Link>
              <Link
                href="/privacy"
                className="block px-4 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
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
              <p className="text-xs text-zinc-400 mb-2">문의사항이 있으신가요?</p>
              <a
                href="mailto:support@vibestack.com"
                className="text-sm font-bold text-indigo-400 hover:underline"
              >
                support@vibestack.com
              </a>
            </div>
          </aside>

          {/* Content */}
          <article className="flex-1 max-w-3xl space-y-8">
            <div className="border-b border-zinc-800 pb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                이용약관
              </h1>
              <p className="text-zinc-400">최종 수정일: 2024년 11월 28일</p>
            </div>

            <div className="space-y-6 text-zinc-300 leading-relaxed">
              <section>
                <h2 className="text-xl font-bold text-white mb-3">1. 목적</h2>
                <p>
                  본 약관은 VibeStack(이하 &quot;회사&quot;)이 제공하는 제반
                  서비스의 이용과 관련하여 회사와 회원 간의 권리, 의무 및
                  책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-3">
                  2. 계정 및 멤버십
                </h2>
                <p className="mb-2">
                  서비스를 이용하기 위해 귀하는 정확하고 완전한 정보를 제공하여
                  계정을 생성해야 합니다. 계정 보안 유지의 책임은 전적으로
                  귀하에게 있습니다.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-zinc-400">
                  <li>만 14세 이상만 가입 가능합니다.</li>
                  <li>타인의 정보를 도용해서는 안 됩니다.</li>
                  <li>계정 공유는 엄격히 금지됩니다. (Team 플랜 제외)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-3">
                  3. 결제 및 구독
                </h2>
                <p className="mb-2">
                  VibeStack은 유료 구독 서비스(Pro Plan)를 제공합니다.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-zinc-400">
                  <li>
                    결제는 Stripe 또는 Toss Payments를 통해 안전하게
                    처리됩니다.
                  </li>
                  <li>구독은 매월/매년 자동으로 갱신됩니다.</li>
                  <li>가격 정책은 사전 고지 후 변경될 수 있습니다.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-3">
                  4. 환불 및 취소
                </h2>
                <div className="bg-zinc-900 border-l-4 border-indigo-500 p-4 my-2">
                  <p className="font-bold text-white mb-1">7일 환불 보장</p>
                  <p className="text-sm text-zinc-400">
                    결제 후 7일 이내에 콘텐츠를 이용하지 않은 경우, 조건 없이
                    전액 환불해 드립니다.
                  </p>
                </div>
                <p>
                  구독 취소는 &apos;설정 &gt; 결제 관리&apos; 페이지에서
                  언제든지 가능하며, 취소 시 다음 결제일부터 청구되지 않습니다.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white mb-3">
                  5. 지적재산권
                </h2>
                <p>
                  VibeStack이 제공하는 모든 콘텐츠(문서, 코드 스니펫,
                  튜토리얼)의 저작권은 회사에 있습니다. 귀하는 이를 학습 및 개인
                  프로젝트 목적으로만 사용할 수 있으며, 무단 재배포 및 판매는
                  금지됩니다.
                </p>
              </section>
            </div>
          </article>
        </div>
    </main>
  )
}
