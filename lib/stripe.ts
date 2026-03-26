import Stripe from 'stripe'

const key = process.env.STRIPE_SECRET_KEY

// Only initialize if key is present — avoids crash on import when unconfigured
export const stripe: Stripe = key
  ? new Stripe(key, { apiVersion: '2025-02-24.acacia' })
  : (null as unknown as Stripe)

export function isStripeConfigured(): boolean {
  return Boolean(key)
}
