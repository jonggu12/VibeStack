export default function SnippetDetailPage({ params }: { params: { slug: string } }) {
  return (
    <div>
      <h1>Snippet: {params.slug}</h1>
    </div>
  )
}
