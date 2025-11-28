'use client'

export default function Loading() {
  return (
    <>
      <style jsx>{`
        @keyframes breathe {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }

        .breathe-animation {
          animation: breathe 2s ease-in-out infinite;
        }
      `}</style>

      <div className="min-h-screen flex items-center justify-center bg-[#09090b]">
        <div className="flex flex-col items-center gap-4">
          {/* Brand Logo Pulse */}
          <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center breathe-animation shadow-[0_0_30px_rgba(255,255,255,0.3)]">
            <span className="text-black font-bold text-3xl">V</span>
          </div>

          {/* Loading Text (Optional) */}
          <p className="text-zinc-500 text-sm font-medium animate-pulse">Loading...</p>
        </div>
      </div>
    </>
  )
}
