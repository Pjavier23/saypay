import { useState } from 'react'
import Link from 'next/link'

interface BusinessCardProps {
  business: {
    id: string
    name: string
    category: string
    location: string
    emoji: string
    avg_rating: number
    total_reviews: number
    cover_image?: string | null
    is_boosted?: boolean
    is_google?: boolean
    google_place_id?: string
    open_now?: boolean | null
    price_level?: number
  }
}

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating)
  return (
    <span>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= full ? '#ffdd00' : '#333', fontSize: '0.85rem' }}>★</span>
      ))}
    </span>
  )
}

export default function BusinessCard({ business }: BusinessCardProps) {
  const [hovered, setHovered] = useState(false)
  const href = business.is_google
    ? `/business/google_${business.google_place_id}`
    : `/business/${business.id}`

  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? 'rgba(255,255,255,0.055)' : 'rgba(255,255,255,0.03)',
          border: business.is_boosted
            ? '2px solid rgba(255,221,0,0.4)'
            : '1px solid rgba(255,255,255,0.08)',
          borderRadius: '1.25rem',
          overflow: 'hidden',
          transform: hovered ? 'translateY(-3px)' : 'none',
          transition: 'all 0.2s ease',
          boxShadow: business.is_boosted
            ? '0 0 24px rgba(255,221,0,0.12)'
            : hovered ? '0 8px 32px rgba(0,0,0,0.4)' : 'none',
          cursor: 'pointer',
        }}
      >
        {/* Cover */}
        <div style={{ position: 'relative', height: '155px', overflow: 'hidden', background: '#111' }}>
          {business.cover_image ? (
            <img
              src={business.cover_image}
              alt={business.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              background: 'linear-gradient(135deg, rgba(255,0,110,0.25), rgba(29,209,221,0.2))',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem',
            }}>
              {business.emoji}
            </div>
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(10,10,10,0.8) 100%)' }} />

          {/* Badges */}
          <div style={{ position: 'absolute', top: '0.65rem', left: '0.65rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {business.is_boosted && (
              <span style={{ background: 'linear-gradient(135deg, #ffdd00, #ff886e)', color: '#000', fontSize: '0.65rem', fontWeight: '800', padding: '0.2rem 0.55rem', borderRadius: '9999px' }}>⭐ Featured</span>
            )}
            {business.is_google && (
              <span style={{ background: 'rgba(66,133,244,0.9)', color: '#fff', fontSize: '0.65rem', fontWeight: '700', padding: '0.2rem 0.55rem', borderRadius: '9999px' }}>📍 Near You</span>
            )}
          </div>

          {business.open_now != null && (
            <div style={{ position: 'absolute', top: '0.65rem', right: '0.65rem' }}>
              <span style={{
                background: business.open_now ? 'rgba(0,200,100,0.85)' : 'rgba(200,50,50,0.85)',
                color: '#fff', fontSize: '0.65rem', fontWeight: '700',
                padding: '0.2rem 0.55rem', borderRadius: '9999px',
              }}>
                {business.open_now ? '● Open' : '● Closed'}
              </span>
            </div>
          )}

          <div style={{ position: 'absolute', bottom: '0.6rem', left: '0.65rem' }}>
            <span style={{ background: 'rgba(0,0,0,0.7)', color: '#aaa', fontSize: '0.72rem', padding: '0.2rem 0.6rem', borderRadius: '9999px', backdropFilter: 'blur(4px)' }}>
              {business.category}
            </span>
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: '1.1rem' }}>
          <h3 style={{ fontWeight: '800', fontSize: '1rem', color: '#fff', margin: '0 0 0.3rem', lineHeight: 1.3 }}>
            {business.emoji} {business.name}
          </h3>
          <p style={{ color: '#666', fontSize: '0.8rem', margin: '0 0 0.7rem' }}>
            📍 {business.location}
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Stars rating={business.avg_rating} />
              <span style={{ color: '#aaa', fontSize: '0.8rem', fontWeight: '600' }}>
                {business.avg_rating > 0 ? business.avg_rating.toFixed(1) : '—'}
              </span>
            </div>
            <span style={{ color: '#444', fontSize: '0.75rem' }}>
              {business.total_reviews > 0 ? `${business.total_reviews} reviews` : 'No reviews yet'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
