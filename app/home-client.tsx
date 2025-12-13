'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Rocket, Code, BookOpen, Globe, Smartphone, ArrowRight,
  Search, XIcon, Check, Copy,
  ShoppingBag, PenTool, Clock, CircleCheck,
  Sparkles, Database, Languages, Users,
  AlertCircle, Layers, Zap, Flag, TriangleAlert
} from 'lucide-react'
import { FaGithub, FaGoogle, FaStripe, FaDiscord } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { UserMenu } from '@/components/layout/user-menu'

// Tutorial type
interface Tutorial {
  id: string
  title: string
  slug: string
  description: string
  estimated_time_minutes: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  gradient?: string
}

interface HomeClientProps {
  tutorials: Tutorial[]
}

export function HomeClient({ tutorials }: HomeClientProps) {
  const router = useRouter()
  const { isSignedIn } = useUser()
  const [showUserHero, setShowUserHero] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [activeSnippet, setActiveSnippet] = useState(0)
  const [showAllTutorials, setShowAllTutorials] = useState(false)

  const handleSignIn = () => {
    router.push('/sign-in')
  }

  const handleSignUp = () => {
    router.push('/sign-up')
  }

  const dismissOnboarding = () => {
    setShowUserHero(false)
  }

  const handleCopyClick = () => {
    if (!isSignedIn) {
      router.push('/sign-in')
      return
    }

    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  const handleCardClick = () => {
    if (!isSignedIn) {
      router.push('/sign-in')
      return
    }
  }

  // Helper function to get gradient based on tags/slug
  const getGradient = (tutorial: Tutorial): string => {
    if (tutorial.gradient) return tutorial.gradient

    const slug = tutorial.slug.toLowerCase()
    const tags = tutorial.tags.map(t => t.toLowerCase())

    if (slug.includes('todo') || tags.includes('saas')) return 'from-indigo-900/20 to-zinc-950'
    if (slug.includes('landing') || slug.includes('email')) return 'from-pink-900/20 to-zinc-950'
    if (slug.includes('blog') || slug.includes('portfolio')) return 'from-emerald-900/20 to-zinc-950'
    if (slug.includes('ai') || slug.includes('chatbot') || tags.includes('openai')) return 'from-purple-900/20 to-zinc-950'
    if (slug.includes('stripe') || tags.includes('payment')) return 'from-blue-900/20 to-zinc-950'
    if (slug.includes('admin') || slug.includes('dashboard')) return 'from-orange-900/20 to-zinc-950'
    if (slug.includes('chat')) return 'from-teal-900/20 to-zinc-950'
    if (slug.includes('native') || tags.includes('mobile')) return 'from-cyan-900/20 to-zinc-950'

    return 'from-zinc-900/20 to-zinc-950'
  }

  // Helper function to get icon based on tags/slug
  const getIcon = (tutorial: Tutorial) => {
    const slug = tutorial.slug.toLowerCase()
    const tags = tutorial.tags.map(t => t.toLowerCase())

    if (slug.includes('todo') || tags.includes('saas')) return <Check className="w-20 h-20 text-indigo-500/30" />
    if (slug.includes('landing') || slug.includes('email')) return <Users className="w-20 h-20 text-pink-500/30" />
    if (slug.includes('blog') || slug.includes('portfolio')) return <PenTool className="w-20 h-20 text-emerald-500/30" />
    if (slug.includes('ai') || slug.includes('chatbot')) return <Sparkles className="w-20 h-20 text-purple-500/30" />
    if (slug.includes('stripe') || tags.includes('payment')) return <ShoppingBag className="w-20 h-20 text-blue-500/30" />
    if (slug.includes('admin') || slug.includes('dashboard')) return <Layers className="w-20 h-20 text-orange-500/30" />
    if (slug.includes('chat')) return <Database className="w-20 h-20 text-teal-500/30" />
    if (slug.includes('native')) return <Smartphone className="w-20 h-20 text-cyan-500/30" />

    return <Globe className="w-20 h-20 text-zinc-500/30" />
  }

  // Helper function to get border color
  const getBorderColor = (tutorial: Tutorial): string => {
    const slug = tutorial.slug.toLowerCase()
    const tags = tutorial.tags.map(t => t.toLowerCase())

    if (slug.includes('todo') || tags.includes('saas')) return 'group-hover:border-indigo-500/50 group-hover:shadow-indigo-500/10'
    if (slug.includes('landing') || slug.includes('email')) return 'group-hover:border-pink-500/50 group-hover:shadow-pink-500/10'
    if (slug.includes('blog') || slug.includes('portfolio')) return 'group-hover:border-emerald-500/50 group-hover:shadow-emerald-500/10'
    if (slug.includes('ai') || slug.includes('chatbot')) return 'group-hover:border-purple-500/50 group-hover:shadow-purple-500/10'
    if (slug.includes('stripe') || tags.includes('payment')) return 'group-hover:border-blue-500/50 group-hover:shadow-blue-500/10'
    if (slug.includes('admin') || slug.includes('dashboard')) return 'group-hover:border-orange-500/50 group-hover:shadow-orange-500/10'
    if (slug.includes('chat')) return 'group-hover:border-teal-500/50 group-hover:shadow-teal-500/10'
    if (slug.includes('native')) return 'group-hover:border-cyan-500/50 group-hover:shadow-cyan-500/10'

    return 'group-hover:border-zinc-500/50'
  }

  // Helper function to get title color on hover
  const getTitleHoverColor = (tutorial: Tutorial): string => {
    const slug = tutorial.slug.toLowerCase()
    const tags = tutorial.tags.map(t => t.toLowerCase())

    if (slug.includes('todo') || tags.includes('saas')) return 'group-hover:text-indigo-400'
    if (slug.includes('landing') || slug.includes('email')) return 'group-hover:text-pink-400'
    if (slug.includes('blog') || slug.includes('portfolio')) return 'group-hover:text-emerald-400'
    if (slug.includes('ai') || slug.includes('chatbot')) return 'group-hover:text-purple-400'
    if (slug.includes('stripe') || tags.includes('payment')) return 'group-hover:text-blue-400'
    if (slug.includes('admin') || slug.includes('dashboard')) return 'group-hover:text-orange-400'
    if (slug.includes('chat')) return 'group-hover:text-teal-400'
    if (slug.includes('native')) return 'group-hover:text-cyan-400'

    return 'group-hover:text-zinc-300'
  }

  // Get category badge
  const getCategoryBadge = (tutorial: Tutorial): string => {
    const tags = tutorial.tags.map(t => t.toLowerCase())

    if (tags.includes('saas')) return 'SaaS'
    if (tags.includes('marketing')) return 'Marketing'
    if (tags.includes('blog')) return 'Blog'
    if (tags.includes('ai') || tags.includes('openai')) return 'AI Wrap'
    if (tags.includes('payment') || tags.includes('stripe')) return 'Payment'
    if (tags.includes('admin')) return 'Admin'
    if (tags.includes('chat')) return 'Realtime'
    if (tags.includes('mobile') || tags.includes('react-native')) return 'Mobile'

    return 'Project'
  }

  // Get difficulty display
  const getDifficultyDisplay = (difficulty: string) => {
    if (difficulty === 'beginner') return { text: '초급', color: 'text-emerald-400' }
    if (difficulty === 'intermediate') return { text: '중급', color: 'text-yellow-400' }
    if (difficulty === 'advanced') return { text: '고급', color: 'text-red-400' }
    return { text: '초급', color: 'text-emerald-400' }
  }

  // Snippet Items (IDE Style)
  const snippetItems = [
    {
      title: 'Google Login',
      category: 'Auth',
      icon: 'react',
      iconColor: 'text-blue-400',
      code: `import { useAuth } from '@clerk/nextjs';

export default function LoginBtn() {
  const { signIn } = useAuth();

  return (
    <button onClick={() => signIn('google')}>
      구글 로그인 시작
    </button>
  );
}`,
    },
    {
      title: 'Stripe Payments',
      category: 'Pay',
      icon: 'stripe',
      iconColor: 'text-indigo-400',
      code: `import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createCheckout() {
  const session = await stripe.checkout.sessions.create({
    line_items: [{ price: 'price_xxx', quantity: 1 }],
    mode: 'payment',
    success_url: 'https://example.com/success',
  });

  return session.url;
}`,
    },
    {
      title: 'Supabase Setup',
      category: 'DB',
      icon: 'database',
      iconColor: 'text-emerald-400',
      code: `import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function getUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('*');

  return data;
}`,
    },
    {
      title: 'Email Service',
      category: 'API',
      icon: 'mail',
      iconColor: 'text-yellow-400',
      code: `import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail(to: string, subject: string) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: '<h1>안녕하세요</h1>',
  });
}`,
    },
  ]

  // Quick Menu Items (App Icon Style)
  const quickMenuItems = [
    {
      title: '시작 가이드',
      icon: Rocket,
      href: '/docs?category=getting-started',
      hoverBorder: 'group-hover:border-blue-500/50',
      hoverGlow: 'group-hover:shadow-[0_0_15px_rgba(59,130,246,0.15)]',
      hoverIcon: 'group-hover:text-blue-400',
    },
    {
      title: '기능 구현',
      icon: Code,
      href: '/docs?category=implementation',
      hoverBorder: 'group-hover:border-purple-500/50',
      hoverGlow: 'group-hover:shadow-[0_0_15px_rgba(168,85,247,0.15)]',
      hoverIcon: 'group-hover:text-purple-400',
    },
    {
      title: '프롬프트',
      icon: Sparkles,
      href: '/docs?category=prompts',
      hoverBorder: 'group-hover:border-indigo-500/50',
      hoverGlow: 'group-hover:shadow-[0_0_15px_rgba(99,102,241,0.15)]',
      hoverIcon: 'group-hover:text-indigo-400',
      badgeColor: 'bg-indigo-500',
    },
    {
      title: '에러 해결',
      icon: AlertCircle,
      href: '/docs?category=errors',
      hoverBorder: 'group-hover:border-red-500/50',
      hoverGlow: 'group-hover:shadow-[0_0_15px_rgba(239,68,68,0.15)]',
      hoverIcon: 'group-hover:text-red-400',
      badgeColor: 'bg-red-500',
    },
    {
      title: '용어 사전',
      icon: BookOpen,
      href: '/docs/glossary',
      hoverBorder: 'group-hover:border-emerald-500/50',
      hoverGlow: 'group-hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]',
      hoverIcon: 'group-hover:text-emerald-400',
    },
    {
      title: '튜토리얼',
      icon: Layers,
      href: '/tutorials',
      hoverBorder: 'group-hover:border-orange-500/50',
      hoverGlow: 'group-hover:shadow-[0_0_15px_rgba(249,115,22,0.15)]',
      hoverIcon: 'group-hover:text-orange-400',
    },
    {
      title: '스니펫',
      icon: Zap,
      href: '/snippets',
      hoverBorder: 'group-hover:border-cyan-500/50',
      hoverGlow: 'group-hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]',
      hoverIcon: 'group-hover:text-cyan-400',
    },
  ]

  // Slider auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3) // 3 slides total
    }, 4000) // 4 seconds per slide

    return () => clearInterval(timer)
  }, [])

  // Display first 6 tutorials, with option to show all
  const displayedTutorials = showAllTutorials ? tutorials : tutorials.slice(0, 6)

  return (
    <>
      <style jsx global>{`
        body {
          background-color: #09090b;
          color: #fafafa;
          font-family: 'Inter', sans-serif;
          overflow-x: hidden;
        }

        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #09090b; }
        ::-webkit-scrollbar-thumb { background: #27272a; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #3f3f46; }

        .glass-effect {
          background: rgba(9, 9, 11, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        .hero-gradient {
          background: radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.15) 0%, rgba(9, 9, 11, 0) 60%);
        }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="min-h-screen flex flex-col relative selection:bg-indigo-500/30">

        {/* DUAL LAYER HEADER */}
        <header className="sticky top-0 z-50 glass-effect border-b border-zinc-800 transition-all duration-300">

          {/* Top Row: Logo, Search, Actions */}
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-bold text-lg group-hover:rotate-3 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.3)]">V</div>
              <span className="font-bold text-lg tracking-tight hidden sm:block">VibeStack</span>
            </Link>

            {/* Search Bar (Central) */}
            <div className="hidden md:flex flex-1 max-w-xl relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-12 py-2 bg-zinc-900/50 border border-zinc-700 rounded-full text-sm placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:bg-zinc-900 transition-all text-white"
                placeholder="무엇을 도와드릴까요? (예: '로그인 구현', '에러 해결')"
              />
              <div className="absolute inset-y-0 right-2 flex items-center gap-1">
                <span className="text-[10px] text-zinc-500 bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5">⌘K</span>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {isSignedIn ? (
                <>
                  <button className="text-zinc-400 hover:text-white transition-colors">
                    <FaDiscord className="w-5 h-5" />
                  </button>
                  <UserMenu />
                </>
              ) : (
                <>
                  <button onClick={handleSignIn} className="text-zinc-400 hover:text-white text-sm font-medium px-2">로그인</button>
                  <button onClick={handleSignUp} className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-zinc-200 transition-colors">
                    시작하기
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Bottom Row: Mega Menu Navigation */}
          <div className="border-t border-zinc-800/50 bg-zinc-950/50">
            <div className="max-w-7xl mx-auto px-4 h-11 flex items-center gap-8 overflow-x-auto no-scrollbar">

              {/* Nav Item: Projects */}
              <div className="group relative h-full flex items-center">
                <Link href="/tutorials" className="text-sm font-medium text-zinc-400 group-hover:text-white flex items-center gap-1.5 h-full border-b-2 border-transparent group-hover:border-indigo-500 transition-all">
                  <Rocket className="w-3 h-3" /> 프로젝트
                </Link>
                {/* Mega Menu */}
                <div className="absolute top-full left-0 mt-0 w-72 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 p-2 z-50 transform origin-top-left">
                  <div className="text-[10px] font-bold text-zinc-500 px-3 py-2 uppercase tracking-wider">Categories</div>
                  <Link href="/tutorials" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800 text-sm text-zinc-300 hover:text-white transition-colors group/item">
                    <div className="w-8 h-8 rounded bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover/item:bg-indigo-500 group-hover/item:text-white transition-colors"><Globe className="w-4 h-4" /></div>
                    <div>
                      <div className="font-semibold">Web SaaS</div>
                      <div className="text-xs text-zinc-500">Next.js, React</div>
                    </div>
                  </Link>
                  <Link href="/tutorials" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800 text-sm text-zinc-300 hover:text-white transition-colors group/item">
                    <div className="w-8 h-8 rounded bg-pink-500/10 text-pink-400 flex items-center justify-center group-hover/item:bg-pink-500 group-hover/item:text-white transition-colors"><Smartphone className="w-4 h-4" /></div>
                    <div>
                      <div className="font-semibold">Mobile App</div>
                      <div className="text-xs text-zinc-500">Flutter, RN</div>
                    </div>
                  </Link>
                  <div className="h-px bg-zinc-800 my-2" />
                  <Link href="/tutorials" className="block px-3 py-2 text-xs text-indigo-400 hover:text-indigo-300 text-center font-bold hover:underline">
                    전체 프로젝트 보기 <ArrowRight className="inline w-3 h-3 ml-1" />
                  </Link>
                </div>
              </div>

              {/* Nav Item: Snippets */}
              <div className="group relative h-full flex items-center">
                <Link href="/snippets" className="text-sm font-medium text-zinc-400 group-hover:text-white flex items-center gap-1.5 h-full border-b-2 border-transparent group-hover:border-indigo-500 transition-all">
                  <Code className="w-3 h-3" /> 스니펫
                </Link>
                {/* Mega Menu */}
                <div className="absolute top-full left-0 mt-0 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 p-2 z-50 transform origin-top-left">
                  <div className="text-[10px] font-bold text-zinc-500 px-3 py-2 uppercase tracking-wider">Most Copied</div>
                  <Link href="/" className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-zinc-800 text-sm text-zinc-300 hover:text-white transition-colors">
                    <span className="flex items-center gap-2"><FaGoogle className="w-4 h-4 text-zinc-500" /> Google Auth</span>
                    <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded">Top 1</span>
                  </Link>
                  <Link href="/" className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-zinc-800 text-sm text-zinc-300 hover:text-white transition-colors">
                    <span className="flex items-center gap-2"><FaStripe className="w-4 h-4 text-zinc-500" /> Stripe Pay</span>
                    <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded">Top 2</span>
                  </Link>
                  <div className="h-px bg-zinc-800 my-2" />
                  <Link href="/snippets" className="block px-3 py-2 text-xs text-indigo-400 hover:text-indigo-300 text-center font-bold hover:underline">
                    50개 스니펫 전체보기 <ArrowRight className="inline w-3 h-3 ml-1" />
                  </Link>
                </div>
              </div>

              {/* Nav Item: Docs */}
              <div className="group relative h-full flex items-center">
                <Link href="/docs" className="text-sm font-medium text-zinc-400 group-hover:text-white flex items-center gap-1.5 h-full border-b-2 border-transparent group-hover:border-indigo-500 transition-all">
                  <BookOpen className="w-3 h-3" /> 문서
                </Link>
                {/* Mega Menu */}
                <div className="absolute top-full left-0 mt-0 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 p-2 z-50 transform origin-top-left">
                  <div className="text-[10px] font-bold text-zinc-500 px-3 py-2 uppercase tracking-wider">Survival Kit</div>
                  <Link href="/" className="block px-3 py-2 rounded-lg hover:bg-zinc-800 text-sm text-zinc-300 hover:text-white transition-colors">
                    🚨 <b>에러 해결</b> <span className="text-red-400 text-[10px] ml-1">SOS</span>
                  </Link>
                  <Link href="/" className="block px-3 py-2 rounded-lg hover:bg-zinc-800 text-sm text-zinc-300 hover:text-white transition-colors">
                    💬 <b>프롬프트 공식</b>
                  </Link>
                  <Link href="/" className="block px-3 py-2 rounded-lg hover:bg-zinc-800 text-sm text-zinc-300 hover:text-white transition-colors">
                    🧠 <b>개념 사전</b>
                  </Link>
                  <div className="h-px bg-zinc-800 my-2" />
                  <Link href="/docs" className="block px-3 py-2 text-xs text-indigo-400 hover:text-indigo-300 text-center font-bold hover:underline">
                    문서 전체보기 <ArrowRight className="inline w-3 h-3 ml-1" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </header>

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 space-y-16">

          {/* VISITOR HERO (Marketing) - Slider */}
          {!showUserHero && (
            <section className="text-center py-20 relative hero-gradient transition-all duration-500 min-h-[550px] flex flex-col justify-center overflow-hidden">

              {/* Slider Container */}
              <div className="relative w-full max-w-5xl mx-auto h-[320px]">

                {/* Slide 1: Main Value */}
                <Link
                  href="/snippets"
                  className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ease-in-out cursor-pointer group ${
                    currentSlide === 0
                      ? 'translate-x-0 opacity-100'
                      : currentSlide > 0
                        ? '-translate-x-full opacity-0'
                        : 'translate-x-full opacity-0'
                  }`}
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-6 animate-pulse-slow">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
                    </span>
                    Vibe Coding: AI 시대의 새로운 표준
                  </div>
                  <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight leading-tight group-hover:scale-105 transition-transform">
                    <span className="text-white">복붙만 하세요.</span><br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient">
                      나머지는 AI가 합니다.
                    </span>
                  </h1>
                  <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                    코딩을 몰라도 괜찮습니다. VibeStack의 가이드를<br className="hidden sm:block" />
                    Cursor에 붙여넣기만 하면 실제 작동하는 서비스가 완성됩니다.
                  </p>
                </Link>

                {/* Slide 2: Glossary Feature */}
                <Link
                  href="/docs/glossary"
                  className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ease-in-out cursor-pointer group ${
                    currentSlide === 1
                      ? 'translate-x-0 opacity-100'
                      : currentSlide > 1
                        ? '-translate-x-full opacity-0'
                        : 'translate-x-full opacity-0'
                  }`}
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium mb-6">
                    <Languages className="w-3 h-3" />
                    <span>바이브 코더 필수템</span>
                  </div>
                  <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight leading-tight group-hover:scale-105 transition-transform">
                    <span className="text-white">Cursor가 뭐래?</span><br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400">
                      API? 배포? 커밋?
                    </span>
                  </h1>
                  <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                    AI가 뱉는 개발 용어, 외계어 같나요?<br className="hidden sm:block" />
                    <span className="text-emerald-300 font-semibold">450개 용어사전</span>이 초등학생도 이해할 수 있는 말로 통역해드립니다.
                  </p>
                </Link>

                {/* Slide 3: Success Rate */}
                <Link
                  href="/tutorials"
                  className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ease-in-out cursor-pointer group ${
                    currentSlide === 2
                      ? 'translate-x-0 opacity-100'
                      : currentSlide > 2
                        ? '-translate-x-full opacity-0'
                        : 'translate-x-full opacity-0'
                  }`}
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium mb-6">
                    <CircleCheck className="w-3 h-3" />
                    <span>검증된 레시피</span>
                  </div>
                  <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight leading-tight group-hover:scale-105 transition-transform">
                    <span className="text-white">성공률</span>{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400">
                      94%
                    </span>
                    <br />
                    <span className="text-white">실패할 수가 없습니다</span>
                  </h1>
                  <p className="text-zinc-400 text-lg mb-6 max-w-xl mx-auto leading-relaxed">
                    매 단계마다 프롬프트 제공. Cursor에 붙여넣기만 하면 끝.<br className="hidden sm:block" />
                    <span className="text-blue-300 font-semibold">10,000명</span>이 완성한 검증된 프로젝트 튜토리얼.
                  </p>
                  {/* Trust Indicators */}
                  <div className="flex flex-wrap items-center justify-center gap-6 text-sm mb-4">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span><strong className="text-white">10,247명</strong> 완성</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span>평균 <strong className="text-white">1.5시간</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-400">
                      <CircleCheck className="w-4 h-4 text-blue-400" />
                      <span><strong className="text-blue-400">94%</strong> 성공률</span>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Static Buttons */}
              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                <button onClick={handleSignUp} className="w-full sm:w-auto px-8 py-3.5 bg-white text-black rounded-full font-bold hover:bg-zinc-200 transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2">
                  <FaGithub className="w-5 h-5" />
                  <span>무료로 시작하기</span>
                </button>
                <button className="w-full sm:w-auto px-8 py-3.5 bg-zinc-900 border border-zinc-700 text-zinc-300 rounded-full font-medium hover:bg-zinc-800 transition-colors">
                  작동 원리 보기
                </button>
              </div>

              {/* Indicators */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
                <button
                  onClick={() => setCurrentSlide(0)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    currentSlide === 0 ? 'w-8 bg-white' : 'w-2 bg-zinc-600 hover:bg-zinc-400'
                  }`}
                  aria-label="Go to slide 1"
                />
                <button
                  onClick={() => setCurrentSlide(1)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    currentSlide === 1 ? 'w-8 bg-white' : 'w-2 bg-zinc-600 hover:bg-zinc-400'
                  }`}
                  aria-label="Go to slide 2"
                />
                <button
                  onClick={() => setCurrentSlide(2)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    currentSlide === 2 ? 'w-8 bg-white' : 'w-2 bg-zinc-600 hover:bg-zinc-400'
                  }`}
                  aria-label="Go to slide 3"
                />
              </div>
            </section>
          )}

          {/* USER HERO (Soft Onboarding) */}
          {showUserHero && (
            <section className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-zinc-900/40 p-6 sm:p-10 transition-all duration-500">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

              <button onClick={dismissOnboarding} className="absolute top-4 right-4 text-zinc-500 hover:text-white p-2 z-20">
                <XIcon className="w-5 h-5" />
              </button>

              <div className="relative z-10 max-w-4xl">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-2.5 py-1 rounded border border-indigo-500/20">맞춤 추천</span>
                  <h2 className="text-2xl font-bold text-white">민준님, 오늘 어떤 프로젝트를 만드실 건가요?</h2>
                </div>
                <p className="text-zinc-400 mb-8 text-sm sm:text-base">3분만 투자해서 설정을 완료하면, 실패 없는 튜토리얼과 프롬프트를 추천해 드려요.</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Option 1 */}
                  <button className="group flex flex-col items-start p-5 rounded-xl bg-zinc-800/40 border border-zinc-700 hover:border-indigo-500 hover:bg-zinc-800 transition-all text-left">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/10">
                      <Rocket className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-base text-zinc-100 mb-1">나만의 SaaS 만들기</span>
                    <span className="text-xs text-zinc-500 group-hover:text-zinc-400">Todo, 대시보드, 회원관리</span>
                  </button>
                  {/* Option 2 */}
                  <button className="group flex flex-col items-start p-5 rounded-xl bg-zinc-800/40 border border-zinc-700 hover:border-pink-500 hover:bg-zinc-800 transition-all text-left">
                    <div className="w-10 h-10 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-pink-500/10">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-base text-zinc-100 mb-1">커머스 / 쇼핑몰</span>
                    <span className="text-xs text-zinc-500 group-hover:text-zinc-400">상품 판매, 결제 연동</span>
                  </button>
                  {/* Option 3 */}
                  <button className="group flex flex-col items-start p-5 rounded-xl bg-zinc-800/40 border border-zinc-700 hover:border-emerald-500 hover:bg-zinc-800 transition-all text-left">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/10">
                      <PenTool className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-base text-zinc-100 mb-1">블로그 / 포트폴리오</span>
                    <span className="text-xs text-zinc-500 group-hover:text-zinc-400">콘텐츠 발행, SEO 최적화</span>
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* QUICK ICON MENU (App Icon Style) */}
          <section className="border-y border-zinc-800/50 bg-zinc-950/30 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 py-10">


              {/* Icon Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 md:gap-6">
                {quickMenuItems.map((item, index) => {
                  const IconComponent = item.icon
                  return (
                    <Link
                      key={index}
                      href={item.href}
                      className="group flex flex-col items-center gap-3"
                    >
                      <div className={`relative w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center transition-all duration-300 ${item.hoverBorder} group-hover:bg-zinc-800 ${item.hoverGlow} group-hover:-translate-y-1`}>
                        {/* Subtle inner glow on hover */}
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />

                        {/* Icon */}
                        <IconComponent className={`w-7 h-7 text-zinc-400 ${item.hoverIcon} transition-colors relative z-10`} />


                      </div>

                      {/* Label */}
                      <span className="text-[11px] font-medium text-zinc-500 group-hover:text-zinc-300 transition-colors text-center">
                        {item.title}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>

          {/* PROJECTS SECTION - Gallery Grid (3x2) */}
          <section id="tutorials" className="py-20 border-t border-zinc-800/50">
            <div className="max-w-7xl mx-auto px-4">
              {/* Header */}
              <div className="text-center mb-16">
                <span className="text-indigo-400 font-bold tracking-wider text-xs uppercase mb-2 block">Project Gallery</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  상상을 현실로 만드는 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">실전 레시피</span>
                </h2>
                <p className="text-zinc-400 max-w-2xl mx-auto">
                  이론은 건너뛰세요. 검증된 프로젝트 가이드를 따라하며 내 서비스를 완성하세요.
                </p>
              </div>

              {/* GRID CONTAINER */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">

                {displayedTutorials.map((tutorial) => {
                  const difficulty = getDifficultyDisplay(tutorial.difficulty)

                  return (
                    <Link key={tutorial.id} href={`/tutorials/${tutorial.slug}`} onClick={handleCardClick} className="group flex flex-col">
                      {/* Thumbnail */}
                      <div className={`relative aspect-video rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 mb-4 ${getBorderColor(tutorial)} transition-all shadow-lg`}>
                        <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(tutorial)} z-10`} />
                        {/* Icon/Image Placeholder */}
                        <div className="absolute inset-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                          {getIcon(tutorial)}
                        </div>
                        {/* Badges */}
                        <div className="absolute top-3 left-3 z-20 flex gap-1.5">
                          <span className="bg-black/80 backdrop-blur border border-zinc-700 text-zinc-300 text-[10px] font-bold px-2 py-1 rounded">
                            {getCategoryBadge(tutorial)}
                          </span>
                        </div>
                      </div>
                      {/* Info */}
                      <div>
                        <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {tutorial.estimated_time_minutes}분
                          </span>
                          <span className={`flex items-center gap-1 ${difficulty.color}`}>
                            <Flag className="w-3 h-3" /> {difficulty.text}
                          </span>
                        </div>
                        <h3 className={`text-lg font-bold text-white mb-1 ${getTitleHoverColor(tutorial)} transition-colors`}>
                          {tutorial.title}
                        </h3>
                        <p className="text-sm text-zinc-400 line-clamp-2">{tutorial.description}</p>
                      </div>
                    </Link>
                  )
                })}

              </div>

              {/* LOAD MORE BUTTON */}
              {!showAllTutorials && tutorials.length > 6 && (
                <div className="mt-16 text-center">
                  <button
                    onClick={() => setShowAllTutorials(true)}
                    className="group relative inline-flex items-center gap-2 px-8 py-3 bg-zinc-900 border border-zinc-700 rounded-full text-zinc-300 font-bold hover:bg-zinc-800 hover:text-white hover:border-zinc-500 transition-all active:scale-95"
                  >
                    <span>더 많은 프로젝트 보기</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />

                    {/* Glow Effect */}
                    <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>
              )}

            </div>
          </section>

          {/* DOCS SECTION: Bento Grid Layout */}
          <section id="docs" className="py-20 border-t border-zinc-800/50">
            <div className="max-w-7xl mx-auto px-4">
              {/* Title */}
              <div className="mb-10 flex items-end justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">지식 보관소</h2>
                  <p className="text-zinc-400">개발의 시작부터 에러 해결까지, 필요한 모든 가이드.</p>
                </div>
                <Link href="/docs" className="hidden sm:flex items-center text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                  전체보기 <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              {/* BENTO GRID */}
              <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 md:h-[500px]">

                {/* 1. 시작 가이드 (Large Vertical - Main Focus) */}
                <Link
                  href="/docs?category=getting-started"
                  className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 p-8 flex flex-col justify-end hover:border-indigo-500/50 transition-all min-h-[400px] md:min-h-0"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent z-10" />

                  {/* Background Icon/Image */}
                  <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Flag className="w-36 h-36 text-indigo-500" />
                  </div>

                  <div className="relative z-20">
                    <div className="inline-block px-3 py-1 mb-4 text-xs font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                      필독
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2">시작 가이드</h3>
                    <p className="text-zinc-400 mb-6 max-w-sm">
                      AI 코딩이 처음이신가요? 환경 설정부터 첫 배포까지, 가장 완벽한 로드맵을 따라오세요.
                    </p>
                    <button className="bg-white text-black px-6 py-2.5 rounded-lg font-bold hover:bg-zinc-200 transition-colors inline-flex items-center gap-2">
                      <span>로드맵 시작하기</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </Link>

                {/* 2. 에러 해결 (Horizontal - Alert Style) */}
                <Link
                  href="/docs?category=errors"
                  className="md:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-red-500/50 transition-all group relative overflow-hidden flex flex-col justify-center min-h-[200px] md:min-h-0"
                >
                  <div className="absolute top-4 right-4 text-red-500/10 group-hover:text-red-500/20 transition-colors">
                    <TriangleAlert className="w-24 h-24" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-1 group-hover:text-red-400 transition-colors">
                    🚨 에러 해결소
                  </h4>
                  <p className="text-sm text-zinc-400">
                    "빨간 줄이 떴어요..." 당황하지 마세요. 자주 발생하는 에러와 해결책을 모았습니다.
                  </p>
                </Link>

                {/* 3. 기능 구현 가이드 (Square) */}
                <Link
                  href="/docs?category=implementation"
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-emerald-500/50 transition-all group flex flex-col justify-between min-h-[200px] md:min-h-0"
                >
                  <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center text-xl mb-4">
                    <Code className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                      기능 구현
                    </h4>
                    <p className="text-xs text-zinc-500">
                      로그인, 결제, 게시판 등<br />필수 기능 원리 파악
                    </p>
                  </div>
                </Link>

                {/* 4. 프롬프트 작성법 (Square) */}
                <Link
                  href="/docs?category=prompts"
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-purple-500/50 transition-all group flex flex-col justify-between min-h-[200px] md:min-h-0"
                >
                  <div className="w-10 h-10 bg-purple-500/10 text-purple-400 rounded-lg flex items-center justify-center text-xl mb-4">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">
                      프롬프트 공식
                    </h4>
                    <p className="text-xs text-zinc-500">
                      AI가 찰떡같이 알아듣는<br />질문 작성 노하우
                    </p>
                  </div>
                </Link>

              </div>

              {/* Bottom Row: Concepts/Glossary (Wide Bar) */}
              <div className="mt-4 grid grid-cols-1">
                <Link
                  href="/docs/glossary"
                  className="group flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:bg-zinc-900 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-zinc-700 transition-all">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">개념 & 용어 사전</h4>
                      <p className="text-xs text-zinc-500">API, 서버, 클라이언트... 개발 용어가 외계어 같다면?</p>
                    </div>
                  </div>
                  <div className="text-zinc-600 group-hover:text-white pr-2 transition-colors">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </Link>
              </div>

              {/* Mobile "전체보기" link */}
              <div className="mt-4 sm:hidden text-center">
                <Link href="/docs" className="text-sm font-medium text-zinc-400 hover:text-white">전체 문서 보기 →</Link>
              </div>
            </div>
          </section>

          {/* SNIPPETS SECTION: IDE Style */}
          <section id="snippets" className="py-20">
            <div className="max-w-7xl mx-auto px-4">
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-white mb-2">필수 기능 스니펫</h2>
                <p className="text-zinc-400">복잡한 구현? 복사-붙여넣기 한 번이면 끝납니다.</p>
              </div>

              {/* IDE Container */}
              <div className="bg-[#1e1e1e] rounded-xl border border-zinc-800 overflow-hidden shadow-2xl flex flex-col md:flex-row h-auto md:h-[500px]">

                {/* Sidebar (List) */}
                <div className="w-full md:w-1/3 border-r border-zinc-800 bg-zinc-900/50 flex flex-col">
                  <div className="p-4 border-b border-zinc-800 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    EXPLORER
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {snippetItems.map((snippet, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveSnippet(index)}
                        className={`w-full text-left px-4 py-3 rounded border-l-2 text-sm font-medium flex items-center justify-between group transition-colors ${
                          activeSnippet === index
                            ? 'bg-zinc-800 border-indigo-500 text-white'
                            : 'border-transparent text-zinc-400 hover:bg-zinc-800/50'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {snippet.icon === 'react' && <Code className={snippet.iconColor} />}
                          {snippet.icon === 'stripe' && <FaStripe className={snippet.iconColor} />}
                          {snippet.icon === 'database' && <Database className={snippet.iconColor} />}
                          {snippet.icon === 'mail' && <Sparkles className={snippet.iconColor} />}
                          {snippet.title}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                          activeSnippet === index ? 'bg-zinc-950 text-zinc-400' : 'bg-zinc-950/50 text-zinc-600'
                        }`}>
                          {snippet.category}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="p-4 border-t border-zinc-800">
                    <Link
                      href="/snippets"
                      className="block w-full text-center py-2 text-xs font-bold text-zinc-500 hover:text-white border border-zinc-800 rounded hover:bg-zinc-800 transition-colors"
                    >
                      스니펫 전체보기
                    </Link>
                  </div>
                </div>

                {/* Main Code Area */}
                <div className="flex-1 bg-[#1e1e1e] flex flex-col min-h-[300px]">
                  {(() => {
                    const currentSnippet = snippetItems[activeSnippet]
                    if (!currentSnippet) return null

                    return (
                      <>
                        {/* Tab Bar */}
                        <div className="h-10 bg-[#252526] flex items-center px-2 gap-1 border-b border-zinc-800">
                          <div className="px-3 py-1.5 bg-[#1e1e1e] text-zinc-300 text-xs flex items-center gap-2 border-t border-indigo-500 rounded-t-sm">
                            {currentSnippet.icon === 'react' && <Code className={`w-3 h-3 ${currentSnippet.iconColor}`} />}
                            {currentSnippet.icon === 'stripe' && <FaStripe className={`w-3 h-3 ${currentSnippet.iconColor}`} />}
                            {currentSnippet.icon === 'database' && <Database className={`w-3 h-3 ${currentSnippet.iconColor}`} />}
                            {currentSnippet.icon === 'mail' && <Sparkles className={`w-3 h-3 ${currentSnippet.iconColor}`} />}
                            {currentSnippet.title}.tsx
                          </div>
                        </div>

                        {/* Code Content */}
                        <div className="flex-1 p-6 font-mono text-sm overflow-auto relative group">
                          {/* Copy Button */}
                          <button
                            onClick={handleCopyClick}
                            className="absolute top-4 right-4 bg-zinc-800 hover:bg-indigo-600 text-zinc-300 hover:text-white px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center gap-2 shadow-lg z-10"
                          >
                            <Copy className="w-3 h-3" /> 복사하기
                          </button>

                          {/* Code Display */}
                          <pre className="text-zinc-400 leading-relaxed whitespace-pre-wrap">
                            {currentSnippet.code}
                          </pre>
                        </div>
                      </>
                    )
                  })()}
                </div>

              </div>

              {/* Mobile "전체보기" link */}
              <div className="mt-4 sm:hidden text-center">
                <Link href="/snippets" className="text-sm font-medium text-zinc-400 hover:text-white">전체 스니펫 보기 →</Link>
              </div>
            </div>
          </section>

        </main>

        {/* Footer */}
        <footer className="border-t border-zinc-800 mt-20 py-10 bg-zinc-950">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-zinc-800 rounded flex items-center justify-center text-white text-xs font-bold">V</div>
              <span className="text-zinc-500 text-sm font-medium">© 2024 VibeStack. All rights reserved.</span>
            </div>
            <div className="flex gap-8 text-sm text-zinc-500 font-medium">
              <Link href="/terms" className="hover:text-white transition-colors">이용약관</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">개인정보처리방침</Link>
              <Link href="/" className="hover:text-white transition-colors flex items-center gap-1"><FaDiscord className="w-4 h-4" /> 커뮤니티</Link>
            </div>
          </div>
        </footer>


        {/* TOAST: Copy Success */}
        <div className={`fixed bottom-8 right-8 bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-[70] transition-all duration-300 ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <div className="w-6 h-6 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center">
            <Check className="w-3 h-3" />
          </div>
          <div>
            <h4 className="font-bold text-sm">프롬프트 복사 완료!</h4>
            <p className="text-xs text-zinc-400">Cursor (Ctrl+I)에 붙여넣기 하세요.</p>
          </div>
        </div>

      </div>
    </>
  )
}
