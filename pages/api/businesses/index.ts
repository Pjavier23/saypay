import type { NextApiRequest, NextApiResponse } from 'next'
import { createServiceClient } from '../../../lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServiceClient()

  if (req.method === 'GET') {
    const { search, category } = req.query

    let query = supabase
      .from('sp_businesses')
      .select('*')
      .order('is_boosted', { ascending: false })
      .order('total_reviews', { ascending: false })
      .order('avg_rating', { ascending: false })

    if (search) {
      query = query.ilike('name', `%${search}%`)
    }
    if (category && category !== 'All') {
      query = query.eq('category', category)
    }

    const { data, error } = await query

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    const { name, category, description, location, cover_image, emoji } = req.body
    if (!name || !category || !location) {
      return res.status(400).json({ error: 'name, category, location required' })
    }

    const { data, error } = await supabase
      .from('sp_businesses')
      .insert({ name, category, description, location, cover_image, emoji })
      .select()
      .single()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  }

  res.status(405).json({ error: 'Method not allowed' })
}
