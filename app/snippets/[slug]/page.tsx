import { notFound } from 'next/navigation'
import { getSnippetBySlug } from '../actions'
import { SnippetDetailClient } from './snippet-detail-client'

export default async function SnippetDetailPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const snippet = await getSnippetBySlug(slug)

  if (!snippet) {
    notFound()
  }

  return <SnippetDetailClient snippet={snippet} />
}
