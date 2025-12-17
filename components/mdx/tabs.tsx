'use client'

import { useState } from 'react'

interface TabsProps {
  children: React.ReactNode
  defaultTab?: number
}

interface TabProps {
  label: string
  children: React.ReactNode
}

export function Tabs({ children, defaultTab = 0 }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab)

  // children을 배열로 변환
  const tabs = Array.isArray(children) ? children : [children]
  const validTabs = tabs.filter(child => child && typeof child === 'object' && 'props' in child)

  return (
    <div className="my-6 rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
      {/* Tab Headers */}
      <div className="flex border-b border-zinc-800 bg-zinc-950/50">
        {validTabs.map((tab: any, index: number) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === index
                ? 'text-indigo-400 bg-zinc-900'
                : 'text-zinc-400 hover:text-zinc-300 hover:bg-zinc-900/50'
            }`}
          >
            {tab.props?.label || `Tab ${index + 1}`}
            {activeTab === index && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"></div>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {validTabs[activeTab]?.props?.children}
      </div>
    </div>
  )
}

export function Tab({ label, children }: TabProps) {
  // 이 컴포넌트는 Tabs 내부에서만 사용됨
  return <>{children}</>
}
