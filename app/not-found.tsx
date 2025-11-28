'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function NotFound() {
  // Mark this as a not-found page to prevent onboarding modal from triggering
  useEffect(() => {
    document.body.setAttribute('data-page-type', 'not-found')
    return () => {
      document.body.removeAttribute('data-page-type')
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-[#09090b]">
      <div className="mb-6 font-mono text-indigo-500 font-bold text-lg">404 Error</div>

      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
        페이지를 찾을 수 없습니다
      </h1>

      <p className="text-zinc-400 mb-10 max-w-md mx-auto">
        요청하신 페이지가 삭제되었거나 주소가 변경되었습니다.<br />
        올바른 URL인지 다시 한번 확인해주세요.
      </p>

      <div className="flex gap-4">
        <a
          href="/"
          className="bg-white text-black font-bold px-6 py-3 rounded-lg hover:bg-zinc-200 transition-colors"
        >
          홈으로 가기
        </a>
        <a
          href="mailto:support@vibestack.com"
          className="bg-zinc-900 text-zinc-300 font-medium px-6 py-3 rounded-lg hover:text-white hover:bg-zinc-800 transition-colors border border-zinc-800"
        >
          문의하기
        </a>
      </div>
    </div>
  )
}
