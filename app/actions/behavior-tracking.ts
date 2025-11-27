'use server'

import { createClient } from '@/lib/supabase/server'
import { currentUser } from '@clerk/nextjs/server'

export type BehaviorType =
  | 'content_view'
  | 'search_query'
  | 'snippet_copy'
  | 'tutorial_start'
  | 'tutorial_complete'
  | 'doc_read'
  | 'error_diagnostic'

export interface TrackBehaviorParams {
  behaviorType: BehaviorType
  metadata?: Record<string, unknown>
}

/**
 * Track user behavior for implicit personalization
 * This helps infer user preferences and trigger strategic onboarding prompts
 */
export async function trackBehavior(params: TrackBehaviorParams) {
  const { behaviorType, metadata = {} } = params

  try {
    const user = await currentUser()
    if (!user) {
      console.warn('No user found for behavior tracking')
      return { success: false, error: 'Not authenticated' }
    }

    const supabase = await createClient()

    // Get user ID from our database
    const { data: dbUser, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_user_id', user.id)
      .single()

    if (userError || !dbUser) {
      console.error('User not found in database:', userError)
      return { success: false, error: 'User not found' }
    }

    // Insert behavior record
    const { error: insertError } = await supabase
      .from('user_behaviors')
      .insert({
        user_id: dbUser.id,
        behavior_type: behaviorType,
        metadata: metadata,
      })

    if (insertError) {
      console.error('Error tracking behavior:', insertError)
      return { success: false, error: insertError.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Unexpected error in trackBehavior:', error)
    return { success: false, error: 'Unexpected error' }
  }
}

/**
 * Get user's behavior summary for analytics
 */
export async function getUserBehaviorSummary() {
  try {
    const user = await currentUser()
    if (!user) {
      return null
    }

    const supabase = await createClient()

    const { data: dbUser, error: userError } = await supabase
      .from('users')
      .select('id, content_view_count, search_count, inferred_stack')
      .eq('clerk_user_id', user.id)
      .single()

    if (userError || !dbUser) {
      return null
    }

    // Get recent behaviors
    const { data: recentBehaviors, error: behaviorsError } = await supabase
      .from('user_behaviors')
      .select('behavior_type, metadata, created_at')
      .eq('user_id', dbUser.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (behaviorsError) {
      console.error('Error fetching behaviors:', behaviorsError)
    }

    // Group behaviors by type
    const behaviorCounts: Record<string, number> = {}
    recentBehaviors?.forEach((b) => {
      behaviorCounts[b.behavior_type] = (behaviorCounts[b.behavior_type] || 0) + 1
    })

    return {
      contentViewCount: dbUser.content_view_count || 0,
      searchCount: dbUser.search_count || 0,
      inferredStack: dbUser.inferred_stack || {},
      recentBehaviors: recentBehaviors || [],
      behaviorCounts,
    }
  } catch (error) {
    console.error('Error in getUserBehaviorSummary:', error)
    return null
  }
}

/**
 * Update user's inferred stack based on behavior
 * This is called periodically or when threshold is reached
 */
export async function updateInferredStack() {
  try {
    const user = await currentUser()
    if (!user) {
      return { success: false }
    }

    const supabase = await createClient()

    const { data: dbUser, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_user_id', user.id)
      .single()

    if (userError || !dbUser) {
      return { success: false }
    }

    // Call the database function to infer stack
    const { data: inferredStack, error: inferError } = await supabase
      .rpc('infer_user_stack', { p_user_id: dbUser.id })

    if (inferError) {
      console.error('Error inferring stack:', inferError)
      return { success: false }
    }

    // Update user record
    const { error: updateError } = await supabase
      .from('users')
      .update({ inferred_stack: inferredStack })
      .eq('id', dbUser.id)

    if (updateError) {
      console.error('Error updating inferred stack:', updateError)
      return { success: false }
    }

    return { success: true, inferredStack }
  } catch (error) {
    console.error('Error in updateInferredStack:', error)
    return { success: false }
  }
}

/**
 * Check if user should see onboarding prompt based on behavior
 */
export async function shouldShowOnboardingPrompt() {
  try {
    const user = await currentUser()
    if (!user) {
      return { shouldShow: false }
    }

    const supabase = await createClient()

    // First get user ID
    const { data: dbUser, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_user_id', user.id)
      .single()

    if (userError || !dbUser) {
      return { shouldShow: false }
    }

    const { data: status, error } = await supabase
      .from('user_onboarding_status')
      .select('should_show_onboarding_prompt, suggested_trigger_type, content_view_count, search_count')
      .eq('clerk_user_id', user.id)
      .single()

    if (error || !status) {
      return { shouldShow: false }
    }

    // Check if prompt was already shown recently
    const { data: recentPrompt } = await supabase
      .from('onboarding_prompts')
      .select('shown_at')
      .eq('user_id', dbUser.id)
      .gte('shown_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
      .order('shown_at', { ascending: false })
      .limit(1)
      .single()

    // Don't show if already shown in last 24 hours
    if (recentPrompt) {
      return { shouldShow: false }
    }

    return {
      shouldShow: status.should_show_onboarding_prompt,
      triggerType: status.suggested_trigger_type,
      contentViewCount: status.content_view_count,
      searchCount: status.search_count,
    }
  } catch (error) {
    console.error('Error in shouldShowOnboardingPrompt:', error)
    return { shouldShow: false }
  }
}

/**
 * Log that onboarding prompt was shown
 */
export async function logOnboardingPromptShown(triggerType: string) {
  try {
    const user = await currentUser()
    if (!user) {
      return { success: false }
    }

    const supabase = await createClient()

    const { data: dbUser, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_user_id', user.id)
      .single()

    if (userError || !dbUser) {
      return { success: false }
    }

    const { error: insertError } = await supabase
      .from('onboarding_prompts')
      .insert({
        user_id: dbUser.id,
        trigger_type: triggerType,
      })

    if (insertError) {
      console.error('Error logging onboarding prompt:', insertError)
      return { success: false }
    }

    return { success: true }
  } catch (error) {
    console.error('Error in logOnboardingPromptShown:', error)
    return { success: false }
  }
}

/**
 * Mark onboarding prompt as clicked or dismissed
 */
export async function updateOnboardingPromptStatus(promptId: string, action: 'clicked' | 'dismissed') {
  try {
    const supabase = await createClient()

    const updateData = action === 'clicked'
      ? { clicked: true, clicked_at: new Date().toISOString() }
      : { dismissed: true, dismissed_at: new Date().toISOString() }

    const { error } = await supabase
      .from('onboarding_prompts')
      .update(updateData)
      .eq('id', promptId)

    if (error) {
      console.error('Error updating onboarding prompt status:', error)
      return { success: false }
    }

    return { success: true }
  } catch (error) {
    console.error('Error in updateOnboardingPromptStatus:', error)
    return { success: false }
  }
}
