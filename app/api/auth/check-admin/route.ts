import { isAdmin } from '@/lib/auth'
import { NextResponse } from 'next/server'

/**
 * API endpoint to check if current user is admin
 * Used by client components to conditionally show admin features
 */
export async function GET() {
  try {
    const adminStatus = await isAdmin()

    return NextResponse.json({ isAdmin: adminStatus })
  } catch (error) {
    console.error('Error checking admin status:', error)
    return NextResponse.json({ isAdmin: false })
  }
}
