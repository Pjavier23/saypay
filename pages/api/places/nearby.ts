import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { lat, lng, address, radius = '2000', type = 'restaurant' } = req.query

  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Google Places API key not configured' })
  }

  try {
    let latLng = `${lat},${lng}`

    // If address provided instead of lat/lng, geocode it first
    if (address && (!lat || !lng)) {
      const geoUrl = new URL('https://maps.googleapis.com/maps/api/geocode/json')
      geoUrl.searchParams.set('address', address as string)
      geoUrl.searchParams.set('key', apiKey)
      const geoRes = await fetch(geoUrl.toString())
      const geoData = await geoRes.json()
      if (geoData.status === 'REQUEST_DENIED' || !geoData.results?.[0]) {
        // Billing not enabled or not found — return empty, UI shows DB businesses
        return res.status(200).json([])
      }
      const loc = geoData.results[0].geometry.location
      latLng = `${loc.lat},${loc.lng}`
    } else if (!lat || !lng) {
      return res.status(400).json({ error: 'lat/lng or address is required' })
    }

    const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json')
    url.searchParams.set('location', latLng)
    url.searchParams.set('radius', radius as string)
    url.searchParams.set('type', type as string)
    url.searchParams.set('key', apiKey)

    const response = await fetch(url.toString())
    const data = await response.json()

    if (data.status === 'REQUEST_DENIED' || data.status === 'OVER_QUERY_LIMIT') {
      // Billing not enabled or quota exceeded — return empty so UI falls back to DB businesses
      console.error('Google Places API denied:', data.status, data.error_message)
      return res.status(200).json([])
    }

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Google Places API error:', data.status, data.error_message)
      return res.status(200).json([])
    }

    const places = (data.results || []).map((place: any) => ({
      id: place.place_id,
      name: place.name,
      category: place.types?.[0]?.replace(/_/g, ' ') || 'Restaurant',
      location: place.vicinity,
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
    return res.status(500).json({ error: 'Failed to fetch nearby places' })
  }
}

function getCategoryEmoji(types: string[] = []): string {
  const typeMap: Record<string, string> = {
    restaurant: '🍽️',
    food: '🍽️',
    cafe: '☕',
    bar: '🍺',
    bakery: '🥐',
    meal_takeaway: '🥡',
    meal_delivery: '🛵',
    pizza: '🍕',
    sushi: '🍣',
    hamburger: '🍔',
    ice_cream: '🍦',
  }
  for (const type of types) {
    if (typeMap[type]) return typeMap[type]
  }
  return '🏪'
}
