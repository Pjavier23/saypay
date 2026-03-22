import type { NextApiRequest, NextApiResponse } from 'next'
import { createServiceClient } from '../../../lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { review_id, user_id, type } = req.body
  if (!review_id || !user_id || !type) {
    return res.status(400).json({ error: 'review_id, user_id, type required' })
  }

  const supabase = createServiceClient()
  const field = type === 'helpful' ? 'helpful_count' : 'love_count'

  // Check if reaction exists
  const { data: existing } = await supabase
    .from('sp_reactions')
    .select('id')
    .eq('review_id', review_id)
    .eq('user_id', user_id)
    .eq('type', type)
    .single()

  if (existing) {
    // Remove reaction
    await supabase.from('sp_reactions').delete().eq('id', existing.id)
    const { data: review } = await supabase
      .from('sp_reviews')
      .select(field)
      .eq('id', review_id)
      .single()
    const current = (review as any)?.[field] || 0
    await supabase
      .from('sp_reviews')
      .update({ [field]: Math.max(0, current - 1) })
      .eq('id', review_id)
    return res.status(200).json({ action: 'removed' })
  } else {
    // Add reaction
    await supabase.from('sp_reactions').insert({ review_id, user_id, type })
    const { data: review } = await supabase
      .from('sp_reviews')
      .select(field)
      .eq('id', review_id)
      .single()
    const current = (review as any)?.[field] || 0
    await supabase
      .from('sp_reviews')
      .update({ [field]: current + 1 })
      .eq('id', review_id)

    // Update profile helpful count
    if (type === 'helpful') {
      const { data: rev } = await supabase
        .from('sp_reviews')
        .select('user_id')
        .eq('id', review_id)
        .single()
      if (rev) {
        const { data: profile } = await supabase
          .from('sp_profiles')
          .select('total_helpful')
          .eq('id', rev.user_id)
          .single()
        if (profile) {
          await supabase
            .from('sp_profiles')
            .update({ total_helpful: (profile.total_helpful || 0) + 1 })
            .eq('id', rev.user_id)
        }
      }
    }
    return res.status(200).json({ action: 'added' })
  }
}
