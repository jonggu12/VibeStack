'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Check, CreditCard } from 'lucide-react'

export default function SuccessPage() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          router.push('/dashboard')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-zinc-950">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-zinc-950 to-zinc-950 pointer-events-none"></div>

      <main className="relative z-10 w-full max-w-md px-4 text-center">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/20 animate-[popIn_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards] shadow-[0_0_30px_rgba(34,197,94,0.3)]">
          <Check className="w-12 h-12 text-green-500" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">결제가 완료되었습니다!</h1>
        <p className="text-zinc-400 mb-8">
          VibeStack Pro 멤버가 되신 것을 환영합니다.
          <br />
          이제 모든 기능을 제한 없이 사용하실 수 있습니다.
        </p>

        {/* Receipt Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8 text-left shadow-xl">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-zinc-800">
            <span className="text-zinc-400 text-sm">결제 금액</span>
            <span className="text-xl font-bold text-white">₩16,000</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">주문 번호</span>
              <span className="text-zinc-300 font-mono">ORD-2024-8823</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">구독 상품</span>
              <span className="text-zinc-300">Pro Creator (월간)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">결제 수단</span>
              <span className="text-zinc-300 flex items-center gap-1">
                <CreditCard className="w-3 h-3" /> Toss Payments
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Link
            href="/dashboard"
            className="block w-full bg-white text-black font-bold py-3.5 rounded-xl hover:bg-zinc-200 transition-colors shadow-lg shadow-white/10"
          >
            대시보드로 이동하기
          </Link>
          <p className="text-xs text-zinc-500">
            <span>{countdown}</span>초 후 자동으로 이동합니다...
          </p>
        </div>
      </main>

      <style jsx>{`
        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  )
}
