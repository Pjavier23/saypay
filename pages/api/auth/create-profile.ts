import type { NextApiRequest, NextApiResponse } from 'next'
import { createServiceClient } from '../../../lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { userId, username, displayName } = req.body
  if (!userId || !username) return res.status(400).json({ error: 'userId and username required' })

  const supabase = createServiceClient()

  // Check username taken
  const { data: existing } = await supabase
    .from('sp_profiles')
    .select('id')
    .eq('username', username.toLowerCase())
    .single()

  if (existing) return res.status(409).json({ error: 'Username already taken' })

  const { error } = await supabase
    .from('sp_profiles')
    .insert({
      id: userId,
      username: username.toLowerCase(),
      display_name: displayName || username,
    })

  if (error) {
    console.error('Profile creation error:', error)
    return res.status(500).json({ error: error.message })
  }

  return res.status(200).json({ success: true })
}
