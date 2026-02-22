import { useState } from 'react'
import Link from 'next/link'

export default function NewHome() {
  const [userStats] = useState({
    reviewsWritten: 14,
    peopleReached: 4203,
    moneySpent: 27.86,
    followers: 47,
    mostHelpfulReview: 'Sweetgreen has the best dressing in DC',
    totalInfluence: 1203,
  })

  const trendingReviews = [
    {
      id: 1,
      author: 'You',
      avatar: '👨‍💼',
      place: 'Sweetgreen',
      rating: 5,
      quote: 'Honestly the best salad bowl in DC. Their dressing is *chef\'s kiss*. Worth every penny.',
      reactions: { helpful: 89, comments: 12, hearts: 45 },
      reached: 2104,
      trending: true,
    },
    {
      id: 2,
      author: 'Marcus Williams',
      avatar: '👨‍🍳',
      place: 'Thai Orchid',
      rating: 5,
      quote: 'Authentic Thai flavors. The pad krapow gai is exceptional. Heat level is perfect.',
      reactions: { helpful: 67, comments: 8, hearts: 34 },
      reached: 1456,
      trending: true,
    },
    {
      id: 3,
      author: 'Alice Chen',
      avatar: '👩‍💻',
      place: 'Chick-fil-A',
      rating: 4,
      quote: 'Classic fast food done right. Waffle fries are addictive. Consistent quality always.',
      reactions: { helpful: 45, comments: 5, hearts: 23 },
      reached: 892,
      trending: false,
    },
  ]

  return (
    <div style={{ background: '#0a0a0a', color: '#fff', minHeight: '100vh' }}>
      {/* Navigation */}
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
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #ff006e, #1dd1dd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', cursor: 'pointer' }}>
              SayPay
            </span>
          </Link>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <Link href="/restaurants" style={{ textDecoration: 'none', color: '#999', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '500' }}>Explore</Link>
            <Link href="/leaderboards" style={{ textDecoration: 'none', color: '#999', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '500' }}>Leaderboards</Link>
            <button style={{
              background: 'linear-gradient(135deg, #ff006e, #ffdd00)',
              color: '#000',
              padding: '0.75rem 1.75rem',
              borderRadius: '9999px',
              border: 'none',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '0.95rem',
            }}>
              Share Your Truth
            </button>
          </div>
        </div>
      </header>

      {/* Hero: Your Impact */}
      <section style={{
        padding: '8rem 2rem 4rem',
        background: 'linear-gradient(180deg, rgba(255, 0, 110, 0.15) 0%, rgba(29, 209, 221, 0.08) 100%)',
        marginTop: '4rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👨‍💼</div>
            <h1 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '1rem' }}>
              Your Voice Matters
            </h1>
            <p style={{ color: '#bbb', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
              You paid for your opinion. Now watch how it impacts real people making real decisions.
            </p>
          </div>

          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1.5rem',
            marginTop: '3rem',
            maxWidth: '800px',
            margin: '3rem auto 0',
          }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 0, 110, 0.2), rgba(255, 0, 110, 0.05))',
              padding: '1.5rem',
              borderRadius: '1rem',
              border: '1px solid rgba(255, 0, 110, 0.3)',
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#ff006e', marginBottom: '0.5rem' }}>
                {userStats.reviewsWritten}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#999' }}>Reviews Written</div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(29, 209, 221, 0.2), rgba(29, 209, 221, 0.05))',
              padding: '1.5rem',
              borderRadius: '1rem',
              border: '1px solid rgba(29, 209, 221, 0.3)',
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1dd1dd', marginBottom: '0.5rem' }}>
                {(userStats.peopleReached / 1000).toFixed(1)}k
              </div>
              <div style={{ fontSize: '0.875rem', color: '#999' }}>People Reached</div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 221, 0, 0.2), rgba(255, 221, 0, 0.05))',
              padding: '1.5rem',
              borderRadius: '1rem',
              border: '1px solid rgba(255, 221, 0, 0.3)',
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#ffdd00', marginBottom: '0.5rem' }}>
                {userStats.followers}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#999' }}>Followers</div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 0, 110, 0.2), rgba(29, 209, 221, 0.2))',
              padding: '1.5rem',
              borderRadius: '1rem',
              border: '1px solid rgba(255, 221, 0, 0.3)',
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', background: 'linear-gradient(135deg, #ff006e, #ffdd00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
                ${userStats.moneySpent}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#999' }}>Invested in Truth</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Reviews Feed */}
      <section style={{ padding: '4rem 2rem', background: '#0a0a0a' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '0.5rem', textAlign: 'center' }}>
            What's Moving People
          </h2>
          <p style={{ color: '#999', textAlign: 'center', marginBottom: '3rem', fontSize: '1.1rem' }}>
            Verified reviews that actually matter
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {trendingReviews.map((review, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(10px)',
                  padding: '2rem',
                  borderRadius: '1.5rem',
                  border: review.trending ? '2px solid #ff006e' : '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: review.trending ? '0 0 30px rgba(255, 0, 110, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                }}
                onMouseEnter={(e: any) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                  e.currentTarget.style.transform = 'translateY(-8px)'
                }}
                onMouseLeave={(e: any) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {review.trending && (
                  <div style={{
                    position: 'absolute',
                    top: '-1rem',
                    right: '2rem',
                    background: 'linear-gradient(135deg, #ff006e, #ffdd00)',
                    color: '#000',
                    padding: '0.5rem 1rem',
                    borderRadius: '9999px',
                    fontSize: '0.85rem',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                  }}>
                    🔥 Trending
                  </div>
                )}

                {/* Header */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div style={{
                    fontSize: '3rem',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ff006e, #1dd1dd)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {review.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.25rem' }}>
                      {review.author}
                    </h3>
                    <p style={{ color: '#999', fontSize: '0.95rem' }}>
                      Reviewed <span style={{ color: '#1dd1dd', fontWeight: '700' }}>{review.place}</span>
                    </p>
                  </div>
                  <div style={{
                    background: 'linear-gradient(135deg, #ff006e, #1dd1dd)',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '9999px',
                    fontWeight: '800',
                    fontSize: '1.1rem',
                    color: '#fff',
                  }}>
                    ⭐ {review.rating}
                  </div>
                </div>

                {/* Quote */}
                <blockquote style={{
                  fontSize: '1.25rem',
                  fontWeight: '500',
                  color: '#e5e5e5',
                  marginBottom: '1.5rem',
                  lineHeight: '1.7',
                  borderLeft: '4px solid #ff006e',
                  paddingLeft: '1.5rem',
                  margin: '0 0 1.5rem 0',
                }}>
                  "{review.quote}"
                </blockquote>

                {/* Impact */}
                <div style={{
                  background: 'rgba(29, 209, 221, 0.1)',
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'center',
                }}>
                  <span style={{ color: '#1dd1dd', fontWeight: '700', fontSize: '0.95rem' }}>
                    ✓ Helped {review.reached.toLocaleString()} people make better decisions
                  </span>
                </div>

                {/* Reactions */}
                <div style={{
                  display: 'flex',
                  gap: '1.5rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  fontSize: '0.95rem',
                  color: '#bbb',
                }}>
                  <button style={{
                    background: 'rgba(255, 0, 110, 0.1)',
                    color: '#ff006e',
                    border: '1px solid rgba(255, 0, 110, 0.3)',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e: any) => {
                    e.currentTarget.style.background = 'rgba(255, 0, 110, 0.2)'
                  }}
                  onMouseLeave={(e: any) => {
                    e.currentTarget.style.background = 'rgba(255, 0, 110, 0.1)'
                  }}>
                    👍 {review.reactions.helpful} Helpful
                  </button>
                  <button style={{
                    background: 'rgba(29, 209, 221, 0.1)',
                    color: '#1dd1dd',
                    border: '1px solid rgba(29, 209, 221, 0.3)',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e: any) => {
                    e.currentTarget.style.background = 'rgba(29, 209, 221, 0.2)'
                  }}
                  onMouseLeave={(e: any) => {
                    e.currentTarget.style.background = 'rgba(29, 209, 221, 0.1)'
                  }}>
                    💬 {review.reactions.comments} Comments
                  </button>
                  <button style={{
                    background: 'rgba(255, 221, 0, 0.1)',
                    color: '#ffdd00',
                    border: '1px solid rgba(255, 221, 0, 0.3)',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e: any) => {
                    e.currentTarget.style.background = 'rgba(255, 221, 0, 0.2)'
                  }}
                  onMouseLeave={(e: any) => {
                    e.currentTarget.style.background = 'rgba(255, 221, 0, 0.1)'
                  }}>
                    ❤️ {review.reactions.hearts} Love
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link href="/restaurants" style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'linear-gradient(135deg, #ff006e, #1dd1dd)',
                color: '#fff',
                padding: '1rem 3rem',
                borderRadius: '9999px',
                border: 'none',
                fontWeight: '800',
                cursor: 'pointer',
                fontSize: '1rem',
                boxShadow: '0 0 40px rgba(255, 0, 110, 0.4)',
              }}>
                Explore & Review
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '4rem 2rem',
        textAlign: 'center',
        background: 'linear-gradient(180deg, rgba(255, 0, 110, 0.1) 0%, rgba(29, 209, 221, 0.05) 100%)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1rem' }}>
            Your Opinion is Worth $0.99
          </h2>
          <p style={{ color: '#bbb', fontSize: '1.125rem', marginBottom: '2rem', lineHeight: '1.6' }}>
            When you pay, you're not just leaving a review. You're signing your name to the truth. And the world listens differently when they know you mean it.
          </p>
          <button style={{
            background: 'linear-gradient(135deg, #ff006e, #ffdd00)',
            color: '#000',
            padding: '1rem 3rem',
            borderRadius: '9999px',
            border: 'none',
            fontWeight: '800',
            cursor: 'pointer',
            fontSize: '1rem',
            boxShadow: '0 8px 32px rgba(255, 0, 110, 0.3)',
          }}>
            Share Your Truth Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '2rem',
        textAlign: 'center',
        color: '#737373',
        fontSize: '0.875rem',
      }}>
        <p>© 2025 SayPay. Your opinion. Your voice. Your truth.</p>
      </footer>
    </div>
  )
}
