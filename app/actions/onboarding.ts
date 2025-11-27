'use server'

import { currentUser } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface OnboardingData {
  projectType: 'web' | 'app' | 'backend'
  stackPreferences: {
    framework?: string
    auth?: string
    database?: string
    hosting?: string
    styling?: string
    payments?: string
  }
  stackPreset: 'saas-kit' | 'ecommerce' | 'custom'
}

/**
 * Complete onboarding and save user preferences
 */
export async function completeOnboarding(data: OnboardingData) {
  try {
    const user = await currentUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const supabase = await createClient()

    // Get user from database
    const { data: dbUser, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_user_id', user.id)
      .single()

    if (userError || !dbUser) {
      return { success: false, error: 'User not found' }
    }

    // Update user preferences
    const { error: updateError } = await supabase
      .from('users')
      .update({
        onboarding_completed: true,
        project_type: data.projectType,
        stack_preset: data.stackPreset,
        inferred_stack: data.stackPreferences,
        updated_at: new Date().toISOString(),
      })
      .eq('id', dbUser.id)

    if (updateError) {
      console.error('Error updating user:', updateError)
      return { success: false, error: 'Failed to save preferences' }
    }

    // Revalidate relevant paths
    revalidatePath('/dashboard')
    revalidatePath('/onboarding')

    return { success: true }
  } catch (error) {
    console.error('Error in completeOnboarding:', error)
    return { success: false, error: 'Internal server error' }
  }
}

/**
 * Skip onboarding (dismiss for 7 days)
 */
export async function skipOnboarding() {
  try {
    const user = await currentUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const supabase = await createClient()

    // Get user from database
    const { data: dbUser, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_user_id', user.id)
      .single()

    if (userError || !dbUser) {
      return { success: false, error: 'User not found' }
    }

    // Update dismissed timestamp
    const { error: updateError } = await supabase
      .from('users')
      .update({
        onboarding_dismissed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', dbUser.id)

    if (updateError) {
      console.error('Error updating user:', updateError)
      return { success: false, error: 'Failed to skip onboarding' }
    }

    revalidatePath('/onboarding')

    return { success: true }
  } catch (error) {
    console.error('Error in skipOnboarding:', error)
    return { success: false, error: 'Internal server error' }
  }
}

/**
 * Get user's onboarding status
 */
export async function getOnboardingStatus() {
  try {
    const user = await currentUser()

    if (!user) {
      return { completed: false, dismissed: false }
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('users')
      .select('onboarding_completed, onboarding_dismissed_at, project_type, stack_preset, inferred_stack')
      .eq('clerk_user_id', user.id)
      .single()

    if (error || !data) {
      return { completed: false, dismissed: false }
    }

    // Check if dismissed within last 7 days
    const dismissedRecently = data.onboarding_dismissed_at
      ? new Date(data.onboarding_dismissed_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      : false

    return {
      completed: data.onboarding_completed || false,
      dismissed: dismissedRecently,
      projectType: data.project_type,
      stackPreset: data.stack_preset,
      stackPreferences: data.inferred_stack,
    }
  } catch (error) {
    console.error('Error in getOnboardingStatus:', error)
    return { completed: false, dismissed: false }
  }
}
