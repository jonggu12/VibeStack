'use client'

import Link from 'next/link'
import { ArrowRight, Quote } from 'lucide-react'

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <style jsx global>{`
                body {
                    background-color: #09090b;
                    color: #fafafa;
                    font-family: 'Inter', sans-serif;
                }
            `}</style>

            <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
                {/* LEFT COLUMN: Branding (Hidden on Mobile) */}
                <div className="relative hidden lg:flex flex-col justify-between p-12 bg-zinc-900 overflow-hidden border-r border-zinc-800">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-zinc-900 to-zinc-900" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

                    {/* Logo */}
                    <div className="relative z-10 flex items-center gap-2">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-bold text-lg">V</div>
                        <span className="font-bold text-lg tracking-tight text-white">VibeStack</span>
                    </div>

                    {/* Testimonial / Copy */}
                    <div className="relative z-10 max-w-lg">
                        <div className="mb-6 text-indigo-400">
                            <Quote className="w-12 h-12 scale-x-[-1] fill-current" />
                        </div>
                        <blockquote className="text-2xl font-medium text-white leading-relaxed mb-6">
                            "VibeStack 덕분에 코딩을 전혀 모르는 저도 3일 만에 SaaS를 런칭했습니다. 단순한 강의가 아니라 진짜 실행 도구입니다."
                        </blockquote>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 border border-white/10" />
                            <div>
                                <p className="font-bold text-white">박지훈</p>
                                <p className="text-sm text-zinc-400">Indie Hacker, Pro User</p>
                            </div>
                        </div>
                        <div className="text-indigo-400 flex justify-end">
                            <Quote className="w-12 h-12 fill-current" />
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Auth Form */}
                <div className="flex flex-col justify-center items-center p-8 bg-zinc-950 relative">
                    {/* Top Right Actions */}
                    <Link href="/" className="absolute top-8 right-8 text-sm text-zinc-500 hover:text-white transition-colors flex items-center gap-2">
                        홈으로 이동 <ArrowRight className="w-4 h-4" />
                    </Link>

                    {/* Mobile Logo (Visible only on Mobile) */}
                    <div className="lg:hidden mb-8 flex items-center gap-2">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-bold text-lg">V</div>
                        <span className="font-bold text-lg tracking-tight text-white">VibeStack</span>
                    </div>

                    {/* Main Content */}
                    {children}

                    {/* Footer Info */}
                    <div className="absolute bottom-8 text-center w-full">
                        <p className="text-[10px] text-zinc-600">
                            &copy; 2024 VibeStack Inc.
                            <Link href="/" className="hover:text-zinc-500 ml-2">Terms</Link>
                            <Link href="/" className="hover:text-zinc-500 ml-2">Privacy</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}
