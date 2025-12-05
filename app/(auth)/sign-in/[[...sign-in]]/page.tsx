'use client'

import { SignIn } from "@clerk/nextjs"
import Link from 'next/link'

export default function SignInPage() {
    return (
        <div className="w-full max-w-sm animate-fade-in">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">다시 오신 것을 환영해요</h1>
                <p className="text-sm text-zinc-400">계속하려면 로그인이 필요합니다.</p>
            </div>

            {/* Clerk Sign In Component with Custom Styling */}
            <SignIn
                appearance={{
                    elements: {
                        rootBox: "w-full",
                        card: "bg-transparent shadow-none w-full",
                        headerTitle: "hidden",
                        headerSubtitle: "hidden",
                        socialButtonsBlockButton: "w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-2.5 rounded-lg hover:bg-zinc-200 transition-colors border-0",
                        socialButtonsBlockButton__google: "bg-white text-black hover:bg-zinc-200",
                        socialButtonsBlockButton__github: "bg-white text-black hover:bg-zinc-200",
                        socialButtonsBlockButton__apple: "bg-white text-black hover:bg-zinc-200",
                        socialButtonsBlockButtonText: "font-bold text-sm",
                        socialButtonsIconButton: "border border-zinc-800",
                        dividerLine: "bg-zinc-800",
                        dividerText: "text-zinc-500 text-xs uppercase bg-zinc-950 px-2",
                        formButtonPrimary: "w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-lg transition-colors shadow-lg shadow-indigo-500/20",
                        formFieldInput: "w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all",
                        formFieldLabel: "block text-xs font-bold text-zinc-400 mb-1.5 ml-1",
                        footerActionLink: "text-indigo-400 hover:text-indigo-300 font-bold hover:underline",
                        identityPreviewText: "text-white",
                        identityPreviewEditButton: "text-indigo-400 hover:text-indigo-300",
                        formFieldInputShowPasswordButton: "text-zinc-400 hover:text-white",
                        otpCodeFieldInput: "bg-zinc-900 border-zinc-800 text-white",
                        formResendCodeLink: "text-indigo-400 hover:text-indigo-300",
                        alertText: "text-sm text-zinc-300",
                        formHeaderTitle: "hidden",
                        formHeaderSubtitle: "hidden",
                    },
                    layout: {
                        socialButtonsPlacement: "top",
                        socialButtonsVariant: "blockButton",
                    },
                }}
                routing="path"
                path="/sign-in"
                signUpUrl="/sign-up"
                afterSignInUrl="/"
            />

            {/* Footer Links - Positioned below Clerk component */}
            <p className="mt-6 text-center text-xs text-zinc-500">
                아직 계정이 없으신가요?{' '}
                <Link href="/sign-up" className="text-indigo-400 hover:text-indigo-300 font-bold hover:underline">
                    회원가입
                </Link>
            </p>
        </div>
    )
}
