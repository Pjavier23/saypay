import Link from 'next/link'

interface ReviewCardProps {
  review: {
    id: string
    rating: number
    content: string
    helpful_count: number
    love_count: number
    created_at: string
    photos?: string[] | null
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
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= rating ? '#ffdd00' : '#333', fontSize: '0.9rem' }}>★</span>
      ))}
    </span>
  )
}

export default function ReviewCard({ review, onReact, showBusiness = true }: ReviewCardProps) {
  const profile = review.sp_profiles
  const business = review.sp_businesses
  const displayName = profile?.display_name || profile?.username || 'Anonymous'

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: review.helpful_count > 5
        ? '1px solid rgba(255,0,110,0.25)'
        : '1px solid rgba(255,255,255,0.07)',
      borderRadius: '1.25rem',
      padding: '1.5rem',
      boxShadow: review.helpful_count > 5 ? '0 0 20px rgba(255,0,110,0.08)' : 'none',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{
            width: '42px', height: '42px', borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #ff006e, #1dd1dd)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: '900', fontSize: '1rem', color: '#fff',
          }}>
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span>{displayName}</span>
              {profile?.is_elite && (
                <span style={{ background: 'linear-gradient(135deg, #ff006e, #ffdd00)', color: '#000', fontSize: '0.6rem', padding: '0.1rem 0.45rem', borderRadius: '9999px', fontWeight: '800' }}>ELITE</span>
              )}
              <span style={{ background: 'rgba(29,209,221,0.15)', color: '#1dd1dd', fontSize: '0.6rem', padding: '0.1rem 0.45rem', borderRadius: '9999px', fontWeight: '700' }}>✓ PAID</span>
            </div>
            {showBusiness && business && (
              <div style={{ color: '#555', fontSize: '0.78rem', marginTop: '0.15rem' }}>
                reviewed <span style={{ color: '#999', fontWeight: '600' }}>{business.emoji} {business.name}</span>
              </div>
            )}
            <div style={{ color: '#444', fontSize: '0.75rem' }}>
              {new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>
        <div style={{
          background: 'rgba(255,221,0,0.1)', border: '1px solid rgba(255,221,0,0.2)',
          padding: '0.3rem 0.7rem', borderRadius: '9999px', flexShrink: 0,
        }}>
          <Stars rating={review.rating} />
        </div>
      </div>

      {/* Content */}
      <p style={{ color: '#ddd', lineHeight: '1.65', fontSize: '0.925rem', margin: '0 0 1rem' }}>
        {review.content}
      </p>

      {/* Photos */}
      {review.photos && review.photos.length > 0 && (
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {review.photos.map((url, i) => (
            <a key={i} href={url} target="_blank" rel="noopener noreferrer">
              <img
                src={url}
                alt={`Review photo ${i + 1}`}
                style={{ width: '100px', height: '80px', objectFit: 'cover', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </a>
          ))}
        </div>
      )}

      {/* Reactions */}
      <div style={{ display: 'flex', gap: '0.6rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.875rem' }}>
        {onReact ? (
          <>
            <button
              onClick={() => onReact(review.id, 'helpful')}
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#aaa', padding: '0.35rem 0.9rem', borderRadius: '9999px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '600' }}
            >
              👍 {review.helpful_count}
            </button>
            <button
              onClick={() => onReact(review.id, 'love')}
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#aaa', padding: '0.35rem 0.9rem', borderRadius: '9999px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '600' }}
            >
              ❤️ {review.love_count}
            </button>
          </>
        ) : (
          <>
            <span style={{ color: '#555', fontSize: '0.82rem' }}>👍 {review.helpful_count}</span>
            <span style={{ color: '#555', fontSize: '0.82rem' }}>❤️ {review.love_count}</span>
          </>
        )}
      </div>
    </div>
  )
}
