/** @type {import('next').NextConfig} */
const nextConfig = {
    // MDX 파일을 페이지로 사용 가능하게 설정
    pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

    // 보안 헤더 설정
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                ],
            },
        ]
    },

    // 이미지 최적화 설정
    images: {
        formats: ['image/webp', 'image/avif'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.supabase.co',
            },
            {
                protocol: 'https',
                hostname: 'img.clerk.com',
            },
        ],
    },

    // 로깅 설정 (디버깅용)
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
}

module.exports = nextConfig
