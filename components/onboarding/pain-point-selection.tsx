'use client'

import { cn } from '@/lib/utils'
import { Check, Lock, Database, CreditCard, Rocket, Bug, Bot, Sparkles, Upload, Zap, BarChart3, Globe, Mail, Search, Share2, LucideIcon } from 'lucide-react'
import { type ProjectType } from './project-type-selection'

export type PainPoint =
  | 'auth' | 'database' | 'payments' | 'deployment' | 'errors' | 'ai_prompting'
  | 'ai_integration' | 'file_processing' | 'realtime' | 'data_visualization'
  | 'external_api' | 'email_setup' | 'seo' | 'social_sharing' | 'not_sure'

interface PainPointOption {
  id: PainPoint
  icon: LucideIcon
  title: string
  description: string
  keywords: string[]
  relevantFor: ProjectType[]  // 어떤 프로젝트 타입에 관련있는지
}

const allPainPoints: PainPointOption[] = [
  {
    id: 'auth',
    icon: Lock,
    title: '로그인/회원가입 구현',
    description: 'OAuth, JWT, Session 관리',
    keywords: ['Clerk', 'NextAuth', 'Google 로그인'],
    relevantFor: ['ai_saas', 'community', 'dashboard'],
  },
  {
    id: 'database',
    icon: Database,
    title: 'DB 설계 및 연결',
    description: 'Schema 설계, Query 작성',
    keywords: ['Supabase', 'PostgreSQL', 'Prisma'],
    relevantFor: ['ai_saas', 'dashboard', 'community', 'productivity', 'quiz', 'landing'],
  },
  {
    id: 'ai_integration',
    icon: Sparkles,
    title: 'AI API 연동',
    description: 'OpenAI, Claude API, 프롬프트 최적화',
    keywords: ['GPT-4', 'Claude', 'API 비용'],
    relevantFor: ['ai_saas'],
  },
  {
    id: 'file_processing',
    icon: Upload,
    title: '파일 업로드/처리',
    description: '이미지 압축, 문서 파싱, 저장소 연동',
    keywords: ['Uploadthing', 'S3', '이미지 최적화'],
    relevantFor: ['ai_saas', 'community', 'productivity'],
  },
  {
    id: 'payments',
    icon: CreditCard,
    title: '결제 시스템 연동',
    description: 'Stripe, 웹훅, 구독 관리',
    keywords: ['Checkout', '환불', '정기결제'],
    relevantFor: ['ai_saas'],
  },
  {
    id: 'data_visualization',
    icon: BarChart3,
    title: '차트/그래프 구현',
    description: '실시간 차트, 데이터 시각화',
    keywords: ['Recharts', 'Chart.js', '대시보드'],
    relevantFor: ['dashboard'],
  },
  {
    id: 'realtime',
    icon: Zap,
    title: '실시간 기능 구현',
    description: '실시간 업데이트, 채팅, 알림',
    keywords: ['WebSocket', 'Supabase Realtime', 'Pusher'],
    relevantFor: ['dashboard', 'community'],
  },
  {
    id: 'external_api',
    icon: Globe,
    title: '외부 API 연동',
    description: '주가, 날씨, 소셜 미디어 API',
    keywords: ['REST API', 'API Key', 'Rate Limit'],
    relevantFor: ['dashboard', 'productivity'],
  },
  {
    id: 'email_setup',
    icon: Mail,
    title: '이메일 전송/수집',
    description: '뉴스레터, 알림 메일, 폼 연동',
    keywords: ['Resend', 'SendGrid', '이메일 검증'],
    relevantFor: ['landing', 'productivity'],
  },
  {
    id: 'seo',
    icon: Search,
    title: 'SEO 최적화',
    description: '메타태그, 사이트맵, 검색엔진 노출',
    keywords: ['Google 검색', 'Open Graph', 'Sitemap'],
    relevantFor: ['landing', 'quiz'],
  },
  {
    id: 'social_sharing',
    icon: Share2,
    title: '소셜 공유 기능',
    description: '결과 공유, SNS 연동, OG 이미지',
    keywords: ['카카오톡', 'Twitter', 'Facebook'],
    relevantFor: ['quiz'],
  },
  {
    id: 'deployment',
    icon: Rocket,
    title: '배포 및 운영',
    description: 'Vercel, 환경변수, 도메인 연결',
    keywords: ['빌드 에러', '환경 설정', 'CI/CD'],
    relevantFor: ['ai_saas', 'dashboard', 'community', 'productivity', 'quiz', 'landing'],
  },
  {
    id: 'errors',
    icon: Bug,
    title: '에러 디버깅',
    description: 'Module not found, Hydration, 런타임 에러',
    keywords: ['에러 해결', '디버깅', '트러블슈팅'],
    relevantFor: ['ai_saas', 'dashboard', 'community', 'productivity', 'quiz', 'landing'],
  },
  {
    id: 'ai_prompting',
    icon: Bot,
    title: 'AI 코딩 도구 활용',
    description: 'Cursor, Claude Code 효율적 사용법',
    keywords: ['프롬프트', 'AI 코딩', '생산성'],
    relevantFor: ['ai_saas', 'dashboard', 'community', 'productivity', 'quiz', 'landing'],
  },
  {
    id: 'not_sure',
    icon: Search,
    title: '아직 잘 모르겠어요',
    description: '시작하면서 천천히 알아가고 싶어요',
    keywords: ['처음', '탐색', '학습'],
    relevantFor: ['ai_saas', 'dashboard', 'community', 'productivity', 'quiz', 'landing'],
  },
]

interface PainPointSelectionProps {
  selected: PainPoint[]
  onToggle: (painPoint: PainPoint) => void
  projectType?: ProjectType  // Step 1에서 선택한 프로젝트 타입
}

export function PainPointSelection({ selected, onToggle, projectType }: PainPointSelectionProps) {
  // 프로젝트 타입에 맞는 Pain Points만 필터링
  const painPoints = projectType
    ? allPainPoints.filter(point => point.relevantFor.includes(projectType))
    : allPainPoints
  return (
    <div>
      <div className="text-center mb-10">
        <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-2 block">
          Step 4 of 4
        </span>
        <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">
          가장 막히는 부분은 무엇인가요?
        </h1>
        <p className="text-zinc-400">
          여러 개 선택 가능해요 · 선택 안 해도 다음 단계로 갈 수 있어요
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {painPoints.map((painPoint) => {
          const isChecked = selected.includes(painPoint.id)
          const Icon = painPoint.icon

          return (
            <label key={painPoint.id} className="relative block cursor-pointer group">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggle(painPoint.id)}
                className="peer sr-only"
              />
              <div className="h-full min-h-[140px] bg-zinc-900 border border-zinc-700 peer-checked:border-indigo-500 peer-checked:bg-indigo-500/10 p-5 rounded-xl flex items-center justify-between transition-all group-hover:border-zinc-500 peer-checked:shadow-[0_0_15px_rgba(99,102,241,0.15)]">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-zinc-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white mb-0.5 text-sm">{painPoint.title}</h4>
                    <p className="text-xs text-zinc-500 line-clamp-2 mb-2">{painPoint.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {painPoint.keywords.slice(0, 3).map((keyword, idx) => (
                        <span key={idx} className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded whitespace-nowrap">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div
                  className={cn(
                    'w-6 h-6 rounded-full border flex items-center justify-center transition-all shrink-0',
                    isChecked
                      ? 'bg-indigo-500 border-indigo-500 scale-100 opacity-100'
                      : 'border-zinc-600 scale-50 opacity-0'
                  )}
                >
                  <Check className="w-4 h-4 text-white" />
                </div>
              </div>
            </label>
          )
        })}
      </div>

      <p className="text-center text-xs text-zinc-500 mt-6">
        💡 선택한 주제의 콘텐츠가 대시보드 상단에 우선 표시됩니다
      </p>
    </div>
  )
}
