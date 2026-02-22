import Link from 'next/link'
import { useState } from 'react'

const mockCampaigns = [
  {
    id: 1,
    name: 'Bring Back the McRib',
    emoji: '🥪',
    brand: 'McDonald\'s',
    goal: 50000,
    current: 28470,
    backers: 28470,
    daysLeft: 45,
    trending: true,
    description: 'The McRib is an iconic sandwich that deserves a permanent place on the menu. Help us show McDonald\'s the demand is real.',
    category: 'Food',
    image: 'https://images.unsplash.com/photo-1572802419224-7c93d6da16d7?w=500&h=400&fit=crop',
    gradient: 'linear-gradient(135deg, #D4341F 0%, #FFC72C 100%)',
    updates: [
      { date: '2 days ago', text: '🎉 We hit 25K backers! McDonald\'s is listening.' },
      { date: '1 week ago', text: '📢 Featured on TikTok - views spiked 300%!' },
    ],
  },
  {
    id: 2,
    name: 'Trader Joe\'s Discontinued Snacks',
    emoji: '🍿',
    brand: 'Trader Joe\'s',
    goal: 40000,
    current: 12030,
    backers: 12030,
    daysLeft: 52,
    trending: true,
    description: 'Bring back the legendary snack mixes. Sea Salt & Vinegar, BBQ, and the legendary trail mix blend. Trader Joe\'s, we\'re calling you home.',
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1599599810694-200c7e7f3818?w=500&h=400&fit=crop',
    gradient: 'linear-gradient(135deg, #8B4513 0%, #FFD700 100%)',
    updates: [
      { date: '3 days ago', text: '📊 Momentum building - 12K backers and counting!' },
      { date: '2 weeks ago', text: '🚀 Campaign launched with major retailer support.' },
    ],
  },
  {
    id: 3,
    name: 'Surge Energy Drink Return',
    emoji: '🥤',
    brand: 'The Coca-Cola Company',
    goal: 60000,
    current: 8234,
    backers: 8234,
    daysLeft: 38,
    trending: false,
    description: 'Surge defined the 90s energy drink era. It\'s time to bring back the green giant and reclaim our beverage history. Taste the rush again.',
    category: 'Beverage',
    image: 'https://images.unsplash.com/photo-1554866585-c4db4d85d5d0?w=500&h=400&fit=crop',
    gradient: 'linear-gradient(135deg, #00AA44 0%, #00DD77 100%)',
    updates: [
      { date: '1 week ago', text: '🟢 Just launched - spreading the word!' },
    ],
  },
  {
    id: 4,
    name: 'Classic Pepsi Blue',
    emoji: '🔵',
    brand: 'PepsiCo',
    goal: 45000,
    current: 5892,
    backers: 5892,
    daysLeft: 61,
    trending: false,
    description: 'The wild, electric blue cola of the early 2000s. Pepsi Blue was ahead of its time. Let\'s show demand still exists.',
    category: 'Beverage',
    image: 'https://images.unsplash.com/photo-1554866585-c4db4d85d5d0?w=500&h=400&fit=crop',
    gradient: 'linear-gradient(135deg, #0033FF 0%, #6699FF 100%)',
    updates: [
      { date: '5 days ago', text: '💙 Early supporters coming in strong.' },
    ],
  },
]

export default function Campaigns() {
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('trending')

  const filtered = mockCampaigns.filter(c => {
    if (filter === 'trending') return c.trending
    if (filter === 'food') return c.category === 'Food'
    if (filter === 'snacks') return c.category === 'Snacks'
    if (filter === 'beverage') return c.category === 'Beverage'
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'trending') return b.current - a.current
    if (sortBy === 'newest') return b.id - a.id
    return a.daysLeft - b.daysLeft
  })

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
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #ff6b35, #1dd1dd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', cursor: 'pointer' }}>
              SayPay
            </span>
          </Link>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/" style={{ textDecoration: 'none', color: '#999', cursor: 'pointer' }}>Home</Link>
            <Link href="/restaurants" style={{ textDecoration: 'none', color: '#999', cursor: 'pointer' }}>Explore</Link>
            <Link href="/leaderboards" style={{ textDecoration: 'none', color: '#999', cursor: 'pointer' }}>Leaderboards</Link>
            <span style={{ color: '#ff6b35', fontWeight: '600' }}>Campaigns</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{
        padding: '8rem 2rem 3rem',
        background: 'linear-gradient(180deg, rgba(29, 209, 221, 0.15) 0%, rgba(255, 107, 53, 0.1) 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1rem' }}>🚀 Bring It Back</h1>
          <p style={{ color: '#999', fontSize: '1.125rem', marginBottom: '2rem' }}>
            Vote with your wallet. Resurrect discontinued products. Show brands what you really want.
          </p>
          <p style={{ color: '#666', fontSize: '0.875rem' }}>
            Each backer pays $0.99 to signal real demand. Brands see the data. Products come back.
          </p>
        </div>
      </section>

      {/* Featured Campaign */}
      <section style={{ padding: '3rem 2rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          {(() => {
            const featured = mockCampaigns[0]
            const progressPercent = (featured.current / featured.goal) * 100
            return (
              <div style={{
                background: featured.gradient,
                borderRadius: '1.5rem',
                padding: '3rem',
                marginBottom: '3rem',
                display: 'flex',
                gap: '3rem',
                alignItems: 'center',
                boxShadow: '0 20px 60px rgba(29, 209, 221, 0.3)',
                overflow: 'hidden',
                transition: 'all 0.4s ease',
                position: 'relative',
              }}
              onMouseEnter={(e: any) => {
                e.currentTarget.style.transform = 'translateY(-8px)'
                e.currentTarget.style.boxShadow = '0 32px 80px rgba(29, 209, 221, 0.4)'
              }}
              onMouseLeave={(e: any) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(29, 209, 221, 0.3)'
              }}>
                <div style={{
                  minWidth: '200px',
                  height: '200px',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  flexShrink: 0,
                }}>
                  <img 
                    src={featured.image}
                    alt={featured.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <span style={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      color: '#000',
                      padding: '0.4rem 0.9rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      textTransform: 'uppercase',
                    }}>
                      🔥 Featured
                    </span>
                  </div>
                  <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '0.5rem', color: '#fff' }}>
                    {featured.name}
                  </h2>
                  <p style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '1.5rem', maxWidth: '500px', lineHeight: '1.6' }}>
                    {featured.description}
                  </p>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: '#fff', fontWeight: '600' }}>
                      <span>{featured.backers.toLocaleString()} backers</span>
                      <span>{Math.round(progressPercent)}%</span>
                    </div>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      height: '8px',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}>
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.95)',
                          height: '100%',
                          width: `${Math.min(100, progressPercent)}%`,
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </div>
                  <button style={{
                    background: '#ffffff',
                    color: '#000',
                    padding: '0.85rem 2rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    fontWeight: '800',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                  }}>
                    Back for $0.99 ({featured.daysLeft} days left)
                  </button>
                </div>
              </div>
            )
          })()}
        </div>
      </section>

      {/* Filters & Sort */}
      <section style={{
        padding: '2rem 2rem 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {/* Filters */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: 'All' },
                { id: 'trending', label: '🔥 Trending' },
                { id: 'food', label: '🍔 Food' },
                { id: 'snacks', label: '🍿 Snacks' },
                { id: 'beverage', label: '🥤 Beverages' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  style={{
                    background: filter === f.id ? '#ff6b35' : 'rgba(255, 255, 255, 0.05)',
                    color: '#fff',
                    padding: '0.5rem 1.25rem',
                    borderRadius: '9999px',
                    border: filter === f.id ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    fontSize: '0.875rem',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#fff',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              <option value="trending">Most Backed</option>
              <option value="newest">Newest First</option>
              <option value="ending">Ending Soon</option>
            </select>
          </div>
        </div>
      </section>

      {/* Campaigns */}
      <section style={{ padding: '3rem 2rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '2rem',
          }}>
            {sorted.map(campaign => {
              const progressPercent = (campaign.current / campaign.goal) * 100
              return (
                <div
                  key={campaign.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '1.25rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                  }}
                  onMouseEnter={(e: any) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                    e.currentTarget.style.borderColor = '#1dd1dd'
                    e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)'
                    e.currentTarget.style.boxShadow = '0 20px 48px rgba(29, 209, 221, 0.25)'
                  }}
                  onMouseLeave={(e: any) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                    e.currentTarget.style.transform = 'translateY(0) scale(1)'
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  {/* Image Header */}
                  <div style={{
                    position: 'relative',
                    minHeight: '200px',
                    overflow: 'hidden',
                    background: campaign.gradient,
                  }}>
                    <img 
                      src={campaign.image}
                      alt={campaign.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease',
                      }}
                      onMouseEnter={(e: any) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e: any) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${campaign.gradient} 100%)`,
                      opacity: 0.3,
                    }} />
                    {campaign.trending && (
                      <div style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: '#ffffff',
                        color: '#000',
                        padding: '0.35rem 0.85rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        zIndex: 10,
                      }}>
                        🔥 Trending
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <p style={{ color: '#999', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '600', marginBottom: '0.25rem' }}>
                        {campaign.category}
                      </p>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                        {campaign.name}
                      </h3>
                      <p style={{ color: '#999', fontSize: '0.875rem' }}>by {campaign.brand}</p>
                    </div>

                    <p style={{ color: '#d1d5db', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                      {campaign.description}
                    </p>

                    {/* Progress */}
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                        <span>
                          <span style={{ color: '#1dd1dd', fontWeight: '700' }}>{campaign.backers.toLocaleString()}</span>
                          {' '}
                          <span style={{ color: '#999' }}>backers</span>
                        </span>
                        <span style={{ color: '#999' }}>{Math.round(progressPercent)}%</span>
                      </div>
                      <div style={{
                        background: 'rgba(29, 209, 221, 0.1)',
                        height: '6px',
                        borderRadius: '3px',
                        overflow: 'hidden',
                      }}>
                        <div
                          style={{
                            background: 'linear-gradient(90deg, #1dd1dd, #f7dc6f)',
                            height: '100%',
                            width: `${Math.min(100, progressPercent)}%`,
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.5rem' }}>
                        {campaign.daysLeft} days left
                      </div>
                    </div>

                    {/* CTA */}
                    <button style={{
                      background: '#1dd1dd',
                      color: '#000',
                      padding: '0.75rem 1rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      fontWeight: '700',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      marginTop: 'auto',
                    }}>
                      Back for $0.99
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{
        padding: '4rem 2rem',
        background: 'rgba(255, 255, 255, 0.02)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            textAlign: 'center',
          }}>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1dd1dd', marginBottom: '0.5rem' }}>
                {mockCampaigns.length}
              </div>
              <div style={{ color: '#999' }}>Active Campaigns</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#ff6b35', marginBottom: '0.5rem' }}>
                {mockCampaigns.reduce((acc, c) => acc + c.backers, 0).toLocaleString()}
              </div>
              <div style={{ color: '#999' }}>Total Backers</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#f7dc6f', marginBottom: '0.5rem' }}>
                ${(mockCampaigns.reduce((acc, c) => acc + c.backers, 0) * 0.99).toFixed(2)}
              </div>
              <div style={{ color: '#999' }}>Total Backed</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '4rem 2rem',
        textAlign: 'center',
        background: 'linear-gradient(180deg, rgba(29, 209, 221, 0.1) 0%, rgba(10, 10, 10, 0) 100%)',
      }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '1rem' }}>
            Can't find what you're looking for?
          </h2>
          <p style={{ color: '#999', marginBottom: '2rem', fontSize: '1.125rem' }}>
            Start your own campaign and rally the community.
          </p>
          <button style={{
            background: '#ff6b35',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '0.5rem',
            border: 'none',
            fontWeight: '700',
            cursor: 'pointer',
            fontSize: '1rem',
            boxShadow: '0 0 40px rgba(255, 107, 53, 0.3)',
          }}>
            Launch a Campaign
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', padding: '2rem', textAlign: 'center', color: '#737373', fontSize: '0.875rem' }}>
        <p>© 2025 SayPay. Every word means something.</p>
      </footer>
    </div>
  )
}
