import type { NextApiRequest, NextApiResponse } from 'next'
import { createServiceClient } from '../../../lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServiceClient()
  const { reviewId } = req.query

  if (!reviewId || typeof reviewId !== 'string') {
    return res.status(400).json({ error: 'reviewId required' })
  }

  if (req.method === 'GET') {
    const { data: comments, error } = await supabase
      .from('sp_comments')
      .select('*')
      .eq('review_id', reviewId)
      .order('created_at', { ascending: true })

    if (error) return res.status(500).json({ error: error.message })

    // Fetch profiles separately
    const userIds = [...new Set((comments || []).map((c: any) => c.user_id))]
    let profileMap: Record<string, any> = {}
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('sp_profiles')
        .select('id, username, display_name, is_elite')
        .in('id', userIds)
      if (profiles) profiles.forEach((p: any) => { profileMap[p.id] = p })
    }

    return res.status(200).json((comments || []).map((c: any) => ({
      ...c,
      sp_profiles: profileMap[c.user_id] || null,
    })))
  }

  if (req.method === 'POST') {
    const { user_id, content } = req.body

    if (!user_id || !content) return res.status(400).json({ error: 'user_id and content are required' })
    if (content.length > 280) return res.status(400).json({ error: 'Comment must be 280 characters or less' })
    if (content.trim().length === 0) return res.status(400).json({ error: 'Comment cannot be empty' })

    const { data, error } = await supabase
      .from('sp_comments')
      .insert({ review_id: reviewId, user_id, content: content.trim() })
      .select()
      .single()

    if (error) return res.status(500).json({ error: error.message })

    const { data: profile } = await supabase
      .from('sp_profiles')
      .select('id, username, display_name, is_elite')
      .eq('id', user_id)
      .single()

    return res.status(201).json({ ...data, sp_profiles: profile || null })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
