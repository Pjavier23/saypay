import type { NextApiRequest, NextApiResponse } from 'next'
import { stripe, isStripeConfigured } from '../../../lib/stripe'
import { createServiceClient } from '../../../lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  if (!isStripeConfigured()) {
    return res.status(503).json({ error: 'Payment processing is not configured yet.' })
  }

  const { review_id, user_id, business_id } = req.body
  if (!review_id || !user_id) {
    return res.status(400).json({ error: 'review_id and user_id are required' })
  }

  const supabase = createServiceClient()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  try {
    // Fetch review to get business_id if not provided
    const { data: review, error: revErr } = await supabase
      .from('sp_reviews')
      .select('id, business_id')
      .eq('id', review_id)
      .single()

    if (revErr || !review) return res.status(404).json({ error: 'Review not found' })

    const resolvedBusinessId = business_id || review.business_id

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: '⬆️ Paid Review Boost — SayPay',
            description: 'Your $0.99 boost counts 5× — help great reviews rise to the top.',
          },
          unit_amount: 99,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${appUrl}/review-success?upvote=1&review_id=${review_id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/business/${resolvedBusinessId}`,
      metadata: { review_id, user_id, business_id: resolvedBusinessId, type: 'upvote' },
    })

    return res.status(200).json({ url: session.url })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unexpected error'
    console.error('upvote-checkout error:', msg)
    return res.status(500).json({ error: msg })
  }
}
