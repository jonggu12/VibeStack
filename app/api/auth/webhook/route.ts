import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  // Clerk webhook handler
  return NextResponse.json({ received: true })
}
