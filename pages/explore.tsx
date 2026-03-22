import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from './_app'

const CATEGORIES = ['All', 'Mexican', 'Salads', 'Burgers', 'Chicken', 'Thai', 'French', 'American', 'Filipino', 'International', 'Juice Bar']

export default function Explore() {
  const { user } = useAuth()
  const [businesses, setBusinesses] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBusinesses()
  }, [category])

  async function fetchBusinesses() {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (category !== 'All') params.set('category', category)
    const res = await fetch(`/api/businesses?${params}`)
    const data = await res.json()
    setBusinesses(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchBusinesses()
  }

  const starString = (rating: number) => {
    const full = Math.round(rating)
    return '★'.repeat(full) + '☆'.repeat(5 - full)
  }

  return (
    <div style={{ background: '#0a0a0a', color: '#fff', minHeight: '100vh' }}>
      {/* Nav */}
      <header style={{ position: 'fixed', top: 0, width: '100%', zIndex: 50, background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '1rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: '900', background: 'linear-gradient(135deg, #ff006e, #1dd1dd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SayPay</span>
          </Link>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <Link href="/leaderboards" style={{ color: '#999', textDecoration: 'none', fontSize: '0.9rem' }}>Leaderboard</Link>
            {user
              ? <Link href="/dashboard"><button style={{ background: 'rgba(255,0,110,0.15)', color: '#ff006e', border: '1px solid rgba(255,0,110,0.3)', padding: '0.55rem 1.2rem', borderRadius: '9999px', fontWeight: '700', cursor: 'pointer', fontSize: '0.85rem' }}>Dashboard</button></Link>
              : <Link href="/login"><button style={{ background: 'linear-gradient(135deg, #ff006e, #ffdd00)', color: '#000', padding: '0.55rem 1.25rem', borderRadius: '9999px', border: 'none', fontWeight: '800', cursor: 'pointer', fontSize: '0.85rem' }}>Log In</button></Link>
            }
          </div>
        </div>
      </header>

      <div style={{ paddingTop: '5.5rem', padding: '5.5rem 2rem 4rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '0.5rem' }}>Explore & Review</h1>
          <p style={{ color: '#666', marginBottom: '2rem' }}>Find a place. Write your truth. Pay $0.99.</p>

          {/* Search */}
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search restaurants, cafés, bars..."
              style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '0.75rem', padding: '0.875rem 1.25rem', color: '#fff', fontSize: '1rem', outline: 'none' }}
            />
            <button type="submit" style={{ background: 'linear-gradient(135deg, #ff006e, #ffdd00)', color: '#000', padding: '0.875rem 1.75rem', borderRadius: '0.75rem', border: 'none', fontWeight: '800', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Search
            </button>
          </form>

          {/* Category filter */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  background: category === cat ? 'linear-gradient(135deg, #ff006e, #ff886e)' : 'rgba(255,255,255,0.05)',
                  color: category === cat ? '#fff' : '#888',
                  border: category === cat ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  padding: '0.4rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#555' }}>Loading...</div>
          ) : businesses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#555' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏪</div>
              <p>No businesses found. Try a different search.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {businesses.map(biz => (
                <BusinessCard key={biz.id} business={biz} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function BusinessCard({ business }: { business: any }) {
  const [hovered, setHovered] = useState(false)
  const rating = parseFloat(business.avg_rating) || 0
  const stars = '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating))

  return (
    <Link href={`/business/${business.id}`} style={{ textDecoration: 'none' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
          border: business.is_boosted ? '2px solid rgba(255,221,0,0.5)' : '1px solid rgba(255,255,255,0.08)',
          borderRadius: '1.25rem',
          overflow: 'hidden',
          transform: hovered ? 'translateY(-4px)' : 'none',
          transition: 'all 0.25s ease',
          boxShadow: business.is_boosted ? '0 0 25px rgba(255,221,0,0.15)' : hovered ? '0 8px 32px rgba(0,0,0,0.4)' : 'none',
          cursor: 'pointer',
        }}
      >
        {/* Cover image */}
        <div style={{ position: 'relative', height: '160px', overflow: 'hidden' }}>
          {business.cover_image ? (
            <img src={business.cover_image} alt={business.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, rgba(255,0,110,0.3), rgba(29,209,221,0.3))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>
              {business.emoji}
            </div>
          )}
          {business.is_boosted && (
            <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'linear-gradient(135deg, #ffdd00, #ff886e)', color: '#000', fontSize: '0.7rem', fontWeight: '800', padding: '0.25rem 0.6rem', borderRadius: '9999px', textTransform: 'uppercase' }}>
              ⭐ Featured
            </div>
          )}
          <div style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem', background: 'rgba(10,10,10,0.8)', borderRadius: '9999px', padding: '0.25rem 0.75rem', fontSize: '0.8rem', color: '#aaa', backdropFilter: 'blur(4px)' }}>
            {business.category}
          </div>
        </div>

        <div style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <h3 style={{ fontWeight: '800', fontSize: '1.1rem', color: '#fff', margin: 0 }}>
              {business.emoji} {business.name}
            </h3>
          </div>
          <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '0.75rem' }}>📍 {business.location}</p>
          {business.description && (
            <p style={{ color: '#888', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {business.description}
            </p>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ color: '#ffdd00', fontSize: '0.9rem' }}>{stars}</span>
              <span style={{ color: '#888', fontSize: '0.8rem', marginLeft: '0.5rem' }}>{rating.toFixed(1)}</span>
            </div>
            <span style={{ color: '#555', fontSize: '0.8rem' }}>{business.total_reviews} verified reviews</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
