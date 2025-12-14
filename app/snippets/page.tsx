import { getSnippets } from './actions'
import { SnippetsClient } from './snippets-client'

export default async function SnippetsPage() {
  // Server-side 데이터 페칭
  const snippets = await getSnippets()

  return <SnippetsClient snippets={snippets} />
}
