import fs from 'fs/promises'
import path from 'path'

export type ContentType = 'tutorial' | 'snippet' | 'doc' | 'glossary'

export async function backupToFile(
  type: ContentType,
  slug: string,
  content: string
): Promise<string> {
  const dir = path.join(process.cwd(), 'scripts', 'generated', `${type}s`)

  // 디렉토리 생성 (없으면)
  await fs.mkdir(dir, { recursive: true })

  const filePath = path.join(dir, `${slug}.mdx`)
  await fs.writeFile(filePath, content, 'utf-8')

  console.log(`💾 Backup saved: ${filePath}`)
  return filePath
}

export async function readBackup(
  type: ContentType,
  slug: string
): Promise<string | null> {
  const filePath = path.join(
    process.cwd(),
    'scripts',
    'generated',
    `${type}s`,
    `${slug}.mdx`
  )

  try {
    const content = await fs.readFile(filePath, 'utf-8')
    return content
  } catch (error) {
    return null
  }
}

export async function listBackups(type: ContentType): Promise<string[]> {
  const dir = path.join(process.cwd(), 'scripts', 'generated', `${type}s`)

  try {
    const files = await fs.readdir(dir)
    return files.filter(file => file.endsWith('.mdx'))
  } catch (error) {
    return []
  }
}
