'use client'

import { cn } from '@/lib/utils'

export type StackPreset = 'saas-kit' | 'ecommerce' | 'custom'

interface PresetOption {
  id: StackPreset
  title: string
  description: string
  emoji: string
  features: string[]
}

const presets: PresetOption[] = [
  {
    id: 'saas-kit',
    title: 'SaaS 스타터 킷',
    description: '완전한 SaaS 템플릿 (인증, 결제, 대시보드)',
    emoji: '✨',
    features: ['Next.js 14', 'Clerk 인증', 'Supabase DB', 'Stripe 결제', 'Tailwind CSS'],
  },
  {
    id: 'ecommerce',
    title: '이커머스 템플릿',
    description: '온라인 쇼핑몰 (장바구니, 결제, 주문관리)',
    emoji: '🛒',
    features: ['Next.js 14', 'Clerk 인증', 'Supabase DB', 'Toss 결제', 'Tailwind CSS'],
  },
  {
    id: 'custom',
    title: '커스텀 설정',
    description: '직접 선택한 스택으로 시작',
    emoji: '🔧',
    features: ['선택한 기능으로', '프로젝트를', '시작합니다'],
  },
]

interface StackPresetSelectionProps {
  selected?: StackPreset
  onSelect: (preset: StackPreset) => void
  userSelectedStack?: any
}

export function StackPresetSelection({
  selected,
  onSelect,
}: StackPresetSelectionProps) {
  return (
    <div>
      <div className="text-center mb-10">
        <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-2 block">
          Step 5 of 5
        </span>
        <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">
          시작 템플릿을 선택하세요
        </h1>
        <p className="text-zinc-400">
          프리셋을 선택하면 즉시 프로젝트를 시작할 수 있어요
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {presets.map((preset) => {
          const isRecommended = preset.id === 'saas-kit'

          return (
            <label key={preset.id} className="cursor-pointer group relative">
              {isRecommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg z-10 border border-white/20">
                  ⭐ 추천
                </div>
              )}
              <input
                type="radio"
                name="preset"
                value={preset.id}
                checked={selected === preset.id}
                onChange={() => onSelect(preset.id)}
                className="peer sr-only"
              />
              <div
                className={cn(
                  'h-full bg-zinc-900 border border-zinc-700 rounded-2xl p-6 transition-all hover:-translate-y-1 hover:border-zinc-500',
                  'peer-checked:border-indigo-500 peer-checked:bg-indigo-500/5 peer-checked:shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                )}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 mx-auto bg-zinc-800 rounded-full flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform">
                    {preset.emoji}
                  </div>
                  <h3 className="font-bold text-white mb-2">{preset.title}</h3>
                  <p className="text-xs text-zinc-500 mb-4">{preset.description}</p>

                  <div className="space-y-1 w-full">
                    {preset.features.map((feature, idx) => (
                      <div key={idx} className="text-xs text-zinc-400 flex items-center justify-center gap-1">
                        <span className="text-indigo-400">•</span>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </label>
          )
        })}
      </div>
    </div>
  )
}
