import type { NextApiRequest, NextApiResponse } from 'next'
import { stripe, isStripeConfigured } from '../../../lib/stripe'
import { createServiceClient } from '../../../lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  if (!isStripeConfigured()) {
    return res.status(503).json({ error: 'Payment processing is not configured yet.' })
  }

  const { business_id, business_name, from_user_id, amount_cents } = req.body

  if (!business_id || !from_user_id || !amount_cents) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const cents = Number(amount_cents)
  if (!Number.isInteger(cents) || cents < 100) {
    return res.status(400).json({ error: 'Invalid tip amount. Minimum $1.00.' })
  }

  const supabase = createServiceClient()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  let tipId: string | null = null

  try {
    const { data: tip, error: tipError } = await supabase
      .from('sp_tips')
      .insert({
        business_id,
        from_user_id,
        to_user_id: from_user_id,
        amount_cents: cents,
        status: 'pending',
      })
      .select()
      .single()

    if (tipError) {
      console.error('Tip insert error:', tipError.message)
    } else {
      tipId = tip.id
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Tip for ${business_name || 'the establishment'} 👨‍🍳`,
            description: 'Show your appreciation — every tip goes directly to the team.',
          },
          unit_amount: cents,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${appUrl}/business/${business_id}?tip=success`,
      cancel_url: `${appUrl}/business/${business_id}?tip=canceled`,
      metadata: { tip_id: tipId || '', business_id, from_user_id, type: 'tip' },
    })

    if (tipId) {
      await supabase.from('sp_tips').update({ stripe_session_id: session.id }).eq('id', tipId)
    }

    return res.status(200).json({ url: session.url })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unexpected error'
    console.error('tip create-checkout error:', msg)
    return res.status(500).json({ error: msg })
  }
}
