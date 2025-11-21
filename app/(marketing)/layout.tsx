export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="marketing-layout">
      {/* Header */}
      {children}
      {/* Footer */}
    </div>
  )
}
