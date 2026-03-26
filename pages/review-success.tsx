import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Nav from '../components/Nav'

export default function ReviewSuccess() {
  const router = useRouter()
  const { review_id, upvote } = router.query
  const isUpvote = upvote === '1'
  const [countdown, setCountdown] = useState(8)
  const [status, setStatus] = useState<'processing' | 'live'>('processing')

  useEffect(() => {
    // Give webhook a moment — show "processing" first, then "live"
    const t = setTimeout(() => setStatus('live'), 2500)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (status !== 'live') return
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000)
      return () => clearTimeout(t)
    } else {
      router.push('/explore')
    }
  }, [countdown, status, router])

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff' }}>
      <Nav />
      <div style={{ paddingTop: '4.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 'clamp(1rem,4vw,2rem)', textAlign: 'center' }}>
        <div style={{ maxWidth: '500px', width: '100%' }}>
          {status === 'processing' ? (
            <>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>⏳</div>
              <div style={{ display: 'inline-block', background: 'rgba(255,221,0,0.12)', border: '1px solid rgba(255,221,0,0.3)', borderRadius: '9999px', padding: '0.5rem 1.25rem', fontSize: '0.85rem', color: '#ffdd00', fontWeight: 700, marginBottom: '1.5rem' }}>
                Processing payment…
              </div>
              <h1 style={{ fontSize: 'clamp(1.5rem,4vw,2.25rem)', fontWeight: 900, marginBottom: '1rem' }}>
                {isUpvote ? 'Boost is being applied…' : 'Your review is being processed…'}
              </h1>
              <p style={{ color: '#888', fontSize: '1rem', lineHeight: '1.6' }}>
                Hold tight — we're confirming your payment with Stripe. This takes just a second.
              </p>
            </>
          ) : (
            <>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
              <div style={{ display: 'inline-block', background: 'rgba(29,209,221,0.15)', border: '1px solid rgba(29,209,221,0.3)', borderRadius: '9999px', padding: '0.5rem 1.25rem', fontSize: '0.85rem', color: '#1dd1dd', fontWeight: 700, marginBottom: '1.5rem' }}>
                ✓ Payment Confirmed
              </div>
              <h1 style={{ fontSize: 'clamp(1.75rem,5vw,2.5rem)', fontWeight: 900, marginBottom: '1rem' }}>
                {isUpvote ? (
                  <>Your boost is <span style={{ background: 'linear-gradient(135deg,#ff006e,#ffdd00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>live!</span></>
                ) : (
                  <>Your review is <span style={{ background: 'linear-gradient(135deg,#ff006e,#ffdd00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>live!</span></>
                )}
              </h1>
              <p style={{ color: '#888', fontSize: '1rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>
                {isUpvote
                  ? 'You paid $0.99 to boost this review. Paid boosts count 5× more and help great reviews rise to the top.'
                  : 'You paid $0.99 and now the world knows you mean it. Your verified review is published and visible to everyone.'
                }
              </p>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
                <Link href="/explore">
                  <button style={{ background: 'linear-gradient(135deg,#ff006e,#ffdd00)', color: '#000', padding: '0.875rem 2rem', borderRadius: '9999px', border: 'none', fontWeight: 900, cursor: 'pointer' }}>
                    Explore More Places
                  </button>
                </Link>
                <Link href="/dashboard">
                  <button style={{ background: 'rgba(255,255,255,0.06)', color: '#fff', padding: '0.875rem 2rem', borderRadius: '9999px', border: '1px solid rgba(255,255,255,0.15)', fontWeight: 700, cursor: 'pointer' }}>
                    My Reviews
                  </button>
                </Link>
              </div>

              <p style={{ color: '#444', fontSize: '0.85rem' }}>Redirecting to Explore in {countdown}s…</p>

              {!isUpvote && (
                <div style={{ marginTop: '2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '1.25rem' }}>
                  <p style={{ color: '#666', fontSize: '0.85rem', margin: 0 }}>
                    🏆 Keep writing verified reviews to climb the leaderboard and earn your{' '}
                    <span style={{ color: '#ff006e', fontWeight: 700 }}>Elite Reviewer</span> badge.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
