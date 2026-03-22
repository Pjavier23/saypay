export interface Profile {
  id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  total_reviews: number
  total_helpful: number
  is_elite: boolean
  created_at: string
}

export interface Business {
  id: string
  name: string
  category: string
  description: string | null
  location: string
  cover_image: string | null
  emoji: string
  avg_rating: number
  total_reviews: number
  is_boosted: boolean
  boost_expires_at: string | null
  created_at: string
}

export interface Review {
  id: string
  business_id: string
  user_id: string
  rating: number
  content: string
  status: 'pending' | 'published' | 'rejected'
  helpful_count: number
  love_count: number
  created_at: string
  // joined
  sp_profiles?: Profile
  sp_businesses?: Business
}

export interface Reaction {
  id: string
  review_id: string
  user_id: string
  type: 'helpful' | 'love'
  created_at: string
}
