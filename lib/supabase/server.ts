import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Create a Supabase client for server-side operations
 * Uses the service role key to bypass RLS policies
 */
export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Supabase credentials not found. Using placeholder client.')
    // Return placeholder client for build time
    return createSupabaseClient('https://placeholder.supabase.co', 'placeholder-key')
  }

  return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
