/**
 * Stripe Configuration
 *
 * Centralized configuration for Stripe payment system.
 * This ensures consistent pricing and payment method settings across the application.
 */

import { env } from './env'
import type Stripe from 'stripe'

/**
 * Stripe price IDs for subscriptions by currency
 */
export const STRIPE_PRICE_IDS = {
  USD: {
    pro: env.payment.stripe.proPriceIdUSD!,
    team: env.payment.stripe.teamPriceIdUSD!,
  },
  KRW: {
    pro: env.payment.stripe.proPriceIdKRW!,
    team: env.payment.stripe.teamPriceIdKRW!,
  },
  EUR: {
    pro: env.payment.stripe.proPriceIdEUR!,
    team: env.payment.stripe.teamPriceIdEUR!,
  },
  JPY: {
    pro: env.payment.stripe.proPriceIdJPY!,
    team: env.payment.stripe.teamPriceIdJPY!,
  },
} as const

/**
 * Single content purchase price ID
 */
export const STRIPE_SINGLE_CONTENT_PRICE_ID = env.payment.stripe.singleContentPriceId!

/**
 * Supported currencies
 */
export type StripeCurrency = keyof typeof STRIPE_PRICE_IDS

/**
 * Subscription plan types
 */
export type StripePlan = 'pro' | 'team'

/**
 * Payment method types by country
 * Maps country codes to supported payment methods for that country
 */
export const PAYMENT_METHODS_BY_COUNTRY: Record<
  string,
  Stripe.Checkout.SessionCreateParams.PaymentMethodType[]
> = {
  KR: ['card'],
  US: ['card'],
  JP: ['card'],
  DE: ['card'],
  NL: ['card'],
  DEFAULT: ['card'],
} as const

/**
 * Default payment methods (used when automatic payment method selection is enabled)
 */
export const DEFAULT_PAYMENT_METHODS: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] =
  [
    'card',
    'link', // Stripe Link (one-click checkout)
  ]

/**
 * Get price ID for a plan and currency
 */
export function getPriceId(plan: StripePlan, currency: StripeCurrency): string {
  return STRIPE_PRICE_IDS[currency][plan]
}

/**
 * Get payment methods for a country code
 * Returns DEFAULT payment methods if country is not found
 */
export function getPaymentMethodsForCountry(
  countryCode: string
): Stripe.Checkout.SessionCreateParams.PaymentMethodType[] {
  return PAYMENT_METHODS_BY_COUNTRY[countryCode] || PAYMENT_METHODS_BY_COUNTRY.DEFAULT!
}

/**
 * Validate that a currency is supported
 */
export function isSupportedCurrency(currency: string): currency is StripeCurrency {
  return currency in STRIPE_PRICE_IDS
}

/**
 * Validate that a plan is supported
 */
export function isSupportedPlan(plan: string): plan is StripePlan {
  return plan === 'pro' || plan === 'team'
}
