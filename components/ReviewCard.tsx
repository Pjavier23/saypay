import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useAuth } from '../pages/_app'
import { isStripeConfigured } from '../lib/stripe'

interface Comment {
  id: string
  content: string
  created_at: string
  sp_profiles?: {
    username: string
    display_name?: string | null
    is_elite?: boolean
  } | null
}

interface ReviewCardProps {
  review: {
    id: string
    rating: number
    content: string
    helpful_count: number
    love_count: number
    paid_boost_count?: number
    created_at: string
    status?: string
    photos?: string[] | null
    rating_food?: number | null
    rating_service?: number | null
    rating_cleanliness?: number | null
    rating_atmosphere?: number | null
    sp_profiles?: {
      username: string
      display_name?: string | null
      is_elite?: boolean
    } | null
    sp_businesses?: {
      name: string
      emoji: string
      category: string
    } | null
  }
  onReact?: (reviewId: string, type: 'helpful' | 'love') => void
  showBusiness?: boolean
}

function Stars({ rating }: { rating: number }) {
  return (
    <span>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= rating ? '#ffdd00' : '#333', fontSize: '0.9rem' }}>★</span>
      ))}
    </span>
  )
}

function MiniRatingBar({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem' }}>
      <span style={{ color: '#555', minWidth: '60px' }}>{label}</span>
      <div style={{ flex: 1, background: 'rgba(255,255,255,0.07)', borderRadius: '9999px', height: '4px', overflow: 'hidden' }}>
        <div style={{ background: 'linear-gradient(90deg,#ff006e,#ffdd00)', height: '100%', width: `${(value / 5) * 100}%`, borderRadius: '9999px' }} />
      </div>
      <span style={{ color: '#777', minWidth: '16px', textAlign: 'right' }}>{value}</span>
    </div>
  )
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function ReviewCard({ review, onReact, showBusiness = true }: ReviewCardProps) {
  const { user } = useAuth()
  const profile = review.sp_profiles
  const business = review.sp_businesses
  const displayName = profile?.display_name || profile?.username || 'Anonymous'

  const isPaid = review.status === 'published' || !review.status
  const isTrending = (review.helpful_count || 0) >= 3
  const isBoosted = (review.paid_boost_count || 0) > 0
  const stripeReady = isStripeConfigured()

  const [localHelpful, setLocalHelpful] = useState(review.helpful_count || 0)
  const [localLove, setLocalLove] = useState(review.love_count || 0)
  const [localBoosts, setLocalBoosts] = useState(review.paid_boost_count || 0)
  const [reactedHelpful, setReactedHelpful] = useState(false)
  const [reactedLove, setReactedLove] = useState(false)

  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [commentError, setCommentError] = useState('')
  const [showSignupPrompt, setShowSignupPrompt] = useState(false)
  const [copied, setCopied] = useState(false)
  const [followed, setFollowed] = useState(false)
  const [boostLoading, setBoostLoading] = useState(false)
  const commentInputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => { setLocalHelpful(review.helpful_count || 0) }, [review.helpful_count])
  useEffect(() => { setLocalLove(review.love_count || 0) }, [review.love_count])
  useEffect(() => { setLocalBoosts(review.paid_boost_count || 0) }, [review.paid_boost_count])

  useEffect(() => {
    if (business) setFollowed(localStorage.getItem(`follow_${review.id}`) === '1')
  }, [review.id, business])

  function handleFollowBusiness() {
    const key = `follow_${review.id}`
    if (followed) { localStorage.removeItem(key); setFollowed(false) }
    else { localStorage.setItem(key, '1'); setFollowed(true) }
  }

  async function handleReact(type: 'helpful' | 'love') {
    if (!user) { setShowSignupPrompt(true); setTimeout(() => setShowSignupPrompt(false), 3000); return }
    if (type === 'helpful') {
      setLocalHelpful(v => reactedHelpful ? v - 1 : v + 1)
      setReactedHelpful(v => !v)
    } else {
      setLocalLove(v => reactedLove ? v - 1 : v + 1)
      setReactedLove(v => !v)
    }
    if (onReact) { onReact(review.id, type); return }
    try {
      await fetch('/api/reactions/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ review_id: review.id, user_id: user.id, type }),
      })
    } catch { /* ignore */ }
  }

  async function handleBoost() {
    if (!user) { setShowSignupPrompt(true); setTimeout(() => setShowSignupPrompt(false), 3000); return }
    if (!stripeReady) return
    setBoostLoading(true)
    try {
      const res = await fetch('/api/reviews/upvote-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ review_id: review.id, user_id: user.id }),
      })
      const data = await res.json()
      if (res.ok && data.url) window.location.href = data.url
    } catch { /* ignore */ }
    setBoostLoading(false)
  }

  async function loadComments() {
    if (commentsLoading) return
    setCommentsLoading(true)
    try {
      const res = await fetch(`/api/comments/${review.id}`)
      if (res.ok) setComments(await res.json())
    } catch { /* ignore */ }
    setCommentsLoading(false)
  }

  function toggleComments() {
    const next = !showComments
    setShowComments(next)
    if (next && comments.length === 0) loadComments()
  }

  async function submitComment(e: React.FormEvent) {
    e.preventDefault()
    if (!user) { setShowSignupPrompt(true); return }
    if (!commentText.trim()) return
    if (commentText.length > 280) { setCommentError('Max 280 characters'); return }
    setSubmittingComment(true)
    setCommentError('')
    try {
      const res = await fetch(`/api/comments/${review.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, content: commentText.trim() }),
      })
      if (res.ok) {
        const newComment = await res.json()
        setComments(prev => [...prev, newComment])
        setCommentText('')
      } else {
        const err = await res.json()
        setCommentError(err.error || 'Failed to post comment')
      }
    } catch { setCommentError('Failed to post comment') }
    setSubmittingComment(false)
  }

  function shareReview() {
    const url = window.location.origin + window.location.pathname + '#review-' + review.id
    navigator.clipboard.writeText(url).catch(() => {/* ignore */})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const hasCategoryRatings = review.rating_food && review.rating_service && review.rating_cleanliness && review.rating_atmosphere

  return (
    <div
      id={`review-${review.id}`}
      className="review-card-animate"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: isBoosted
          ? '1px solid rgba(255,0,110,0.45)'
          : isTrending
            ? '1px solid rgba(255,0,110,0.3)'
            : '1px solid rgba(255,255,255,0.07)',
        borderRadius: '1.25rem',
        padding: '1.5rem',
        boxShadow: isBoosted ? '0 0 28px rgba(255,0,110,0.15)' : isTrending ? '0 0 24px rgba(255,0,110,0.1)' : 'none',
        position: 'relative',
        overflow: 'visible',
      }}
    >
      {/* Badges */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.875rem', flexWrap: 'wrap' }}>
        {isPaid && (
          <span style={{ background: 'linear-gradient(135deg,rgba(29,209,221,0.2),rgba(29,209,221,0.1))', border: '1px solid rgba(29,209,221,0.35)', color: '#1dd1dd', fontSize: '0.65rem', padding: '0.2rem 0.55rem', borderRadius: '9999px', fontWeight: 800, letterSpacing: '0.04em' }}>
            ✓ Verified Paid
          </span>
        )}
        {isBoosted && (
          <span style={{ background: 'linear-gradient(135deg,rgba(255,0,110,0.25),rgba(255,170,0,0.2))', border: '1px solid rgba(255,0,110,0.45)', color: '#ff886e', fontSize: '0.65rem', padding: '0.2rem 0.55rem', borderRadius: '9999px', fontWeight: 800 }}>
            🚀 Boosted ×{localBoosts}
          </span>
        )}
        {isTrending && !isBoosted && (
          <span style={{ background: 'linear-gradient(135deg,rgba(255,0,110,0.2),rgba(255,170,0,0.15))', border: '1px solid rgba(255,0,110,0.35)', color: '#ff886e', fontSize: '0.65rem', padding: '0.2rem 0.55rem', borderRadius: '9999px', fontWeight: 800 }}>
            🔥 Trending
          </span>
        )}
      </div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', minWidth: 0 }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg,#ff006e,#1dd1dd)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1rem', color: '#fff' }}>
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName}</span>
              {profile?.is_elite && (
                <span style={{ background: 'linear-gradient(135deg,#ff006e,#ffdd00)', color: '#000', fontSize: '0.6rem', padding: '0.1rem 0.45rem', borderRadius: '9999px', fontWeight: 800, flexShrink: 0 }}>ELITE</span>
              )}
            </div>
            {showBusiness && business && (
              <div style={{ color: '#555', fontSize: '0.78rem', marginTop: '0.15rem' }}>
                reviewed <span style={{ color: '#999', fontWeight: 600 }}>{business.emoji} {business.name}</span>
              </div>
            )}
            <div style={{ color: '#444', fontSize: '0.75rem' }}>{timeAgo(review.created_at)}</div>
          </div>
        </div>
        <div style={{ background: 'rgba(255,221,0,0.1)', border: '1px solid rgba(255,221,0,0.2)', padding: '0.3rem 0.7rem', borderRadius: '9999px', flexShrink: 0, marginLeft: '0.5rem' }}>
          <Stars rating={review.rating} />
        </div>
      </div>

      {/* Category ratings mini-bars */}
      {hasCategoryRatings && (
        <div style={{ marginBottom: '0.875rem', padding: '0.75rem', background: 'rgba(255,255,255,0.025)', borderRadius: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <MiniRatingBar label="🍽️ Food" value={review.rating_food!} />
          <MiniRatingBar label="🤝 Service" value={review.rating_service!} />
          <MiniRatingBar label="🧹 Clean" value={review.rating_cleanliness!} />
          <MiniRatingBar label="😊 Vibe" value={review.rating_atmosphere!} />
        </div>
      )}

      {/* Content */}
      <p style={{ color: '#ddd', lineHeight: '1.65', fontSize: '0.925rem', margin: '0 0 1rem' }}>
        {review.content}
      </p>

      {/* Photos */}
      {review.photos && review.photos.length > 0 && (
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {review.photos.map((url, i) => (
            <a key={i} href={url} target="_blank" rel="noopener noreferrer">
              <img src={url} alt={`Review photo ${i + 1}`} style={{ width: '100px', height: '80px', objectFit: 'cover', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)' }} />
            </a>
          ))}
        </div>
      )}

      {/* Sign up prompt */}
      {showSignupPrompt && (
        <div style={{ background: 'rgba(255,0,110,0.12)', border: '1px solid rgba(255,0,110,0.3)', borderRadius: '0.75rem', padding: '0.75rem 1rem', marginBottom: '0.75rem', fontSize: '0.85rem', color: '#ff886e', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span>Sign in to react to reviews</span>
          <Link href="/login" style={{ color: '#ff006e', fontWeight: 700, textDecoration: 'none', fontSize: '0.82rem' }}>Sign in →</Link>
        </div>
      )}

      {/* Reactions */}
      <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.875rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          onClick={() => handleReact('helpful')}
          style={{ background: reactedHelpful ? 'rgba(29,209,221,0.15)' : 'rgba(255,255,255,0.04)', border: reactedHelpful ? '1px solid rgba(29,209,221,0.35)' : '1px solid rgba(255,255,255,0.1)', color: reactedHelpful ? '#1dd1dd' : '#aaa', padding: '0.35rem 0.9rem', borderRadius: '9999px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}
        >👍 {localHelpful}</button>

        <button
          onClick={() => handleReact('love')}
          style={{ background: reactedLove ? 'rgba(255,0,110,0.15)' : 'rgba(255,255,255,0.04)', border: reactedLove ? '1px solid rgba(255,0,110,0.35)' : '1px solid rgba(255,255,255,0.1)', color: reactedLove ? '#ff006e' : '#aaa', padding: '0.35rem 0.9rem', borderRadius: '9999px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}
        >❤️ {localLove}</button>

        {/* Paid boost button */}
        <button
          onClick={handleBoost}
          disabled={!stripeReady || boostLoading}
          title={!stripeReady ? 'Payment coming soon' : 'Boost this review for $0.99 — counts 5×'}
          style={{
            background: !stripeReady ? 'rgba(255,255,255,0.03)' : isBoosted ? 'rgba(255,0,110,0.15)' : 'rgba(255,255,255,0.04)',
            border: !stripeReady ? '1px solid rgba(255,255,255,0.07)' : isBoosted ? '1px solid rgba(255,0,110,0.35)' : '1px solid rgba(255,255,255,0.1)',
            color: !stripeReady ? '#444' : isBoosted ? '#ff886e' : '#aaa',
            padding: '0.35rem 0.9rem', borderRadius: '9999px', cursor: !stripeReady ? 'not-allowed' : 'pointer',
            fontSize: '0.82rem', fontWeight: 600,
          }}
        >
          {boostLoading ? '…' : `⬆️ Boost${localBoosts > 0 ? ` (${localBoosts})` : ''}${stripeReady ? ' $0.99' : ''}`}
        </button>

        <button
          onClick={toggleComments}
          style={{ background: showComments ? 'rgba(255,221,0,0.1)' : 'rgba(255,255,255,0.04)', border: showComments ? '1px solid rgba(255,221,0,0.25)' : '1px solid rgba(255,255,255,0.1)', color: showComments ? '#ffdd00' : '#aaa', padding: '0.35rem 0.9rem', borderRadius: '9999px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}
        >💬 {comments.length > 0 ? `${comments.length}` : 'Reply'} {showComments ? '▴' : '▾'}</button>

        <button
          onClick={shareReview}
          style={{ background: copied ? 'rgba(0,200,100,0.1)' : 'rgba(255,255,255,0.04)', border: copied ? '1px solid rgba(0,200,100,0.25)' : '1px solid rgba(255,255,255,0.1)', color: copied ? '#00c864' : '#aaa', padding: '0.35rem 0.9rem', borderRadius: '9999px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}
        >{copied ? '✓ Copied!' : '🔗 Share'}</button>

        {showBusiness && business && (
          <button
            onClick={handleFollowBusiness}
            style={{ background: followed ? 'rgba(255,0,110,0.12)' : 'rgba(255,255,255,0.04)', border: followed ? '1px solid rgba(255,0,110,0.3)' : '1px solid rgba(255,255,255,0.1)', color: followed ? '#ff006e' : '#aaa', padding: '0.35rem 0.9rem', borderRadius: '9999px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, marginLeft: 'auto' }}
          >{followed ? '🔔 Following' : '🔔 Follow'}</button>
        )}
      </div>

      {/* Comments */}
      {showComments && (
        <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
          {commentsLoading ? (
            <div style={{ color: '#555', fontSize: '0.85rem', padding: '0.5rem 0' }}>Loading replies…</div>
          ) : (
            <>
              {comments.length === 0 && (
                <p style={{ color: '#555', fontSize: '0.82rem', marginBottom: '0.75rem' }}>No replies yet. Be the first.</p>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: comments.length > 0 ? '1rem' : '0.5rem' }}>
                {comments.map(comment => {
                  const cProfile = comment.sp_profiles
                  const cName = cProfile?.display_name || cProfile?.username || 'Anonymous'
                  return (
                    <div key={comment.id} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', background: 'rgba(255,255,255,0.02)', borderRadius: '0.875rem', padding: '0.75rem' }}>
                      <div style={{ width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg,#ff886e,#1dd1dd)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.75rem', color: '#fff' }}>
                        {cName.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#ccc' }}>{cName}</span>
                          {cProfile?.is_elite && <span style={{ background: 'linear-gradient(135deg,#ff006e,#ffdd00)', color: '#000', fontSize: '0.55rem', padding: '0.05rem 0.35rem', borderRadius: '9999px', fontWeight: 800 }}>ELITE</span>}
                          <span style={{ color: '#444', fontSize: '0.72rem' }}>{timeAgo(comment.created_at)}</span>
                        </div>
                        <p style={{ color: '#bbb', fontSize: '0.875rem', lineHeight: '1.5', margin: 0 }}>{comment.content}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
              {user ? (
                <form onSubmit={submitComment} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <textarea
                      ref={commentInputRef}
                      value={commentText}
                      onChange={e => { setCommentText(e.target.value); setCommentError('') }}
                      placeholder="Write a reply… (max 280 chars)"
                      rows={2}
                      maxLength={280}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: commentError ? '1px solid rgba(255,0,110,0.4)' : '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '0.6rem 0.875rem', color: '#fff', fontSize: '0.875rem', outline: 'none', resize: 'none', fontFamily: 'inherit', lineHeight: '1.5', boxSizing: 'border-box' }}
                    />
                    <span style={{ position: 'absolute', bottom: '0.4rem', right: '0.6rem', fontSize: '0.7rem', color: commentText.length > 250 ? '#ff006e' : '#444' }}>{commentText.length}/280</span>
                  </div>
                  <button type="submit" disabled={submittingComment || !commentText.trim()} style={{ background: submittingComment || !commentText.trim() ? 'rgba(255,0,110,0.2)' : 'linear-gradient(135deg,#ff006e,#ff886e)', color: '#fff', border: 'none', padding: '0.6rem 1rem', borderRadius: '0.75rem', fontWeight: 700, cursor: submittingComment ? 'not-allowed' : 'pointer', fontSize: '0.82rem', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {submittingComment ? '…' : 'Post'}
                  </button>
                </form>
              ) : (
                <div style={{ fontSize: '0.82rem', color: '#555', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <Link href="/login" style={{ color: '#ff006e', fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
                  <span>to reply</span>
                </div>
              )}
              {commentError && <p style={{ color: '#ff006e', fontSize: '0.78rem', marginTop: '0.4rem' }}>{commentError}</p>}
            </>
          )}
        </div>
      )}
    </div>
  )
}
