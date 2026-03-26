import type { NextApiRequest, NextApiResponse } from 'next'
import { createServiceClient } from '../../../lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServiceClient()
  const { id } = req.query

  if (typeof id !== 'string') return res.status(400).json({ error: 'Invalid id' })

  if (req.method === 'GET') {
    const { data: business, error: bizError } = await supabase
      .from('sp_businesses')
      .select('*')
      .eq('id', id)
      .single()

    if (bizError || !business) return res.status(404).json({ error: 'Business not found' })

    // Fetch reviews (no join since user_id refs auth.users not sp_profiles)
    const { data: reviews, error: revError } = await supabase
      .from('sp_reviews')
      .select('*')
      .eq('business_id', id)
      .eq('status', 'published')
      .order('helpful_count', { ascending: false })
      .order('created_at', { ascending: false })

    if (revError) return res.status(500).json({ error: revError.message })

    // Fetch profiles for review authors
    const userIds = [...new Set((reviews || []).map((r: any) => r.user_id))]
    let profileMap: Record<string, any> = {}
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('sp_profiles')
        .select('id, username, display_name, avatar_url, is_elite')
        .in('id', userIds)
      if (profiles) {
        profiles.forEach((p: any) => { profileMap[p.id] = p })
      }
    }

    const reviewsWithProfiles = (reviews || []).map((r: any) => ({
      ...r,
      sp_profiles: profileMap[r.user_id] || null,
    }))

    return res.status(200).json({ business, reviews: reviewsWithProfiles })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
