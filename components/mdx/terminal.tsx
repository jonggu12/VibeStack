import { Terminal as TerminalIcon } from 'lucide-react'

type TerminalProps = {
  children: React.ReactNode
  title?: string
}

export function Terminal({ children, title = 'Terminal' }: TerminalProps) {
  return (
    <div className="my-6 rounded-xl overflow-hidden border border-zinc-800 bg-gray-900">
      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-zinc-900 border-b border-zinc-800">
        <TerminalIcon className="w-4 h-4 text-zinc-500" />
        <span className="text-xs font-medium text-zinc-400">{title}</span>
      </div>

      {/* Terminal Content */}
      <div className="p-4 font-mono text-sm text-zinc-300 overflow-x-auto">
        <pre className="m-0">{children}</pre>
      </div>
    </div>
  )
}
