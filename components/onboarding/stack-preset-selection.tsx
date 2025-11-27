'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Sparkles, ShoppingCart, Wrench } from 'lucide-react'

export type StackPreset = 'saas-kit' | 'ecommerce' | 'custom'

interface PresetOption {
  id: StackPreset
  title: string
  description: string
  icon: React.ReactNode
  stack: {
    framework: string
    auth: string
    database: string
    hosting: string
    styling: string
    payments: string
  }
  recommended?: boolean
}

const presets: PresetOption[] = [
  {
    id: 'saas-kit',
    title: 'SaaS 스타터 킷',
    description: '완전한 SaaS 템플릿 (인증, 결제, 대시보드)',
    icon: <Sparkles className="h-10 w-10" />,
    stack: {
      framework: 'Next.js 14',
      auth: 'Clerk',
      database: 'Supabase',
      hosting: 'Vercel',
      styling: 'Tailwind + Shadcn',
      payments: 'Stripe',
    },
    recommended: true,
  },
  {
    id: 'ecommerce',
    title: '이커머스 템플릿',
    description: '온라인 쇼핑몰 (장바구니, 결제, 주문관리)',
    icon: <ShoppingCart className="h-10 w-10" />,
    stack: {
      framework: 'Next.js 14',
      auth: 'Clerk',
      database: 'Supabase',
      hosting: 'Vercel',
      styling: 'Tailwind + Shadcn',
      payments: 'Toss Payments',
    },
  },
  {
    id: 'custom',
    title: '커스텀 설정',
    description: '직접 선택한 스택으로 시작',
    icon: <Wrench className="h-10 w-10" />,
    stack: {
      framework: '선택한 프레임워크',
      auth: '선택한 인증',
      database: '선택한 DB',
      hosting: '선택한 호스팅',
      styling: '선택한 스타일링',
      payments: '선택한 결제',
    },
  },
]

interface StackPresetSelectionProps {
  selected?: StackPreset
  onSelect: (preset: StackPreset) => void
  userSelectedStack?: {
    framework?: string
    auth?: string
    database?: string
    hosting?: string
    styling?: string
    payments?: string
  }
}

export function StackPresetSelection({
  selected,
  onSelect,
  userSelectedStack,
}: StackPresetSelectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">시작 템플릿을 선택하세요</h2>
        <p className="text-muted-foreground">
          프리셋을 선택하면 즉시 프로젝트를 시작할 수 있어요
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {presets.map((preset) => {
          const isSelected = selected === preset.id
          const isCustom = preset.id === 'custom'

          // For custom preset, use user-selected stack
          const displayStack = isCustom && userSelectedStack
            ? userSelectedStack
            : preset.stack

          return (
            <Card
              key={preset.id}
              className={cn(
                'relative cursor-pointer transition-all p-6 hover:shadow-lg',
                isSelected
                  ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50'
                  : 'hover:border-blue-300'
              )}
              onClick={() => onSelect(preset.id)}
            >
              {/* Recommended badge */}
              {preset.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1">
                    ⭐ 추천
                  </Badge>
                </div>
              )}

              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              <div className="space-y-4">
                {/* Icon and title */}
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={cn(
                    'text-blue-500',
                    isSelected && 'text-blue-600'
                  )}>
                    {preset.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{preset.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {preset.description}
                    </p>
                  </div>
                </div>

                {/* Stack details */}
                <div className="space-y-2 pt-4 border-t">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase">
                    포함된 스택
                  </h4>
                  <div className="space-y-1.5">
                    {Object.entries(displayStack).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-xs">
                        <span className="text-muted-foreground capitalize">
                          {key === 'framework' && '프레임워크'}
                          {key === 'auth' && '인증'}
                          {key === 'database' && 'DB'}
                          {key === 'hosting' && '호스팅'}
                          {key === 'styling' && '스타일'}
                          {key === 'payments' && '결제'}
                        </span>
                        <span className="font-medium text-foreground">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        💡 프리셋을 선택해도 나중에 개별 스택을 변경할 수 있어요
      </div>
    </div>
  )
}
