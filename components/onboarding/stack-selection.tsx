'use client'

import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

export interface StackPreferences {
  auth?: boolean
  database?: boolean
  payments?: boolean
  [key: string]: boolean | undefined
}

interface FeatureOption {
  id: keyof StackPreferences
  emoji: string
  title: string
  description: string
  defaultChecked: boolean
}

const features: FeatureOption[] = [
  {
    id: 'auth',
    emoji: '🔐',
    title: '회원가입 / 로그인',
    description: 'Google 로그인, 이메일 인증 (Clerk)',
    defaultChecked: true,
  },
  {
    id: 'database',
    emoji: '💾',
    title: '데이터 저장소 (DB)',
    description: '게시글, 사용자 정보 저장 (Supabase)',
    defaultChecked: true,
  },
  {
    id: 'payments',
    emoji: '💳',
    title: '결제 기능',
    description: '구독, 일회성 결제 시스템 (Stripe)',
    defaultChecked: false,
  },
]

interface StackSelectionProps {
  selected: StackPreferences
  onToggle: (feature: keyof StackPreferences) => void
}

export function StackSelection({ selected, onToggle }: StackSelectionProps) {
  return (
    <div>
      <div className="text-center mb-10">
        <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-2 block">
          Step 3 of 5
        </span>
        <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">
          어떤 기능이 필요한가요?
        </h1>
        <p className="text-zinc-400">
          필요한 기능을 선택하면 관련된 라이브러리를 자동으로 세팅해줍니다.
        </p>
      </div>

      <div className="space-y-3">
        {features.map((feature) => {
          const isChecked = selected[feature.id] ?? feature.defaultChecked

          return (
            <label key={feature.id} className="relative block cursor-pointer group">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggle(feature.id)}
                className="peer sr-only"
              />
              <div className="bg-zinc-900 border border-zinc-700 peer-checked:border-indigo-500 peer-checked:bg-indigo-500/10 p-5 rounded-xl flex items-center justify-between transition-all group-hover:border-zinc-500">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center text-xl">
                    {feature.emoji}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{feature.title}</h4>
                    <p className="text-xs text-zinc-500">{feature.description}</p>
                  </div>
                </div>
                <div
                  className={cn(
                    'w-6 h-6 rounded-full border flex items-center justify-center transition-all',
                    isChecked
                      ? 'bg-indigo-500 border-indigo-500 scale-100 opacity-100'
                      : 'border-zinc-600 scale-50 opacity-0'
                  )}
                >
                  <Check className="w-4 h-4 text-white" />
                </div>
              </div>
            </label>
          )
        })}
      </div>
    </div>
  )
}
