export default function TutorialDetailPage({ params }: { params: { slug: string } }) {
  return (
    <div>
      <h1>Tutorial: {params.slug}</h1>
    </div>
  )
}
