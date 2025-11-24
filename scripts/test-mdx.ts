/**
 * MDX 렌더링 테스트 스크립트
 * 사용법: npx ts-node scripts/test-mdx.ts
 */

import { readFileSync } from 'fs'
import { join } from 'path'
import { validateMDXContent, extractTOC, calculateReadingTime, extractFrontmatter } from '../lib/mdx'

async function testMDX() {
    console.log('🧪 MDX 렌더링 테스트 시작\n')

    // 샘플 파일 읽기
    const sampleFiles = [
        'content/samples/sample-doc.mdx',
        'content/samples/sample-tutorial.mdx',
    ]

    for (const file of sampleFiles) {
        console.log(`📄 테스트 파일: ${file}`)
        console.log('─'.repeat(50))

        try {
            const filePath = join(process.cwd(), file)
            const content = readFileSync(filePath, 'utf-8')

            // 1. 유효성 검사
            const validation = validateMDXContent(content)
            console.log(`✅ 유효성 검사: ${validation.valid ? '통과' : '실패'}`)
            if (!validation.valid) {
                console.log(`   오류: ${validation.errors.join(', ')}`)
            }

            // 2. 프론트매터 추출
            const frontmatter = extractFrontmatter(content)
            console.log(`📝 제목: ${frontmatter.title}`)
            console.log(`📝 설명: ${frontmatter.description || '없음'}`)
            console.log(`📝 난이도: ${frontmatter.difficulty || '없음'}`)

            // 3. 목차 추출
            const toc = extractTOC(content)
            console.log(`📑 목차 항목: ${toc.length}개`)
            toc.slice(0, 3).forEach((item) => {
                console.log(`   ${'  '.repeat(item.level - 1)}• ${item.text}`)
            })
            if (toc.length > 3) console.log(`   ... 외 ${toc.length - 3}개`)

            // 4. 읽기 시간 계산
            const readingTime = calculateReadingTime(content)
            console.log(`⏱️  예상 읽기 시간: ${readingTime}분`)

        } catch (error) {
            console.log(`❌ 오류 발생: ${error}`)
        }

        console.log('\n')
    }

    console.log('🎉 테스트 완료!')
}

testMDX()
