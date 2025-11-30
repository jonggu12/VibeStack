'use client'

import { ExternalLink, ArrowRight } from 'lucide-react'

type TechStack = {
  name: string
  description: string
  icon: string
  url?: string
}

type ProgressCardProps = {
  progress: number
  message: string
  techStack?: TechStack[]
}

export function ProgressCard({ progress, message, techStack = [] }: ProgressCardProps) {
  return (
    <aside className="hidden xl:block w-80 shrink-0 h-[calc(100vh-4rem)] sticky top-16 py-8 px-6">
      {/* Progress Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-6 sticky top-0">
        <div className="flex justify-between items-end mb-2">
          <span className="text-xs font-bold text-zinc-500 uppercase">Your Progress</span>
          <span className="text-xl font-bold text-white">{progress}%</span>
        </div>
        <div className="w-full bg-zinc-800 rounded-full h-2 mb-4 overflow-hidden">
          <div
            className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-zinc-400 mb-4">{message}</p>
        <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold py-2.5 rounded-lg transition-colors border border-zinc-700">
          진행상황 저장하기
        </button>
      </div>

      {/* Tech Stack */}
      {techStack.length > 0 && (
        <div className="mb-8">
          <h5 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">
            Used in this step
          </h5>
          <div className="space-y-2">
            {techStack.map((tech) => (
              <a
                key={tech.name}
                href={tech.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2 rounded hover:bg-zinc-900 transition-colors group"
              >
                <img src={tech.icon} className="w-8 h-8 rounded-lg" alt={tech.name} />
                <div className="flex-1">
                  <div className="text-sm font-bold text-zinc-300 group-hover:text-white">
                    {tech.name}
                  </div>
                  <div className="text-[10px] text-zinc-500">{tech.description}</div>
                </div>
                <ExternalLink className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Help Card */}
      <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-bold text-indigo-300">Live Help</span>
        </div>
        <p className="text-xs text-zinc-400 mb-3">
          이 단계에서 막히셨나요? 디스코드에서 'Phase 2' 채널을 확인하세요.
        </p>
        <a
          href="#"
          className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
        >
          질문하러 가기 <ArrowRight className="w-3 h-3" />
        </a>
      </div>
    </aside>
  )
}
