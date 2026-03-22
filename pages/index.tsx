import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from './_app'
import { supabase } from '../lib/supabase'

const NAV_STYLE: React.CSSProperties = {
  position: 'fixed', top: 0, width: '100%', zIndex: 50,
  background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(10px)',
  borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '1rem 2rem',
}

const STAR_COLORS = ['#ff006e', '#ff006e', '#ff886e', '#ffdd00', '#ffdd00']

function StarRating({ rating }: { rating: number }) {
  return (
    <span>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= rating ? STAR_COLORS[i - 1] : '#333', fontSize: '1.1rem' }}>★</span>
      ))}
    </span>
  )
}

export default function Home() {
  const { user, profile, signOut } = useAuth()
  const [trending, setTrending] = useState<any[]>([])
  const [stats, setStats] = useState({ reviews: 0, businesses: 0 })

  useEffect(() => {
    fetchTrending()
    fetchStats()
  }, [])

  async function fetchTrending() {
    const { data } = await supabase
      .from('sp_reviews')
      .select('*, sp_profiles(username, display_name, is_elite), sp_businesses(name, emoji, category)')
      .eq('status', 'published')
      .order('helpful_count', { ascending: false })
      .limit(6)
    setTrending(data || [])
  }

  async function fetchStats() {
    const [r, b] = await Promise.all([
      supabase.from('sp_reviews').select('id', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from('sp_businesses').select('id', { count: 'exact', head: true }),
    ])
    setStats({ reviews: r.count || 0, businesses: b.count || 0 })
  }

  return (
    <div style={{ background: '#0a0a0a', color: '#fff', minHeight: '100vh' }}>
      {/* Nav */}
      <header style={NAV_STYLE}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: '900', background: 'linear-gradient(135deg, #ff006e, #1dd1dd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              SayPay
            </span>
          </Link>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <Link href="/explore" style={{ color: '#999', textDecoration: 'none', fontWeight: '500' }}>Explore</Link>
            <Link href="/leaderboards" style={{ color: '#999', textDecoration: 'none', fontWeight: '500' }}>Leaderboard</Link>
            <Link href="/campaigns" style={{ color: '#999', textDecoration: 'none', fontWeight: '500' }}>For Businesses</Link>
            {user ? (
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                  <button style={{ background: 'rgba(255,0,110,0.15)', color: '#ff006e', border: '1px solid rgba(255,0,110,0.3)', padding: '0.6rem 1.25rem', borderRadius: '9999px', fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem' }}>
                    Dashboard
                  </button>
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Link href="/login" style={{ color: '#aaa', textDecoration: 'none', fontWeight: '600' }}>Log in</Link>
                <Link href="/signup">
                  <button style={{ background: 'linear-gradient(135deg, #ff006e, #ffdd00)', color: '#000', padding: '0.65rem 1.5rem', borderRadius: '9999px', border: 'none', fontWeight: '800', cursor: 'pointer', fontSize: '0.9rem' }}>
                    Get Started
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{ paddingTop: '7rem', paddingBottom: '5rem', paddingLeft: '2rem', paddingRight: '2rem', textAlign: 'center', background: 'radial-gradient(ellipse at center top, rgba(255,0,110,0.2) 0%, transparent 60%)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,0,110,0.15)', border: '1px solid rgba(255,0,110,0.3)', borderRadius: '9999px', padding: '0.5rem 1.25rem', fontSize: '0.85rem', color: '#ff006e', fontWeight: '700', marginBottom: '1.5rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            🔥 Reviews you can actually trust
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: '900', lineHeight: '1.1', marginBottom: '1.5rem' }}>
            Your Opinion Is Worth{' '}
            <span style={{ background: 'linear-gradient(135deg, #ff006e, #ffdd00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              $0.99
            </span>
          </h1>
          <p style={{ color: '#999', fontSize: '1.25rem', lineHeight: '1.6', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
            When you pay, the world listens differently. No fake reviews. No bots. Just real people putting money behind what they actually think.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={user ? '/explore' : '/signup'}>
              <button style={{ background: 'linear-gradient(135deg, #ff006e, #ffdd00)', color: '#000', padding: '1rem 2.5rem', borderRadius: '9999px', border: 'none', fontWeight: '900', cursor: 'pointer', fontSize: '1.05rem', boxShadow: '0 0 40px rgba(255,0,110,0.4)' }}>
                {user ? 'Write a Review →' : 'Start for Free →'}
              </button>
            </Link>
            <Link href="/explore">
              <button style={{ background: 'transparent', color: '#fff', padding: '1rem 2.5rem', borderRadius: '9999px', border: '1px solid rgba(255,255,255,0.2)', fontWeight: '700', cursor: 'pointer', fontSize: '1.05rem' }}>
                Explore Reviews
              </button>
            </Link>
          </div>

          {/* Live stats */}
          <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center', marginTop: '3.5rem' }}>
            {[
              { value: stats.reviews > 0 ? `${stats.reviews}+` : '—', label: 'Verified Reviews' },
              { value: stats.businesses > 0 ? `${stats.businesses}+` : '—', label: 'Businesses' },
              { value: '$0.99', label: 'Per Review' },
            ].map(({ value, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: '900', background: 'linear-gradient(135deg, #ff006e, #1dd1dd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{value}</div>
                <div style={{ color: '#555', fontSize: '0.85rem', marginTop: '0.25rem' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '4rem 2rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: '900', marginBottom: '0.5rem' }}>How It Works</h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '3rem' }}>Three steps to a review the world trusts</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {[
              { emoji: '🍽️', step: '01', title: 'Find a place', desc: 'Browse restaurants, cafés, and businesses. Read what others actually paid to say.' },
              { emoji: '✍️', step: '02', title: 'Write your truth', desc: 'Share your genuine experience. No character limit. No sugar-coating required.' },
              { emoji: '💳', step: '03', title: 'Pay $0.99 to publish', desc: 'That\'s it. One tap. Your verified review goes live and joins the feed. The world listens.' },
            ].map(({ emoji, step, title, desc }) => (
              <div key={step} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.25rem', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '1rem', right: '1.25rem', fontSize: '3rem', fontWeight: '900', color: 'rgba(255,255,255,0.04)', fontFamily: 'monospace' }}>{step}</div>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{emoji}</div>
                <h3 style={{ fontWeight: '800', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{title}</h3>
                <p style={{ color: '#666', lineHeight: '1.6', fontSize: '0.95rem' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Reviews */}
      <section style={{ padding: '4rem 2rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: '900', margin: 0 }}>🔥 Trending Reviews</h2>
              <p style={{ color: '#666', marginTop: '0.25rem' }}>What's moving people right now</p>
            </div>
            <Link href="/explore" style={{ color: '#ff006e', textDecoration: 'none', fontWeight: '700', fontSize: '0.9rem' }}>
              See all →
            </Link>
          </div>

          {trending.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#555' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✍️</div>
              <p>No reviews yet. Be the first to pay for your opinion.</p>
              <Link href={user ? '/explore' : '/signup'}>
                <button style={{ marginTop: '1rem', background: 'linear-gradient(135deg, #ff006e, #ffdd00)', color: '#000', padding: '0.75rem 2rem', borderRadius: '9999px', border: 'none', fontWeight: '800', cursor: 'pointer' }}>
                  Write the First Review
                </button>
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {trending.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: '5rem 2rem', background: 'linear-gradient(135deg, rgba(255,0,110,0.15) 0%, rgba(29,209,221,0.1) 100%)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1rem' }}>
            Ready to make your voice count?
          </h2>
          <p style={{ color: '#999', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.6' }}>
            Join reviewers who put their money where their mouth is. $0.99 turns your opinion into something real.
          </p>
          <Link href={user ? '/explore' : '/signup'}>
            <button style={{ background: 'linear-gradient(135deg, #ff006e, #ffdd00)', color: '#000', padding: '1rem 3rem', borderRadius: '9999px', border: 'none', fontWeight: '900', cursor: 'pointer', fontSize: '1.05rem', boxShadow: '0 0 40px rgba(255,0,110,0.3)' }}>
              {user ? 'Write a Review →' : 'Get Started — Free →'}
            </button>
          </Link>
          <p style={{ color: '#444', fontSize: '0.8rem', marginTop: '1rem' }}>No subscription. Pay only when you publish.</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '2rem', textAlign: 'center', color: '#444', fontSize: '0.875rem' }}>
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <Link href="/explore" style={{ color: '#555', textDecoration: 'none' }}>Explore</Link>
          <Link href="/leaderboards" style={{ color: '#555', textDecoration: 'none' }}>Leaderboard</Link>
          <Link href="/campaigns" style={{ color: '#555', textDecoration: 'none' }}>For Businesses</Link>
          <Link href="/login" style={{ color: '#555', textDecoration: 'none' }}>Login</Link>
        </div>
        <p>© 2025 SayPay. Your opinion. Your truth. Verified.</p>
      </footer>
    </div>
  )
}

function ReviewCard({ review }: { review: any }) {
  const profile = review.sp_profiles
  const business = review.sp_businesses
  const displayName = profile?.display_name || profile?.username || 'Anonymous'

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: review.helpful_count > 5 ? '1px solid rgba(255,0,110,0.3)' : '1px solid rgba(255,255,255,0.08)',
      borderRadius: '1.25rem',
      padding: '1.75rem',
      boxShadow: review.helpful_count > 5 ? '0 0 20px rgba(255,0,110,0.1)' : 'none',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #ff006e, #1dd1dd)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1rem', color: '#fff', flexShrink: 0 }}>
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {displayName}
              {profile?.is_elite && <span style={{ background: 'linear-gradient(135deg, #ff006e, #ffdd00)', color: '#000', fontSize: '0.65rem', padding: '0.15rem 0.5rem', borderRadius: '9999px', fontWeight: '800' }}>ELITE</span>}
              <span style={{ background: 'rgba(29,209,221,0.15)', color: '#1dd1dd', fontSize: '0.65rem', padding: '0.15rem 0.5rem', borderRadius: '9999px', fontWeight: '700' }}>✓ PAID</span>
            </div>
            <div style={{ color: '#555', fontSize: '0.8rem' }}>
              reviewed <span style={{ color: '#aaa', fontWeight: '600' }}>{business?.emoji} {business?.name}</span>
            </div>
          </div>
        </div>
        <div style={{ background: 'rgba(255,0,110,0.1)', border: '1px solid rgba(255,0,110,0.2)', padding: '0.4rem 0.8rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: '800', color: '#ff006e' }}>
          {'★'.repeat(review.rating)}
        </div>
      </div>
      <p style={{ color: '#ddd', lineHeight: '1.65', fontSize: '0.95rem', margin: '0 0 1rem 0' }}>{review.content}</p>
      <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem', color: '#555', fontSize: '0.85rem' }}>
        <span>👍 {review.helpful_count} helpful</span>
        <span>❤️ {review.love_count} love</span>
        <span style={{ marginLeft: 'auto' }}>{new Date(review.created_at).toLocaleDateString()}</span>
      </div>
    </div>
  )
}
