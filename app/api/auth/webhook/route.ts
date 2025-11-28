import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'
import { env } from '@/lib/env'

// Generate unique request ID for logging
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Generic error responses (safe for external clients)
const ERROR_MESSAGES = {
  INVALID_REQUEST: 'Invalid request',
  PROCESSING_FAILED: 'Request processing failed',
  INTERNAL_ERROR: 'An unexpected error occurred',
} as const

// Type for user data from Clerk webhook
type ClerkUserData = {
  id: string
  email_addresses?: Array<{ email_address: string }>
  first_name?: string | null
  last_name?: string | null
  image_url?: string | null
}

// Type for extracted user information
type UserInfo = {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
}

/**
 * Extract and validate user information from Clerk webhook data
 */
function extractUserInfo(userData: ClerkUserData): UserInfo | null {
  const { id, email_addresses, first_name, last_name, image_url } = userData

  // Validate required fields
  if (!email_addresses || email_addresses.length === 0) {
    return null
  }

  const email = email_addresses[0]!.email_address
  const name = [first_name, last_name].filter(Boolean).join(' ') || null
  const avatar_url = image_url || null

  return { id, email, name, avatar_url }
}

/**
 * Handle user creation or update in Supabase
 */
async function syncUserToSupabase(
  userInfo: UserInfo,
  operation: 'create' | 'update',
  requestId: string
): Promise<NextResponse> {
  try {
    const supabase = await createClient()

    if (operation === 'create') {
      const { error } = await supabase
        .from('users')
        .insert({
          clerk_user_id: userInfo.id,
          email: userInfo.email,
          name: userInfo.name,
          avatar_url: userInfo.avatar_url,
        })
        .select()
        .single()

      if (error) {
        console.error(`[${requestId}] user.created: Database error for user ${userInfo.id}:`, error)
        return NextResponse.json(
          { error: ERROR_MESSAGES.PROCESSING_FAILED },
          { status: 500 }
        )
      }

      console.log(`[${requestId}] user.created: Successfully created user ${userInfo.id}`)
    } else {
      const { error } = await supabase
        .from('users')
        .update({
          email: userInfo.email,
          name: userInfo.name,
          avatar_url: userInfo.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq('clerk_user_id', userInfo.id)
        .select()
        .single()

      if (error) {
        console.error(`[${requestId}] user.updated: Database error for user ${userInfo.id}:`, error)
        return NextResponse.json(
          { error: ERROR_MESSAGES.PROCESSING_FAILED },
          { status: 500 }
        )
      }

      console.log(`[${requestId}] user.updated: Successfully updated user ${userInfo.id}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    const eventType = operation === 'create' ? 'user.created' : 'user.updated'
    console.error(`[${requestId}] ${eventType}: Unexpected error for user ${userInfo.id}:`, error)
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const requestId = generateRequestId()

  // Get webhook secret (validated at startup via env.ts)
  const WEBHOOK_SECRET = env.clerk.webhookSecret

  // Get headers for webhook verification
  const svix_id = req.headers.get('svix-id')
  const svix_timestamp = req.headers.get('svix-timestamp')
  const svix_signature = req.headers.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error(`[${requestId}] Missing required webhook headers`)
    return NextResponse.json(
      { error: ERROR_MESSAGES.INVALID_REQUEST },
      { status: 400 }
    )
  }

  // Get the body
  const payload = await req.text()

  // Create Svix instance for verification
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the webhook
  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error(`[${requestId}] Webhook verification failed:`, err)
    return NextResponse.json(
      { error: ERROR_MESSAGES.INVALID_REQUEST },
      { status: 400 }
    )
  }

  // Handle the webhook event
  const eventType = evt.type

  if (eventType === 'user.created') {
    const userInfo = extractUserInfo(evt.data)

    if (!userInfo) {
      console.error(`[${requestId}] user.created: Missing email address for user ${evt.data.id}`)
      return NextResponse.json(
        { error: ERROR_MESSAGES.INVALID_REQUEST },
        { status: 400 }
      )
    }

    return syncUserToSupabase(userInfo, 'create', requestId)
  }

  if (eventType === 'user.updated') {
    const userInfo = extractUserInfo(evt.data)

    if (!userInfo) {
      console.error(`[${requestId}] user.updated: Missing email address for user ${evt.data.id}`)
      return NextResponse.json(
        { error: ERROR_MESSAGES.INVALID_REQUEST },
        { status: 400 }
      )
    }

    return syncUserToSupabase(userInfo, 'update', requestId)
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data

    try {
      const supabase = await createClient()

      // Delete user from Supabase
      // Note: CASCADE delete will remove related records (subscriptions, purchases, etc.)
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('clerk_user_id', id)

      if (error) {
        console.error(`[${requestId}] user.deleted: Database error for user ${id}:`, error)
        return NextResponse.json(
          { error: ERROR_MESSAGES.PROCESSING_FAILED },
          { status: 500 }
        )
      }

      console.log(`[${requestId}] user.deleted: Successfully deleted user ${id}`)
      return NextResponse.json({ success: true })
    } catch (error) {
      console.error(`[${requestId}] user.deleted: Unexpected error for user ${id}:`, error)
      return NextResponse.json(
        { error: ERROR_MESSAGES.INTERNAL_ERROR },
        { status: 500 }
      )
    }
  }

  // Return success for other event types (log for monitoring)
  console.log(`[${requestId}] Unhandled event type: ${eventType}`)
  return NextResponse.json({ received: true })
}
