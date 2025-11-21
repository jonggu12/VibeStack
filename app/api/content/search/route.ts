import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  // Algolia search proxy
  return NextResponse.json({ results: [] })
}
