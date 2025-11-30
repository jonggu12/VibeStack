import { Info, AlertTriangle, Lightbulb, AlertCircle } from 'lucide-react'

interface CalloutProps {
    type?: 'info' | 'warning' | 'tip' | 'error'
    title: string
    children: React.ReactNode
}

export function Callout({ type = 'info', title, children }: CalloutProps) {
    const styles = {
        info: {
            container: 'bg-blue-500/5 border-blue-500/20',
            icon: 'text-blue-400',
            title: 'text-blue-400',
            Icon: Info,
        },
        warning: {
            container: 'bg-yellow-500/5 border-yellow-500/20',
            icon: 'text-yellow-400',
            title: 'text-yellow-400',
            Icon: AlertTriangle,
        },
        tip: {
            container: 'bg-emerald-500/5 border-emerald-500/20',
            icon: 'text-emerald-400',
            title: 'text-emerald-400',
            Icon: Lightbulb,
        },
        error: {
            container: 'bg-red-500/5 border-red-500/20',
            icon: 'text-red-400',
            title: 'text-red-400',
            Icon: AlertCircle,
        },
    }

    const style = styles[type]
    const Icon = style.Icon

    return (
        <div className={`${style.container} border rounded-xl p-4 my-6 flex gap-3`}>
            <Icon className={`${style.icon} w-5 h-5 mt-0.5 shrink-0`} />
            <div>
                <h4 className={`font-bold ${style.title} text-sm mb-1`}>{title}</h4>
                <div className="text-zinc-400 text-sm mb-0 leading-relaxed">
                    {children}
                </div>
            </div>
        </div>
    )
}
