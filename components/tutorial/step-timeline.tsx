'use client'

import Link from 'next/link'
import { Check } from 'lucide-react'

export type TutorialStep = {
  id: string
  number: number
  title: string
  duration: string
  status: 'completed' | 'active' | 'pending'
}

type StepTimelineProps = {
  steps: TutorialStep[]
  tutorialSlug?: string
}

export function StepTimeline({ steps, tutorialSlug }: StepTimelineProps) {
  const StepLink = tutorialSlug ? Link : 'a'

  return (
    <aside className="hidden lg:block w-72 shrink-0 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto py-8 pl-4 pr-6 border-r border-zinc-800 scrollbar-thin scrollbar-thumb-zinc-800 hover:scrollbar-thumb-zinc-700">
      <h5 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-6 px-2">
        Table of Contents
      </h5>

      <div className="space-y-0">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`relative pl-2 step-connector ${step.status === 'completed'
                ? 'completed-step'
                : step.status === 'active'
                  ? 'active-step'
                  : ''
              }`}
          >
            <StepLink
              href={tutorialSlug ? `/tutorials/${tutorialSlug}/${step.number}` : `#${step.id}`}
              className="flex items-start gap-3 py-2 group"
            >
              {/* Circle */}
              <div
                className={`w-6 h-6 rounded-full border-2 text-[10px] flex items-center justify-center shrink-0 z-10 step-circle transition-colors font-bold ${step.status === 'completed'
                    ? 'bg-zinc-900 border-zinc-700 text-white'
                    : step.status === 'active'
                      ? 'bg-zinc-900 border-zinc-600 text-white'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-600'
                  }`}
              >
                {step.status === 'completed' ? <Check className="w-3 h-3" /> : step.number}
              </div>

              {/* Text */}
              <div className="pt-0.5">
                <h6
                  className={`text-sm font-medium step-title transition-colors ${step.status === 'completed'
                      ? 'text-zinc-400 group-hover:text-white'
                      : step.status === 'active'
                        ? 'text-zinc-300 group-hover:text-white'
                        : 'text-zinc-500 group-hover:text-zinc-300'
                    }`}
                >
                  {step.title}
                </h6>
                <p
                  className={`text-[10px] ${step.status === 'pending' ? 'text-zinc-600' : 'text-zinc-500'
                    }`}
                >
                  {step.duration}
                </p>
              </div>
            </StepLink>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`absolute top-8 bottom-0 left-[11px] w-[2px] ${step.status === 'completed' ? 'bg-emerald-500' : 'bg-zinc-800'
                  }`}
                style={{ height: 'calc(100% - 1rem)' }}
              />
            )}
          </div>
        ))}
      </div>
    </aside>
  )
}
