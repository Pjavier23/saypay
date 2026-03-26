import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import BusinessCard from '../components/BusinessCard'
import { BusinessCardSkeleton } from '../components/LoadingSkeleton'

const CATEGORIES = ['All', 'Mexican', 'Salads', 'Burgers', 'Chicken', 'Thai', 'French', 'American', 'Filipino', 'International', 'Juice Bar', 'Restaurant', 'Cafe', 'Bar']

type LocationStatus = 'idle' | 'loading' | 'granted' | 'denied' | 'error'

export default function Explore() {
  const [businesses, setBusinesses] = useState<any[]>([])
  const [nearbyPlaces, setNearbyPlaces] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [locationStatus, setLocationStatus] = useState<LocationStatus>('idle')
  const [showNearby, setShowNearby] = useState(false)
  const [nearbyLoading, setNearbyLoading] = useState(false)

  useEffect(() => {
    fetchBusinesses()
  }, [category])

  const fetchBusinesses = useCallback(async (overrideSearch?: string) => {
    setLoading(true)
    const params = new URLSearchParams()
    const searchTerm = overrideSearch !== undefined ? overrideSearch : search
    if (searchTerm) params.set('search', searchTerm)
    if (category !== 'All') params.set('category', category)
    const res = await fetch(`/api/businesses?${params}`)
    const data = await res.json()
    setBusinesses(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [search, category])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchBusinesses()
  }

  const handleNearMe = async () => {
    if (!navigator.geolocation) {
      setLocationStatus('denied')
      return
    }

    // Check permission state first if API available
    if (navigator.permissions) {
      try {
        const perm = await navigator.permissions.query({ name: 'geolocation' })
        if (perm.state === 'denied') {
          setLocationStatus('denied')
          return
        }
      } catch(e) {}
    }

    setLocationStatus('loading')
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setLocationStatus('granted')
        setNearbyLoading(true)
        setShowNearby(true)
        const { latitude, longitude } = pos.coords
        try {
          const nearbyUrl = search
            ? `/api/places/nearby?lat=${latitude}&lng=${longitude}&radius=3000&keyword=${encodeURIComponent(search)}`
            : `/api/places/nearby?lat=${latitude}&lng=${longitude}&radius=3000`
          const res = await fetch(nearbyUrl)
          if (res.ok) {
            const data = await res.json()
            setNearbyPlaces(Array.isArray(data) ? data.slice(0, 12) : [])
          }
        } catch(e) {}
        setNearbyLoading(false)
      },
      (err) => {
        setLocationStatus('denied')
        // err.code: 1=PERMISSION_DENIED, 2=POSITION_UNAVAILABLE, 3=TIMEOUT
        console.error('Geolocation error code:', err.code, err.message)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }

  const handleCitySearch = async (city: string) => {
    if (!city.trim()) return
    setNearbyLoading(true)
    setShowNearby(true)
    try {
      const res = await fetch(`/api/places/nearby?address=${encodeURIComponent(city)}&radius=3000`)
      if (res.ok) {
        const data = await res.json()
        setNearbyPlaces(Array.isArray(data) ? data.slice(0, 12) : [])
        setLocationStatus('granted')
      }
    } catch(e) {}
    setNearbyLoading(false)
  }

  const allResults = showNearby && nearbyPlaces.length > 0
    ? [
        ...nearbyPlaces,
        ...businesses.filter(b => !nearbyPlaces.some((p: any) => p.name === b.name)),
      ]
    : businesses

  return (
    <div style={{ background: '#0a0a0a', color: '#fff', minHeight: '100vh' }}>
      <Nav />

      <div style={{ paddingTop: '4.5rem' }}>
        {/* Page header */}
        <div style={{
          background: 'linear-gradient(180deg, rgba(255,0,110,0.1) 0%, transparent 100%)',
          padding: '3rem 1.5rem 2rem',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: '900', marginBottom: '0.4rem' }}>
              Explore & Review
            </h1>
            <p style={{ color: '#666', marginBottom: '1.75rem', fontSize: '1rem' }}>
              Find a place. Write your truth. Pay $0.99 to publish.
            </p>

            {/* Single unified search bar */}
            <form onSubmit={(e) => {
              e.preventDefault()
              const val = (e.currentTarget.elements.namedItem('mainSearch') as HTMLInputElement).value.trim()
              if (!val) { fetchBusinesses(); return }
              // Detect if it looks like a location (has numbers, comma, or common location words)
              const looksLikeLocation = /\d{5}|,|\b(fl|tx|ca|ny|dc|ga|nc|nj|az|il|pa|oh|mi|wa|co|tn|md|va|ma|mn|or|mo|wi|ct|nv|in|la|ky|al|sc|ok|ut|ia|ms|ar|ks|ne|id|nm|wv|hi|nh|me|ri|mt|de|sd|nd|ak|vt|wy|street|ave|blvd|city|town|miami|new york|los angeles|chicago|houston|phoenix|philadelphia|san antonio|san diego|dallas|san jose|austin|jacksonville|fort|charlotte)\b/i.test(val)
              if (looksLikeLocation) {
                handleCitySearch(val)
              } else {
                setSearch(val)
                fetchBusinesses(val) // pass val directly — avoids stale state
              }
            }} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                name="mainSearch"
                defaultValue={search}
                placeholder="🔍 Search restaurants, or enter a city / zip code..."
                style={{
                  flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '0.75rem', padding: '0.9rem 1.25rem', color: '#fff', fontSize: '1rem', outline: 'none',
                }}
              />
              <button type="submit" style={{
                background: 'linear-gradient(135deg, #ff006e, #ffdd00)', color: '#000',
                border: 'none', borderRadius: '0.75rem', padding: '0.9rem 1.5rem',
                fontWeight: '800', cursor: 'pointer', fontSize: '1rem', whiteSpace: 'nowrap',
              }}>Search</button>
            </form>

            {/* GPS button */}
            <button
              type="button"
              onClick={handleNearMe}
              disabled={locationStatus === 'loading'}
              style={{
                width: '100%', marginBottom: '1rem',
                background: locationStatus === 'granted' ? 'rgba(29,209,221,0.15)' : 'rgba(255,255,255,0.05)',
                color: locationStatus === 'granted' ? '#1dd1dd' : '#888',
                border: locationStatus === 'granted' ? '1px solid rgba(29,209,221,0.35)' : '1px solid rgba(255,255,255,0.1)',
                padding: '0.65rem 1.5rem', borderRadius: '0.75rem',
                fontWeight: '600', cursor: locationStatus === 'loading' ? 'wait' : 'pointer', fontSize: '0.9rem',
              }}
            >
              {locationStatus === 'loading' ? '📍 Detecting...' :
               locationStatus === 'granted' ? '📍 Showing results near you ✓' :
               locationStatus === 'denied' ? '📍 Location blocked — enable in browser settings' :
               '📍 Or use my current location'}
            </button>

            {locationStatus === 'denied' && (
              <div style={{ background: 'rgba(255,136,110,0.08)', border: '1px solid rgba(255,136,110,0.25)', borderRadius: '0.75rem', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.82rem', color: '#ff886e' }}>
                📱 <strong>iPhone:</strong> Settings → Safari → Location → Allow &nbsp;|&nbsp;
                🤖 <strong>Android:</strong> Tap 🔒 in address bar → Location → Allow
              </div>
            )}

            {/* Category filter */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  style={{
                    background: category === cat ? 'linear-gradient(135deg, #ff006e, #ff886e)' : 'rgba(255,255,255,0.05)',
                    color: category === cat ? '#fff' : '#777',
                    border: category === cat ? 'none' : '1px solid rgba(255,255,255,0.09)',
                    padding: '0.35rem 0.875rem', borderRadius: '9999px',
                    fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
          {/* Nearby section */}
          {showNearby && (
            <div style={{ marginBottom: '3rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: '900', margin: 0 }}>
                    📍 Near You
                  </h2>
                  <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                    Real restaurants detected from your location
                  </p>
                </div>
                <button
                  onClick={() => { setShowNearby(false); setNearbyPlaces([]) }}
                  style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  Clear ×
                </button>
              </div>
              {nearbyLoading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                  {Array.from({ length: 6 }).map((_, i) => <BusinessCardSkeleton key={i} />)}
                </div>
              ) : nearbyPlaces.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                  {nearbyPlaces.map(place => (
                    <BusinessCard key={place.id} business={place} />
                  ))}
                </div>
              ) : (
                <p style={{ color: '#555', padding: '2rem 0' }}>No restaurants found nearby. Try expanding the search radius.</p>
              )}
            </div>
          )}

          {/* DB Businesses */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '900', margin: 0 }}>
                  {showNearby ? '🏪 All Businesses' : '🏪 Restaurants & Businesses'}
                </h2>
                {!loading && (
                  <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                    {businesses.length} place{businesses.length !== 1 ? 's' : ''} found
                  </p>
                )}
              </div>
            </div>

            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {Array.from({ length: 6 }).map((_, i) => <BusinessCardSkeleton key={i} />)}
              </div>
            ) : allResults.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#555' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏪</div>
                <p style={{ marginBottom: '0.5rem' }}>No businesses found.</p>
                <p style={{ fontSize: '0.85rem' }}>Try a different search or category filter.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {allResults.map(biz => (
                  <BusinessCard key={biz.id} business={biz} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
