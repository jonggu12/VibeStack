'use client'

import Link from 'next/link'
import { TriangleAlert, RotateCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-[#09090b]">
      <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
        <TriangleAlert className="w-8 h-8 text-red-500" />
      </div>

      <h1 className="text-3xl font-bold text-white mb-2">
        서버에 문제가 발생했습니다
      </h1>

      <p className="text-zinc-400 mb-8 max-w-md mx-auto text-sm">
        일시적인 시스템 오류입니다. 잠시 후 다시 시도해주세요.<br />
        문제가 지속되면 <span className="font-mono bg-zinc-900 px-1 rounded text-zinc-300">support@vibestack.com</span>으로 연락바랍니다.
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="bg-indigo-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-indigo-500 transition-colors flex items-center gap-2"
        >
          <RotateCw className="w-4 h-4" /> 새로고침
        </button>
        <Link
          href="/"
          className="bg-transparent text-zinc-400 font-medium px-6 py-3 hover:text-white transition-colors"
        >
          홈으로 이동
        </Link>
      </div>

      <p className="mt-12 text-xs text-zinc-600 font-mono">
        Error Code: {error.digest || '500_INTERNAL_SERVER_ERROR'}
      </p>
    </div>
  )
}
