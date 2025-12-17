import { Check, X } from 'lucide-react'

interface DoProps {
  children: React.ReactNode
  title?: string
}

interface DontProps {
  children: React.ReactNode
  title?: string
}

export function Do({ children, title }: DoProps) {
  return (
    <div className="my-4 rounded-lg border-l-4 border-green-500 bg-green-500/5 p-4">
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500/10 shrink-0 mt-0.5">
          <Check className="w-3.5 h-3.5 text-green-400" />
        </div>
        <div className="flex-1">
          {title && (
            <p className="font-bold text-sm text-green-300 mb-2">{title}</p>
          )}
          <div className="text-sm text-zinc-300 leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export function Dont({ children, title }: DontProps) {
  return (
    <div className="my-4 rounded-lg border-l-4 border-red-500 bg-red-500/5 p-4">
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-red-500/10 shrink-0 mt-0.5">
          <X className="w-3.5 h-3.5 text-red-400" />
        </div>
        <div className="flex-1">
          {title && (
            <p className="font-bold text-sm text-red-300 mb-2">{title}</p>
          )}
          <div className="text-sm text-zinc-300 leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
