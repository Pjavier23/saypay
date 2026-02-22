import { useState } from 'react'
import Link from 'next/link'

const mockItems = {
  restaurants: [
    { 
      id: 1, 
      name: 'Chipotle', 
      location: 'Dupont Circle, DC', 
      rating: 4.2, 
      reviews: 12, 
      category: 'Mexican', 
      image: 'https://images.unsplash.com/photo-1585238341710-4abb9fd3f2eb?w=400&h=300&fit=crop',
      emoji: '🌯',
      trending: false, 
      campaign: false,
      lat: 38.9083,
      lng: -77.0441,
      distance: null
    },
    { 
      id: 2, 
      name: 'Sweetgreen', 
      location: 'Downtown DC', 
      rating: 4.5, 
      reviews: 28, 
      category: 'Salads', 
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
      emoji: '🥗',
      trending: true, 
      campaign: false,
      lat: 38.8951,
      lng: -77.0369,
      distance: null
    },
    { 
      id: 3, 
      name: 'Shake Shack', 
      location: 'Navy Yard, DC', 
      rating: 4.1, 
      reviews: 19, 
      category: 'Burgers', 
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
      emoji: '🍔',
      trending: false, 
      campaign: false,
      lat: 38.8799,
      lng: -77.0269,
      distance: null
    },
    { 
      id: 4, 
      name: 'Chick-fil-A', 
      location: 'Gallery Place, DC', 
      rating: 4.3, 
      reviews: 45, 
      category: 'Chicken', 
      image: 'https://images.unsplash.com/photo-1562547256-ee0e0e7ff5a6?w=400&h=300&fit=crop',
      emoji: '🍗',
      trending: true, 
      campaign: false,
      lat: 38.8979,
      lng: -77.0209,
      distance: null
    },
    {
      id: 7,
      name: 'Thai Orchid',
      location: 'Georgetown, DC',
      rating: 4.4,
      reviews: 34,
      category: 'Thai',
      image: 'https://images.unsplash.com/photo-1562126f-d41efdfb9d1d?w=400&h=300&fit=crop',
      emoji: '🍜',
      trending: true,
      campaign: false,
      lat: 38.9072,
      lng: -77.0737,
      distance: null
    },
    {
      id: 8,
      name: 'Pupatella',
      location: 'Navy Yard, DC',
      rating: 4.6,
      reviews: 52,
      category: 'Pizza',
      image: 'https://images.unsplash.com/photo-1606787620884-c0cea2c75f6e?w=400&h=300&fit=crop',
      emoji: '🍕',
      trending: true,
      campaign: false,
      lat: 38.8780,
      lng: -77.0260,
      distance: null
    },
  ],
  products: [
    { 
      id: 5, 
      name: 'McRib (Bring Back)', 
      location: 'McDonalds', 
      rating: 4.8, 
      reviews: 2847, 
      category: 'Discontinued', 
      image: 'https://images.unsplash.com/photo-1572802419224-7c93d6da16d7?w=400&h=300&fit=crop',
      emoji: '🥪',
      trending: true, 
      campaign: true, 
      backers: 2847 
    },
    { 
      id: 6, 
      name: 'TJs Discontinued Snacks', 
      location: 'Trader Joes', 
      rating: 4.6, 
      reviews: 1203, 
      category: 'Food', 
      image: 'https://images.unsplash.com/photo-1599599810694-200c7e7f3818?w=400&h=300&fit=crop',
      emoji: '🍿',
      trending: true, 
      campaign: true, 
      backers: 1203 
    },
  ],
  services: [
    { 
      id: 8, 
      name: 'The Barbers Chair', 
      location: 'Arts District', 
      rating: 4.8, 
      reviews: 67, 
      category: 'Barbershop', 
      image: 'https://images.unsplash.com/photo-1621905167918-48416bd8575a?w=400&h=300&fit=crop',
      emoji: '✂️',
      trending: false, 
      campaign: false 
    },
  ],
}

export default function Restaurants() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [filtered, setFiltered] = useState([...mockItems.restaurants, ...mockItems.products, ...mockItems.services])
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [sortByDistance, setSortByDistance] = useState(false)

  const handleSearch = (e: any) => {
    const query = e.target.value.toLowerCase()
    setSearch(query)
    updateFiltered(query, category)
  }

  const handleCategoryChange = (cat: string) => {
    setCategory(cat)
    updateFiltered(search, cat)
  }

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 3959 // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const getNearbyRestaurants = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = { lat: position.coords.latitude, lng: position.coords.longitude }
        setUserLocation(loc)
        setSortByDistance(true)
        
        // Calculate distances for all restaurants
        mockItems.restaurants.forEach(r => {
          if (r.lat && r.lng) {
            r.distance = calculateDistance(loc.lat, loc.lng, r.lat, r.lng)
          }
        })
      },
      () => alert('Could not get your location')
    )
  }

  const updateFiltered = (query: string, cat: string) => {
    let items: any[] = []
    if (cat === 'all') items = [...mockItems.restaurants, ...mockItems.products, ...mockItems.services]
    else if (cat === 'restaurants') items = mockItems.restaurants
    else if (cat === 'products') items = mockItems.products
    else if (cat === 'services') items = mockItems.services

    let result = items.filter(r =>
      r.name.toLowerCase().includes(query) ||
      r.location.toLowerCase().includes(query) ||
      r.category.toLowerCase().includes(query)
    )

    // Sort by distance if enabled
    if (sortByDistance && userLocation) {
      result = result.sort((a: any, b: any) => {
        const distA = a.distance ?? 999
        const distB = b.distance ?? 999
        return distA - distB
      })
    }

    setFiltered(result)
  }

  return (
    <div style={{ background: '#0a0a0a', color: '#fff', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 50,
        background: 'rgba(10, 10, 10, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '1rem 2rem',
      }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #ff1493, #00d9ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', cursor: 'pointer' }}>
              SayPay
            </span>
          </Link>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/" style={{ textDecoration: 'none', color: '#999', cursor: 'pointer' }}>Home</Link>
            <span style={{ color: '#999' }}>Explore</span>
            <Link href="/leaderboards" style={{ textDecoration: 'none', color: '#999', cursor: 'pointer' }}>Leaderboards</Link>
            <Link href="/campaigns" style={{ textDecoration: 'none', color: '#999', cursor: 'pointer' }}>Campaigns</Link>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <section style={{ padding: '8rem 2rem 2rem', background: 'linear-gradient(180deg, rgba(255, 20, 147, 0.1) 0%, rgba(10, 10, 10, 0) 100%)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', textAlign: 'center' }}>Discover & Review</h1>
          <p style={{ textAlign: 'center', color: '#999', marginBottom: '2rem' }}>Restaurants, Products, Services</p>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            padding: '1.5rem',
            borderRadius: '1rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '2rem',
          }}>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={handleSearch}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '0.5rem',
                padding: '1rem',
                color: 'white',
                fontSize: '1rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Category Buttons + Near Me */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
            {[
              { cat: 'all', label: '🔥 All' },
              { cat: 'restaurants', label: '🍽️ Restaurants' },
              { cat: 'products', label: '📦 Products' },
              { cat: 'services', label: '🔧 Services' },
            ].map(({ cat, label }) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                style={{
                  padding: '0.5rem 1.5rem',
                  borderRadius: '9999px',
                  border: 'none',
                  fontWeight: '600',
                  cursor: 'pointer',
                  background: category === cat ? '#ff1493' : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                }}
              >
                {label}
              </button>
            ))}
            <button
              onClick={getNearbyRestaurants}
              style={{
                padding: '0.5rem 1.5rem',
                borderRadius: '9999px',
                border: '2px solid #00d9ff',
                fontWeight: '700',
                cursor: 'pointer',
                background: userLocation ? '#00d9ff' : 'transparent',
                color: userLocation ? '#000' : '#00d9ff',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e: any) => {
                if (!userLocation) {
                  e.currentTarget.style.background = 'rgba(0, 217, 255, 0.2)'
                }
              }}
              onMouseLeave={(e: any) => {
                if (!userLocation) {
                  e.currentTarget.style.background = 'transparent'
                }
              }}
            >
              📍 Near Me {userLocation && '✓'}
            </button>
          </div>

          <p style={{ color: '#737373', marginBottom: '2rem' }}>
            {filtered.length} results
          </p>

          {/* Items Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}>
            {filtered.map((item: any) => (
              <Link key={item.id} href={`/restaurant/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    padding: '1rem',
                    borderRadius: '1.25rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    height: '100%',
                    position: 'relative',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                  }}
                  onMouseEnter={(e: any) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                    e.currentTarget.style.borderColor = '#ff1493'
                    e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)'
                    e.currentTarget.style.boxShadow = '0 20px 48px rgba(255, 20, 147, 0.25)'
                  }}
                  onMouseLeave={(e: any) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                    e.currentTarget.style.transform = 'translateY(0) scale(1)'
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  {(item.trending || item.campaign) && (
                    <div style={{
                      position: 'absolute',
                      top: '0.75rem',
                      right: '0.75rem',
                      background: item.campaign ? '#00d9ff' : '#39ff14',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      zIndex: 10,
                    }}>
                      {item.campaign ? '🎯 CAMPAIGN' : '🔥 TRENDING'}
                    </div>
                  )}

                  <div style={{
                    width: '100%',
                    height: '160px',
                    marginBottom: '0.75rem',
                    borderRadius: '0.5rem',
                    overflow: 'hidden',
                    background: 'rgba(255, 255, 255, 0.05)',
                    position: 'relative',
                  }}>
                    <img 
                      src={item.image} 
                      alt={item.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease',
                      }}
                      onMouseEnter={(e: any) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e: any) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>{item.name}</h3>
                  <p style={{ color: '#999', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{item.location}</p>
                  {(item as any).distance !== null && (item as any).distance !== undefined && (
                    <p style={{ color: '#00d9ff', fontSize: '0.875rem', fontWeight: '600', marginBottom: '1rem' }}>
                      📍 {((item as any).distance).toFixed(1)} miles away
                    </p>
                  )}
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ background: '#ff1493', padding: '0.25rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>
                      ⭐ {item.rating}
                    </span>
                    <span style={{ color: '#737373', fontSize: '0.875rem' }}>{item.reviews} reviews</span>
                  </div>

                  {item.campaign && (item as any).backers && (
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <div style={{ fontSize: '0.75rem', color: '#00d9ff', fontWeight: '700', marginBottom: '0.5rem' }}>
                        {(item as any).backers} backers 🚀
                      </div>
                      <div style={{ background: 'rgba(0, 217, 255, 0.2)', height: '4px', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ background: '#00d9ff', height: '100%', width: `${Math.min(100, ((item as any).backers / 3000) * 100)}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', padding: '2rem', marginTop: '4rem', textAlign: 'center', color: '#737373', fontSize: '0.875rem' }}>
        <p>© 2025 SayPay. Every word means something.</p>
      </footer>
    </div>
  )
}
