import {
  SiNextdotjs,
  SiSupabase,
  SiStripe,
  SiTailwindcss,
  SiVercel,
  SiReact,
  SiTypescript,
  SiPrisma,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiFirebase,
  SiCloudinary,
  SiGithub,
  SiDocker
} from 'react-icons/si'
import { FaAws } from 'react-icons/fa'
import { RiShieldKeyholeFill } from 'react-icons/ri'
import { MdEmail } from 'react-icons/md'

interface StackBadgeProps {
  stack: string | string[]
}

// 기술 스택별 아이콘 매핑
const stackIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'next.js': SiNextdotjs,
  'nextjs': SiNextdotjs,
  'next': SiNextdotjs,
  'supabase': SiSupabase,
  'stripe': SiStripe,
  'clerk': RiShieldKeyholeFill,
  'tailwind': SiTailwindcss,
  'tailwindcss': SiTailwindcss,
  'vercel': SiVercel,
  'react': SiReact,
  'typescript': SiTypescript,
  'ts': SiTypescript,
  'prisma': SiPrisma,
  'postgresql': SiPostgresql,
  'postgres': SiPostgresql,
  'mongodb': SiMongodb,
  'mongo': SiMongodb,
  'redis': SiRedis,
  'firebase': SiFirebase,
  'aws': FaAws,
  's3': FaAws,
  'cloudinary': SiCloudinary,
  'github': SiGithub,
  'docker': SiDocker,
  'resend': MdEmail,
  'email': MdEmail,
}

// 기술 스택별 색상
const stackColors: Record<string, { bg: string; text: string; border: string }> = {
  'next.js': { bg: 'bg-black/50', text: 'text-white', border: 'border-zinc-700' },
  'nextjs': { bg: 'bg-black/50', text: 'text-white', border: 'border-zinc-700' },
  'next': { bg: 'bg-black/50', text: 'text-white', border: 'border-zinc-700' },
  'supabase': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  'stripe': { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30' },
  'clerk': { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
  'tailwind': { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/30' },
  'tailwindcss': { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/30' },
  'vercel': { bg: 'bg-black/50', text: 'text-white', border: 'border-zinc-700' },
  'react': { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  'typescript': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  'ts': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  'prisma': { bg: 'bg-slate-500/10', text: 'text-slate-300', border: 'border-slate-500/30' },
  'postgresql': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  'postgres': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  'mongodb': { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30' },
  'mongo': { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30' },
  'redis': { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
  'firebase': { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  'aws': { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
  's3': { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
  'cloudinary': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  'github': { bg: 'bg-zinc-800/50', text: 'text-zinc-300', border: 'border-zinc-700' },
  'docker': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  'resend': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  'email': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
}

// 기본 색상
const defaultColors = { bg: 'bg-zinc-800/50', text: 'text-zinc-300', border: 'border-zinc-700' }

export function StackBadge({ stack }: StackBadgeProps) {
  const stackArray = Array.isArray(stack) ? stack : [stack]

  return (
    <div className="flex gap-2 flex-wrap my-4">
      {stackArray.map((tech, index) => {
        const techKey = tech.toLowerCase().trim()
        const Icon = stackIcons[techKey]
        const colors = stackColors[techKey] || defaultColors

        return (
          <span
            key={index}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${colors.bg} ${colors.text} text-xs font-medium rounded-lg border ${colors.border}`}
          >
            {Icon && <Icon className="w-3.5 h-3.5" />}
            {tech}
          </span>
        )
      })}
    </div>
  )
}
