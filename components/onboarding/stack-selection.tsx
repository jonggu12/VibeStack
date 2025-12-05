'use client'

import { cn } from '@/lib/utils'
import { Check, Lock, Database, CreditCard, Sparkles, Upload, Zap, Mail, Globe, LucideIcon } from 'lucide-react'

export interface StackPreferences {
  auth?: boolean
  database?: boolean
  payments?: boolean
  ai_api?: boolean
  file_upload?: boolean
  realtime?: boolean
  email?: boolean
  external_api?: boolean
  [key: string]: boolean | undefined
}

interface FeatureOption {
  id: keyof StackPreferences
  icon: LucideIcon
  title: string
  description: string
  defaultChecked: boolean
  badge?: string
}

const features: FeatureOption[] = [
  {
    id: 'auth',
    icon: Lock,
    title: '회원가입 / 로그인',
    description: 'Google 로그인, 이메일 인증 (Clerk)',
    defaultChecked: true,
  },
  {
    id: 'database',
    icon: Database,
    title: '데이터 저장소 (DB)',
    description: '게시글, 사용자 정보 저장 (Supabase)',
    defaultChecked: true,
  },
  {
    id: 'payments',
    icon: CreditCard,
    title: '결제 / 구독 기능',
    description: '구독, 일회성 결제 시스템 (Stripe)',
    defaultChecked: false,
  },
  {
    id: 'ai_api',
    icon: Sparkles,
    title: 'AI API 연동',
    description: 'ChatGPT, Claude, DALL-E 등',
    defaultChecked: false,
  },
  {
    id: 'file_upload',
    icon: Upload,
    title: '파일 업로드',
    description: '이미지, 문서 업로드 (Uploadthing)',
    defaultChecked: false,
  },
  {
    id: 'realtime',
    icon: Zap,
    title: '실시간 기능',
    description: '실시간 업데이트, 채팅 (Supabase Realtime)',
    defaultChecked: false,
  },
  {
    id: 'email',
    icon: Mail,
    title: '이메일 전송',
    description: '알림, 뉴스레터 전송 (Resend)',
    defaultChecked: false,
  },
  {
    id: 'external_api',
    icon: Globe,
    title: '외부 API 연동',
    description: '주가, 날씨, 소셜 미디어 API',
    defaultChecked: false,
  },
]

interface StackSelectionProps {
  selected: StackPreferences
  onToggle: (feature: keyof StackPreferences) => void
}

export function StackSelection({ selected, onToggle }: StackSelectionProps) {
  // 선택된 기능을 상단으로 정렬
  const sortedFeatures = [...features].sort((a, b) => {
    const aChecked = selected[a.id] ?? a.defaultChecked
    const bChecked = selected[b.id] ?? b.defaultChecked

    // 선택된 것이 위로
    if (aChecked && !bChecked) return -1
    if (!aChecked && bChecked) return 1
    return 0
  })

  return (
    <div>
      <div className="text-center mb-10">
        <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-2 block">
          Step 3 of 4
        </span>
        <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">
          어떤 기능이 필요한가요?
        </h1>
        <p className="text-zinc-400">
          필요한 기능을 선택하면 관련된 라이브러리를 자동으로 세팅해줍니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sortedFeatures.map((feature) => {
          const isChecked = selected[feature.id] ?? feature.defaultChecked
          const Icon = feature.icon

          return (
            <label key={feature.id} className="relative block cursor-pointer group">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggle(feature.id)}
                className="peer sr-only"
              />
              <div className="bg-zinc-900 border border-zinc-700 peer-checked:border-indigo-500 peer-checked:bg-indigo-500/10 p-4 rounded-xl flex items-center justify-between transition-all group-hover:border-zinc-500">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-zinc-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white text-sm">{feature.title}</h4>
                    <p className="text-[11px] text-zinc-500 truncate">{feature.description}</p>
                  </div>
                </div>
                <div
                  className={cn(
                    'w-6 h-6 rounded-full border flex items-center justify-center transition-all shrink-0 ml-2',
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
