import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from './_app'
import { supabase } from '../lib/supabase'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import ReviewCard from '../components/ReviewCard'
import BusinessCard from '../components/BusinessCard'
import { BusinessCardSkeleton, ReviewCardSkeleton } from '../components/LoadingSkeleton'

function ActivityFeed({ items }: { items: Record<string, unknown>[] }) {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    if (items.length === 0) return
    const t = setInterval(() => setIdx(i => (i + 1) % items.length), 4000)
    return () => clearInterval(t)
  }, [items.length])

  if (items.length === 0) {
    return (
      <div className="activity-ticker-wrap" style={{ background: 'rgba(255,0,110,0.07)', border: '1px solid rgba(255,0,110,0.18)', borderRadius: '9999px', padding: '0.5rem 1.25rem', maxWidth: '520px', margin: '1.5rem auto 0', overflow: 'hidden', textAlign: 'center' }}>
        <span style={{ fontSize: '0.82rem', color: '#666' }}>✍️ Be the first to review a restaurant!</span>
      </div>
    )
  }

  const item = items[idx]
  const profile = item.sp_profiles as Record<string, unknown> | undefined
  const biz = item.sp_businesses as Record<string, unknown> | undefined
  const name = (profile?.display_name as string) || (profile?.username as string) || 'Someone'
  const stars = '★'.repeat(Number(item.rating) || 5)

  return (
    <div className="activity-ticker-wrap" style={{
      background: 'rgba(255,0,110,0.07)', border: '1px solid rgba(255,0,110,0.18)',
      borderRadius: '9999px', padding: '0.5rem 1.25rem',
      display: 'flex', alignItems: 'center', gap: '0.5rem',
      maxWidth: '520px', width: '100%', margin: '1.5rem auto 0', overflow: 'hidden',
    }}>
      <span style={{ fontSize: '0.8rem', color: '#888', whiteSpace: 'nowrap', flexShrink: 0 }}>🔴 Live</span>
      <span key={idx} style={{ fontSize: '0.82rem', color: '#ccc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', animation: 'reviewFadeIn 0.5s ease' }}>
        <strong style={{ color: '#ff886e' }}>{name}</strong>
        {' just reviewed '}
        {biz && <><strong style={{ color: '#fff' }}>{String(biz.emoji)} {String(biz.name)}</strong>{' '}</>}
        <span style={{ color: '#ffdd00' }}>{stars}</span>
      </span>
    </div>
  )
}

export default function Home() {
  const { user } = useAuth()
  const [trending, setTrending] = useState<Record<string, unknown>[]>([])
  const [nearby, setNearby] = useState<Record<string, unknown>[]>([])
  const [nearbyLoading, setNearbyLoading] = useState(false)
  const [stats, setStats] = useState({ reviews: 0, businesses: 0 })
  const [trendingLoading, setTrendingLoading] = useState(true)
  const [activityFeed, setActivityFeed] = useState<Record<string, unknown>[]>([])

  useEffect(() => {
    fetchTrending()
    fetchStats()
    fetchActivityFeed()
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => fetchNearby(pos.coords.latitude, pos.coords.longitude),
        () => {},
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      )
    }
  }, [])

  async function fetchActivityFeed() {
    try {
      const { data } = await supabase
        .from('sp_reviews')
        .select('*, sp_profiles(username, display_name), sp_businesses(name, emoji)')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(5)
      setActivityFeed(data || [])
    } catch { /* ignore */ }
  }

  async function fetchTrending() {
    setTrendingLoading(true)
    try {
      const { data } = await supabase
        .from('sp_reviews')
        .select('*, sp_profiles(username, display_name, is_elite), sp_businesses(name, emoji, category)')
        .eq('status', 'published')
        .order('helpful_count', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(4)
      setTrending(data || [])
    } catch { /* ignore */ }
    setTrendingLoading(false)
  }

  async function fetchStats() {
    try {
      const [r, b] = await Promise.all([
        supabase.from('sp_reviews').select('id', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('sp_businesses').select('id', { count: 'exact', head: true }),
      ])
      setStats({ reviews: r.count || 0, businesses: b.count || 0 })
    } catch { /* ignore */ }
  }

  async function fetchNearby(lat: number, lng: number) {
    setNearbyLoading(true)
    try {
      const res = await fetch(`/api/places/nearby?lat=${lat}&lng=${lng}&radius=1500`)
      if (res.ok) {
        const data = await res.json()
        setNearby(Array.isArray(data) ? data.slice(0, 4) : [])
      }
    } catch { /* ignore */ }
    setNearbyLoading(false)
  }

  function handleDetectLocation() {
    if (!navigator.geolocation) {
      setNearbyLoading(false)
      return
    }
    setNearbyLoading(true)
    navigator.geolocation.getCurrentPosition(
      pos => fetchNearby(pos.coords.latitude, pos.coords.longitude),
      () => {
        setNearbyLoading(false)
        // Don't show error — the city input fallback is already visible
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }

  return (
    <div style={{ background: '#0a0a0a', color: '#fff', minHeight: '100vh' }}>
      <Nav />

      {/* Hero */}
      <section style={{
        paddingTop: 'clamp(5rem,10vw,7rem)', paddingBottom: 'clamp(3rem,6vw,5rem)',
        paddingLeft: 'clamp(1rem,4vw,1.5rem)', paddingRight: 'clamp(1rem,4vw,1.5rem)',
        textAlign: 'center',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(255,0,110,0.18) 0%, transparent 65%)',
      }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,0,110,0.12)', border: '1px solid rgba(255,0,110,0.25)', borderRadius: '9999px', padding: '0.4rem 1.1rem', fontSize: '0.8rem', color: '#ff006e', fontWeight: 700, marginBottom: '1.5rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            🔥 Reviews you can actually trust
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 6vw, 4.25rem)', fontWeight: 900, lineHeight: '1.1', marginBottom: '1.25rem' }}>
            Real Reviews from{' '}
            <span style={{ background: 'linear-gradient(135deg,#ff006e,#ffdd00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Real People</span>
          </h1>
          <p style={{ color: '#888', fontSize: 'clamp(0.95rem,2.5vw,1.1rem)', lineHeight: '1.7', maxWidth: '560px', margin: '0 auto 2.5rem' }}>
            Skin in the game changes everything. When reviewers back their words with a small commitment, you get honest opinions — not noise.
          </p>
          <div className="hero-buttons" style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={user ? '/explore' : '/signup'}>
              <button style={{ background: 'linear-gradient(135deg,#ff006e,#ffdd00)', color: '#000', padding: '1rem 2.25rem', borderRadius: '9999px', border: 'none', fontWeight: 900, cursor: 'pointer', fontSize: '1rem', boxShadow: '0 0 40px rgba(255,0,110,0.35)' }}>
                {user ? 'Write a Review →' : 'Start for Free →'}
              </button>
            </Link>
            <Link href="/explore">
              <button style={{ background: 'transparent', color: '#fff', padding: '1rem 2.25rem', borderRadius: '9999px', border: '1px solid rgba(255,255,255,0.18)', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}>
                Explore Reviews
              </button>
            </Link>
          </div>

          <ActivityFeed items={activityFeed} />

          <div style={{ display: 'flex', gap: '2.5rem', justifyContent: 'center', marginTop: '3.5rem', flexWrap: 'wrap' }}>
            {[
              { value: stats.reviews > 0 ? `${stats.reviews}+` : '—', label: 'Verified Reviews' },
              { value: stats.businesses > 0 ? `${stats.businesses}+` : '—', label: 'Businesses' },
              { value: '$0.99', label: 'Per Review' },
            ].map(({ value, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(1.5rem,3vw,1.85rem)', fontWeight: 900, background: 'linear-gradient(135deg,#ff006e,#1dd1dd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{value}</div>
                <div style={{ color: '#555', fontSize: '0.8rem', marginTop: '0.2rem' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Near You */}
      <section style={{ padding: 'clamp(2rem,4vw,3.5rem) clamp(1rem,4vw,1.5rem)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(1.25rem,3vw,1.6rem)', fontWeight: 900, margin: 0 }}>📍 Near You</h2>
              <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.25rem' }}>Real restaurants in your area</p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              {nearby.length === 0 && !nearbyLoading && (
                <button onClick={handleDetectLocation} style={{ background: 'rgba(29,209,221,0.1)', color: '#1dd1dd', border: '1px solid rgba(29,209,221,0.2)', padding: '0.5rem 1.1rem', borderRadius: '9999px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}>
                  📍 Detect my location
                </button>
              )}
              <Link href="/explore" style={{ color: '#ff006e', textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem' }}>See all →</Link>
            </div>
          </div>

          {nearbyLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '1.25rem' }}>
              {Array.from({ length: 4 }).map((_, i) => <BusinessCardSkeleton key={i} />)}
            </div>
          ) : nearby.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '1.25rem' }}>
              {nearby.map(place => <BusinessCard key={String(place.id)} business={place as Parameters<typeof BusinessCard>[0]['business']} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(255,255,255,0.02)', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.07)', color: '#555' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📍</div>
              <p style={{ marginBottom: '1rem' }}>Find restaurants near you</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
                <button onClick={handleDetectLocation} style={{ background: 'rgba(29,209,221,0.1)', color: '#1dd1dd', border: '1px solid rgba(29,209,221,0.25)', padding: '0.65rem 1.5rem', borderRadius: '9999px', cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem' }}>
                  📍 Use my location
                </button>
                <p style={{ color: '#444', fontSize: '0.8rem', margin: '0' }}>— or —</p>
                <form onSubmit={async (e) => {
                  e.preventDefault()
                  const val = (e.currentTarget.elements.namedItem('homeCity') as HTMLInputElement).value.trim()
                  if (!val) return
                  setNearbyLoading(true)
                  const res = await fetch(`/api/places/nearby?address=${encodeURIComponent(val)}&radius=2000`)
                  if (res.ok) {
                    const data = await res.json()
                    setNearby(Array.isArray(data) ? data.slice(0, 8) : [])
                  }
                  setNearbyLoading(false)
                }} style={{ display: 'flex', gap: '0.5rem', width: '100%', maxWidth: '360px' }}>
                  <input
                    name="homeCity"
                    placeholder="Enter city or zip code..."
                    style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '0.6rem', padding: '0.6rem 1rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                  />
                  <button type="submit" style={{ background: 'linear-gradient(135deg,#ff006e,#ffdd00)', color: '#000', border: 'none', borderRadius: '0.6rem', padding: '0.6rem 1.1rem', fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem' }}>Go</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: 'clamp(2rem,4vw,3.5rem) clamp(1rem,4vw,1.5rem)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.5rem,4vw,1.85rem)', fontWeight: 900, marginBottom: '0.4rem' }}>How It Works</h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '2.5rem', fontSize: '0.95rem' }}>Three steps to a review the world trusts</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '1.25rem' }}>
            {[
              { emoji: '🍽️', step: '01', title: 'Find a place', desc: 'Browse restaurants, cafés, and businesses near you or discover new ones.' },
              { emoji: '✍️', step: '02', title: 'Write your truth', desc: 'Share your genuine experience. Add photos. No sugar-coating required.' },
              { emoji: '💳', step: '03', title: 'Verify with a small commitment', desc: 'One tap. Your verified review goes live and joins the feed.' },
            ].map(({ emoji, step, title, desc }) => (
              <div key={step} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.25rem', padding: '1.75rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '0.75rem', right: '1rem', fontSize: '2.5rem', fontWeight: 900, color: 'rgba(255,255,255,0.04)', fontFamily: 'monospace' }}>{step}</div>
                <div style={{ fontSize: '2.25rem', marginBottom: '0.875rem' }}>{emoji}</div>
                <h3 style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.4rem' }}>{title}</h3>
                <p style={{ color: '#666', lineHeight: '1.6', fontSize: '0.9rem' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Reviews */}
      <section style={{ padding: 'clamp(2rem,4vw,3.5rem) clamp(1rem,4vw,1.5rem)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(1.25rem,3vw,1.6rem)', fontWeight: 900, margin: 0 }}>🔥 Trending Reviews</h2>
              <p style={{ color: '#666', marginTop: '0.25rem', fontSize: '0.85rem' }}>What's moving people right now</p>
            </div>
            <Link href="/explore" style={{ color: '#ff006e', textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem' }}>See all →</Link>
          </div>

          {trendingLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {Array.from({ length: 3 }).map((_, i) => <ReviewCardSkeleton key={i} />)}
            </div>
          ) : trending.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem', color: '#555', background: 'rgba(255,255,255,0.02)', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.875rem' }}>✍️</div>
              <p>No reviews yet. Be the first to leave a verified review.</p>
              <Link href={user ? '/explore' : '/signup'}>
                <button style={{ marginTop: '1rem', background: 'linear-gradient(135deg,#ff006e,#ffdd00)', color: '#000', padding: '0.75rem 1.75rem', borderRadius: '9999px', border: 'none', fontWeight: 800, cursor: 'pointer' }}>
                  Write the First Review
                </button>
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {trending.map(review => (
                <ReviewCard key={String(review.id)} review={review as Parameters<typeof ReviewCard>[0]['review']} showBusiness={true} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: 'clamp(3rem,6vw,5rem) clamp(1rem,4vw,1.5rem)',
        background: 'linear-gradient(135deg,rgba(255,0,110,0.12) 0%,rgba(29,209,221,0.08) 100%)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
      }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem,4vw,2.5rem)', fontWeight: 900, marginBottom: '1rem' }}>
            Ready to make your voice count?
          </h2>
          <p style={{ color: '#888', fontSize: '1rem', marginBottom: '2rem', lineHeight: '1.7' }}>
            Join a community where reviews actually mean something. Back your words and be heard.
          </p>
          <Link href={user ? '/explore' : '/signup'}>
            <button style={{ background: 'linear-gradient(135deg,#ff006e,#ffdd00)', color: '#000', padding: '1rem 3rem', borderRadius: '9999px', border: 'none', fontWeight: 900, cursor: 'pointer', fontSize: '1rem', boxShadow: '0 0 40px rgba(255,0,110,0.3)' }}>
              {user ? 'Write a Review →' : 'Get Started — Free →'}
            </button>
          </Link>
          <p style={{ color: '#444', fontSize: '0.8rem', marginTop: '0.875rem' }}>No subscription. Pay only when you publish.</p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
