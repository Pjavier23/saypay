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

  const fetchBusinesses = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
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

  const handleNearMe = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error')
      return
    }
    setLocationStatus('loading')
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setLocationStatus('granted')
        setNearbyLoading(true)
        setShowNearby(true)
        const { latitude, longitude } = pos.coords
        const res = await fetch(`/api/places/nearby?lat=${latitude}&lng=${longitude}&radius=2000`)
        if (res.ok) {
          const data = await res.json()
          setNearbyPlaces(Array.isArray(data) ? data.slice(0, 12) : [])
        } else {
          setNearbyPlaces([])
        }
        setNearbyLoading(false)
      },
      (err) => {
        console.error('Geolocation error:', err)
        setLocationStatus('denied')
      },
      { timeout: 10000 }
    )
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

            {/* Search + Near Me row */}
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search restaurants, cafés, bars..."
                style={{
                  flex: '1 1 200px', minWidth: '180px',
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '0.75rem', padding: '0.8rem 1.1rem',
                  color: '#fff', fontSize: '0.95rem', outline: 'none',
                }}
              />
              <button type="submit" style={{
                background: 'linear-gradient(135deg, #ff006e, #ffdd00)', color: '#000',
                padding: '0.8rem 1.5rem', borderRadius: '0.75rem', border: 'none',
                fontWeight: '800', cursor: 'pointer', fontSize: '0.9rem', whiteSpace: 'nowrap',
              }}>
                Search
              </button>
              <button
                type="button"
                onClick={handleNearMe}
                disabled={locationStatus === 'loading' || locationStatus === 'granted'}
                style={{
                  background: showNearby && locationStatus === 'granted'
                    ? 'rgba(29,209,221,0.15)'
                    : 'rgba(255,255,255,0.06)',
                  color: showNearby && locationStatus === 'granted' ? '#1dd1dd' : '#ccc',
                  border: showNearby && locationStatus === 'granted'
                    ? '1px solid rgba(29,209,221,0.3)'
                    : '1px solid rgba(255,255,255,0.12)',
                  padding: '0.8rem 1.25rem', borderRadius: '0.75rem',
                  fontWeight: '700', cursor: locationStatus === 'loading' ? 'wait' : 'pointer',
                  fontSize: '0.9rem', whiteSpace: 'nowrap',
                }}
              >
                {locationStatus === 'loading' ? '📍 Detecting...' :
                 locationStatus === 'granted' ? '📍 Near Me ✓' : '📍 Near Me'}
              </button>
            </form>

            {locationStatus === 'denied' && (
              <div style={{ marginBottom: '0.75rem' }}>
                <p style={{ color: '#ff886e', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  📍 Location blocked — enter your city or zip to find nearby places:
                </p>
                <form onSubmit={async (e) => {
                  e.preventDefault()
                  const input = (e.currentTarget.elements.namedItem('cityInput') as HTMLInputElement).value.trim()
                  if (!input) return
                  setNearbyLoading(true)
                  setShowNearby(true)
                  const res = await fetch(`/api/places/nearby?address=${encodeURIComponent(input)}&radius=2000`)
                  if (res.ok) {
                    const data = await res.json()
                    setNearbyPlaces(Array.isArray(data) ? data.slice(0, 12) : [])
                    setLocationStatus('granted')
                  }
                  setNearbyLoading(false)
                }} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    name="cityInput"
                    placeholder="e.g. Miami, FL or 33101"
                    style={{
                      flex: 1, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,136,110,0.4)',
                      borderRadius: '0.6rem', padding: '0.6rem 1rem', color: '#fff', fontSize: '0.9rem', outline: 'none'
                    }}
                  />
                  <button type="submit" style={{
                    background: 'linear-gradient(135deg, #ff006e, #ff886e)', color: '#fff',
                    border: 'none', borderRadius: '0.6rem', padding: '0.6rem 1.25rem',
                    fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem'
                  }}>Search</button>
                </form>
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
