// MDX 파일 타입 선언
declare module '*.mdx' {
    import type { ComponentType } from 'react'

    interface MDXProps {
        components?: Record<string, ComponentType>
    }

    const MDXComponent: ComponentType<MDXProps>
    export default MDXComponent

    // 프론트매터 export
    export const frontmatter: {
        title?: string
        description?: string
        [key: string]: unknown
    }
}

// mdx/types 모듈 선언
declare module 'mdx/types' {
    import type { ComponentType, ReactNode } from 'react'

    export interface MDXComponents {
        [key: string]: ComponentType<{ children?: ReactNode; [key: string]: unknown }>
    }
}
