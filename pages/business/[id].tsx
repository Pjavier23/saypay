import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import ReviewCard from '../../components/ReviewCard'
import { ReviewCardSkeleton } from '../../components/LoadingSkeleton'
import { useAuth } from '../_app'
import { supabase } from '../../lib/supabase'

const TIP_AMOUNTS = [
  { label: '$1', cents: 100 },
  { label: '$2', cents: 200 },
  { label: '$5', cents: 500 },
  { label: 'Custom', cents: 0 },
]

const DONATION_PLANS = [
  { key: 'supporter', label: '$5/mo', sublabel: 'Supporter', cents: 500 },
  { key: 'champion', label: '$10/mo', sublabel: 'Champion', cents: 1000 },
  { key: 'hero', label: '$25/mo', sublabel: 'Hero', cents: 2500 },
]

export default function BusinessPage() {
  const router = useRouter()
  const { id } = router.query
  const { user } = useAuth()

  const [business, setBusiness] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewsLoading, setReviewsLoading] = useState(false)

  // Review form
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [content, setContent] = useState('')
  const [photos, setPhotos] = useState<File[]>([])
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([])
  const [uploadingPhotos, setUploadingPhotos] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Tip
  const [showTip, setShowTip] = useState(false)
  const [tipAmount, setTipAmount] = useState<number | null>(null)
  const [customTip, setCustomTip] = useState('')
  const [tipping, setTipping] = useState(false)

  // Donation
  const [showDonation, setShowDonation] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [donating, setDonating] = useState(false)

  // Notifications from URL params
  const tipSuccess = router.query.tip === 'success'
  const tipCanceled = router.query.tip === 'canceled'
  const donationSuccess = router.query.donation === 'success'
  const reviewCanceled = router.query.canceled === '1'

  useEffect(() => {
    if (!id) return
    fetchData()
  }, [id])

  async function fetchData() {
    setLoading(true)
    const idStr = id as string

    if (idStr.startsWith('google_')) {
      // Google Places — no DB entry, create a mock business object
      const placeId = idStr.replace('google_', '')
      setBusiness({
        id: idStr,
        name: 'Restaurant',
        emoji: '🍽️',
        location: '',
        category: 'Restaurant',
        description: '',
        cover_image: null,
        avg_rating: 0,
        total_reviews: 0,
        is_boosted: false,
        is_google: true,
        google_place_id: placeId,
      })
      setReviews([])
      setLoading(false)
      return
    }

    const res = await fetch(`/api/businesses/${id}`)
    if (res.ok) {
      const data = await res.json()
      setBusiness(data.business)
      setReviews(data.reviews || [])
    }
    setLoading(false)
  }

  // Photo selection
  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    const remaining = 3 - photos.length
    const newFiles = files.slice(0, remaining)
    setPhotos(prev => [...prev, ...newFiles])
    const newUrls = newFiles.map(f => URL.createObjectURL(f))
    setPhotoPreviewUrls(prev => [...prev, ...newUrls])
  }

  function removePhoto(i: number) {
    URL.revokeObjectURL(photoPreviewUrls[i])
    setPhotos(prev => prev.filter((_, idx) => idx !== i))
    setPhotoPreviewUrls(prev => prev.filter((_, idx) => idx !== i))
  }

  // Upload photos to Supabase Storage
  async function uploadPhotos(): Promise<string[]> {
    if (photos.length === 0) return []
    setUploadingPhotos(true)
    const urls: string[] = []

    for (const file of photos) {
      const ext = file.name.split('.').pop() || 'jpg'
      const filename = `reviews/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
      const { data, error } = await supabase.storage
        .from('review-photos')
        .upload(filename, file, { contentType: file.type, upsert: false })

      if (!error && data) {
        const { data: urlData } = supabase.storage
          .from('review-photos')
          .getPublicUrl(data.path)
        urls.push(urlData.publicUrl)
      }
    }

    setUploadingPhotos(false)
    return urls
  }

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault()
    if (!user) { router.push('/login'); return }
    if (rating === 0) { setFormError('Please select a star rating'); return }
    if (content.length < 20) { setFormError('Review must be at least 20 characters'); return }

    setSubmitting(true)
    setFormError('')

    // Upload photos first
    let photoUrls: string[] = []
    try {
      photoUrls = await uploadPhotos()
    } catch {
      // Continue without photos if upload fails
    }

    const res = await fetch('/api/reviews/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ business_id: id, user_id: user.id, rating, content, photos: photoUrls }),
    })

    const data = await res.json()
    if (!res.ok) {
      setFormError(data.error || 'Failed to create checkout')
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

  async function handleTip() {
    if (!user) { router.push('/login'); return }
    const cents = tipAmount || (customTip ? Math.round(parseFloat(customTip) * 100) : 0)
    if (!cents || cents < 100) { return }
    setTipping(true)
    const res = await fetch('/api/tips/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ business_id: id, business_name: business?.name, from_user_id: user.id, amount_cents: cents }),
    })
    const data = await res.json()
    if (res.ok && data.url) {
      window.location.href = data.url
    }
    setTipping(false)
  }

  async function handleDonation() {
    if (!user) { router.push('/login'); return }
    if (!selectedPlan) return
    setDonating(true)
    const res = await fetch('/api/donations/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ business_id: id, business_name: business?.name, user_id: user.id, plan: selectedPlan }),
    })
    const data = await res.json()
    if (res.ok && data.url) {
      window.location.href = data.url
    }
    setDonating(false)
  }

  if (loading) {
    return (
      <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
        <Nav />
        <div style={{ paddingTop: '4.5rem', maxWidth: '900px', margin: '0 auto', padding: '6rem 1.5rem' }}>
          <div style={{ height: '280px', background: 'rgba(255,255,255,0.04)', borderRadius: '1rem', marginBottom: '2rem' }} className="skeleton-pulse" />
          <ReviewCardSkeleton />
          <div style={{ marginTop: '1rem' }}><ReviewCardSkeleton /></div>
        </div>
      </div>
    )
  }

  if (!business) {
    return (
      <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textAlign: 'center' }}>
        <div>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤔</div>
          <h2 style={{ marginBottom: '1rem' }}>Business not found</h2>
          <Link href="/explore" style={{ color: '#ff006e', textDecoration: 'none' }}>← Back to Explore</Link>
        </div>
      </div>
    )
  }

  const avgRating = parseFloat(business.avg_rating) || 0
  const googleMapsUrl = business.is_google
    ? `https://www.google.com/maps/place/?q=place_id:${business.google_place_id}`
    : `https://www.google.com/maps/search/${encodeURIComponent(business.name + ' ' + (business.location || ''))}`
  const yelpUrl = `https://www.yelp.com/search?find_desc=${encodeURIComponent(business.name)}&find_loc=${encodeURIComponent(business.location || '')}`

  return (
    <div style={{ background: '#0a0a0a', color: '#fff', minHeight: '100vh' }}>
      <Nav />

      <div style={{ paddingTop: '4.5rem' }}>
        {/* Hero */}
        <div style={{ position: 'relative', height: '280px', overflow: 'hidden' }}>
          {business.cover_image ? (
            <img src={business.cover_image} alt={business.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              background: 'linear-gradient(135deg, rgba(255,0,110,0.35), rgba(29,209,221,0.25))',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '6rem',
            }}>
              {business.emoji}
            </div>
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 25%, rgba(10,10,10,0.97) 100%)' }} />
          {business.is_boosted && (
            <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'linear-gradient(135deg, #ffdd00, #ff886e)', color: '#000', fontSize: '0.75rem', fontWeight: '800', padding: '0.35rem 0.8rem', borderRadius: '9999px' }}>
              ⭐ Featured
            </div>
          )}
          <div style={{ position: 'absolute', top: '1.25rem', left: '1.25rem' }}>
            <Link href="/explore" style={{ background: 'rgba(0,0,0,0.6)', color: '#aaa', textDecoration: 'none', padding: '0.4rem 0.875rem', borderRadius: '9999px', fontSize: '0.82rem', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.1)' }}>
              ← Explore
            </Link>
          </div>
        </div>

        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1.5rem 5rem' }}>
          {/* Business info */}
          <div style={{ marginTop: '-2.5rem', position: 'relative', marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.25rem)', fontWeight: '900', marginBottom: '0.3rem', lineHeight: 1.2 }}>
                  {business.emoji} {business.name}
                </h1>
                <p style={{ color: '#777', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  📍 {business.location}
                  {business.category && ` · ${business.category}`}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <span style={{ color: '#ffdd00', fontSize: '1rem', letterSpacing: '1px' }}>
                    {'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}
                  </span>
                  <span style={{ fontWeight: '800', fontSize: '1.05rem' }}>{avgRating > 0 ? avgRating.toFixed(1) : '—'}</span>
                  <span style={{ color: '#555', fontSize: '0.85rem' }}>({business.total_reviews} verified)</span>
                </div>
              </div>
              <button
                onClick={() => { if (!user) router.push('/login'); else setShowForm(!showForm) }}
                style={{
                  background: 'linear-gradient(135deg, #ff006e, #ffdd00)', color: '#000',
                  padding: '0.875rem 1.75rem', borderRadius: '9999px', border: 'none',
                  fontWeight: '900', cursor: 'pointer', fontSize: '0.95rem',
                  boxShadow: '0 0 30px rgba(255,0,110,0.3)', flexShrink: 0,
                }}
              >
                ✍️ Write Review — $0.99
              </button>
            </div>
          </div>

          {business.description && (
            <p style={{ color: '#888', lineHeight: '1.65', marginBottom: '2rem', fontSize: '0.95rem' }}>
              {business.description}
            </p>
          )}

          {/* Notifications */}
          {tipSuccess && (
            <div style={{ background: 'rgba(0,200,100,0.1)', border: '1px solid rgba(0,200,100,0.3)', borderRadius: '0.75rem', padding: '1rem 1.25rem', marginBottom: '1.5rem', color: '#00c864', fontSize: '0.9rem' }}>
              🎉 Tip sent! Thank you for supporting the team.
            </div>
          )}
          {donationSuccess && (
            <div style={{ background: 'rgba(0,200,100,0.1)', border: '1px solid rgba(0,200,100,0.3)', borderRadius: '0.75rem', padding: '1rem 1.25rem', marginBottom: '1.5rem', color: '#00c864', fontSize: '0.9rem' }}>
              ❤️ Monthly support activated! You're a hero.
            </div>
          )}
          {reviewCanceled && (
            <div style={{ background: 'rgba(255,221,0,0.08)', border: '1px solid rgba(255,221,0,0.25)', borderRadius: '0.75rem', padding: '1rem 1.25rem', marginBottom: '1.5rem', color: '#ffdd00', fontSize: '0.9rem' }}>
              Payment canceled. Your draft review was not published.
            </div>
          )}

          {/* Review Form */}
          {showForm && (
            <div style={{ background: 'rgba(255,0,110,0.04)', border: '1px solid rgba(255,0,110,0.18)', borderRadius: '1.5rem', padding: '1.75rem', marginBottom: '2.5rem' }}>
              <h3 style={{ fontWeight: '900', fontSize: '1.2rem', marginBottom: '0.25rem' }}>Write Your Review</h3>
              <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                You'll pay $0.99 to publish. That's what makes it real.
              </p>

              <form onSubmit={handleSubmitReview}>
                {/* Stars */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', color: '#aaa', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rating</label>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star} type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                          fontSize: '2.2rem', lineHeight: 1,
                          color: star <= (hoverRating || rating) ? '#ffdd00' : '#2a2a2a',
                          transform: star <= (hoverRating || rating) ? 'scale(1.15)' : 'scale(1)',
                          transition: 'all 0.1s',
                        }}
                      >★</button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <p style={{ color: '#888', fontSize: '0.8rem', marginTop: '0.4rem' }}>
                      {['', '😤 Poor', '😕 Fair', '😐 OK', '😊 Good', '🤩 Amazing!'][rating]}
                    </p>
                  )}
                </div>

                {/* Content */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', color: '#aaa', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Review</label>
                  <textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    rows={4}
                    placeholder="Tell people what you really think. Be specific, be honest, be you. (min. 20 characters)"
                    style={{
                      width: '100%', background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem',
                      padding: '0.875rem 1rem', color: '#fff', fontSize: '0.925rem',
                      outline: 'none', resize: 'vertical', fontFamily: 'inherit',
                      boxSizing: 'border-box', lineHeight: '1.6',
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                    <span style={{ color: content.length < 20 ? '#ff006e' : '#555', fontSize: '0.75rem' }}>
                      {content.length < 20 ? `${20 - content.length} more characters needed` : '✓ Good length'}
                    </span>
                  </div>
                </div>

                {/* Photo Upload */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', color: '#aaa', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Photos (optional, up to 3)
                  </label>

                  {photoPreviewUrls.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                      {photoPreviewUrls.map((url, i) => (
                        <div key={i} style={{ position: 'relative' }}>
                          <img src={url} alt="" style={{ width: '88px', height: '72px', objectFit: 'cover', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)' }} />
                          <button
                            type="button"
                            onClick={() => removePhoto(i)}
                            style={{
                              position: 'absolute', top: '-6px', right: '-6px',
                              background: '#ff006e', color: '#fff', border: 'none',
                              borderRadius: '50%', width: '20px', height: '20px',
                              cursor: 'pointer', fontSize: '0.75rem', lineHeight: '20px',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              padding: 0,
                            }}
                          >×</button>
                        </div>
                      ))}
                    </div>
                  )}

                  {photos.length < 3 && (
                    <>
                      <div
                        className="photo-upload-zone"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.4rem' }}>📷</span>
                        <span style={{ color: '#666', fontSize: '0.875rem' }}>
                          Click to add photos ({3 - photos.length} remaining)
                        </span>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        style={{ display: 'none' }}
                        onChange={handlePhotoSelect}
                      />
                    </>
                  )}
                </div>

                {formError && (
                  <div style={{ background: 'rgba(255,0,110,0.1)', border: '1px solid rgba(255,0,110,0.25)', borderRadius: '0.75rem', padding: '0.75rem 1rem', color: '#ff006e', marginBottom: '1rem', fontSize: '0.875rem' }}>
                    {formError}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button
                    type="submit"
                    disabled={submitting || uploadingPhotos}
                    style={{
                      background: (submitting || uploadingPhotos) ? 'rgba(255,0,110,0.3)' : 'linear-gradient(135deg, #ff006e, #ffdd00)',
                      color: '#000', padding: '0.875rem 1.75rem', borderRadius: '9999px',
                      border: 'none', fontWeight: '900', cursor: submitting ? 'not-allowed' : 'pointer', fontSize: '0.925rem',
                    }}
                  >
                    {uploadingPhotos ? '📸 Uploading photos...' : submitting ? '⏳ Loading Stripe...' : '💳 Publish for $0.99'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '0.9rem' }}>
                    Cancel
                  </button>
                </div>
                <p style={{ color: '#444', fontSize: '0.75rem', marginTop: '0.75rem' }}>
                  Redirected to Stripe's secure checkout. $0.99 to publish. No subscriptions.
                </p>
              </form>
            </div>
          )}

          {/* Tip the Chef */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showTip ? '1.25rem' : 0 }}>
              <div>
                <h3 style={{ fontWeight: '800', fontSize: '1.05rem', margin: 0 }}>👨‍🍳 Tip the Chef</h3>
                <p style={{ color: '#666', fontSize: '0.82rem', margin: '0.2rem 0 0' }}>Show appreciation for great food and service</p>
              </div>
              <button
                onClick={() => setShowTip(!showTip)}
                style={{
                  background: showTip ? 'rgba(255,0,110,0.1)' : 'rgba(255,255,255,0.06)',
                  color: showTip ? '#ff006e' : '#aaa',
                  border: '1px solid rgba(255,255,255,0.1)', padding: '0.45rem 1rem',
                  borderRadius: '9999px', cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem',
                }}
              >{showTip ? 'Hide' : 'Send a Tip'}</button>
            </div>

            {showTip && (
              <div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.875rem' }}>
                  {TIP_AMOUNTS.map(({ label, cents }) => (
                    <button
                      key={label}
                      onClick={() => { setTipAmount(cents || null); if (label !== 'Custom') setCustomTip('') }}
                      style={{
                        background: tipAmount === cents && cents !== 0 ? 'linear-gradient(135deg, #ff006e, #ff886e)' : 'rgba(255,255,255,0.06)',
                        color: tipAmount === cents && cents !== 0 ? '#fff' : '#aaa',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '0.55rem 1.1rem', borderRadius: '9999px',
                        cursor: 'pointer', fontWeight: '700', fontSize: '0.9rem',
                      }}
                    >{label}</button>
                  ))}
                </div>
                {(tipAmount === null || tipAmount === 0) && (
                  <div style={{ marginBottom: '0.875rem' }}>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      placeholder="Enter amount ($)"
                      value={customTip}
                      onChange={e => setCustomTip(e.target.value)}
                      style={{
                        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '0.5rem', padding: '0.6rem 0.875rem', color: '#fff',
                        fontSize: '0.9rem', outline: 'none', width: '160px',
                      }}
                    />
                  </div>
                )}
                <button
                  onClick={handleTip}
                  disabled={tipping || (!tipAmount && !customTip)}
                  style={{
                    background: tipping || (!tipAmount && !customTip) ? 'rgba(255,0,110,0.3)' : 'linear-gradient(135deg, #ff006e, #ffdd00)',
                    color: '#000', padding: '0.7rem 1.5rem', borderRadius: '9999px',
                    border: 'none', fontWeight: '900', cursor: 'pointer', fontSize: '0.9rem',
                  }}
                >
                  {tipping ? 'Loading...' : `Send Tip${tipAmount ? ` ${TIP_AMOUNTS.find(t => t.cents === tipAmount)?.label || '$' + (tipAmount / 100).toFixed(2)}` : customTip ? ` $${customTip}` : ''}`}
                </button>
              </div>
            )}
          </div>

          {/* Monthly Support */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showDonation ? '1.25rem' : 0 }}>
              <div>
                <h3 style={{ fontWeight: '800', fontSize: '1.05rem', margin: 0 }}>❤️ Support this place</h3>
                <p style={{ color: '#666', fontSize: '0.82rem', margin: '0.2rem 0 0' }}>Become a monthly supporter of this small business</p>
              </div>
              <button
                onClick={() => setShowDonation(!showDonation)}
                style={{
                  background: showDonation ? 'rgba(255,0,110,0.1)' : 'rgba(255,255,255,0.06)',
                  color: showDonation ? '#ff006e' : '#aaa',
                  border: '1px solid rgba(255,255,255,0.1)', padding: '0.45rem 1rem',
                  borderRadius: '9999px', cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem',
                }}
              >{showDonation ? 'Hide' : 'Support ❤️'}</button>
            </div>

            {showDonation && (
              <div>
                <p style={{ color: '#777', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  Choose how much you'd like to support {business.name} monthly:
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  {DONATION_PLANS.map(plan => (
                    <button
                      key={plan.key}
                      onClick={() => setSelectedPlan(plan.key)}
                      style={{
                        background: selectedPlan === plan.key ? 'linear-gradient(135deg, #ff006e, #ff886e)' : 'rgba(255,255,255,0.06)',
                        color: selectedPlan === plan.key ? '#fff' : '#aaa',
                        border: selectedPlan === plan.key ? 'none' : '1px solid rgba(255,255,255,0.1)',
                        padding: '0.75rem 1.25rem', borderRadius: '0.75rem',
                        cursor: 'pointer', fontWeight: '700',
                        textAlign: 'center' as const,
                        minWidth: '90px',
                      }}
                    >
                      <div style={{ fontSize: '1rem' }}>{plan.label}</div>
                      <div style={{ fontSize: '0.72rem', opacity: 0.8, marginTop: '0.1rem' }}>{plan.sublabel}</div>
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleDonation}
                  disabled={donating || !selectedPlan}
                  style={{
                    background: donating || !selectedPlan ? 'rgba(255,0,110,0.3)' : 'linear-gradient(135deg, #ff006e, #ffdd00)',
                    color: '#000', padding: '0.7rem 1.75rem', borderRadius: '9999px',
                    border: 'none', fontWeight: '900', cursor: 'pointer', fontSize: '0.9rem',
                  }}
                >
                  {donating ? 'Loading...' : selectedPlan ? `Become a ${DONATION_PLANS.find(p => p.key === selectedPlan)?.sublabel} →` : 'Select a plan'}
                </button>
                <p style={{ color: '#444', fontSize: '0.75rem', marginTop: '0.5rem' }}>Cancel anytime. Powered by Stripe.</p>
              </div>
            )}
          </div>

          {/* Seen on the web */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.25rem', padding: '1.25rem 1.5rem', marginBottom: '2.5rem' }}>
            <h3 style={{ fontWeight: '700', fontSize: '0.95rem', marginBottom: '0.875rem', color: '#aaa' }}>🌐 Seen on the web</h3>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  background: 'rgba(66,133,244,0.1)', border: '1px solid rgba(66,133,244,0.2)',
                  color: '#4285f4', textDecoration: 'none', padding: '0.4rem 0.875rem',
                  borderRadius: '9999px', fontSize: '0.82rem', fontWeight: '600',
                }}
              >
                🗺️ Google Maps
              </a>
              <a
                href={yelpUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  background: 'rgba(255,80,0,0.1)', border: '1px solid rgba(255,80,0,0.2)',
                  color: '#ff5000', textDecoration: 'none', padding: '0.4rem 0.875rem',
                  borderRadius: '9999px', fontSize: '0.82rem', fontWeight: '600',
                }}
              >
                ⭐ Yelp
              </a>
            </div>
          </div>

          {/* Reviews */}
          <div>
            <h2 style={{ fontWeight: '900', fontSize: '1.4rem', marginBottom: '1.25rem' }}>
              {reviews.length > 0
                ? `${reviews.length} Verified Review${reviews.length !== 1 ? 's' : ''}`
                : 'No reviews yet — be the first!'}
            </h2>

            {reviews.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#555', background: 'rgba(255,255,255,0.02)', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✍️</div>
                <p>Nobody has reviewed {business.name} yet.</p>
                <button
                  onClick={() => { if (!user) router.push('/login'); else setShowForm(true) }}
                  style={{ marginTop: '1rem', background: 'linear-gradient(135deg, #ff006e, #ffdd00)', color: '#000', padding: '0.75rem 2rem', borderRadius: '9999px', border: 'none', fontWeight: '800', cursor: 'pointer' }}
                >
                  Write the First Review
                </button>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {reviews.map(review => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onReact={handleReaction}
                  showBusiness={false}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
