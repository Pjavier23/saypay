import type { NextApiRequest, NextApiResponse } from 'next'
import { createServiceClient } from '../../../lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('sp_profiles')
    .select('id, username, display_name, avatar_url, is_elite, total_reviews, total_helpful')
    .order('total_helpful', { ascending: false })
    .limit(20)

  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json(data)
}
