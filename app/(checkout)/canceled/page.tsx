'use client'

import Link from 'next/link'
import { X, Info } from 'lucide-react'

export default function CanceledPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative bg-zinc-950">
      <main className="w-full max-w-md px-4 text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-800">
          <X className="w-10 h-10 text-zinc-500" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">결제가 취소되었습니다</h1>
        <p className="text-zinc-400 mb-8 text-sm">
          요청하신 결제가 진행되지 않았습니다.
          <br />
          계좌나 카드에서 비용이 청구되지 않았으니 안심하세요.
        </p>

        {/* Help Box */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 mb-8 text-left flex gap-3">
          <Info className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
          <div className="text-sm">
            <p className="font-bold text-zinc-200 mb-1">도움이 필요하신가요?</p>
            <p className="text-zinc-500 text-xs leading-relaxed">
              일시적인 네트워크 오류이거나 결제 시간이 초과되었을 수 있습니다. 문제가 지속되면
              고객센터로 문의해주세요.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href="/subscribe"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition-colors"
          >
            다시 시도하기
          </Link>
          <Link
            href="/"
            className="w-full bg-transparent text-zinc-500 font-medium py-3 hover:text-zinc-300 transition-colors text-sm"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </main>
    </div>
  )
}
