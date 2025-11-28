/**
 * Environment Variable Validation
 *
 * This file validates all required environment variables at startup.
 * Fails fast if any required variables are missing or invalid.
 */

// Required Clerk environment variables
const REQUIRED_CLERK_VARS = [
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY',
  'CLERK_WEBHOOK_SECRET',
] as const

// Required Supabase environment variables
const REQUIRED_SUPABASE_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
] as const

// Required Stripe environment variables (conditional based on payment provider)
const REQUIRED_STRIPE_VARS = [
  'STRIPE_SECRET_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_WEBHOOK_SECRET',
] as const

// Required Toss Payments environment variables (conditional based on payment provider)
const REQUIRED_TOSS_VARS = [
  'TOSS_CLIENT_KEY',
  'TOSS_SECRET_KEY',
] as const

// Validation errors
const validationErrors: string[] = []

/**
 * Validate that an environment variable exists and is not empty
 */
function validateEnvVar(varName: string, required: boolean = true): string | undefined {
  const value = process.env[varName]

  if (!value || value.trim() === '') {
    if (required) {
      validationErrors.push(`Missing required environment variable: ${varName}`)
    }
    return undefined
  }

  return value
}

/**
 * Validate URL format for environment variables
 */
function validateUrl(varName: string, required: boolean = true): string | undefined {
  const value = validateEnvVar(varName, required)

  if (value) {
    try {
      new URL(value)
      return value
    } catch {
      validationErrors.push(`Invalid URL format for ${varName}: ${value}`)
      return undefined
    }
  }

  return undefined
}

/**
 * Validate Clerk environment variables
 */
function validateClerkEnv() {
  const clerkPublishableKey = validateEnvVar('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY')
  const clerkSecretKey = validateEnvVar('CLERK_SECRET_KEY')
  const clerkWebhookSecret = validateEnvVar('CLERK_WEBHOOK_SECRET')

  return {
    clerkPublishableKey,
    clerkSecretKey,
    clerkWebhookSecret,
  }
}

/**
 * Validate Supabase environment variables
 */
function validateSupabaseEnv() {
  const supabaseUrl = validateUrl('NEXT_PUBLIC_SUPABASE_URL')
  const supabaseAnonKey = validateEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  const supabaseServiceRoleKey = validateEnvVar('SUPABASE_SERVICE_ROLE_KEY')

  return {
    supabaseUrl,
    supabaseAnonKey,
    supabaseServiceRoleKey,
  }
}

/**
 * Validate payment provider environment variables
 * Note: Either Stripe or Toss Payments is required, not both
 */
function validatePaymentEnv() {
  const paymentProvider = process.env.NEXT_PUBLIC_PAYMENT_PROVIDER || 'stripe'

  let stripeSecretKey: string | undefined
  let stripePublishableKey: string | undefined
  let stripeWebhookSecret: string | undefined
  let tossClientKey: string | undefined
  let tossSecretKey: string | undefined

  if (paymentProvider === 'stripe') {
    stripeSecretKey = validateEnvVar('STRIPE_SECRET_KEY')
    stripePublishableKey = validateEnvVar('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY')
    stripeWebhookSecret = validateEnvVar('STRIPE_WEBHOOK_SECRET')
  } else if (paymentProvider === 'toss') {
    tossClientKey = validateEnvVar('TOSS_CLIENT_KEY')
    tossSecretKey = validateEnvVar('TOSS_SECRET_KEY')
  }

  return {
    paymentProvider,
    stripeSecretKey,
    stripePublishableKey,
    stripeWebhookSecret,
    tossClientKey,
    tossSecretKey,
  }
}

/**
 * Validate all environment variables
 * This function is called at app startup
 */
export function validateEnvironmentVariables() {
  // Skip validation in test environment
  if (process.env.NODE_ENV === 'test') {
    return
  }

  const clerk = validateClerkEnv()
  const supabase = validateSupabaseEnv()
  const payment = validatePaymentEnv()

  // If there are validation errors, throw an error and prevent app from starting
  if (validationErrors.length > 0) {
    const errorMessage = [
      '❌ Environment variable validation failed:',
      ...validationErrors.map((err) => `  - ${err}`),
      '',
      'Please check your .env.local file and ensure all required variables are set.',
    ].join('\n')

    throw new Error(errorMessage)
  }

  console.log('✅ Environment variables validated successfully')
}

/**
 * Typed environment variables
 * Use these instead of process.env for type safety
 */
export const env = {
  // Clerk
  clerk: {
    publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!,
    secretKey: process.env.CLERK_SECRET_KEY!,
    webhookSecret: process.env.CLERK_WEBHOOK_SECRET!,
  },

  // Supabase
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  },

  // Payment
  payment: {
    provider: (process.env.NEXT_PUBLIC_PAYMENT_PROVIDER || 'stripe') as 'stripe' | 'toss',
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY,
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    },
    toss: {
      clientKey: process.env.TOSS_CLIENT_KEY,
      secretKey: process.env.TOSS_SECRET_KEY,
    },
  },

  // App
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },

  // Node environment
  nodeEnv: process.env.NODE_ENV as 'development' | 'production' | 'test',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
} as const
