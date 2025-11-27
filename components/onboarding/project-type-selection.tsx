'use client'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Globe, Smartphone, Server } from 'lucide-react'

export type ProjectType = 'web' | 'app' | 'backend'

interface ProjectTypeOption {
  id: ProjectType
  title: string
  description: string
  icon: React.ReactNode
  examples: string[]
}

const projectTypes: ProjectTypeOption[] = [
  {
    id: 'web',
    title: '웹 앱',
    description: 'SaaS, 관리자 대시보드, 포트폴리오 등',
    icon: <Globe className="h-12 w-12" />,
    examples: ['Next.js', 'React', 'Vue.js'],
  },
  {
    id: 'app',
    title: '모바일 앱',
    description: '크로스 플랫폼 모바일 애플리케이션',
    icon: <Smartphone className="h-12 w-12" />,
    examples: ['React Native', 'Flutter', 'Expo'],
  },
  {
    id: 'backend',
    title: '백엔드 API',
    description: 'REST API, GraphQL, 마이크로서비스',
    icon: <Server className="h-12 w-12" />,
    examples: ['Node.js', 'Python', 'Go'],
  },
]

interface ProjectTypeSelectionProps {
  selected?: ProjectType
  onSelect: (type: ProjectType) => void
}

export function ProjectTypeSelection({ selected, onSelect }: ProjectTypeSelectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">어떤 프로젝트를 만드시나요?</h2>
        <p className="text-muted-foreground">
          프로젝트 유형을 선택하면 맞춤 튜토리얼을 추천해드려요
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projectTypes.map((type) => (
          <Card
            key={type.id}
            className={cn(
              'relative cursor-pointer transition-all p-6 hover:shadow-lg hover:scale-105',
              selected === type.id
                ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50'
                : 'hover:border-blue-300'
            )}
            onClick={() => onSelect(type.id)}
          >
            {/* Selection indicator */}
            {selected === type.id && (
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

            <div className="flex flex-col items-center text-center space-y-4">
              <div className={cn(
                'text-blue-500',
                selected === type.id && 'text-blue-600'
              )}>
                {type.icon}
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{type.title}</h3>
                <p className="text-sm text-muted-foreground">{type.description}</p>
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                {type.examples.map((example) => (
                  <span
                    key={example}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                  >
                    {example}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
