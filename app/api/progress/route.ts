import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  // Save user progress
  return NextResponse.json({ success: true })
}
