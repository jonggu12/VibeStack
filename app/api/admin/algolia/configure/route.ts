import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { configureIndex } from '@/lib/algolia'

// POST: Configure Algolia index settings (run once during setup)
export async function POST() {
    try {
        // Admin only
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // TODO: Check if user is admin

        const success = await configureIndex()

        if (success) {
            return NextResponse.json({ message: 'Index configured successfully' })
        } else {
            return NextResponse.json({ error: 'Failed to configure index' }, { status: 500 })
        }
    } catch (error) {
        console.error('Configure API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
