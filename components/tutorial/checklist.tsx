'use client'

import { useState } from 'react'

type ChecklistItem = {
  id: string
  label: string
}

type ChecklistProps = {
  items: ChecklistItem[]
  title?: string
}

export function Checklist({ items, title = '✅ 제대로 됐는지 확인하기' }: ChecklistProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  const handleToggle = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
      <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">{title}</h4>
      <div className="space-y-3">
        {items.map((item) => (
          <label key={item.id} className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={checked[item.id] || false}
              onChange={() => handleToggle(item.id)}
              className="mt-1 w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-zinc-900 cursor-pointer"
            />
            <span className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors">
              {item.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}
