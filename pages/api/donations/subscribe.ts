import type { NextApiRequest, NextApiResponse } from 'next'
import { stripe, isStripeConfigured } from '../../../lib/stripe'

const DONATION_PLANS: Record<string, { amount: number; label: string }> = {
  supporter: { amount: 500, label: '$5/mo Supporter' },
  champion: { amount: 1000, label: '$10/mo Champion' },
  hero: { amount: 2500, label: '$25/mo Hero' },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  if (!isStripeConfigured()) {
    return res.status(503).json({ error: 'Payment processing is not configured yet.' })
  }

  const { business_id, business_name, user_id, plan, custom_amount_cents } = req.body

  if (!business_id || !user_id) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  let amount_cents: number
  let planLabel: string

  if (plan && DONATION_PLANS[plan]) {
    amount_cents = DONATION_PLANS[plan].amount
    planLabel = DONATION_PLANS[plan].label
  } else if (custom_amount_cents && Number(custom_amount_cents) >= 100) {
    amount_cents = Number(custom_amount_cents)
    planLabel = `$${(amount_cents / 100).toFixed(0)}/mo Custom`
  } else {
    return res.status(400).json({ error: 'Invalid plan or amount' })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  try {
    const price = await stripe.prices.create({
      currency: 'usd',
      unit_amount: amount_cents,
      recurring: { interval: 'month' },
      product_data: { name: `Monthly Support: ${business_name || 'Local Business'}` },
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: price.id, quantity: 1 }],
      mode: 'subscription',
      success_url: `${appUrl}/business/${business_id}?donation=success`,
      cancel_url: `${appUrl}/business/${business_id}?donation=canceled`,
      metadata: { business_id, user_id, type: 'monthly_donation', plan: planLabel },
    })

    return res.status(200).json({ url: session.url })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unexpected error'
    console.error('donations/subscribe error:', msg)
    return res.status(500).json({ error: msg })
  }
}
