import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  // Submit rating
  return NextResponse.json({ success: true })
}
