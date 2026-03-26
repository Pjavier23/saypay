import type { NextApiRequest, NextApiResponse } from 'next'
import { stripe } from '../../../lib/stripe'
import { createServiceClient } from '../../../lib/supabase'
import Stripe from 'stripe'

export const config = { api: { bodyParser: false } }

async function buffer(req: NextApiRequest): Promise<Buffer> {
  const chunks: Buffer[] = []
  for await (const chunk of req as any) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const sig = req.headers['stripe-signature'] as string
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
  const buf = await buffer(req)

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature error:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  const supabase = createServiceClient()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const { review_id, business_id, user_id, tip_id, type } = session.metadata || {}

    // Handle review payment
    if (type !== 'tip' && type !== 'monthly_donation' && review_id) {
      const { error } = await supabase
        .from('sp_reviews')
        .update({ status: 'published' })
        .eq('id', review_id)

      if (error) {
        console.error('Failed to publish review:', error)
        return res.status(500).json({ error: error.message })
      }

      // Update business avg_rating and total_reviews
      const { data: reviews } = await supabase
        .from('sp_reviews')
        .select('rating')
        .eq('business_id', business_id)
        .eq('status', 'published')

      if (reviews && reviews.length > 0) {
        const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        await supabase
          .from('sp_businesses')
          .update({ avg_rating: Math.round(avg * 10) / 10, total_reviews: reviews.length })
          .eq('id', business_id)
      }

      // Increment user's review count
      const { data: profile } = await supabase
        .from('sp_profiles')
        .select('total_reviews')
        .eq('id', user_id)
        .single()

      if (profile) {
        await supabase
          .from('sp_profiles')
          .update({ total_reviews: (profile.total_reviews || 0) + 1 })
          .eq('id', user_id)
      }
    }

    // Handle tip payment
    if (type === 'tip' && tip_id) {
      await supabase
        .from('sp_tips')
        .update({ status: 'completed' })
        .eq('id', tip_id)
    }
  }

  if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated') {
    const sub = event.data.object as Stripe.Subscription
    if (sub.metadata?.campaign_id) {
      const status = sub.status === 'active' ? 'active' : 'pending'
      await supabase
        .from('sp_campaigns')
        .update({ status, stripe_subscription_id: sub.id, started_at: new Date().toISOString() })
        .eq('id', sub.metadata.campaign_id)

      if (status === 'active' && sub.metadata?.business_id) {
        const expiresAt = new Date()
        expiresAt.setMonth(expiresAt.getMonth() + 1)
        await supabase
          .from('sp_businesses')
          .update({ is_boosted: true, boost_expires_at: expiresAt.toISOString() })
          .eq('id', sub.metadata.business_id)
      }
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    if (sub.metadata?.business_id) {
      await supabase
        .from('sp_businesses')
        .update({ is_boosted: false, boost_expires_at: null })
        .eq('id', sub.metadata.business_id)
    }
  }

  res.status(200).json({ received: true })
}
