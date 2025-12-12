import { getBundleBySlug } from '@/app/actions/content'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function BundleDetailPage({ params }: { params: { slug: string } }) {
  const bundle = await getBundleBySlug(params.slug)

  if (!bundle) {
    notFound()
  }

  const typeRoutes = {
    doc: '/docs',
    tutorial: '/tutorials',
    snippet: '/snippets',
    bundle: '/bundles',
    glossary: '/docs?category=concepts',
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Bundle Header */}
      <div className="mb-8">
        {bundle.thumbnail_url && (
          <img
            src={bundle.thumbnail_url}
            alt={bundle.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-4">{bundle.title}</h1>

            {bundle.description && (
              <p className="text-lg text-muted-foreground mb-6">
                {bundle.description}
              </p>
            )}

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{bundle.views} views</span>
              {bundle.estimated_time_mins && (
                <span>• {bundle.estimated_time_mins} minutes total</span>
              )}
            </div>
          </div>

          <div className="ml-8">
            {bundle.discount_pct && bundle.discount_pct > 0 && (
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded mb-2 text-center font-semibold">
                {bundle.discount_pct}% OFF
              </div>
            )}
            <div className="text-3xl font-bold">
              ₩{((bundle.price_cents ?? 0) / 100).toLocaleString()}
            </div>
            <button className="mt-4 w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90">
              Purchase Bundle
            </button>
          </div>
        </div>
      </div>

      {/* Bundle Contents */}
      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold mb-6">What's Included</h2>

        {!bundle.children || bundle.children.length === 0 ? (
          <p className="text-muted-foreground">This bundle has no contents yet.</p>
        ) : (
          <div className="space-y-4">
            {bundle.children.map((child, index) => (
              <Link
                key={child.id}
                href={`${typeRoutes[child.content.type]}/${child.content.slug}`}
                className="block border rounded-lg p-4 hover:border-primary transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center font-semibold text-primary">
                    {index + 1}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs uppercase font-semibold text-muted-foreground">
                        {child.content.type}
                      </span>
                      {child.content.difficulty && (
                        <span className="text-xs px-2 py-0.5 bg-secondary rounded">
                          {child.content.difficulty}
                        </span>
                      )}
                    </div>

                    <h3 className="font-semibold mb-1">{child.content.title}</h3>

                    {child.content.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {child.content.description}
                      </p>
                    )}

                    {child.content.estimated_time_mins && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {child.content.estimated_time_mins} minutes
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Bundle Content (MDX if available) */}
      {bundle.content && (
        <div className="border-t mt-8 pt-8">
          <h2 className="text-2xl font-bold mb-6">About This Bundle</h2>
          <div className="prose prose-lg max-w-none">
            {/* MDX content would be rendered here */}
            <div dangerouslySetInnerHTML={{ __html: bundle.content }} />
          </div>
        </div>
      )}
    </div>
  )
}
