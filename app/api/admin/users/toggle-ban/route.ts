import { NextResponse } from 'next/server'
import { toggleUserBan } from '@/app/actions/user'

export async function POST(request: Request) {
  try {
    const { userId, reason, durationDays } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      )
    }

    const result = await toggleUserBan(userId, reason, durationDays)
    return NextResponse.json(result, { status: result.success ? 200 : 400 })
  } catch (error) {
    console.error('Error toggling user ban:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
