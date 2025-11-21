export default function BundleDetailPage({ params }: { params: { slug: string } }) {
  return (
    <div>
      <h1>Bundle: {params.slug}</h1>
    </div>
  )
}
