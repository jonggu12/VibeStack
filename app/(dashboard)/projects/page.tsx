import Link from 'next/link'
import { Rocket, Mail, PenLine, Plus, MoreVertical, ExternalLink, Database, ChevronLeft, ChevronRight } from 'lucide-react'

export default function ProjectsPage() {
  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
      {/* Controls (Title & Filter) */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">내 프로젝트</h1>
          <p className="text-sm text-zinc-400">
            총 <span className="text-white font-bold">5개</span>의 프로젝트가 있습니다.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="relative">
            <select className="appearance-none bg-zinc-900 border border-zinc-700 text-zinc-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-3 pr-8 py-2 cursor-pointer hover:border-zinc-500 transition-colors">
              <option>모든 상태</option>
              <option>진행 중</option>
              <option>완료됨</option>
              <option>배포됨</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-500">
              <ChevronRight className="w-3 h-3 rotate-90" />
            </div>
          </div>

          {/* Sort */}
          <div className="relative">
            <select className="appearance-none bg-zinc-900 border border-zinc-700 text-zinc-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-3 pr-8 py-2 cursor-pointer hover:border-zinc-500 transition-colors">
              <option>최신순</option>
              <option>오래된순</option>
              <option>이름순</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-500">
              <ChevronRight className="w-3 h-3 rotate-90" />
            </div>
          </div>
        </div>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Active Project */}
        <div className="group bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-600 transition-all hover:shadow-xl hover:shadow-indigo-500/5 relative overflow-hidden">
          {/* Top: Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xl border border-indigo-500/20 group-hover:scale-110 transition-transform">
              <Rocket className="w-6 h-6" />
            </div>
            <div className="flex gap-2">
              <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-bold px-2 py-1 rounded border border-indigo-500/20">
                진행 중
              </span>
              <button className="text-zinc-500 hover:text-white transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Middle: Info */}
          <div className="mb-4">
            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">
              나만의 SaaS (Todo)
            </h3>
            <p className="text-xs text-zinc-500 line-clamp-1">Next.js 14로 만드는 할 일 관리 서비스</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-[10px] text-zinc-400 mb-1.5">
              <span>진행률</span>
              <span className="text-white font-bold">65%</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-1.5">
              <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>

          {/* Bottom: Meta & Tech */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] text-zinc-400" title="Next.js">
                ⚛️
              </div>
              <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] text-zinc-400" title="Supabase">
                <Database className="w-3 h-3" />
              </div>
            </div>
            <span className="text-[10px] text-zinc-500">2시간 전 수정됨</span>
          </div>

          {/* Hover Action (Overlay) */}
          <Link href="/tutorials/todo-saas" className="absolute inset-0 z-10"></Link>
        </div>

        {/* Card 2: Completed Project */}
        <div className="group bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-emerald-500/50 transition-all hover:shadow-xl hover:shadow-emerald-500/5 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xl border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <Mail className="w-6 h-6" />
            </div>
            <div className="flex gap-2">
              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded border border-emerald-500/20">
                완료됨
              </span>
              <button className="text-zinc-500 hover:text-white transition-colors relative z-20">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
              대기자 명단 페이지
            </h3>
            <p className="text-xs text-zinc-500 line-clamp-1">이메일 수집용 랜딩 페이지</p>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-[10px] text-zinc-400 mb-1.5">
              <span>진행률</span>
              <span className="text-emerald-400 font-bold">100%</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-1.5">
              <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] text-zinc-400">
                🌐
              </div>
              <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] text-zinc-400">
                🎨
              </div>
            </div>
            <a href="#" className="text-[10px] font-bold text-zinc-400 hover:text-emerald-400 flex items-center gap-1 relative z-20 transition-colors">
              <ExternalLink className="w-3 h-3" /> 배포 보기
            </a>
          </div>
          <Link href="#" className="absolute inset-0 z-10"></Link>
        </div>

        {/* Card 3: Draft */}
        <div className="group bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-600 transition-all hover:shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-lg bg-zinc-800 text-zinc-400 flex items-center justify-center text-xl border border-zinc-700 group-hover:scale-110 transition-transform">
              <PenLine className="w-6 h-6" />
            </div>
            <div className="flex gap-2">
              <span className="bg-zinc-800 text-zinc-400 text-[10px] font-bold px-2 py-1 rounded border border-zinc-700">
                임시
              </span>
              <button className="text-zinc-500 hover:text-white transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-zinc-300 transition-colors">
              개발자 블로그
            </h3>
            <p className="text-xs text-zinc-500 line-clamp-1">MDX 기반 기술 블로그</p>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-[10px] text-zinc-400 mb-1.5">
              <span>진행률</span>
              <span className="text-zinc-300 font-bold">10%</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-1.5">
              <div className="bg-zinc-600 h-1.5 rounded-full" style={{ width: '10%' }}></div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] text-zinc-400">
                ⚛️
              </div>
            </div>
            <span className="text-[10px] text-zinc-500">3일 전 수정됨</span>
          </div>
          <Link href="#" className="absolute inset-0 z-10"></Link>
        </div>

        {/* Card 4: New Project */}
        <Link
          href="/onboarding"
          className="group border-2 border-dashed border-zinc-800 rounded-xl p-5 flex flex-col items-center justify-center min-h-[220px] hover:border-zinc-600 hover:bg-zinc-900/30 transition-all cursor-pointer"
        >
          <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:border-zinc-600">
            <Plus className="w-6 h-6 text-zinc-500 group-hover:text-white transition-colors" />
          </div>
          <h3 className="text-sm font-bold text-zinc-300 group-hover:text-white mb-1 transition-colors">
            새 프로젝트 만들기
          </h3>
          <p className="text-xs text-zinc-500 text-center max-w-[200px]">
            웹앱, 랜딩페이지, 블로그 등<br />원하는 것을 바로 시작하세요.
          </p>
        </Link>
      </div>

      {/* Pagination */}
      <div className="mt-12 flex justify-center">
        <nav className="flex items-center gap-1">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-800 text-zinc-500 hover:bg-zinc-800 hover:text-white transition-colors disabled:opacity-50">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-600 text-white text-sm font-bold shadow-lg shadow-indigo-500/20">
            1
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors text-sm">
            2
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors text-sm">
            3
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-800 text-zinc-500 hover:bg-zinc-800 hover:text-white transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </nav>
      </div>
    </main>
  )
}
