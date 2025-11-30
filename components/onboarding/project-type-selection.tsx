'use client'

import { cn } from '@/lib/utils'

export type ProjectType = 'saas' | 'landing' | 'blog'

interface ProjectTypeOption {
  id: ProjectType
  title: string
  description: string
  emoji: string
  color: 'indigo' | 'emerald' | 'pink'
}

const projectTypes: ProjectTypeOption[] = [
  {
    id: 'saas',
    title: '웹 서비스 (SaaS)',
    description: '로그인, 데이터 저장, 결제가 필요한 앱',
    emoji: '🚀',
    color: 'indigo',
  },
  {
    id: 'landing',
    title: '랜딩 페이지',
    description: '이메일 수집, 홍보용 원페이지 사이트',
    emoji: '📢',
    color: 'emerald',
  },
  {
    id: 'blog',
    title: '블로그 / 포트폴리오',
    description: '글 작성, SEO 최적화가 중요한 사이트',
    emoji: '📝',
    color: 'pink',
  },
]

interface ProjectTypeSelectionProps {
  selected?: ProjectType
  onSelect: (type: ProjectType) => void
}

const colorClasses = {
  indigo: {
    border: 'peer-checked:border-indigo-500',
    bg: 'peer-checked:bg-indigo-500/5',
    shadow: 'peer-checked:shadow-[0_0_20px_rgba(99,102,241,0.2)]',
  },
  emerald: {
    border: 'peer-checked:border-emerald-500',
    bg: 'peer-checked:bg-emerald-500/5',
    shadow: 'peer-checked:shadow-[0_0_20px_rgba(16,185,129,0.2)]',
  },
  pink: {
    border: 'peer-checked:border-pink-500',
    bg: 'peer-checked:bg-pink-500/5',
    shadow: 'peer-checked:shadow-[0_0_20px_rgba(236,72,153,0.2)]',
  },
}

export function ProjectTypeSelection({ selected, onSelect }: ProjectTypeSelectionProps) {
  return (
    <div>
      <div className="text-center mb-10">
        <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-2 block">
          Step 1 of 3
        </span>
        <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">
          어떤 서비스를 만드실 건가요?
        </h1>
        <p className="text-zinc-400">
          만들고 싶은 프로젝트의 형태를 선택해주세요. AI가 최적의 스택을 골라드립니다.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {projectTypes.map((type) => {
          const colors = colorClasses[type.color]
          return (
            <label key={type.id} className="cursor-pointer group">
              <input
                type="radio"
                name="project_type"
                value={type.id}
                checked={selected === type.id}
                onChange={() => onSelect(type.id)}
                className="peer sr-only"
              />
              <div
                className={cn(
                  'h-full bg-zinc-900 border border-zinc-700 rounded-2xl p-6 text-center transition-all hover:-translate-y-1 hover:border-zinc-500',
                  colors.border,
                  colors.bg,
                  colors.shadow
                )}
              >
                <div className="w-14 h-14 mx-auto bg-zinc-800 rounded-full flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform">
                  {type.emoji}
                </div>
                <h3 className="font-bold text-white mb-1">{type.title}</h3>
                <p className="text-xs text-zinc-500">{type.description}</p>
              </div>
            </label>
          )
        })}
      </div>
    </div>
  )
}
