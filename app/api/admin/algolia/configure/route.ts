import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { configureIndex } from '@/lib/algolia'

// POST: Configure Algolia index settings (run once during setup)
export async function POST() {
    try {
        // Admin only
        const user = await currentUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Admin check via Clerk metadata
        if (user.publicMetadata?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

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
