import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 'Free',
    priceNum: 0,
    emoji: '🌱',
    color: '#888',
    gradient: 'rgba(255,255,255,0.04)',
    border: 'rgba(255,255,255,0.1)',
    features: [
      'Basic business listing',
      'Receive verified reviews',
      'Standard placement in search',
      'Public review profile',
    ],
    cta: 'List for Free',
    stripeKey: null,
  },
  {
    id: 'boost',
    name: 'Boost',
    price: '$49/mo',
    priceNum: 49,
    emoji: '🚀',
    color: '#ff006e',
    gradient: 'rgba(255,0,110,0.08)',
    border: 'rgba(255,0,110,0.35)',
    badge: '⭐ Most Popular',
    features: [
      'Featured placement in search',
      '⭐ Featured badge on listing',
      'Priority in category results',
      'Monthly review analytics',
      'Review response tools',
      'Cancel anytime',
    ],
    cta: 'Start Boost →',
    stripeKey: 'boost',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$149/mo',
    priceNum: 149,
    emoji: '💎',
    color: '#1dd1dd',
    gradient: 'rgba(29,209,221,0.08)',
    border: 'rgba(29,209,221,0.35)',
    features: [
      'Everything in Boost',
      'Top placement in all searches',
      'Full analytics dashboard',
      'Customer sentiment insights',
      'Competitor benchmarking',
      'Review campaign tools',
      'Dedicated success support',
    ],
    cta: 'Go Pro →',
    stripeKey: 'pro',
  },
]

export default function Campaigns() {
  const router = useRouter()
  const success = router.query.success === '1'
  const canceled = router.query.canceled === '1'

  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [businessName, setBusinessName] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubscribe(plan: typeof PLANS[0]) {
    if (plan.priceNum === 0) {
      // Free plan - just show success
      alert('Your free listing is live! Browse SayPay and your business will appear when people search.')
      return
    }
    if (!businessName.trim() || !email.trim()) {
      setError('Please enter your business name and email')
      return
    }
    setSubmitting(true)
    setError('')

    const res = await fetch('/api/campaigns/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ business_name: businessName, email, plan: plan.id }),
    })

    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Something went wrong'); setSubmitting(false); return }
    window.location.href = data.url
  }

  return (
    <div style={{ background: '#0a0a0a', color: '#fff', minHeight: '100vh' }}>
      {/* Nav */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '1rem 2rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: '900', background: 'linear-gradient(135deg, #ff006e, #1dd1dd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SayPay</span>
          </Link>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <Link href="/explore" style={{ color: '#888', textDecoration: 'none', fontSize: '0.9rem' }}>Explore</Link>
            <Link href="/login" style={{ color: '#888', textDecoration: 'none', fontSize: '0.9rem' }}>Log In</Link>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 2rem' }}>
        {/* Success / Canceled banners */}
        {success && (
          <div style={{ background: 'rgba(29,209,221,0.1)', border: '1px solid rgba(29,209,221,0.3)', borderRadius: '1rem', padding: '1.25rem 1.5rem', marginBottom: '2rem', color: '#1dd1dd', fontWeight: '700' }}>
            🎉 You're live! Your business listing has been boosted. Welcome to SayPay Business.
          </div>
        )}
        {canceled && (
          <div style={{ background: 'rgba(255,221,0,0.08)', border: '1px solid rgba(255,221,0,0.25)', borderRadius: '1rem', padding: '1.25rem 1.5rem', marginBottom: '2rem', color: '#ffdd00' }}>
            Payment canceled. No worries — your listing is still free to start.
          </div>
        )}

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,0,110,0.12)', border: '1px solid rgba(255,0,110,0.3)', borderRadius: '9999px', padding: '0.5rem 1.25rem', fontSize: '0.85rem', color: '#ff006e', fontWeight: '700', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            For Business Owners
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '900', marginBottom: '1rem' }}>
            Verified Reviews.<br />
            <span style={{ background: 'linear-gradient(135deg, #ff006e, #ffdd00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Real trust. Real growth.</span>
          </h1>
          <p style={{ color: '#777', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            Every SayPay review was paid for. That means your customers are reading feedback from people who actually care enough to put money on it.
          </p>
        </div>

        {/* Why SayPay */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '4rem' }}>
          {[
            { emoji: '🔒', title: 'Zero fake reviews', desc: '$0.99 per review eliminates bots and spam. Every review on your profile is real.' },
            { emoji: '📈', title: 'Boosts conversion', desc: 'Verified reviews outperform free reviews 3:1 for trust and purchase intent.' },
            { emoji: '🎯', title: 'Your audience', desc: 'People searching your category find you. Featured listings get 5x more profile views.' },
            { emoji: '📊', title: 'Real analytics', desc: 'See who\'s reading reviews, what they respond to, and how you compare to competitors.' },
          ].map(({ emoji, title, desc }) => (
            <div key={title} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.25rem', padding: '1.5rem' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>{emoji}</div>
              <h3 style={{ fontWeight: '800', fontSize: '1rem', marginBottom: '0.4rem' }}>{title}</h3>
              <p style={{ color: '#666', fontSize: '0.85rem', lineHeight: '1.55' }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <h2 style={{ textAlign: 'center', fontWeight: '900', fontSize: '2rem', marginBottom: '0.5rem' }}>Choose Your Plan</h2>
        <p style={{ textAlign: 'center', color: '#555', marginBottom: '2.5rem' }}>Start free. Upgrade when you're ready to grow.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {PLANS.map(plan => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              style={{
                background: plan.gradient,
                border: `${plan.id === selectedPlan ? '2px' : '1px'} solid ${plan.border}`,
                borderRadius: '1.5rem',
                padding: '2rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: plan.id === selectedPlan ? `0 0 30px ${plan.border}` : 'none',
                position: 'relative',
              }}
            >
              {plan.badge && (
                <div style={{ position: 'absolute', top: '-0.75rem', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #ff006e, #ffdd00)', color: '#000', fontSize: '0.72rem', fontWeight: '800', padding: '0.25rem 0.85rem', borderRadius: '9999px', whiteSpace: 'nowrap' }}>
                  {plan.badge}
                </div>
              )}
              <div style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>{plan.emoji}</div>
              <h3 style={{ fontWeight: '900', fontSize: '1.35rem', marginBottom: '0.35rem' }}>{plan.name}</h3>
              <div style={{ fontSize: '2rem', fontWeight: '900', color: plan.color, marginBottom: '1.25rem' }}>{plan.price}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {plan.features.map(f => (
                  <li key={f} style={{ color: '#bbb', fontSize: '0.875rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <span style={{ color: plan.color, fontWeight: '800', flexShrink: 0 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedPlan(plan.id) }}
                style={{
                  width: '100%',
                  background: plan.priceNum > 0 ? `linear-gradient(135deg, ${plan.color}, ${plan.color === '#ff006e' ? '#ffdd00' : '#ff006e'})` : 'rgba(255,255,255,0.08)',
                  color: plan.priceNum > 0 ? '#000' : '#fff',
                  padding: '0.875rem',
                  borderRadius: '0.75rem',
                  border: plan.priceNum > 0 ? 'none' : '1px solid rgba(255,255,255,0.15)',
                  fontWeight: '800',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                }}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Checkout form */}
        {selectedPlan && selectedPlan !== 'starter' && (
          <div style={{ maxWidth: '480px', margin: '0 auto', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '1.5rem', padding: '2rem' }}>
            <h3 style={{ fontWeight: '900', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
              {PLANS.find(p => p.id === selectedPlan)?.emoji} Get Started with {PLANS.find(p => p.id === selectedPlan)?.name}
            </h3>
            <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1.5rem' }}>You'll be sent to Stripe's secure checkout.</p>

            {error && (
              <div style={{ background: 'rgba(255,0,110,0.1)', border: '1px solid rgba(255,0,110,0.3)', borderRadius: '0.75rem', padding: '0.75rem 1rem', color: '#ff006e', marginBottom: '1rem', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.82rem', fontWeight: '600', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Business Name</label>
              <input value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="Sweetgreen Downtown" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '0.7rem', padding: '0.8rem 1rem', color: '#fff', outline: 'none', boxSizing: 'border-box', fontSize: '0.95rem' }} />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.82rem', fontWeight: '600', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="owner@yourbusiness.com" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '0.7rem', padding: '0.8rem 1rem', color: '#fff', outline: 'none', boxSizing: 'border-box', fontSize: '0.95rem' }} />
            </div>

            <button
              onClick={() => { const plan = PLANS.find(p => p.id === selectedPlan); if (plan) handleSubscribe(plan) }}
              disabled={submitting}
              style={{ width: '100%', background: submitting ? 'rgba(255,0,110,0.3)' : 'linear-gradient(135deg, #ff006e, #ffdd00)', color: '#000', padding: '1rem', borderRadius: '0.75rem', border: 'none', fontWeight: '900', cursor: submitting ? 'not-allowed' : 'pointer', fontSize: '1rem' }}
            >
              {submitting ? 'Redirecting to Stripe...' : `Activate ${PLANS.find(p => p.id === selectedPlan)?.name} — ${PLANS.find(p => p.id === selectedPlan)?.price}`}
            </button>
            <p style={{ color: '#444', fontSize: '0.75rem', textAlign: 'center', marginTop: '0.75rem' }}>Cancel anytime. No contracts. Billed monthly.</p>
          </div>
        )}

        {/* Social proof */}
        <div style={{ textAlign: 'center', marginTop: '4rem', padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.7' }}>
            "SayPay reviews convert better than Yelp or Google. When customers see that someone paid $0.99 to leave a review, they trust it instantly."
          </p>
          <p style={{ color: '#ff006e', fontWeight: '700', fontSize: '0.85rem', marginTop: '0.75rem' }}>— Restaurant owner, Washington DC</p>
        </div>
      </div>
    </div>
  )
}
