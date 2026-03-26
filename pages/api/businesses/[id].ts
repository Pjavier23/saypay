import type { NextApiRequest, NextApiResponse } from 'next'
import { createServiceClient } from '../../../lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServiceClient()
  const { id } = req.query

  if (req.method === 'GET') {
    const { data: business, error: bizError } = await supabase
      .from('sp_businesses')
      .select('*')
      .eq('id', id)
      .single()

    if (bizError) return res.status(404).json({ error: 'Business not found' })

    const { data: reviews, error: revError } = await supabase
      .from('sp_reviews')
      .select('*, sp_profiles(username, display_name, avatar_url, is_elite)')
      .eq('business_id', id)
      .eq('status', 'published')
      .order('helpful_count', { ascending: false })
      .order('created_at', { ascending: false })

    if (revError) return res.status(500).json({ error: revError.message })

    return res.status(200).json({ business, reviews: reviews || [] })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
