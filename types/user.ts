// User types
export type PlanType = 'free' | 'pro' | 'team'
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'expired'

export interface User {
  id: string
  clerkUserId: string
  email: string
  name?: string
  avatarUrl?: string
  createdAt: string
  updatedAt: string
}

export interface Subscription {
  id: string
  userId: string
  planType: PlanType
  status: SubscriptionStatus
  stripeSubscriptionId?: string
  stripeCustomerId?: string
  currentPeriodEnd?: string
  createdAt: string
  updatedAt: string
}
