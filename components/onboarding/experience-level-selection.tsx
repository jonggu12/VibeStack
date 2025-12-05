'use client'

import { cn } from '@/lib/utils'

export type ExperienceLevel = 'vibe_coder' | 'beginner' | 'intermediate' | 'advanced'

interface ExperienceLevelOption {
  id: ExperienceLevel
  emoji: string
  title: string
  description: string
  badge?: string
  color: 'purple' | 'green' | 'blue' | 'orange'
}

const experienceLevels: ExperienceLevelOption[] = [
  {
    id: 'vibe_coder',
    emoji: '🎯',
    title: '코딩 처음이에요',
    description: 'AI 도구로 개발 시작하는 중',
    badge: 'Vibe Coder',
    color: 'purple',
  },
  {
    id: 'beginner',
    emoji: '🌱',
    title: '1년 미만',
    description: '기본은 아는데 실전 경험 부족',
    color: 'green',
  },
  {
    id: 'intermediate',
    emoji: '⚡',
    title: '1~3년 개발자',
    description: '실무 프로젝트 경험 있음',
    color: 'blue',
  },
  {
    id: 'advanced',
    emoji: '🚀',
    title: '3년 이상 시니어',
    description: '새로운 스택 빠르게 습득 원함',
    color: 'orange',
  },
]

const colorClasses = {
  purple: {
    border: 'peer-checked:border-purple-500',
    bg: 'peer-checked:bg-purple-500/5',
    shadow: 'peer-checked:shadow-[0_0_20px_rgba(168,85,247,0.2)]',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  },
  green: {
    border: 'peer-checked:border-emerald-500',
    bg: 'peer-checked:bg-emerald-500/5',
    shadow: 'peer-checked:shadow-[0_0_20px_rgba(16,185,129,0.2)]',
    badge: '',
  },
  blue: {
    border: 'peer-checked:border-blue-500',
    bg: 'peer-checked:bg-blue-500/5',
    shadow: 'peer-checked:shadow-[0_0_20px_rgba(59,130,246,0.2)]',
    badge: '',
  },
  orange: {
    border: 'peer-checked:border-orange-500',
    bg: 'peer-checked:bg-orange-500/5',
    shadow: 'peer-checked:shadow-[0_0_20px_rgba(249,115,22,0.2)]',
    badge: '',
  },
}

interface ExperienceLevelSelectionProps {
  selected?: ExperienceLevel
  onSelect: (level: ExperienceLevel) => void
}

export function ExperienceLevelSelection({ selected, onSelect }: ExperienceLevelSelectionProps) {
  return (
    <div>
      <div className="text-center mb-10">
        <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-2 block">
          Step 2 of 5
        </span>
        <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">
          개발 경험이 어느 정도신가요?
        </h1>
        <p className="text-zinc-400">
          수준에 맞는 콘텐츠를 추천해드려요
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {experienceLevels.map((level) => {
          const colors = colorClasses[level.color]
          return (
            <label key={level.id} className="cursor-pointer group">
              <input
                type="radio"
                name="experience_level"
                value={level.id}
                checked={selected === level.id}
                onChange={() => onSelect(level.id)}
                className="peer sr-only"
              />
              <div
                className={cn(
                  'h-full bg-zinc-900 border border-zinc-700 rounded-2xl p-6 transition-all hover:-translate-y-1 hover:border-zinc-500',
                  colors.border,
                  colors.bg,
                  colors.shadow
                )}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="text-3xl mb-3">{level.emoji}</div>
                  <h3 className="font-bold text-white mb-1">{level.title}</h3>
                  <p className="text-xs text-zinc-500 mb-3">{level.description}</p>
                  {level.badge && (
                    <span className={cn(
                      'inline-block text-[10px] px-2.5 py-1 rounded-full border font-bold',
                      colors.badge
                    )}>
                      {level.badge}
                    </span>
                  )}
                </div>
              </div>
            </label>
          )
        })}
      </div>
    </div>
  )
}
