import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useAuth } from '../_app'

export default function BusinessPage() {
  const router = useRouter()
  const { id } = router.query
  const { user, profile } = useAuth()
  const [business, setBusiness] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [reactions, setReactions] = useState<Record<string, Set<string>>>({})

  const canceled = router.query.canceled === '1'

  useEffect(() => {
    if (!id) return
    fetchData()
  }, [id])

  async function fetchData() {
    const res = await fetch(`/api/businesses/${id}`)
    if (res.ok) {
      const data = await res.json()
      setBusiness(data.business)
      setReviews(data.reviews)
    }
    setLoading(false)
  }

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault()
    if (!user) { router.push('/login'); return }
    if (rating === 0) { setError('Please select a star rating'); return }
    if (content.length < 20) { setError('Review must be at least 20 characters'); return }

    setSubmitting(true)
    setError('')

    const res = await fetch('/api/reviews/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ business_id: id, user_id: user.id, rating, content }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Failed to create checkout')
      setSubmitting(false)
      return
    }

    window.location.href = data.url
  }

  async function handleReaction(reviewId: string, type: 'helpful' | 'love') {
    if (!user) { router.push('/login'); return }

    const res = await fetch('/api/reactions/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ review_id: reviewId, user_id: user.id, type }),
    })

    if (res.ok) {
      const field = type === 'helpful' ? 'helpful_count' : 'love_count'
      const { action } = await res.json()
      setReviews(prev => prev.map(r => r.id === reviewId
        ? { ...r, [field]: r[field] + (action === 'added' ? 1 : -1) }
        : r
      ))
    }
  }

  if (loading) {
    return (
      <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>
        Loading...
      </div>
    )
  }

  if (!business) {
    return (
      <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textAlign: 'center' }}>
        <div>
          <div style={{ fontSize: '3rem' }}>🤔</div>
          <h2>Business not found</h2>
          <Link href="/explore" style={{ color: '#ff006e' }}>← Back to Explore</Link>
        </div>
      </div>
    )
  }

  const avgRating = parseFloat(business.avg_rating) || 0
  const stars = '★'.repeat(Math.round(avgRating)) + '☆'.repeat(5 - Math.round(avgRating))

  return (
    <div style={{ background: '#0a0a0a', color: '#fff', minHeight: '100vh' }}>
      {/* Nav */}
      <header style={{ position: 'fixed', top: 0, width: '100%', zIndex: 50, background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '1rem 2rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: '900', background: 'linear-gradient(135deg, #ff006e, #1dd1dd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SayPay</span>
          </Link>
          <Link href="/explore" style={{ color: '#888', textDecoration: 'none', fontSize: '0.9rem' }}>← Explore</Link>
        </div>
      </header>

      <div style={{ paddingTop: '4rem' }}>
        {/* Hero */}
        <div style={{ position: 'relative', height: '280px', overflow: 'hidden' }}>
          {business.cover_image ? (
            <img src={business.cover_image} alt={business.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, rgba(255,0,110,0.4), rgba(29,209,221,0.3))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '6rem' }}>
              {business.emoji}
            </div>
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, rgba(10,10,10,0.95) 100%)' }} />
          {business.is_boosted && (
            <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'linear-gradient(135deg, #ffdd00, #ff886e)', color: '#000', fontSize: '0.75rem', fontWeight: '800', padding: '0.35rem 0.8rem', borderRadius: '9999px' }}>
              ⭐ Featured Business
            </div>
          )}
        </div>

        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem 4rem' }}>
          {/* Business info */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', marginTop: '-3rem', position: 'relative' }}>
            <div>
              <h1 style={{ fontSize: '2.25rem', fontWeight: '900', marginBottom: '0.25rem' }}>
                {business.emoji} {business.name}
              </h1>
              <p style={{ color: '#777', marginBottom: '0.5rem' }}>📍 {business.location} · {business.category}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: '#ffdd00', fontSize: '1.1rem' }}>{stars}</span>
                <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>{avgRating.toFixed(1)}</span>
                <span style={{ color: '#555' }}>({business.total_reviews} verified reviews)</span>
              </div>
            </div>
            <button
              onClick={() => { if (!user) router.push('/login'); else setShowForm(!showForm) }}
              style={{ background: 'linear-gradient(135deg, #ff006e, #ffdd00)', color: '#000', padding: '0.875rem 2rem', borderRadius: '9999px', border: 'none', fontWeight: '900', cursor: 'pointer', fontSize: '0.95rem', flexShrink: 0, boxShadow: '0 0 30px rgba(255,0,110,0.3)' }}
            >
              ✍️ Write Review — $0.99
            </button>
          </div>

          {business.description && (
            <p style={{ color: '#888', lineHeight: '1.65', marginBottom: '2rem', fontSize: '0.95rem' }}>{business.description}</p>
          )}

          {canceled && (
            <div style={{ background: 'rgba(255,221,0,0.1)', border: '1px solid rgba(255,221,0,0.3)', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.5rem', color: '#ffdd00', fontSize: '0.9rem' }}>
              Payment canceled. Your draft review was not published.
            </div>
          )}

          {/* Write Review Form */}
          {showForm && (
            <div style={{ background: 'rgba(255,0,110,0.05)', border: '1px solid rgba(255,0,110,0.2)', borderRadius: '1.5rem', padding: '2rem', marginBottom: '2.5rem' }}>
              <h3 style={{ fontWeight: '900', fontSize: '1.25rem', marginBottom: '0.25rem' }}>Write Your Review</h3>
              <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>You'll pay $0.99 to publish. That's what makes it real.</p>

              <form onSubmit={handleSubmitReview}>
                {/* Star picker */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', color: '#aaa', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Rating</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                          fontSize: '2.5rem', lineHeight: 1,
                          color: star <= (hoverRating || rating) ? '#ffdd00' : '#333',
                          transform: star <= (hoverRating || rating) ? 'scale(1.15)' : 'scale(1)',
                          transition: 'all 0.1s',
                        }}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <p style={{ color: '#888', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                      {['', '😤 Poor', '😕 Fair', '😐 OK', '😊 Good', '🤩 Amazing!'][rating]}
                    </p>
                  )}
                </div>

                {/* Review text */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', color: '#aaa', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Review</label>
                  <textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    rows={5}
                    placeholder="Tell people what you really think. Be specific, be honest, be you. (min. 20 characters)"
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '0.75rem', padding: '1rem', color: '#fff', fontSize: '0.95rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box', lineHeight: '1.6' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                    <span style={{ color: content.length < 20 ? '#ff006e' : '#555', fontSize: '0.75rem' }}>
                      {content.length}/20 min
                    </span>
                    <span style={{ color: '#555', fontSize: '0.75rem' }}>{content.length} chars</span>
                  </div>
                </div>

                {error && (
                  <div style={{ background: 'rgba(255,0,110,0.1)', border: '1px solid rgba(255,0,110,0.3)', borderRadius: '0.75rem', padding: '0.75rem 1rem', color: '#ff006e', marginBottom: '1rem', fontSize: '0.9rem' }}>
                    {error}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{ background: submitting ? 'rgba(255,0,110,0.3)' : 'linear-gradient(135deg, #ff006e, #ffdd00)', color: '#000', padding: '0.875rem 2rem', borderRadius: '9999px', border: 'none', fontWeight: '900', cursor: submitting ? 'not-allowed' : 'pointer', fontSize: '0.95rem' }}
                  >
                    {submitting ? 'Loading Stripe...' : '💳 Publish for $0.99'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '0.9rem' }}>
                    Cancel
                  </button>
                </div>
                <p style={{ color: '#444', fontSize: '0.75rem', marginTop: '0.75rem' }}>
                  You'll be redirected to Stripe's secure checkout. $0.99 charged to publish. No subscriptions.
                </p>
              </form>
            </div>
          )}

          {/* Reviews list */}
          <h2 style={{ fontWeight: '900', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
            {reviews.length > 0 ? `${reviews.length} Verified Review${reviews.length !== 1 ? 's' : ''}` : 'No reviews yet — be the first!'}
          </h2>

          {reviews.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#555', background: 'rgba(255,255,255,0.02)', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✍️</div>
              <p>Nobody has reviewed {business.name} yet.</p>
              <button
                onClick={() => setShowForm(true)}
                style={{ marginTop: '1rem', background: 'linear-gradient(135deg, #ff006e, #ffdd00)', color: '#000', padding: '0.75rem 2rem', borderRadius: '9999px', border: 'none', fontWeight: '800', cursor: 'pointer' }}
              >
                Write the First Review
              </button>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {reviews.map(review => {
              const reviewProfile = review.sp_profiles
              const displayName = reviewProfile?.display_name || reviewProfile?.username || 'Reviewer'
              const ratingStars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating)

              return (
                <div key={review.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.25rem', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, #ff006e, #1dd1dd)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: '#fff', flexShrink: 0 }}>
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          {displayName}
                          {reviewProfile?.is_elite && <span style={{ background: 'linear-gradient(135deg, #ff006e, #ffdd00)', color: '#000', fontSize: '0.6rem', padding: '0.1rem 0.45rem', borderRadius: '9999px', fontWeight: '800' }}>ELITE</span>}
                          <span style={{ background: 'rgba(29,209,221,0.15)', color: '#1dd1dd', fontSize: '0.6rem', padding: '0.1rem 0.45rem', borderRadius: '9999px', fontWeight: '700' }}>✓ PAID</span>
                        </div>
                        <div style={{ color: '#555', fontSize: '0.78rem' }}>
                          {new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                      </div>
                    </div>
                    <span style={{ color: '#ffdd00', fontSize: '1rem', letterSpacing: '1px' }}>{ratingStars}</span>
                  </div>

                  <p style={{ color: '#ddd', lineHeight: '1.65', marginBottom: '1.25rem', fontSize: '0.95rem' }}>{review.content}</p>

                  <div style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
                    <button
                      onClick={() => handleReaction(review.id, 'helpful')}
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#aaa', padding: '0.4rem 1rem', borderRadius: '9999px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600', transition: 'all 0.2s' }}
                    >
                      👍 {review.helpful_count} Helpful
                    </button>
                    <button
                      onClick={() => handleReaction(review.id, 'love')}
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#aaa', padding: '0.4rem 1rem', borderRadius: '9999px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600', transition: 'all 0.2s' }}
                    >
                      ❤️ {review.love_count} Love
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
