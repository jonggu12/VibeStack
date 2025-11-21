export default function BuyContentPage({ params }: { params: { contentId: string } }) {
  return (
    <div>
      <h1>Purchase Content</h1>
      <p>Content ID: {params.contentId}</p>
    </div>
  )
}
