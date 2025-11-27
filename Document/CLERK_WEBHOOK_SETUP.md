# Clerk Webhook Setup Guide

This document explains how to configure Clerk webhooks to sync user data with Supabase.

## Problem Solved

When users sign up through Clerk, their data needs to be synchronized to the Supabase `users` table. Without this webhook setup, users will encounter "User Not Found" errors when completing onboarding or accessing the application.

## Prerequisites

- Clerk account with a project set up
- Your application deployed and accessible via HTTPS (or use ngrok for local development)
- `CLERK_WEBHOOK_SECRET` environment variable configured

## Setup Steps

### 1. Access Clerk Dashboard

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your project
3. Navigate to **Configure** → **Webhooks** in the sidebar

### 2. Create Webhook Endpoint

1. Click **"Add Endpoint"**
2. Enter your webhook URL:
   - **Production**: `https://your-domain.com/api/auth/webhook`
   - **Development** (with ngrok): `https://your-ngrok-url.ngrok.io/api/auth/webhook`
   - **Local** (not recommended): Use ngrok or similar tunneling service

### 3. Subscribe to Events

Select the following events to sync user data:

- ✅ `user.created` - When a new user signs up
- ✅ `user.updated` - When user profile is updated
- ✅ `user.deleted` - When a user is deleted

**Important**: Make sure all three events are checked!

### 4. Get Webhook Signing Secret

After creating the endpoint:

1. Copy the **Signing Secret** (starts with `whsec_`)
2. Add it to your `.env.local` file:

```bash
CLERK_WEBHOOK_SECRET=whsec_your_secret_key_here
```

### 5. Test Webhook

#### Option A: Use Clerk Dashboard

1. In the webhook settings, click **"Send test event"**
2. Select `user.created` event
3. Check your application logs to verify the webhook was received

#### Option B: Use Real Signup Flow

1. Create a new test user through your application's signup flow
2. Check Supabase `users` table to verify the user was created
3. Complete onboarding to verify no "User Not Found" errors

## Webhook Event Handlers

The webhook endpoint handles three types of events:

### user.created

Triggered when a new user signs up via Clerk.

**Action**: Inserts a new record into Supabase `users` table with:
- `clerk_user_id`: Clerk's user ID
- `email`: Primary email address
- `name`: Full name (first_name + last_name)
- `avatar_url`: Profile image URL

### user.updated

Triggered when a user updates their profile in Clerk.

**Action**: Updates the corresponding user record in Supabase with:
- Latest email address
- Updated name
- New avatar URL
- Updated timestamp

### user.deleted

Triggered when a user is deleted from Clerk.

**Action**: Deletes the user from Supabase `users` table. Related records (subscriptions, purchases, etc.) are automatically deleted via CASCADE constraints.

## Troubleshooting

### "Webhook secret not configured"

**Cause**: `CLERK_WEBHOOK_SECRET` environment variable is missing.

**Solution**:
1. Check your `.env.local` file
2. Restart your development server after adding the variable
3. For production, ensure the secret is configured in Vercel/Netlify environment variables

### "Webhook verification failed"

**Cause**: The signing secret is incorrect or the webhook payload was tampered with.

**Solution**:
1. Verify you copied the correct signing secret from Clerk Dashboard
2. Make sure there are no extra spaces or line breaks in the secret
3. Regenerate the webhook secret if needed

### "User not found" after signup

**Cause**: Webhook is not triggering or failing silently.

**Solution**:
1. Check Clerk Dashboard → Webhooks → Logs to see if webhooks are being sent
2. Check your application logs for webhook errors
3. Verify the webhook URL is correct and accessible from the internet
4. Ensure `user.created` event is subscribed

### User created in Clerk but not in Supabase

**Cause**: Webhook endpoint is not processing events correctly.

**Solution**:
1. Check application logs for errors in `/api/auth/webhook/route.ts`
2. Verify Supabase credentials are configured correctly
3. Run the webhook tests: `npm test -- app/api/auth/webhook/__tests__/route.test.ts`

## Development vs Production

### Development (Local)

For local development, you'll need to expose your local server to the internet:

1. Install ngrok: `npm install -g ngrok`
2. Start your dev server: `npm run dev`
3. In another terminal: `ngrok http 3000`
4. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
5. Use this as your webhook URL in Clerk Dashboard: `https://abc123.ngrok.io/api/auth/webhook`

**Note**: Every time you restart ngrok, the URL changes and you'll need to update the webhook URL in Clerk Dashboard.

### Production

1. Deploy your application to Vercel/Netlify
2. Use your production domain: `https://your-domain.com/api/auth/webhook`
3. Add `CLERK_WEBHOOK_SECRET` to your hosting platform's environment variables
4. Redeploy to apply the environment variable

## Security Considerations

1. **Never commit** your webhook secret to version control
2. Always use HTTPS for webhook endpoints (HTTP is not supported)
3. The webhook handler verifies the signature using Svix to ensure authenticity
4. Use the service role key for Supabase to bypass RLS (already configured in `createClient`)

## Testing

Run the comprehensive test suite to verify webhook functionality:

```bash
# Run all webhook tests
npm test -- app/api/auth/webhook/__tests__/route.test.ts

# Run with coverage
npm run test:coverage
```

All tests should pass:
- ✅ user.created event creates user in Supabase
- ✅ user.updated event updates user in Supabase
- ✅ user.deleted event removes user from Supabase
- ✅ Missing webhook secret returns 400
- ✅ Missing headers returns 400
- ✅ Invalid signature fails verification
- ✅ Error handling for database failures

## Additional Resources

- [Clerk Webhooks Documentation](https://clerk.com/docs/integrations/webhooks)
- [Svix Webhook Verification](https://docs.svix.com/receiving/verifying-payloads/how)
- [Supabase RLS Bypass with Service Role](https://supabase.com/docs/guides/auth/row-level-security#bypass-rls)

## Summary

After completing this setup:

1. ✅ New users signing up via Clerk will automatically be added to Supabase
2. ✅ Profile updates in Clerk will sync to Supabase
3. ✅ User deletions will be reflected in both systems
4. ✅ No more "User Not Found" errors during onboarding
5. ✅ Seamless authentication experience across the application
