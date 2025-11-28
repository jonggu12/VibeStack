/**
 * Stripe Client Configuration
 *
 * Centralized Stripe client initialization using validated environment variables.
 */

import Stripe from 'stripe'
import { env } from './env'

export const stripe = new Stripe(env.payment.stripe.secretKey!, {
  // Using latest stable API version from stripe package
  apiVersion: '2025-11-17.clover',
  typescript: true,
})
