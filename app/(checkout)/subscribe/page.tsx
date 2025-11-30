'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import {
  Lock,
  Check,
  ArrowRight,
  CreditCard,
  Loader2,
} from 'lucide-react'

type PaymentGateway = 'toss' | 'stripe'
type BillingCycle = 'monthly' | 'yearly'

const pricing = {
  toss: {
    symbol: '₩',
    monthly: 16000,
    yearly: 153600,
    subtotalRate: 1 / 1.1, // VAT calculation
  },
  stripe: {
    symbol: '$',
    monthly: 12.0,
    yearly: 115.0,
    subtotalRate: 1,
  },
}

export default function SubscribePage() {
  const { user } = useUser()
  const [gateway, setGateway] = useState<PaymentGateway>('toss')
  const [cycle, setCycle] = useState<BillingCycle>('monthly')
  const [isLoading, setIsLoading] = useState(false)

  const currentPricing = pricing[gateway]
  const amount = cycle === 'monthly' ? currentPricing.monthly : currentPricing.yearly
  const vat = gateway === 'toss' ? Math.round(amount - amount * currentPricing.subtotalRate) : 0
  const subtotal = amount - vat

  const formatPrice = (num: number) => {
    if (gateway === 'toss') return num.toLocaleString()
    return num.toFixed(2)
  }

  const handlePayment = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      if (gateway === 'toss') {
        // Toss Payments
        const res = await fetch('/api/toss/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            plan: 'pro',
          }),
        })

        if (!res.ok) throw new Error('Checkout failed')

        const data = await res.json()
        window.location.href = data.checkoutUrl
      } else {
        // Stripe
        const res = await fetch('/api/stripe/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            plan: 'pro',
            currency: 'USD',
            country: 'US',
          }),
        })

        if (!res.ok) throw new Error('Checkout failed')

        const data = await res.json()
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('결제 처리 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800 h-16 bg-zinc-950">
        <div className="max-w-5xl mx-auto px-4 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-bold text-lg">
              V
            </div>
            <span className="font-bold text-lg tracking-tight text-white">VibeStack</span>
          </Link>
          <div className="flex items-center gap-2 text-zinc-500 text-sm">
            <Lock className="w-4 h-4 text-green-500" />
            <span className="hidden sm:inline">256-bit SSL Secure Payment</span>
            <span className="sm:hidden">보안 결제</span>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {/* LEFT COLUMN: Payment Selection */}
          <div className="lg:col-span-2 space-y-8">
            {/* Step 1: User Info */}
            <section>
              <h2 className="text-lg font-bold text-white mb-4">1. 구독 계정</h2>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border border-zinc-700"></div>
                <div>
                  <p className="text-sm font-bold text-white">
                    {user?.fullName || user?.firstName || '사용자'}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {user?.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
                <span className="ml-auto text-xs text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">
                  로그인됨
                </span>
              </div>
            </section>

            {/* Step 2: Payment Method */}
            <section>
              <h2 className="text-lg font-bold text-white mb-4">2. 결제 수단 선택</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Toss Payments Option */}
                <button
                  onClick={() => setGateway('toss')}
                  className={`bg-zinc-900 border rounded-xl p-5 cursor-pointer relative group hover:border-[#3282F6] transition-all ${
                    gateway === 'toss'
                      ? 'border-[#3282F6] border-2 bg-[#3282F6]/5'
                      : 'border-zinc-800'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-bold text-[#3282F6] italic text-xl">toss</span>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                        gateway === 'toss'
                          ? 'bg-[#3282F6] text-white'
                          : 'border border-zinc-600 text-transparent'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                    </div>
                  </div>
                  <p className="font-bold text-white mb-1 text-left">한국 카드 / 간편결제</p>
                  <p className="text-xs text-zinc-500 text-left">신용카드, 카카오페이, 토스페이</p>
                </button>

                {/* Stripe Option */}
                <button
                  onClick={() => setGateway('stripe')}
                  className={`bg-zinc-900 border rounded-xl p-5 cursor-pointer relative group hover:border-[#635BFF] transition-all ${
                    gateway === 'stripe'
                      ? 'border-[#635BFF] border-2 bg-[#635BFF]/5'
                      : 'border-zinc-800'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-bold text-[#635BFF] text-xl">
                      <CreditCard className="w-6 h-6" />
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                        gateway === 'stripe'
                          ? 'bg-[#635BFF] text-white'
                          : 'border border-zinc-600 text-transparent'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                    </div>
                  </div>
                  <p className="font-bold text-white mb-1 text-left">해외 결제 (USD)</p>
                  <p className="text-xs text-zinc-500 text-left">Visa, Mastercard, Amex</p>
                </button>
              </div>

              <div className="mt-4 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800 text-xs text-zinc-400 flex items-start gap-2">
                <div className="w-4 h-4 rounded-full border border-zinc-600 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-zinc-500 rounded-full"></div>
                </div>
                <p>
                  해외 거주자의 경우 Stripe를 선택하시면 달러(USD)로 결제됩니다.
                  <br />
                  국내 카드는 Toss Payments를 이용하시면 수수료 없이 원화(KRW)로 결제됩니다.
                </p>
              </div>
            </section>

            {/* Step 3: Billing Cycle */}
            <section>
              <h2 className="text-lg font-bold text-white mb-4">3. 결제 주기</h2>
              <div className="flex flex-col gap-3">
                <label
                  className={`flex items-center justify-between p-4 bg-zinc-900 border rounded-xl cursor-pointer transition-all ${
                    cycle === 'monthly'
                      ? 'border-indigo-500/50 bg-indigo-500/5'
                      : 'border-zinc-800 hover:border-zinc-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="billing"
                      checked={cycle === 'monthly'}
                      onChange={() => setCycle('monthly')}
                      className="w-4 h-4 text-indigo-600 bg-zinc-800 border-zinc-600 focus:ring-indigo-500 focus:ring-offset-zinc-900"
                    />
                    <div>
                      <span className="block text-sm font-bold text-white">월간 결제 (Monthly)</span>
                      <span className="block text-xs text-zinc-400">매달 자동 갱신됩니다.</span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-white">
                    {currentPricing.symbol}
                    {formatPrice(currentPricing.monthly)}
                  </span>
                </label>

                <label
                  className={`flex items-center justify-between p-4 bg-zinc-900 border rounded-xl cursor-pointer transition-all ${
                    cycle === 'yearly'
                      ? 'border-indigo-500/50 bg-indigo-500/5'
                      : 'border-zinc-800 hover:border-zinc-600 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="billing"
                      checked={cycle === 'yearly'}
                      onChange={() => setCycle('yearly')}
                      className="w-4 h-4 text-indigo-600 bg-zinc-800 border-zinc-600 focus:ring-indigo-500 focus:ring-offset-zinc-900"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="block text-sm font-bold text-zinc-300">
                          연간 결제 (Yearly)
                        </span>
                        <span className="bg-indigo-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                          SAVE 20%
                        </span>
                      </div>
                      <span className="block text-xs text-zinc-500">1년에 한 번 결제됩니다.</span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-zinc-300">
                    {currentPricing.symbol}
                    {formatPrice(currentPricing.yearly)}
                  </span>
                </label>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Summary Card */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
                <h3 className="text-lg font-bold text-white mb-6">주문 요약</h3>

                {/* Item */}
                <div className="flex justify-between items-start mb-6 pb-6 border-b border-zinc-800">
                  <div>
                    <p className="text-sm font-bold text-white">VibeStack Pro</p>
                    <p className="text-xs text-zinc-500 mt-1">
                      {cycle === 'monthly' ? '월간 구독' : '연간 구독'}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-white">
                    {currentPricing.symbol}
                    {formatPrice(amount)}
                  </p>
                </div>

                {/* Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>소계 (Subtotal)</span>
                    <span>
                      {currentPricing.symbol}
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  {gateway === 'toss' && (
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span>부가세 (VAT 10%)</span>
                      <span>
                        {currentPricing.symbol}
                        {formatPrice(vat)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between items-end mb-8">
                  <span className="text-sm font-bold text-zinc-300">총 결제 금액</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-white">
                      {currentPricing.symbol}
                      {formatPrice(amount)}
                    </span>
                    <p className="text-[10px] text-zinc-500 mt-1">
                      {cycle === 'monthly' ? '매월 자동 결제' : '매년 자동 결제'}
                    </p>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={handlePayment}
                  disabled={isLoading}
                  className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>처리 중...</span>
                    </>
                  ) : (
                    <>
                      <span>결제하기</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <p className="text-[10px] text-zinc-500 text-center mt-4">
                  구독 해지는 언제든지 가능합니다. <br />
                  결제 시{' '}
                  <Link href="/terms" className="underline hover:text-zinc-300">
                    이용약관
                  </Link>
                  에 동의하는 것으로 간주합니다.
                </p>
              </div>

              {/* Trust Badges */}
              <div className="flex justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
                <CreditCard className="w-8 h-8 text-white" />
                <CreditCard className="w-8 h-8 text-white" />
                <CreditCard className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
