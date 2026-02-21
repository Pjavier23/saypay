import Link from 'next/link'
import { useRouter } from 'next/router'

const mockUser = {
  username: 'pedro_guerrero',
  name: 'Pedro Guerrero',
  trustScore: 94,
  level: 'Gold',
  reviews: 14,
  upvotes: 8,
  spent: 27.86,
  reviewStreak: 5,
  joinDate: 'Jan 2025',
  bio: 'Food critic. Honest opinions. Always paying.',
  badges: [
    { id: 1, name: 'Verified Reviewer', icon: '✓', color: '#10b981', earned: true },
    { id: 2, name: 'Trendsetter', icon: '🚀', color: '#f59e0b', earned: true },
    { id: 3, name: 'Campaign Leader', icon: '🎯', color: '#a855f7', earned: false },
    { id: 4, name: 'Community Champion', icon: '👑', color: '#ec4899', earned: false },
    { id: 5, name: '100 Reviews', icon: '💯', color: '#06b6d4', earned: false },
  ],
  recentReviews: [
    { id: 1, restaurant: 'Sakura Ramen House', rating: 5, text: 'Best tonkotsu in the Pacific NW', upvotes: 24, tips: 5 },
    { id: 2, restaurant: 'Blue Bottle Coffee', rating: 4, text: 'Excellent pour-over', upvotes: 12, tips: 2 },
  ],
}

export default function UserProfile() {
  const router = useRouter()

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
            <Link href="/restaurants" style={{ textDecoration: 'none', color: '#999', cursor: 'pointer' }}>Explore</Link>
            <Link href="/leaderboard" style={{ textDecoration: 'none', color: '#999', cursor: 'pointer' }}>Leaderboard</Link>
          </div>
        </div>
      </header>

      {/* Profile Hero */}
      <section style={{ padding: '8rem 2rem 4rem', background: 'linear-gradient(180deg, rgba(168, 85, 247, 0.1) 0%, rgba(10, 10, 10, 0) 100%)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          {/* Profile Card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            padding: '3rem',
            borderRadius: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '3rem',
          }}>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'start', marginBottom: '2rem' }}>
              {/* Avatar */}
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
                flexShrink: 0,
              }}>
                👤
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: 0 }}>{mockUser.name}</h1>
                  <span style={{
                    background: '#a855f7',
                    padding: '0.25rem 1rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                  }}>
                    {mockUser.level} Reviewer
                  </span>
                </div>
                <p style={{ color: '#999', marginBottom: '1rem' }}>@{mockUser.username} • Joined {mockUser.joinDate}</p>
                <p style={{ color: '#d1d5db', marginBottom: '1.5rem' }}>{mockUser.bio}</p>

                {/* Trust Score */}
                <div style={{
                  background: 'rgba(168, 85, 247, 0.1)',
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  display: 'inline-block',
                }}>
                  <div style={{ fontSize: '0.875rem', color: '#999', marginBottom: '0.25rem' }}>Trust Score</div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: '#a855f7' }}>{mockUser.trustScore}% 🔥</div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem',
              marginTop: '2rem',
              paddingTop: '2rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#10b981' }}>{mockUser.reviews}</div>
                <div style={{ color: '#737373', fontSize: '0.875rem' }}>Reviews Written</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#f59e0b' }}>{mockUser.upvotes}</div>
                <div style={{ color: '#737373', fontSize: '0.875rem' }}>Upvotes Earned</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ec4899' }}>${mockUser.spent.toFixed(2)}</div>
                <div style={{ color: '#737373', fontSize: '0.875rem' }}>Total Spent</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#06b6d4' }}>{mockUser.reviewStreak} 🔥</div>
                <div style={{ color: '#737373', fontSize: '0.875rem' }}>Day Streak</div>
              </div>
            </div>
          </div>

          {/* Badges Section */}
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>Achievements</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '1rem',
            }}>
              {mockUser.badges.map(badge => (
                <div
                  key={badge.id}
                  style={{
                    background: badge.earned ? `rgba(${parseInt(badge.color.slice(1, 3), 16)}, ${parseInt(badge.color.slice(3, 5), 16)}, ${parseInt(badge.color.slice(5, 7), 16)}, 0.1)` : 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${badge.earned ? badge.color : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    opacity: badge.earned ? 1 : 0.5,
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={e => {
                    if (badge.earned) {
                      e.currentTarget.style.transform = 'scale(1.05)'
                      e.currentTarget.style.boxShadow = `0 0 20px ${badge.color}`
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{badge.icon}</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: '600', color: badge.earned ? badge.color : '#737373' }}>
                    {badge.name}
                  </div>
                  {!badge.earned && <div style={{ fontSize: '0.65rem', color: '#555', marginTop: '0.5rem' }}>Locked</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recent Reviews */}
      <section style={{ padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>Recent Reviews</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {mockUser.recentReviews.map(review => (
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{review.restaurant}</h3>
                    <p style={{ color: '#737373', fontSize: '0.875rem' }}>{'⭐'.repeat(review.rating)}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#10b981', fontSize: '0.875rem', fontWeight: '600' }}>⬆️ {review.upvotes}</div>
                    <div style={{ color: '#ec4899', fontSize: '0.875rem', fontWeight: '600' }}>💛 ${review.tips}</div>
                  </div>
                </div>
                <p style={{ color: '#d1d5db' }}>{review.text}</p>
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
