'use client'

import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

export type PainPoint = 'auth' | 'database' | 'payments' | 'deployment' | 'errors' | 'ai_prompting'

interface PainPointOption {
  id: PainPoint
  emoji: string
  title: string
  description: string
  keywords: string[]
}

const painPoints: PainPointOption[] = [
  {
    id: 'auth',
    emoji: '🔐',
    title: '로그인/회원가입 구현',
    description: 'OAuth, JWT, Session 관리',
    keywords: ['Clerk', 'NextAuth', 'Google 로그인'],
  },
  {
    id: 'database',
    emoji: '💾',
    title: 'DB 설계 및 연결',
    description: 'Schema 설계, Query 작성',
    keywords: ['Supabase', 'PostgreSQL', 'Prisma'],
  },
  {
    id: 'payments',
    emoji: '💳',
    title: '결제 시스템 연동',
    description: 'Stripe, Webhook, 정기구독',
    keywords: ['Checkout', '환불', '웹훅'],
  },
  {
    id: 'deployment',
    emoji: '🚀',
    title: '배포 및 운영',
    description: 'Vercel, 환경변수, CI/CD',
    keywords: ['빌드 에러', '환경 설정', '도메인'],
  },
  {
    id: 'errors',
    emoji: '🐛',
    title: '에러 디버깅',
    description: 'Module not found, Hydration, 404',
    keywords: ['에러 해결', '디버깅', '트러블슈팅'],
  },
  {
    id: 'ai_prompting',
    emoji: '🤖',
    title: 'AI에게 정확히 질문하기',
    description: '프롬프트 공식, Cursor 사용법',
    keywords: ['프롬프트', 'AI 코딩', 'Cursor'],
  },
]

interface PainPointSelectionProps {
  selected: PainPoint[]
  onToggle: (painPoint: PainPoint) => void
}

export function PainPointSelection({ selected, onToggle }: PainPointSelectionProps) {
  return (
    <div>
      <div className="text-center mb-10">
        <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-2 block">
          Step 4 of 5
        </span>
        <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">
          가장 막히는 부분은 무엇인가요?
        </h1>
        <p className="text-zinc-400">
          여러 개 선택 가능해요 · 관련 콘텐츠를 우선 추천해드릴게요
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {painPoints.map((painPoint) => {
          const isChecked = selected.includes(painPoint.id)

          return (
            <label key={painPoint.id} className="relative block cursor-pointer group">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggle(painPoint.id)}
                className="peer sr-only"
              />
              <div className="bg-zinc-900 border border-zinc-700 peer-checked:border-indigo-500 peer-checked:bg-indigo-500/10 p-5 rounded-xl flex items-center justify-between transition-all group-hover:border-zinc-500 peer-checked:shadow-[0_0_15px_rgba(99,102,241,0.15)]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center text-2xl shrink-0">
                    {painPoint.emoji}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white mb-0.5">{painPoint.title}</h4>
                    <p className="text-xs text-zinc-500">{painPoint.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {painPoint.keywords.slice(0, 3).map((keyword, idx) => (
                        <span key={idx} className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div
                  className={cn(
                    'w-6 h-6 rounded-full border flex items-center justify-center transition-all shrink-0',
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

      <p className="text-center text-xs text-zinc-500 mt-6">
        💡 선택한 주제의 콘텐츠가 대시보드 상단에 우선 표시됩니다
      </p>
    </div>
  )
}
