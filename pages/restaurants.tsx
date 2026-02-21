import { useState } from 'react'
import Link from 'next/link'

const mockItems = {
  restaurants: [
    { id: 1, name: 'Chipotle', location: 'Dupont Circle, DC', rating: 4.2, reviews: 12, category: 'Mexican', image: '🌯', trending: false },
    { id: 2, name: 'Sweetgreen', location: 'Downtown DC', rating: 4.5, reviews: 28, category: 'Salads', image: '🥗', trending: true },
    { id: 3, name: 'Shake Shack', location: 'Navy Yard, DC', rating: 4.1, reviews: 19, category: 'Burgers', image: '🍔', trending: false },
    { id: 4, name: 'Chick-fil-A', location: 'Gallery Place, DC', rating: 4.3, reviews: 45, category: 'Chicken', image: '🍗', trending: true },
  ],
  products: [
    { id: 5, name: 'McRib (Bring Back)', location: 'McDonalds', rating: 4.8, reviews: 2847, category: 'Discontinued', image: '🥪', trending: true, campaign: true, backers: 2847 },
    { id: 6, name: 'TJs Discontinued Snacks', location: 'Trader Joes', rating: 4.6, reviews: 1203, category: 'Food', image: '🍿', trending: true, campaign: true, backers: 1203 },
  ],
  services: [
    { id: 8, name: 'The Barbers Chair', location: 'Arts District', rating: 4.8, reviews: 67, category: 'Barbershop', image: '✂️', trending: false },
  ],
}

export default function Restaurants() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [filtered, setFiltered] = useState([...mockItems.restaurants, ...mockItems.products, ...mockItems.services])

  const handleSearch = (e: any) => {
    const query = e.target.value.toLowerCase()
    setSearch(query)
    updateFiltered(query, category)
  }

  const handleCategoryChange = (cat: string) => {
    setCategory(cat)
    updateFiltered(search, cat)
  }

  const updateFiltered = (query: string, cat: string) => {
    let items: any[] = []
    if (cat === 'all') items = [...mockItems.restaurants, ...mockItems.products, ...mockItems.services]
    else if (cat === 'restaurants') items = mockItems.restaurants
    else if (cat === 'products') items = mockItems.products
    else if (cat === 'services') items = mockItems.services

    const result = items.filter(r =>
      r.name.toLowerCase().includes(query) ||
      r.location.toLowerCase().includes(query) ||
      r.category.toLowerCase().includes(query)
    )
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
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', cursor: 'pointer' }}>
              SayPay
            </span>
          </Link>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/" style={{ textDecoration: 'none', color: '#999', cursor: 'pointer' }}>Home</Link>
            <span style={{ color: '#999' }}>Explore</span>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <section style={{ padding: '8rem 2rem 2rem', background: 'linear-gradient(180deg, rgba(168, 85, 247, 0.1) 0%, rgba(10, 10, 10, 0) 100%)' }}>
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

          {/* Category Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
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
                  background: category === cat ? '#a855f7' : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                }}
              >
                {label}
              </button>
            ))}
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
                    borderRadius: '1rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    height: '100%',
                    position: 'relative',
                  }}
                  onMouseEnter={(e: any) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                    e.currentTarget.style.borderColor = '#a855f7'
                    e.currentTarget.style.transform = 'translateY(-8px)'
                  }}
                  onMouseLeave={(e: any) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  {(item.trending || item.campaign) && (
                    <div style={{
                      position: 'absolute',
                      top: '0.75rem',
                      right: '0.75rem',
                      background: item.campaign ? '#ec4899' : '#f59e0b',
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
                    fontSize: '3rem',
                    marginBottom: '0.75rem',
                    textAlign: 'center',
                  }}>
                    {item.image}
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>{item.name}</h3>
                  <p style={{ color: '#999', fontSize: '0.875rem', marginBottom: '1rem' }}>{item.location}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ background: '#a855f7', padding: '0.25rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>
                      ⭐ {item.rating}
                    </span>
                    <span style={{ color: '#737373', fontSize: '0.875rem' }}>{item.reviews} reviews</span>
                  </div>

                  {item.campaign && (
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <div style={{ fontSize: '0.75rem', color: '#ec4899', fontWeight: '700', marginBottom: '0.5rem' }}>
                        {item.backers} backers 🚀
                      </div>
                      <div style={{ background: 'rgba(236, 72, 153, 0.2)', height: '4px', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ background: '#ec4899', height: '100%', width: `${Math.min(100, (item.backers / 3000) * 100)}%` }} />
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
