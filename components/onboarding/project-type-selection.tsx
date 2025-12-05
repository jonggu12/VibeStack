'use client'

import { cn } from '@/lib/utils'
import { Sparkles, BarChart3, Users, Zap, Gamepad2, Megaphone, LucideIcon } from 'lucide-react'

export type ProjectType = 'ai_saas' | 'dashboard' | 'community' | 'productivity' | 'quiz' | 'landing'

interface ProjectTypeOption {
  id: ProjectType
  title: string
  description: string
  icon: LucideIcon
  color: 'purple' | 'blue' | 'indigo' | 'emerald' | 'pink' | 'orange'
  badge?: string
}

const projectTypes: ProjectTypeOption[] = [
  {
    id: 'ai_saas',
    title: 'AI 기반 웹 서비스',
    description: 'GPT 요약기, 이미지 생성 도구',
    icon: Sparkles,
    color: 'purple',
    badge: '⭐ 인기',
  },
  {
    id: 'dashboard',
    title: '대시보드 / 데이터 앱',
    description: '주가·코인 대시보드, 운동 기록',
    icon: BarChart3,
    color: 'blue',
  },
  {
    id: 'community',
    title: '커뮤니티 / 소셜 서비스',
    description: '게시판, 댓글, 좋아요 기능',
    icon: Users,
    color: 'indigo',
  },
  {
    id: 'productivity',
    title: '생산성 / 자동화 툴',
    description: 'To-Do, 파일변환, 북마크 관리',
    icon: Zap,
    color: 'emerald',
  },
  {
    id: 'quiz',
    title: '퀴즈 / 테스트 / 미니게임',
    description: 'MBTI 테스트, 밸런스 게임',
    icon: Gamepad2,
    color: 'pink',
  },
  {
    id: 'landing',
    title: '랜딩 페이지',
    description: '제품 홍보, 이메일 수집',
    icon: Megaphone,
    color: 'orange',
  },
]

interface ProjectTypeSelectionProps {
  selected?: ProjectType
  onSelect: (type: ProjectType) => void
}

const colorClasses = {
  purple: {
    border: 'peer-checked:border-purple-500',
    bg: 'peer-checked:bg-purple-500/5',
    shadow: 'peer-checked:shadow-[0_0_20px_rgba(168,85,247,0.2)]',
  },
  blue: {
    border: 'peer-checked:border-blue-500',
    bg: 'peer-checked:bg-blue-500/5',
    shadow: 'peer-checked:shadow-[0_0_20px_rgba(59,130,246,0.2)]',
  },
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
  orange: {
    border: 'peer-checked:border-orange-500',
    bg: 'peer-checked:bg-orange-500/5',
    shadow: 'peer-checked:shadow-[0_0_20px_rgba(249,115,22,0.2)]',
  },
}

export function ProjectTypeSelection({ selected, onSelect }: ProjectTypeSelectionProps) {
  return (
    <div>
      <div className="text-center mb-10">
        <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-2 block">
          Step 1 of 4
        </span>
        <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">
          어떤 서비스를 만드실 건가요?
        </h1>
        <p className="text-zinc-400">
          만들고 싶은 프로젝트의 형태를 선택해주세요. AI가 최적의 스택을 골라드립니다.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projectTypes.map((type) => {
          const colors = colorClasses[type.color]
          const Icon = type.icon
          return (
            <label key={type.id} className="cursor-pointer group relative">
              {type.badge && (
                <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-lg z-10 border border-white/20">
                  {type.badge}
                </div>
              )}
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
                  'h-full bg-zinc-900 border border-zinc-700 rounded-2xl p-5 text-center transition-all hover:-translate-y-1 hover:border-zinc-500',
                  colors.border,
                  colors.bg,
                  colors.shadow
                )}
              >
                <div className="w-12 h-12 mx-auto bg-zinc-800 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-zinc-300" />
                </div>
                <h3 className="font-bold text-white text-sm mb-1">{type.title}</h3>
                <p className="text-[11px] text-zinc-500 leading-relaxed">{type.description}</p>
              </div>
            </label>
          )
        })}
      </div>
    </div>
  )
}
