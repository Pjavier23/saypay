import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { lat, lng, address, radius = '3000', type = 'restaurant' } = req.query

  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) return res.status(200).json([])

  try {
    let searchUrl: string

    if (address && (!lat || !lng)) {
      // Use Text Search to find restaurants in a city directly (no geocoding needed)
      const url = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json')
      url.searchParams.set('query', `restaurants in ${address}`)
      url.searchParams.set('type', 'restaurant')
      url.searchParams.set('key', apiKey)
      searchUrl = url.toString()
    } else if (lat && lng) {
      // Use Nearby Search for lat/lng
      const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json')
      url.searchParams.set('location', `${lat},${lng}`)
      url.searchParams.set('radius', radius as string)
      url.searchParams.set('type', type as string)
      url.searchParams.set('key', apiKey)
      searchUrl = url.toString()
    } else {
      return res.status(400).json({ error: 'lat/lng or address is required' })
    }

    const response = await fetch(searchUrl)
    const data = await response.json()

    if (data.status === 'REQUEST_DENIED' || data.status === 'OVER_QUERY_LIMIT') {
      console.error('Google Places API denied:', data.status, data.error_message)
      return res.status(200).json([])
    }

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Google Places API error:', data.status)
      return res.status(200).json([])
    }

    const places = (data.results || []).map((place: any) => ({
      id: place.place_id,
      name: place.name,
      category: place.types?.[0]?.replace(/_/g, ' ') || 'Restaurant',
      location: place.vicinity || place.formatted_address || '',
      avg_rating: place.rating || 0,
      total_reviews: place.user_ratings_total || 0,
      emoji: getCategoryEmoji(place.types),
      cover_image: place.photos?.[0]
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${place.photos[0].photo_reference}&key=${apiKey}`
        : null,
      is_boosted: false,
      is_google: true,
      google_place_id: place.place_id,
      price_level: place.price_level,
      open_now: place.opening_hours?.open_now,
    }))

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate')
    return res.status(200).json(places)
  } catch (err: any) {
    console.error('Places API error:', err)
    return res.status(200).json([])
  }
}

function getCategoryEmoji(types: string[] = []): string {
  const typeMap: Record<string, string> = {
    restaurant: '🍽️', food: '🍽️', cafe: '☕', bar: '🍺',
    bakery: '🥐', meal_takeaway: '🥡', meal_delivery: '🛵',
    night_club: '🎵', lodging: '🏨',
  }
  for (const type of types) {
    if (typeMap[type]) return typeMap[type]
  }
  return '🏪'
}
