import { getBundles } from '@/app/actions/content'
import Link from 'next/link'

export default async function BundlesPage() {
  const bundles = await getBundles(50)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Content Bundles</h1>
        <p className="text-muted-foreground">
          Curated collections of tutorials, docs, and snippets for complete learning paths
        </p>
      </div>

      {bundles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No bundles available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bundles.map((bundle) => (
            <Link
              key={bundle.id}
              href={`/bundles/${bundle.slug}`}
              className="block border rounded-lg p-6 hover:border-primary transition-colors"
            >
              {bundle.thumbnail_url && (
                <img
                  src={bundle.thumbnail_url}
                  alt={bundle.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )}

              <h2 className="text-xl font-semibold mb-2">{bundle.title}</h2>

              {bundle.description && (
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {bundle.description}
                </p>
              )}

              <div className="flex items-center justify-between">
                <div>
                  {bundle.discount_pct && bundle.discount_pct > 0 && (
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-2">
                      {bundle.discount_pct}% OFF
                    </span>
                  )}
                  <span className="font-bold">
                    ₩{((bundle.price_cents ?? 0) / 100).toLocaleString()}
                  </span>
                </div>

                <span className="text-sm text-muted-foreground">
                  {bundle.views} views
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
