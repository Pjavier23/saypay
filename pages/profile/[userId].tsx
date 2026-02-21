import Link from 'next/link'

// Mock user data
const mockUsers: { [key: string]: any } = {
  'pedro': {
    id: 'pedro',
    name: 'Pedro Guerrero',
    avatar: '👨‍💼',
    trustScore: 94,
    level: 'Gold',
    bio: 'Food enthusiast & verified reviewer. Always looking for the next great meal.',
    stats: {
      reviewsWritten: 14,
      upvotesReceived: 112,
      moneySpent: 27.86,
      dayStreak: 8,
    },
    badges: [
      { id: 1, name: 'Verified Reviewer', icon: '✅', desc: 'Made 5+ verified reviews' },
      { id: 2, name: 'Trendsetter', icon: '🔥', desc: 'Had a review go viral (100+ upvotes)' },
      { id: 3, name: 'First Review', icon: '🎯', desc: 'Wrote your first review' },
      { id: 4, name: 'Supporter', icon: '❤️', desc: 'Tipped creators 5+ times' },
      { id: 5, name: 'Campaigner', icon: '🚀', desc: 'Backed 3+ "Bring It Back" campaigns' },
    ],
    recentReviews: [
      {
        id: 1,
        place: 'Sweetgreen',
        rating: 4.5,
        text: 'Honestly the best salad bowl in DC. Their dressing is *chef\'s kiss*. Worth every penny.',
        upvotes: 45,
        date: '2 days ago',
        trending: true,
      },
      {
        id: 2,
        place: 'Shake Shack',
        rating: 4.1,
        text: 'Good burgers, solid fries. Lines can get crazy during lunch though.',
        upvotes: 12,
        date: '5 days ago',
        trending: false,
      },
      {
        id: 3,
        place: 'Chipotle',
        rating: 3.8,
        text: 'Consistent, but nothing special. Rice quality varies week to week.',
        upvotes: 8,
        date: '1 week ago',
        trending: false,
      },
    ],
  },
  'alice': {
    id: 'alice',
    name: 'Alice Chen',
    avatar: '👩‍💻',
    trustScore: 87,
    level: 'Silver',
    bio: 'Coffee snob. Brunch expert. Let\'s chat about your favorites.',
    stats: {
      reviewsWritten: 8,
      upvotesReceived: 34,
      moneySpent: 14.92,
      dayStreak: 3,
    },
    badges: [
      { id: 1, name: 'Verified Reviewer', icon: '✅', desc: 'Made 5+ verified reviews' },
      { id: 3, name: 'First Review', icon: '🎯', desc: 'Wrote your first review' },
    ],
    recentReviews: [
      {
        id: 1,
        place: 'Chick-fil-A',
        rating: 4.3,
        text: 'Fast service, solid chicken sandwich. The lemonade is a must-try.',
        upvotes: 18,
        date: '3 days ago',
        trending: false,
      },
    ],
  },
  'marcus': {
    id: 'marcus',
    name: 'Marcus Williams',
    avatar: '👨‍🍳',
    trustScore: 91,
    level: 'Gold',
    bio: 'Chef by day, food critic by night. Every meal tells a story.',
    stats: {
      reviewsWritten: 22,
      upvotesReceived: 287,
      moneySpent: 45.78,
      dayStreak: 12,
    },
    badges: [
      { id: 1, name: 'Verified Reviewer', icon: '✅', desc: 'Made 5+ verified reviews' },
      { id: 2, name: 'Trendsetter', icon: '🔥', desc: 'Had a review go viral (100+ upvotes)' },
      { id: 3, name: 'First Review', icon: '🎯', desc: 'Wrote your first review' },
      { id: 4, name: 'Supporter', icon: '❤️', desc: 'Tipped creators 5+ times' },
      { id: 5, name: 'Campaigner', icon: '🚀', desc: 'Backed 3+ "Bring It Back" campaigns' },
    ],
    recentReviews: [
      {
        id: 1,
        place: 'Thai Orchid',
        rating: 4.6,
        text: 'Authentic Thai flavors. The pad krapow gai is exceptional. Highly recommend.',
        upvotes: 67,
        date: '1 day ago',
        trending: true,
      },
    ],
  },
}

export default function Profile({ userId }: { userId: string }) {
  const user = mockUsers[userId]

  if (!user) {
    return (
      <div style={{ background: '#0a0a0a', color: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>User Not Found</h1>
        <Link href="/restaurants" style={{ color: '#a855f7', textDecoration: 'none' }}>
          ← Back to Explore
        </Link>
      </div>
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
            <Link href="/restaurants" style={{ textDecoration: 'none', color: '#999', cursor: 'pointer' }}>Explore</Link>
          </div>
        </div>
      </header>

      {/* Profile Hero */}
      <section style={{
        padding: '8rem 2rem 3rem',
        background: `linear-gradient(180deg, rgba(168, 85, 247, 0.15) 0%, rgba(10, 10, 10, 0) 100%)`,
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
          {/* Avatar */}
          <div style={{
            fontSize: '5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '120px',
            height: '120px',
            background: 'rgba(168, 85, 247, 0.2)',
            borderRadius: '50%',
            border: '2px solid #a855f7',
            flexShrink: 0,
          }}>
            {user.avatar}
          </div>

          {/* Info */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: 0 }}>{user.name}</h1>
              <span style={{
                background: user.level === 'Gold' ? '#f59e0b' : '#6b7280',
                color: '#000',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '700',
              }}>
                {user.level} Member
              </span>
            </div>
            <p style={{ color: '#999', marginBottom: '1rem', maxWidth: '400px' }}>{user.bio}</p>

            {/* Trust Score */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: '0.75rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              width: 'fit-content',
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#a855f7' }}>{user.trustScore}%</div>
                <div style={{ fontSize: '0.75rem', color: '#999' }}>Trust Score</div>
              </div>
              <div style={{ width: '1px', height: '40px', background: 'rgba(255, 255, 255, 0.1)' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', color: '#999' }}>✅ Verified</span>
                <span style={{ fontSize: '0.875rem', color: '#999' }}>⭐ Active reviewer</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section style={{ padding: '3rem 2rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
          }}>
            <div style={{
              background: 'rgba(168, 85, 247, 0.1)',
              padding: '1.5rem',
              borderRadius: '1rem',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '2rem', fontWeight: '900', color: '#a855f7', marginBottom: '0.5rem' }}>
                {user.stats.reviewsWritten}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#999' }}>Reviews Written</div>
            </div>

            <div style={{
              background: 'rgba(236, 72, 153, 0.1)',
              padding: '1.5rem',
              borderRadius: '1rem',
              border: '1px solid rgba(236, 72, 153, 0.3)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '2rem', fontWeight: '900', color: '#ec4899', marginBottom: '0.5rem' }}>
                {user.stats.upvotesReceived}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#999' }}>Upvotes Received</div>
            </div>

            <div style={{
              background: 'rgba(245, 158, 11, 0.1)',
              padding: '1.5rem',
              borderRadius: '1rem',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '2rem', fontWeight: '900', color: '#f59e0b', marginBottom: '0.5rem' }}>
                ${user.stats.moneySpent}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#999' }}>Total Spent</div>
            </div>

            <div style={{
              background: 'rgba(34, 197, 94, 0.1)',
              padding: '1.5rem',
              borderRadius: '1rem',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '2rem', fontWeight: '900', color: '#22c55e', marginBottom: '0.5rem' }}>
                {user.stats.dayStreak}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#999' }}>Day Streak 🔥</div>
            </div>
          </div>
        </div>
      </section>

      {/* Badges */}
      <section style={{ padding: '3rem 2rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '2rem' }}>Achievements</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '1.5rem',
          }}>
            {user.badges.map((badge: any) => (
              <div
                key={badge.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  padding: '1.5rem',
                  borderRadius: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e: any) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                  e.currentTarget.style.borderColor = '#a855f7'
                  e.currentTarget.style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={(e: any) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{badge.icon}</div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.25rem' }}>{badge.name}</h3>
                <p style={{ fontSize: '0.75rem', color: '#999' }}>{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Reviews */}
      <section style={{ padding: '3rem 2rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '2rem' }}>Recent Reviews</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {user.recentReviews.map((review: any) => (
              <div
                key={review.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  padding: '1.5rem',
                  borderRadius: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.25rem' }}>{review.place}</h3>
                    <p style={{ color: '#999', fontSize: '0.875rem' }}>{review.date}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {review.trending && (
                      <span style={{
                        background: '#f59e0b',
                        color: '#000',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                      }}>
                        🔥 Trending
                      </span>
                    )}
                    <span style={{ background: '#a855f7', padding: '0.25rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>
                      ⭐ {review.rating}
                    </span>
                  </div>
                </div>
                <p style={{ color: '#e5e5e5', marginBottom: '1rem', lineHeight: '1.6' }}>{review.text}</p>
                <div style={{ display: 'flex', gap: '1rem', color: '#999', fontSize: '0.875rem' }}>
                  <button style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#ec4899',
                    cursor: 'pointer',
                    fontWeight: '600',
                    padding: 0,
                  }}>
                    👍 {review.upvotes} Helpful
                  </button>
                  <button style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#999',
                    cursor: 'pointer',
                    padding: 0,
                  }}>
                    💬 Reply
                  </button>
                </div>
              </div>
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

export async function getStaticProps({ params }: { params: { userId: string } }) {
  return { props: { userId: params.userId } }
}

export async function getStaticPaths() {
  return {
    paths: [
      { params: { userId: 'pedro' } },
      { params: { userId: 'alice' } },
      { params: { userId: 'marcus' } },
    ],
    fallback: true,
  }
}
