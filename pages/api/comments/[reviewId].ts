import type { NextApiRequest, NextApiResponse } from 'next'
import { createServiceClient } from '../../../lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServiceClient()
  const { reviewId } = req.query

  if (!reviewId || typeof reviewId !== 'string') {
    return res.status(400).json({ error: 'reviewId required' })
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('sp_comments')
      .select('*, sp_profiles(username, display_name, is_elite)')
      .eq('review_id', reviewId)
      .order('created_at', { ascending: true })

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data || [])
  }

  if (req.method === 'POST') {
    const { user_id, content } = req.body

    if (!user_id || !content) {
      return res.status(400).json({ error: 'user_id and content are required' })
    }

    if (content.length > 280) {
      return res.status(400).json({ error: 'Comment must be 280 characters or less' })
    }

    if (content.trim().length === 0) {
      return res.status(400).json({ error: 'Comment cannot be empty' })
    }

    // Fetch profile for the response
    const { data: profile } = await supabase
      .from('sp_profiles')
      .select('username, display_name, is_elite')
      .eq('id', user_id)
      .single()

    const { data, error } = await supabase
      .from('sp_comments')
      .insert({ review_id: reviewId, user_id, content: content.trim() })
      .select()
      .single()

    if (error) return res.status(500).json({ error: error.message })

    return res.status(201).json({ ...data, sp_profiles: profile })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
