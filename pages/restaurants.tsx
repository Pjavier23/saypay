import { useState } from 'react'
import Link from 'next/link'

const mockRestaurants = [
  { id: 1, name: 'Chipotle', location: 'Dupont Circle, DC', rating: 4.2, reviews: 12, cuisine: 'Mexican' },
  { id: 2, name: 'Sweetgreen', location: 'Downtown DC', rating: 4.5, reviews: 28, cuisine: 'Salads' },
  { id: 3, name: 'Shake Shack', location: 'Navy Yard, DC', rating: 4.1, reviews: 19, cuisine: 'Burgers' },
  { id: 4, name: 'Chick-fil-A', location: 'Gallery Place, DC', rating: 4.3, reviews: 45, cuisine: 'Chicken' },
  { id: 5, name: 'Thai Orchid', location: 'Georgetown, DC', rating: 4.4, reviews: 16, cuisine: 'Thai' },
  { id: 6, name: 'Panda Express', location: 'Bethesda, MD', rating: 3.8, reviews: 22, cuisine: 'Chinese' },
]

export default function Restaurants() {
  const [search, setSearch] = useState('')
  const [filteredRestaurants, setFilteredRestaurants] = useState(mockRestaurants)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase()
    setSearch(query)
    setFilteredRestaurants(
      mockRestaurants.filter(r =>
        r.name.toLowerCase().includes(query) ||
        r.location.toLowerCase().includes(query) ||
        r.cuisine.toLowerCase().includes(query)
      )
    )
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
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', cursor: 'pointer' }}>
              SayPay
            </span>
          </Link>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/" style={{ textDecoration: 'none', color: '#999', cursor: 'pointer' }}>Home</Link>
            <span style={{ color: '#999' }}>Restaurants</span>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <section style={{ padding: '8rem 2rem 2rem', background: 'linear-gradient(180deg, rgba(168, 85, 247, 0.1) 0%, rgba(10, 10, 10, 0) 100%)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '2rem', textAlign: 'center' }}>Find Restaurants</h1>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            padding: '1.5rem',
            borderRadius: '1rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '3rem',
          }}>
            <input
              type="text"
              placeholder="Search by name, location, or cuisine..."
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
              onFocus={e => e.currentTarget.style.borderColor = '#a855f7'}
              onBlur={e => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
            />
          </div>

          {/* Results count */}
          <p style={{ color: '#737373', marginBottom: '2rem' }}>
            {filteredRestaurants.length} restaurants found
          </p>

          {/* Restaurant Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}>
            {filteredRestaurants.map(restaurant => (
              <Link key={restaurant.id} href={`/restaurant/${restaurant.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    padding: '1.5rem',
                    borderRadius: '1rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    height: '100%',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                    e.currentTarget.style.borderColor = '#a855f7'
                    e.currentTarget.style.transform = 'translateY(-4px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>{restaurant.name}</h3>
                      <p style={{ color: '#999', fontSize: '0.875rem' }}>{restaurant.location}</p>
                    </div>
                    <span style={{ background: '#a855f7', padding: '0.25rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>
                      ⭐ {restaurant.rating}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                    <span style={{ color: '#737373', fontSize: '0.875rem' }}>{restaurant.cuisine}</span>
                    <span style={{ color: '#737373', fontSize: '0.875rem' }}>{restaurant.reviews} reviews</span>
                  </div>
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
