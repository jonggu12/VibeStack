import { requireAdmin } from '@/lib/auth'
import Link from 'next/link'
import {
  DollarSign,
  Users,
  Eye,
  Zap,
  Download,
  Plus,
  ArrowRight,
  Star,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react'

// 빌드 시 정적 생성 방지
export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  // Require admin access
  await requireAdmin()

  // Mock data (실제로는 DB나 API에서 가져와야 함)
  const kpiData = {
    totalRevenue: {
      value: '₩12,450,000',
      change: '+12.5%',
      changeType: 'positive' as const,
      label: 'vs last month',
    },
    activeUsers: {
      value: '1,240',
      change: '+48',
      changeType: 'positive' as const,
      label: 'new today',
    },
    contentViews: {
      value: '45.2k',
      change: '+8.2%',
      changeType: 'positive' as const,
      label: 'vs last week',
    },
    proConversion: {
      value: '3.2%',
      change: '+0.4%',
      changeType: 'positive' as const,
      label: 'growth',
    },
  }

  const chartData = [
    { day: 'Mon', height: 45 },
    { day: 'Tue', height: 60 },
    { day: 'Wed', height: 35 },
    { day: 'Thu', height: 75 },
    { day: 'Fri', height: 50 },
    { day: 'Sat', height: 85 },
    { day: 'Sun', height: 65 },
  ]

  const recentActivity = [
    {
      id: 1,
      user: 'SJ',
      name: 'Soojin',
      action: '님이 Pro 플랜을 구독했습니다.',
      time: '2분 전',
      type: 'subscription' as const,
    },
    {
      id: 2,
      user: 'MJ',
      name: 'Minjun',
      action: '님이 회원가입했습니다.',
      time: '15분 전',
      type: 'signup' as const,
    },
    {
      id: 3,
      user: 'DK',
      name: 'Duke',
      action: '님이 튜토리얼을 완료했습니다.',
      time: '1시간 전',
      type: 'completion' as const,
    },
    {
      id: 4,
      icon: 'alert',
      action: '에러 진단기 사용이 급증하고 있습니다.',
      time: '3시간 전',
      type: 'alert' as const,
    },
  ]

  const topContent = [
    {
      id: 1,
      title: '45분 만에 만드는 Todo SaaS',
      type: 'tutorial',
      views: 12402,
      completion: 42,
      rating: 4.9,
    },
    {
      id: 2,
      title: '구글 소셜 로그인 (Clerk)',
      type: 'snippet',
      views: 8231,
      completion: null,
      rating: 4.8,
    },
    {
      id: 3,
      title: 'Module not found 해결법',
      type: 'doc',
      views: 5102,
      completion: 94,
      rating: 4.7,
    },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">대시보드</h1>
          <p className="text-sm text-zinc-400 mt-1">오늘의 VibeStack 현황입니다.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            리포트 다운로드
          </button>
          <Link
            href="/admin/content/new"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-500/20 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            콘텐츠 작성
          </Link>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Revenue */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">
                Total Revenue
              </p>
              <h3 className="text-2xl font-bold text-white mt-1">{kpiData.totalRevenue.value}</h3>
            </div>
            <div className="w-8 h-8 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> {kpiData.totalRevenue.change}
            </span>
            <span className="text-zinc-500">{kpiData.totalRevenue.label}</span>
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">
                Active Users
              </p>
              <h3 className="text-2xl font-bold text-white mt-1">{kpiData.activeUsers.value}</h3>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> {kpiData.activeUsers.change}
            </span>
            <span className="text-zinc-500">{kpiData.activeUsers.label}</span>
          </div>
        </div>

        {/* Content Views */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">
                Content Views
              </p>
              <h3 className="text-2xl font-bold text-white mt-1">{kpiData.contentViews.value}</h3>
            </div>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> {kpiData.contentViews.change}
            </span>
            <span className="text-zinc-500">{kpiData.contentViews.label}</span>
          </div>
        </div>

        {/* Pro Conversion */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">
                Pro Conversion
              </p>
              <h3 className="text-2xl font-bold text-white mt-1">{kpiData.proConversion.value}</h3>
            </div>
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> {kpiData.proConversion.change}
            </span>
            <span className="text-zinc-500">{kpiData.proConversion.label}</span>
          </div>
        </div>
      </div>

      {/* Middle Section: Chart & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">매출 추이 (Revenue)</h3>
            <select className="bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 rounded px-2 py-1">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>

          {/* CSS Bar Chart */}
          <div className="flex items-end justify-between h-64 gap-2 pt-4">
            {chartData.map((item, index) => (
              <div key={index} className="w-full flex flex-col items-center gap-2 group cursor-pointer">
                <div className="w-full bg-zinc-800 rounded-t relative h-full flex items-end overflow-hidden">
                  <div
                    className="w-full bg-indigo-600 opacity-80 group-hover:opacity-100 transition-all duration-1000 ease-out hover:brightness-125"
                    style={{ height: `${item.height}%` }}
                  ></div>
                </div>
                <span className="text-[10px] text-zinc-500">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">최근 활동</h3>
          <div className="space-y-6">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                {activity.type === 'alert' ? (
                  <div className="w-8 h-8 rounded-full bg-red-900/30 text-red-400 flex items-center justify-center shrink-0 text-xs">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                ) : activity.type === 'subscription' ? (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shrink-0 text-xs text-white font-bold">
                    {activity.user}
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 text-xs text-zinc-400">
                    {activity.user}
                  </div>
                )}
                <div>
                  <p className="text-sm text-zinc-200">
                    {activity.name && <span className="font-bold">{activity.name}</span>}
                    {activity.action}
                  </p>
                  <span className="text-xs text-zinc-500">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-xs text-zinc-500 hover:text-zinc-300 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors">
            모든 활동 보기
          </button>
        </div>
      </div>

      {/* Bottom: Popular Content */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">인기 콘텐츠 (Top Content)</h3>
          <a href="#" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
            전체 통계 <ArrowRight className="w-4 h-4" />
          </a>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="bg-zinc-950/50 text-zinc-500 border-b border-zinc-800 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">제목</th>
              <th className="px-6 py-4 font-medium">타입</th>
              <th className="px-6 py-4 font-medium text-center">조회수</th>
              <th className="px-6 py-4 font-medium text-center">완료율</th>
              <th className="px-6 py-4 font-medium text-right">평점</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 text-zinc-300">
            {topContent.map((content) => (
              <tr key={content.id} className="hover:bg-zinc-800/50 transition-colors">
                <td className="px-6 py-4 font-medium">{content.title}</td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs px-2 py-0.5 rounded border ${
                      content.type === 'tutorial'
                        ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                        : content.type === 'snippet'
                        ? 'bg-zinc-800 text-zinc-300 border-zinc-700'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}
                  >
                    {content.type === 'tutorial'
                      ? 'Tutorial'
                      : content.type === 'snippet'
                      ? 'Snippet'
                      : 'Doc'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">{content.views.toLocaleString()}</td>
                <td className="px-6 py-4 text-center">
                  {content.completion ? (
                    <span className="text-emerald-400">{content.completion}%</span>
                  ) : (
                    <span className="text-zinc-500">-</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right flex items-center justify-end gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  {content.rating}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
