import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  // Get webhook secret
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 400 }
    )
  }

  // Get headers for webhook verification
  const svix_id = req.headers.get('svix-id')
  const svix_timestamp = req.headers.get('svix-timestamp')
  const svix_signature = req.headers.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: 'Missing required headers' },
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
    console.error('Error verifying webhook:', err)
    return NextResponse.json(
      { error: 'Webhook verification failed' },
      { status: 400 }
    )
  }

  // Handle the webhook event
  const eventType = evt.type

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data

    // Validate required fields
    if (!email_addresses || email_addresses.length === 0) {
      return NextResponse.json(
        { error: 'User must have at least one email address' },
        { status: 400 }
      )
    }

    const email = email_addresses[0].email_address
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
        console.error('Error creating user in Supabase:', error)
        return NextResponse.json(
          { error: 'Failed to create user in database' },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true, user: data })
    } catch (error) {
      console.error('Error in user.created webhook:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data

    // Validate required fields
    if (!email_addresses || email_addresses.length === 0) {
      return NextResponse.json(
        { error: 'User must have at least one email address' },
        { status: 400 }
      )
    }

    const email = email_addresses[0].email_address
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
        console.error('Error updating user in Supabase:', error)
        return NextResponse.json(
          { error: 'Failed to update user in database' },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true, user: data })
    } catch (error) {
      console.error('Error in user.updated webhook:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
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
        console.error('Error deleting user from Supabase:', error)
        return NextResponse.json(
          { error: 'Failed to delete user from database' },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true, deleted: id })
    } catch (error) {
      console.error('Error in user.deleted webhook:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }

  // Return success for other event types
  return NextResponse.json({ received: true })
}
