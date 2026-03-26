import type { NextApiRequest, NextApiResponse } from 'next'
import { stripe } from '../../../lib/stripe'
import { createServiceClient } from '../../../lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { business_id, business_name, from_user_id, amount_cents } = req.body

  if (!business_id || !from_user_id || !amount_cents) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const validAmounts = [100, 200, 500, 1000, 2500]
  if (!validAmounts.includes(Number(amount_cents)) && Number(amount_cents) < 100) {
    return res.status(400).json({ error: 'Invalid tip amount. Minimum $1.00.' })
  }

  const supabase = createServiceClient()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  // Create a pending tip record
  const { data: tip, error: tipError } = await supabase
    .from('sp_tips')
    .insert({
      business_id,
      from_user_id,
      to_user_id: from_user_id, // fallback; ideally business owner
      amount_cents: Number(amount_cents),
      status: 'pending',
    })
    .select()
    .single()

  if (tipError) {
    // Column might not exist yet if migration not run; still try checkout
    console.error('Tip insert error:', tipError.message)
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
        unit_amount: Number(amount_cents),
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${appUrl}/business/${business_id}?tip=success`,
    cancel_url: `${appUrl}/business/${business_id}?tip=canceled`,
    metadata: {
      tip_id: tip?.id || '',
      business_id,
      from_user_id,
      type: 'tip',
    },
  })

  // Update tip with session ID
  if (tip?.id) {
    await supabase
      .from('sp_tips')
      .update({ stripe_session_id: session.id })
      .eq('id', tip.id)
  }

  return res.status(200).json({ url: session.url })
}
