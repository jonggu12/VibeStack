import { currentUser } from "@clerk/nextjs/server";
import { Rocket, Copy, Code, Flame } from "lucide-react";

export default async function DashboardPage() {
  const user = await currentUser();

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* 1. WELCOME & STATS */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Greeting Card */}
        <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 rounded-xl p-6 relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-2xl font-bold text-white mb-2">
              반가워요, {user?.firstName || '개발자'}님! 👋
            </h1>
            <p className="text-indigo-200 text-sm mb-4">
              오늘도 AI와 함께 멋진 서비스를 만들어볼까요?
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-indigo-300 bg-indigo-500/10 w-fit px-3 py-1.5 rounded-full border border-indigo-500/20">
              <Flame className="w-3 h-3" />
              3일 연속 코딩 중
            </div>
          </div>
          {/* Deco */}
          <div className="absolute right-0 bottom-0 text-9xl text-indigo-500/10 -mr-4 -mb-4">
            <Code className="w-32 h-32" />
          </div>
        </div>

        {/* Stat 1 */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="text-zinc-400 text-sm font-medium flex justify-between items-center">
            완성한 프로젝트
            <Rocket className="w-5 h-5 text-zinc-600" />
          </div>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-3xl font-bold text-white">2</span>
            <span className="text-xs text-emerald-400 mb-1.5">+1 이번 주</span>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="text-zinc-400 text-sm font-medium flex justify-between items-center">
            복사한 프롬프트
            <Copy className="w-5 h-5 text-zinc-600" />
          </div>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-3xl font-bold text-white">142</span>
            <span className="text-xs text-zinc-500 mb-1.5">Total</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN (Main) */}
        <div className="lg:col-span-2 space-y-8">
          {/* 2. CONTINUE BUILDING (Active Project) */}
          <section>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              🚀 진행 중인 프로젝트
            </h2>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors group cursor-pointer relative overflow-hidden">
              {/* Progress Overlay Background */}
              <div className="absolute top-0 left-0 h-1 bg-zinc-800 w-full">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 w-[65%]"></div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                {/* Thumbnail */}
                <div className="w-full sm:w-32 h-32 bg-zinc-800 rounded-lg shrink-0 flex items-center justify-center border border-zinc-700">
                  <span className="text-2xl">📝</span>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                          나만의 SaaS (Todo 앱)
                        </h3>
                        <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">
                          Active
                        </span>
                      </div>
                      <p className="text-sm text-zinc-400">Chapter 3: 데이터베이스 연결하기</p>
                    </div>
                    <button className="bg-white text-black text-sm font-bold px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors shadow-lg shadow-indigo-500/10">
                      계속하기
                    </button>
                  </div>

                  <div className="mt-6">
                    <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
                      <span>진행률 65%</span>
                      <span>마지막 편집: 2시간 전</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 w-[65%] rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. RECOMMENDED NEXT STEPS */}
          <section>
            <h2 className="text-lg font-bold text-white mb-4">🎯 다음 추천 단계</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Recommendation 1 */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-600 transition-all cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center shrink-0 border border-pink-500/20">
                    💳
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-200 mb-1">결제 기능 붙이기</h4>
                    <p className="text-xs text-zinc-500 line-clamp-2">
                      SaaS의 핵심은 수익화입니다. Stripe로 10분 만에 결제창을 만드세요.
                    </p>
                  </div>
                </div>
              </div>
              {/* Recommendation 2 */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-600 transition-all cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                    🌐
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-200 mb-1">커스텀 도메인 연결</h4>
                    <p className="text-xs text-zinc-500 line-clamp-2">
                      vercel.app 대신 .com 도메인을 연결하여 브랜딩을 완성하세요.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4. RECENTLY VIEWED DOCS */}
          <section>
            <h2 className="text-lg font-bold text-white mb-4">📚 최근 본 문서</h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-800">
              <a href="#" className="flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors group">
                <div className="flex items-center gap-3">
                  <span className="text-red-400">⚠️</span>
                  <span className="text-sm text-zinc-300 group-hover:text-white">
                    &quot;Module not found&quot; 해결법
                  </span>
                </div>
                <span className="text-xs text-zinc-500">10분 전</span>
              </a>
              <a href="#" className="flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors group">
                <div className="flex items-center gap-3">
                  <span className="text-indigo-400">💻</span>
                  <span className="text-sm text-zinc-300 group-hover:text-white">
                    Supabase 환경변수 설정
                  </span>
                </div>
                <span className="text-xs text-zinc-500">어제</span>
              </a>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN (Side) */}
        <aside className="space-y-8">
          {/* MY STACK */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center justify-between">
              🛠️ My Stack
              <button className="text-[10px] text-zinc-500 hover:text-white">편집</button>
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 rounded hover:bg-zinc-800 transition-colors">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                  <span className="text-xs">⚡</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-zinc-200">Next.js 14</div>
                  <div className="text-[10px] text-zinc-500">Frontend Framework</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded hover:bg-zinc-800 transition-colors">
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                  <span className="text-xs">⚡</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-zinc-200">Supabase</div>
                  <div className="text-[10px] text-zinc-500">Backend & Auth</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded hover:bg-zinc-800 transition-colors">
                <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center">
                  <span className="text-xs">🎨</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-zinc-200">Shadcn/ui</div>
                  <div className="text-[10px] text-zinc-500">UI Component</div>
                </div>
              </div>

              <button className="w-full mt-2 py-2 border border-dashed border-zinc-700 rounded-lg text-xs text-zinc-500 hover:text-white hover:border-zinc-500 transition-colors">
                + 스택 추가하기
              </button>
            </div>
          </div>

          {/* SAVED SNIPPETS */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center justify-between">
              ⭐ 저장된 스니펫
              <a href="#" className="text-[10px] text-indigo-400 hover:text-indigo-300">전체보기</a>
            </h3>
            <div className="space-y-3">
              {/* Item 1 */}
              <div className="group">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-zinc-300">Google Login</span>
                  <span className="text-[10px] text-zinc-500">Auth</span>
                </div>
                <button className="w-full bg-zinc-950 border border-zinc-800 hover:border-indigo-500/50 text-left px-3 py-2 rounded text-[10px] font-mono text-zinc-400 truncate transition-colors relative group-hover:text-zinc-200">
                  <span className="pointer-events-none">createClerkClient()...</span>
                  <Copy className="w-3 h-3 absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-indigo-400" />
                </button>
              </div>
              {/* Item 2 */}
              <div className="group">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-zinc-300">Stripe Checkout</span>
                  <span className="text-[10px] text-zinc-500">Pay</span>
                </div>
                <button className="w-full bg-zinc-950 border border-zinc-800 hover:border-indigo-500/50 text-left px-3 py-2 rounded text-[10px] font-mono text-zinc-400 truncate transition-colors relative group-hover:text-zinc-200">
                  <span className="pointer-events-none">stripe.checkout.sessions...</span>
                  <Copy className="w-3 h-3 absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-indigo-400" />
                </button>
              </div>
            </div>
          </div>

          {/* COMMUNITY */}
          <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 border border-zinc-700 rounded-xl p-5 text-center">
            <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-500/30">
              <span className="text-white text-xl">💬</span>
            </div>
            <h3 className="text-sm font-bold text-white mb-1">혼자가 아닙니다</h3>
            <p className="text-xs text-zinc-400 mb-4">
              40,000명의 바이브 코더들이<br />서로 돕고 있어요.
            </p>
            <button className="w-full bg-white text-black text-xs font-bold py-2 rounded hover:bg-zinc-200 transition-colors">
              Discord 입장하기
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
