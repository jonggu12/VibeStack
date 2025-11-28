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
    const { id, email_addresses, first_name, last_name, image_url } = evt.data

    // Validate required fields
    if (!email_addresses || email_addresses.length === 0) {
      console.error(`[${requestId}] user.created: Missing email address for user ${id}`)
      return NextResponse.json(
        { error: ERROR_MESSAGES.INVALID_REQUEST },
        { status: 400 }
      )
    }

    const email = email_addresses[0]!.email_address
    const name = [first_name, last_name].filter(Boolean).join(' ') || null

    try {
      const supabase = await createClient()

      // Insert user into Supabase
      const { data, error } = await supabase
        .from('users')
        .insert({
          clerk_user_id: id,
          email: email,
          name: name,
          avatar_url: image_url || null,
        })
        .select()
        .single()

      if (error) {
        console.error(`[${requestId}] user.created: Database error for user ${id}:`, error)
        return NextResponse.json(
          { error: ERROR_MESSAGES.PROCESSING_FAILED },
          { status: 500 }
        )
      }

      console.log(`[${requestId}] user.created: Successfully created user ${id}`)
      return NextResponse.json({ success: true })
    } catch (error) {
      console.error(`[${requestId}] user.created: Unexpected error for user ${id}:`, error)
      return NextResponse.json(
        { error: ERROR_MESSAGES.INTERNAL_ERROR },
        { status: 500 }
      )
    }
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data

    // Validate required fields
    if (!email_addresses || email_addresses.length === 0) {
      console.error(`[${requestId}] user.updated: Missing email address for user ${id}`)
      return NextResponse.json(
        { error: ERROR_MESSAGES.INVALID_REQUEST },
        { status: 400 }
      )
    }

    const email = email_addresses[0]!.email_address
    const name = [first_name, last_name].filter(Boolean).join(' ') || null

    try {
      const supabase = await createClient()

      // Update user in Supabase
      const { data, error } = await supabase
        .from('users')
        .update({
          email: email,
          name: name,
          avatar_url: image_url || null,
          updated_at: new Date().toISOString(),
        })
        .eq('clerk_user_id', id)
        .select()
        .single()

      if (error) {
        console.error(`[${requestId}] user.updated: Database error for user ${id}:`, error)
        return NextResponse.json(
          { error: ERROR_MESSAGES.PROCESSING_FAILED },
          { status: 500 }
        )
      }

      console.log(`[${requestId}] user.updated: Successfully updated user ${id}`)
      return NextResponse.json({ success: true })
    } catch (error) {
      console.error(`[${requestId}] user.updated: Unexpected error for user ${id}:`, error)
      return NextResponse.json(
        { error: ERROR_MESSAGES.INTERNAL_ERROR },
        { status: 500 }
      )
    }
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
