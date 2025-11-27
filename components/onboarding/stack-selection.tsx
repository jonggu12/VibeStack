'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

export interface StackPreferences {
  framework?: string
  auth?: string
  database?: string
  hosting?: string
  styling?: string
  payments?: string
}

interface StackOption {
  id: string
  name: string
  description: string
  popular?: boolean
}

const stackOptions: Record<keyof StackPreferences, StackOption[]> = {
  framework: [
    { id: 'nextjs', name: 'Next.js 14', description: 'React + App Router', popular: true },
    { id: 'react', name: 'React', description: 'Client-side SPA', popular: true },
    { id: 'vue', name: 'Vue.js', description: 'Progressive framework' },
    { id: 'svelte', name: 'Svelte', description: 'No virtual DOM' },
  ],
  auth: [
    { id: 'clerk', name: 'Clerk', description: '완전 관리형 인증', popular: true },
    { id: 'nextauth', name: 'NextAuth', description: 'OAuth + 커스텀' },
    { id: 'supabase', name: 'Supabase Auth', description: 'DB 통합 인증' },
    { id: 'firebase', name: 'Firebase Auth', description: 'Google 인증' },
  ],
  database: [
    { id: 'supabase', name: 'Supabase', description: 'PostgreSQL + 실시간', popular: true },
    { id: 'planetscale', name: 'PlanetScale', description: 'Serverless MySQL' },
    { id: 'mongodb', name: 'MongoDB', description: 'NoSQL 문서 DB' },
    { id: 'firebase', name: 'Firestore', description: 'Firebase NoSQL' },
  ],
  hosting: [
    { id: 'vercel', name: 'Vercel', description: 'Next.js 최적화', popular: true },
    { id: 'netlify', name: 'Netlify', description: 'JAMstack 호스팅' },
    { id: 'aws', name: 'AWS', description: 'EC2 + Lambda' },
    { id: 'railway', name: 'Railway', description: '간편한 배포' },
  ],
  styling: [
    { id: 'tailwind', name: 'Tailwind CSS', description: 'Utility-first CSS', popular: true },
    { id: 'shadcn', name: 'Shadcn/ui', description: 'Tailwind 컴포넌트', popular: true },
    { id: 'mui', name: 'Material UI', description: 'Google 디자인' },
    { id: 'chakra', name: 'Chakra UI', description: '접근성 우선' },
  ],
  payments: [
    { id: 'stripe', name: 'Stripe', description: '글로벌 결제', popular: true },
    { id: 'toss', name: 'Toss Payments', description: '한국 결제', popular: true },
    { id: 'paypal', name: 'PayPal', description: '페이팔 결제' },
    { id: 'none', name: '없음', description: '나중에 추가' },
  ],
}

const categoryLabels: Record<keyof StackPreferences, string> = {
  framework: '프레임워크',
  auth: '인증',
  database: '데이터베이스',
  hosting: '호스팅',
  styling: '스타일링',
  payments: '결제',
}

interface StackSelectionProps {
  selected: StackPreferences
  onSelect: (category: keyof StackPreferences, value: string) => void
}

export function StackSelection({ selected, onSelect }: StackSelectionProps) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">스택을 선택해주세요</h2>
        <p className="text-muted-foreground">
          자주 사용하는 기술 스택을 선택하면 맞춤 콘텐츠를 추천해드려요
        </p>
      </div>

      <div className="space-y-6">
        {(Object.keys(stackOptions) as Array<keyof StackPreferences>).map((category) => (
          <div key={category} className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{categoryLabels[category]}</h3>
              {selected[category] && (
                <Badge variant="secondary" className="text-xs">
                  선택됨
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {stackOptions[category].map((option) => {
                const isSelected = selected[category] === option.id

                return (
                  <Card
                    key={option.id}
                    className={cn(
                      'relative cursor-pointer transition-all p-4 hover:shadow-md',
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'hover:border-blue-300'
                    )}
                    onClick={() => onSelect(category, option.id)}
                  >
                    {/* Popular badge */}
                    {option.popular && !isSelected && (
                      <div className="absolute -top-2 -right-2">
                        <Badge variant="default" className="text-xs px-2 py-0.5">
                          인기
                        </Badge>
                      </div>
                    )}

                    {/* Selection checkmark */}
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}

                    <div className="space-y-1">
                      <h4 className={cn(
                        'font-semibold text-sm',
                        isSelected && 'text-blue-700'
                      )}>
                        {option.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        💡 나중에 설정에서 언제든지 변경할 수 있어요
      </div>
    </div>
  )
}
