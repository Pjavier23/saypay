import type { NextApiRequest, NextApiResponse } from 'next'
import { stripe } from '../../../lib/stripe'
import { createServiceClient } from '../../../lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { business_name, email, plan, business_id } = req.body

  if (!business_name || !email || !plan) {
    return res.status(400).json({ error: 'business_name, email, plan required' })
  }

  const supabase = createServiceClient()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  // Save campaign record
  const { data: campaign, error } = await supabase
    .from('sp_campaigns')
    .insert({ business_name, owner_email: email, plan, status: 'pending' })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })

  const priceId = plan === 'pro'
    ? process.env.STRIPE_PRO_PRICE_ID
    : process.env.STRIPE_BOOST_PRICE_ID

  const planName = plan === 'pro' ? 'SayPay Pro ($149/mo)' : 'SayPay Boost ($49/mo)'
  const planDesc = plan === 'pro'
    ? 'Top placement, full analytics, campaign tools, verified business badge'
    : 'Featured listing, analytics dashboard, verified business badge'

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    customer_email: email,
    line_items: priceId
      ? [{ price: priceId, quantity: 1 }]
      : [{
          price_data: {
            currency: 'usd',
            recurring: { interval: 'month' },
            product_data: { name: planName, description: planDesc },
            unit_amount: plan === 'pro' ? 14900 : 4900,
          },
          quantity: 1,
        }],
    mode: 'subscription',
    success_url: `${appUrl}/campaigns?success=1&campaign_id=${campaign.id}`,
    cancel_url: `${appUrl}/campaigns?canceled=1`,
    metadata: {
      campaign_id: campaign.id,
      business_id: business_id || '',
      plan,
    },
    subscription_data: {
      metadata: {
        campaign_id: campaign.id,
        business_id: business_id || '',
        plan,
      },
    },
  })

  return res.status(200).json({ url: session.url })
}
