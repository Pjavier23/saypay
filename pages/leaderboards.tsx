import Link from 'next/link'
import { useState } from 'react'

const mockLeaderboardData = {
  reviewers: {
    thisWeek: [
      { rank: 1, name: 'Marcus Williams', userId: 'marcus', avatar: '👨‍🍳', reviews: 7, upvotes: 145, trustScore: 91, trend: '↑ +2' },
      { rank: 2, name: 'Pedro Guerrero', userId: 'pedro', avatar: '👨‍💼', reviews: 5, upvotes: 89, trustScore: 94, trend: '↑ +1' },
      { rank: 3, name: 'Alice Chen', userId: 'alice', avatar: '👩‍💻', reviews: 4, upvotes: 42, trustScore: 87, trend: '→' },
      { rank: 4, name: 'Sarah M.', userId: null, avatar: '👩', reviews: 3, upvotes: 28, trustScore: 78, trend: '↓ -1' },
      { rank: 5, name: 'James K.', userId: null, avatar: '👨', reviews: 2, upvotes: 15, trustScore: 72, trend: '→' },
    ],
    allTime: [
      { rank: 1, name: 'Marcus Williams', userId: 'marcus', avatar: '👨‍🍳', reviews: 22, upvotes: 287, trustScore: 91, trend: 'Legend' },
      { rank: 2, name: 'Pedro Guerrero', userId: 'pedro', avatar: '👨‍💼', reviews: 14, upvotes: 112, trustScore: 94, trend: 'Veteran' },
      { rank: 3, name: 'Alice Chen', userId: 'alice', avatar: '👩‍💻', reviews: 8, upvotes: 56, trustScore: 87, trend: 'Rising' },
      { rank: 4, name: 'Sarah M.', userId: null, avatar: '👩', reviews: 6, upvotes: 34, trustScore: 78, trend: 'Active' },
      { rank: 5, name: 'James K.', userId: null, avatar: '👨', reviews: 5, upvotes: 22, trustScore: 72, trend: 'Engaged' },
    ],
  },
  trendingReviews: [
    {
      id: 1,
      author: 'Marcus Williams',
      userId: 'marcus',
      avatar: '👨‍🍳',
      place: 'Thai Orchid',
      rating: 4.6,
      text: 'Authentic Thai flavors. The pad krapow gai is exceptional. Highly recommend.',
      upvotes: 67,
      date: '1 day ago',
      views: 234,
      trustScore: 91,
    },
    {
      id: 2,
      author: 'Pedro Guerrero',
      userId: 'pedro',
      avatar: '👨‍💼',
      place: 'Sweetgreen',
      rating: 4.5,
      text: 'Honestly the best salad bowl in DC. Their dressing is *chef\'s kiss*. Worth every penny.',
      upvotes: 45,
      date: '2 days ago',
      views: 156,
      trustScore: 94,
    },
    {
      id: 3,
      author: 'Alice Chen',
      userId: 'alice',
      avatar: '👩‍💻',
      place: 'Chick-fil-A',
      rating: 4.3,
      text: 'Fast service, solid chicken sandwich. The lemonade is a must-try.',
      upvotes: 18,
      date: '3 days ago',
      views: 89,
      trustScore: 87,
    },
  ],
  badges: [
    { rank: 1, name: '🏆 Master Reviewer', icon: '🏆', members: 3, description: '50+ reviews written' },
    { rank: 2, name: '🔥 Trendsetter', icon: '🔥', members: 8, description: 'Review went viral (100+ upvotes)' },
    { rank: 3, name: '✅ Verified Champion', icon: '✅', members: 24, description: '25+ verified reviews' },
    { rank: 4, name: '❤️ Supporter', icon: '❤️', members: 142, description: 'Tipped creators 5+ times' },
  ],
}

export default function Leaderboards() {
  const [activeTab, setActiveTab] = useState('reviewers')
  const [timeRange, setTimeRange] = useState('thisWeek')

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
            <Link href="/restaurants" style={{ textDecoration: 'none', color: '#999', cursor: 'pointer' }}>Explore</Link>
            <span style={{ color: '#ff1493', fontWeight: '600' }}>Leaderboards</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{
        padding: '8rem 2rem 3rem',
        background: 'linear-gradient(180deg, rgba(255, 20, 147, 0.15) 0%, rgba(0, 217, 255, 0.1) 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1rem' }}>🏆 Leaderboards</h1>
          <p style={{ color: '#999', fontSize: '1.125rem' }}>The most trusted reviewers. The most viral reviews. The rising stars.</p>
        </div>
      </section>

      {/* Tabs */}
      <section style={{ padding: '2rem 2rem 0', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            {[
              { id: 'reviewers', label: '👥 Top Reviewers' },
              { id: 'trending', label: '🔥 Trending Reviews' },
              { id: 'badges', label: '🎖️ Badges' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: activeTab === tab.id ? '#ff1493' : '#999',
                  padding: '1rem 0',
                  borderBottom: activeTab === tab.id ? '2px solid #ff1493' : 'none',
                  cursor: 'pointer',
                  fontWeight: activeTab === tab.id ? '700' : '400',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: '3rem 2rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          {/* Top Reviewers */}
          {activeTab === 'reviewers' && (
            <>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                {['thisWeek', 'allTime'].map(range => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    style={{
                      background: timeRange === range ? '#ff1493' : 'rgba(255, 255, 255, 0.05)',
                      color: '#fff',
                      padding: '0.5rem 1.5rem',
                      borderRadius: '9999px',
                      border: timeRange === range ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                      cursor: 'pointer',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {range === 'thisWeek' ? 'This Week' : 'All Time'}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {mockLeaderboardData.reviewers[timeRange as 'thisWeek' | 'allTime'].map((reviewer, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      padding: '1.5rem',
                      borderRadius: '1rem',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.5rem',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e: any) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                      e.currentTarget.style.borderColor = '#ff1493'
                      e.currentTarget.style.transform = 'translateX(8px)'
                    }}
                    onMouseLeave={(e: any) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                      e.currentTarget.style.transform = 'translateX(0)'
                    }}
                  >
                    {/* Rank */}
                    <div style={{
                      fontSize: idx === 0 ? '2rem' : '1.5rem',
                      fontWeight: '900',
                      width: '60px',
                      textAlign: 'center',
                      color: idx === 0 ? '#39ff14' : idx === 1 ? '#ff1493' : '#999',
                    }}>
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${reviewer.rank}`}
                    </div>

                    {/* Avatar & Name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                      <div style={{ fontSize: '2.5rem' }}>{reviewer.avatar}</div>
                      {reviewer.userId ? (
                        <Link href={`/profile/${reviewer.userId}`} style={{ textDecoration: 'none', color: '#fff' }}>
                          <div style={{ cursor: 'pointer' }}>
                            <h3 style={{ fontWeight: '700', fontSize: '1.125rem', marginBottom: '0.25rem', color: '#ff1493' }}>
                              {reviewer.name}
                            </h3>
                            <p style={{ color: '#999', fontSize: '0.875rem' }}>Trust {reviewer.trustScore}% • {reviewer.reviews} reviews</p>
                          </div>
                        </Link>
                      ) : (
                        <div>
                          <h3 style={{ fontWeight: '700', fontSize: '1.125rem', marginBottom: '0.25rem' }}>
                            {reviewer.name}
                          </h3>
                          <p style={{ color: '#999', fontSize: '0.875rem' }}>Trust {reviewer.trustScore}% • {reviewer.reviews} reviews</p>
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', textAlign: 'right' }}>
                      <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#00d9ff' }}>{reviewer.upvotes}</div>
                        <div style={{ color: '#999', fontSize: '0.75rem' }}>Upvotes</div>
                      </div>
                      <div style={{
                        padding: '0.5rem 1rem',
                        background: reviewer.trend.includes('↑') ? 'rgba(34, 197, 94, 0.2)' : reviewer.trend.includes('↓') ? 'rgba(239, 68, 68, 0.2)' : 'rgba(107, 114, 128, 0.2)',
                        borderRadius: '0.5rem',
                        color: reviewer.trend.includes('↑') ? '#22c55e' : reviewer.trend.includes('↓') ? '#ef4444' : '#999',
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        minWidth: '60px',
                      }}>
                        {reviewer.trend}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Trending Reviews */}
          {activeTab === 'trending' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {mockLeaderboardData.trendingReviews.map((review, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    padding: '2rem',
                    borderRadius: '1rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e: any) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                    e.currentTarget.style.borderColor = '#39ff14'
                  }}
                  onMouseLeave={(e: any) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '2.5rem' }}>{review.avatar}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        {review.userId ? (
                          <Link href={`/profile/${review.userId}`} style={{ textDecoration: 'none', color: '#fff' }}>
                            <h3 style={{ fontWeight: '700', fontSize: '1.125rem', color: '#ff1493', cursor: 'pointer' }}>
                              {review.author}
                            </h3>
                          </Link>
                        ) : (
                          <h3 style={{ fontWeight: '700', fontSize: '1.125rem' }}>
                            {review.author}
                          </h3>
                        )}
                        <span style={{ background: '#ff1493', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600' }}>
                          Trust {review.trustScore}%
                        </span>
                      </div>
                      <p style={{ color: '#999', fontSize: '0.875rem', marginBottom: '1rem' }}>
                        Reviewed <span style={{ color: '#00d9ff', fontWeight: '600' }}>{review.place}</span> {review.date}
                      </p>
                      <p style={{ color: '#e5e5e5', marginBottom: '1rem', lineHeight: '1.6' }}>{review.text}</p>
                      <div style={{ display: 'flex', gap: '2rem', color: '#999', fontSize: '0.875rem' }}>
                        <span>👍 {review.upvotes} Upvotes</span>
                        <span>👁️ {review.views} Views</span>
                        <span>⭐ {review.rating}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', minWidth: '80px' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#39ff14', marginBottom: '0.5rem' }}>
                        🔥 #{idx + 1}
                      </div>
                      <div style={{ color: '#999', fontSize: '0.75rem' }}>Trending</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Badges */}
          {activeTab === 'badges' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '1.5rem',
            }}>
              {mockLeaderboardData.badges.map((badge, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    padding: '2rem',
                    borderRadius: '1rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e: any) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                    e.currentTarget.style.transform = 'translateY(-8px)'
                  }}
                  onMouseLeave={(e: any) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{badge.icon}</div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.5rem' }}>{badge.name}</h3>
                  <p style={{ color: '#999', fontSize: '0.875rem', marginBottom: '1rem' }}>{badge.description}</p>
                  <div style={{ padding: '0.75rem', background: 'rgba(255, 20, 147, 0.1)', borderRadius: '0.5rem', color: '#ff1493', fontWeight: '600', fontSize: '0.875rem' }}>
                    {badge.members} Members
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '4rem 2rem',
        background: 'linear-gradient(180deg, rgba(255, 20, 147, 0.1) 0%, rgba(10, 10, 10, 0) 100%)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '1rem' }}>Ready to Climb the Ranks?</h2>
          <p style={{ color: '#999', marginBottom: '2rem', fontSize: '1.125rem' }}>Start writing reviews and join the top reviewers on SayPay.</p>
          <Link href="/restaurants" style={{ textDecoration: 'none' }}>
            <button style={{
              background: '#ff1493',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '0.5rem',
              border: 'none',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '1rem',
              boxShadow: '0 0 40px rgba(255, 20, 147, 0.3)',
            }}>
              Explore & Review
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', padding: '2rem', marginTop: '0', textAlign: 'center', color: '#737373', fontSize: '0.875rem' }}>
        <p>© 2025 SayPay. Every word means something.</p>
      </footer>
    </div>
  )
}
