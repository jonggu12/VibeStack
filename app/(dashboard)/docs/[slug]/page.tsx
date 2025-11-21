export default function DocDetailPage({ params }: { params: { slug: string } }) {
  return (
    <div>
      <h1>Doc: {params.slug}</h1>
    </div>
  )
}
