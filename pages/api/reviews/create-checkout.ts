import type { NextApiRequest, NextApiResponse } from 'next'
import { stripe, isStripeConfigured } from '../../../lib/stripe'
import { createServiceClient } from '../../../lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  if (!isStripeConfigured()) {
    return res.status(503).json({ error: 'Payment processing is not configured yet. Check back soon!' })
  }

  const { business_id, user_id, rating, content, photos,
          rating_food, rating_service, rating_cleanliness, rating_atmosphere } = req.body

  if (!business_id || !user_id || !rating || !content) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  if (content.length < 20) {
    return res.status(400).json({ error: 'Review must be at least 20 characters' })
  }

  const supabase = createServiceClient()

  try {
    const insertData: Record<string, unknown> = { business_id, user_id, rating, content, status: 'pending' }
    if (photos && Array.isArray(photos) && photos.length > 0) insertData.photos = photos
    if (rating_food) insertData.rating_food = rating_food
    if (rating_service) insertData.rating_service = rating_service
    if (rating_cleanliness) insertData.rating_cleanliness = rating_cleanliness
    if (rating_atmosphere) insertData.rating_atmosphere = rating_atmosphere

    const { data: review, error: reviewError } = await supabase
      .from('sp_reviews')
      .insert(insertData)
      .select()
      .single()

    if (reviewError) return res.status(500).json({ error: reviewError.message })

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: '✅ Verified Review — SayPay',
            description: 'Your $0.99 proves you mean it. Skin in the game = trusted opinion.',
            images: ['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400'],
          },
          unit_amount: 99,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${appUrl}/review-success?review_id=${review.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/business/${business_id}?canceled=1`,
      metadata: { review_id: review.id, business_id, user_id },
    })

    await supabase.from('sp_reviews').update({ stripe_session_id: session.id }).eq('id', review.id)

    return res.status(200).json({ url: session.url })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unexpected error'
    console.error('create-checkout error:', msg)
    return res.status(500).json({ error: msg })
  }
}
