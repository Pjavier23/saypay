import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from './_app'
import { supabase } from '../lib/supabase'
import Nav from '../components/Nav'

interface Profile {
  username?: string
  display_name?: string
  is_elite?: boolean
  total_reviews?: number
  total_helpful?: number
}

interface ReviewRow {
  id: string
  business_id: string
  status: string
  rating: number
  content: string
  helpful_count: number
  love_count: number
  created_at: string
  sp_businesses?: { name: string; emoji: string; category: string } | null
}

export default function Dashboard() {
  const router = useRouter()
  const { user, profile: rawProfile, loading, signOut } = useAuth()
  const profile = rawProfile as Profile | null
  const [reviews, setReviews] = useState<ReviewRow[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const welcome = router.query.welcome === '1'

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  useEffect(() => {
    if (user) fetchReviews()
  }, [user])

  async function fetchReviews() {
    try {
      const { data } = await supabase
        .from('sp_reviews')
        .select('*, sp_businesses(name, emoji, category)')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
      setReviews((data as ReviewRow[]) || [])
    } catch { /* ignore */ }
    setDataLoading(false)
  }

  if (loading || !user) {
    return <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>Loading…</div>
  }

  const displayName = profile?.display_name || profile?.username || user.email?.split('@')[0] || 'Reviewer'
  const publishedReviews = reviews.filter(r => r.status === 'published')
  const totalHelpful = profile?.total_helpful || 0
  const totalReviews = profile?.total_reviews || publishedReviews.length
  const moneyInvested = `$${(totalReviews * 0.99).toFixed(2)}`

  return (
    <div style={{ background: '#0a0a0a', color: '#fff', minHeight: '100vh' }}>
      <Nav />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'clamp(1.25rem,4vw,2.5rem) clamp(1rem,4vw,2rem) 4rem' }}>
        {/* Offset for sticky nav */}
        <div style={{ height: '4.5rem' }} />

        {welcome && (
          <div style={{ background: 'linear-gradient(135deg,rgba(29,209,221,0.15),rgba(255,0,110,0.1))', border: '1px solid rgba(29,209,221,0.3)', borderRadius: '1rem', padding: '1.25rem 1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '1.75rem' }}>🎉</span>
            <div>
              <p style={{ fontWeight: 800, margin: '0 0 0.25rem', color: '#1dd1dd' }}>Welcome to SayPay, {displayName}!</p>
              <p style={{ color: '#888', fontSize: '0.9rem', margin: 0 }}>Find a place and write your first verified review. It costs $0.99 — that's what makes it count.</p>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.5rem,4vw,2rem)', fontWeight: 900, margin: '0 0 0.25rem' }}>Hey, {displayName} 👋</h1>
            <p style={{ color: '#555', margin: 0 }}>
              @{profile?.username || 'you'}{' '}
              {profile?.is_elite && <span style={{ background: 'linear-gradient(135deg,#ff006e,#ffdd00)', color: '#000', fontSize: '0.65rem', padding: '0.15rem 0.5rem', borderRadius: '9999px', fontWeight: 800, marginLeft: '0.4rem' }}>ELITE</span>}
            </p>
          </div>
          <Link href="/explore">
            <button style={{ background: 'linear-gradient(135deg,#ff006e,#ffdd00)', color: '#000', padding: '0.75rem 1.75rem', borderRadius: '9999px', border: 'none', fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem' }}>
              ✍️ Write a Review
            </button>
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          {[
            { label: 'Reviews Published', value: String(totalReviews), color: '#ff006e', emoji: '✍️' },
            { label: 'Helpful Votes', value: String(totalHelpful), color: '#1dd1dd', emoji: '👍' },
            { label: 'Money Invested', value: moneyInvested, color: '#ffdd00', emoji: '💰' },
            { label: 'Status', value: profile?.is_elite ? 'Elite' : 'Reviewer', color: profile?.is_elite ? '#ffdd00' : '#888', emoji: profile?.is_elite ? '⭐' : '🔵' },
          ].map(({ label, value, color, emoji }) => (
            <div key={label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.25rem', padding: '1.5rem' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{emoji}</div>
              <div style={{ fontSize: 'clamp(1.25rem,3vw,1.75rem)', fontWeight: 900, color, marginBottom: '0.25rem' }}>{value}</div>
              <div style={{ color: '#555', fontSize: '0.8rem' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Elite progress */}
        {!profile?.is_elite && (
          <div style={{ background: 'rgba(255,221,0,0.05)', border: '1px solid rgba(255,221,0,0.2)', borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>⭐ Elite Reviewer Progress</span>
              <span style={{ color: '#888', fontSize: '0.85rem' }}>{totalReviews}/10 reviews</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '9999px', height: '8px', overflow: 'hidden' }}>
              <div style={{ background: 'linear-gradient(90deg,#ff006e,#ffdd00)', height: '100%', width: `${Math.min(100, (totalReviews / 10) * 100)}%`, borderRadius: '9999px', transition: 'width 0.3s' }} />
            </div>
            <p style={{ color: '#666', fontSize: '0.8rem', marginTop: '0.75rem' }}>
              Write {Math.max(0, 10 - totalReviews)} more verified reviews to unlock Elite status.
            </p>
          </div>
        )}

        {/* Reviews list */}
        <h2 style={{ fontWeight: 900, fontSize: '1.4rem', marginBottom: '1.25rem' }}>My Reviews</h2>

        {dataLoading ? (
          <div style={{ color: '#555', padding: '2rem', textAlign: 'center' }}>Loading reviews…</div>
        ) : reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1.25rem', color: '#555' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✍️</div>
            <p style={{ marginBottom: '1.25rem' }}>You haven't written any reviews yet.</p>
            <Link href="/explore">
              <button style={{ background: 'linear-gradient(135deg,#ff006e,#ffdd00)', color: '#000', padding: '0.75rem 2rem', borderRadius: '9999px', border: 'none', fontWeight: 800, cursor: 'pointer' }}>
                Find a Place to Review
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {reviews.map(review => {
              const biz = review.sp_businesses
              return (
                <div key={review.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.25rem', padding: 'clamp(1rem,3vw,1.5rem)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <div style={{ fontWeight: 800, marginBottom: '0.25rem' }}>
                        {biz?.emoji} {biz?.name}
                        <span style={{ color: '#555', fontSize: '0.8rem', fontWeight: 400, marginLeft: '0.5rem' }}>{biz?.category}</span>
                      </div>
                      <div style={{ color: '#ffdd00', fontSize: '0.9rem' }}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                      <span style={{
                        background: review.status === 'published' ? 'rgba(29,209,221,0.15)' : 'rgba(255,221,0,0.15)',
                        color: review.status === 'published' ? '#1dd1dd' : '#ffdd00',
                        border: `1px solid ${review.status === 'published' ? 'rgba(29,209,221,0.3)' : 'rgba(255,221,0,0.3)'}`,
                        fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '9999px',
                      }}>
                        {review.status === 'published' ? '✓ Published' : '⏳ Pending'}
                      </span>
                      <span style={{ color: '#555', fontSize: '0.75rem' }}>{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p style={{ color: '#ccc', lineHeight: '1.6', fontSize: '0.9rem', margin: '0 0 0.75rem 0' }}>{review.content}</p>
                  {review.status === 'published' && (
                    <div style={{ display: 'flex', gap: '1rem', color: '#555', fontSize: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem', flexWrap: 'wrap' }}>
                      <span>👍 {review.helpful_count} helpful</span>
                      <span>❤️ {review.love_count} love</span>
                      <Link href={`/business/${review.business_id}`} style={{ color: '#ff006e', textDecoration: 'none', marginLeft: 'auto', fontWeight: 600, fontSize: '0.8rem' }}>View →</Link>
                    </div>
                  )}
                  {review.status === 'pending' && (
                    <p style={{ color: '#555', fontSize: '0.75rem', marginTop: '0.5rem' }}>Payment may be processing. Refresh in a moment.</p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
