import { compileMDX } from 'next-mdx-remote/rsc'
import { serialize } from 'next-mdx-remote/serialize'
import type { MDXRemoteSerializeResult } from 'next-mdx-remote'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeHighlight from 'rehype-highlight'
import matter from 'gray-matter'
import { mdxComponents } from '@/components/mdx'

// MDX 콘텐츠의 프론트매터 타입
export interface ContentFrontmatter {
    title: string
    description?: string
    author?: string
    publishedAt?: string
    updatedAt?: string
    difficulty?: 'beginner' | 'intermediate' | 'advanced'
    estimatedTime?: number // 분 단위
    tags?: string[]
    prerequisites?: string[]
}

// 컴파일된 MDX 결과 타입
export interface CompiledMDX {
    content: React.ReactElement
    frontmatter: ContentFrontmatter
}

/**
 * MDX 문자열을 React 컴포넌트로 컴파일
 * DB에서 가져온 MDX 콘텐츠를 렌더링할 때 사용
 */
export async function compileMDXContent(
    source: string,
    components?: Record<string, React.ComponentType>
): Promise<CompiledMDX> {
    // gray-matter로 프론트매터 파싱
    const { content: mdxContent, data } = matter(source)

    // MDX 컴파일 (기본 컴포넌트 + 커스텀 컴포넌트 병합)
    const { content } = await compileMDX<ContentFrontmatter>({
        source: mdxContent,
        options: {
            parseFrontmatter: false, // 이미 gray-matter로 파싱함
            mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeSlug, rehypeHighlight],
            },
        },
        components: { ...mdxComponents, ...components },
    })

    return {
        content,
        frontmatter: data as ContentFrontmatter,
    }
}

/**
 * MDX 문자열에서 프론트매터만 추출
 * 목록 페이지에서 메타데이터만 필요할 때 사용
 */
export function extractFrontmatter(source: string): ContentFrontmatter {
    const { data } = matter(source)
    return data as ContentFrontmatter
}

/**
 * 예상 읽기 시간 계산 (분 단위)
 * 평균 읽기 속도: 한국어 400자/분, 영어 200단어/분
 */
export function calculateReadingTime(content: string): number {
    // 코드 블록 제거
    const textOnly = content.replace(/```[\s\S]*?```/g, '')

    // 한글 문자 수
    const koreanChars = (textOnly.match(/[가-힣]/g) || []).length
    // 영어 단어 수
    const englishWords = (textOnly.match(/[a-zA-Z]+/g) || []).length

    // 읽기 시간 계산
    const koreanTime = koreanChars / 400
    const englishTime = englishWords / 200

    return Math.ceil(koreanTime + englishTime)
}

/**
 * MDX 콘텐츠에서 목차(TOC) 추출
 */
export interface TOCItem {
    id: string
    text: string
    level: number
}

export function extractTOC(content: string): TOCItem[] {
    const headingRegex = /^(#{1,3})\s+(.+)$/gm
    const toc: TOCItem[] = []
    let match

    while ((match = headingRegex.exec(content)) !== null) {
        const level = match[1].length
        const text = match[2].trim()
        // ID 생성: 소문자, 공백을 하이픈으로, 특수문자 제거
        const id = text
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w가-힣-]/g, '')

        toc.push({ id, text, level })
    }

    return toc
}

/**
 * MDX 콘텐츠 유효성 검사
 */
export function validateMDXContent(source: string): {
    valid: boolean
    errors: string[]
} {
    const errors: string[] = []

    // 프론트매터 체크
    if (!source.startsWith('---')) {
        errors.push('프론트매터가 없습니다. ---로 시작해야 합니다.')
    }

    // 필수 프론트매터 필드 체크
    try {
        const { data } = matter(source)
        if (!data.title) {
            errors.push('title 필드가 필요합니다.')
        }
    } catch {
        errors.push('프론트매터 파싱 오류')
    }

    // 닫히지 않은 코드 블록 체크
    const codeBlockCount = (source.match(/```/g) || []).length
    if (codeBlockCount % 2 !== 0) {
        errors.push('닫히지 않은 코드 블록이 있습니다.')
    }

    return {
        valid: errors.length === 0,
        errors,
    }
}

/**
 * MDX 문자열을 클라이언트에서 렌더링 가능한 형태로 직렬화
 * 클라이언트 컴포넌트에서 MDXRemote와 함께 사용
 */
export async function serializeMDX(source: string): Promise<MDXRemoteSerializeResult> {
    // 프론트매터 제거
    const { content } = matter(source)

    return serialize(content, {
        mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeSlug, rehypeHighlight],
        },
    })
}
