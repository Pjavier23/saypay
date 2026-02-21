import { useState } from 'react'

const actions = [
  { icon: '📝', label: 'Verified Review', price: '$0.99', desc: 'Your opinion, backed by skin in the game.' },
  { icon: '⬆️', label: 'Upvote', price: '$0.99', desc: 'Bring back a dish or product you love.' },
  { icon: '💛', label: 'Tip Creator', price: 'Any amount', desc: 'Show real appreciation for great work.' },
  { icon: '🎯', label: 'Community Campaign', price: '$3.00', desc: 'Rally support for something that matters.' },
]

const steps = [
  { num: '01', title: 'Find a Business', desc: 'Search restaurants, brands, creators on SayPay.' },
  { num: '02', title: 'Pay to Share', desc: 'A small fee ensures every word matters.' },
  { num: '03', title: 'Build Trust', desc: 'Your review carries real weight.' },
]

export default function Home() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
    <div style={{ background: '#0a0a0a', color: '#fff' }}>
      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 50,
        background: 'rgba(10, 10, 10, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          SayPay
        </span>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', fontSize: '0.875rem', color: '#999' }}>
          <a href="#how" style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}>How it works</a>
          <a href="#pricing" style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}>Pricing</a>
          <button style={{
            background: '#9333ea',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '9999px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500',
          }}>
            Get Early Access
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '6rem 1.5rem 2rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Glow effect */}
        <div style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%)',
          filter: 'blur(120px)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '56rem', position: 'relative', zIndex: 10 }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            padding: '0.5rem 1rem',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            color: '#c084fc',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '2rem',
          }}>
            <span style={{ width: '0.5rem', height: '0.5rem', background: '#a78bfa', borderRadius: '50%', animation: 'pulse 2s ease-in-out infinite' }} />
            The end of fake reviews
          </div>

          {/* Hero Headline */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 8vw, 5rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: '1.5rem',
          }}>
            Reviews that<br />
            <span style={{
              background: 'linear-gradient(135deg, #a855f7, #ec4899, #f59e0b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              mean something.
            </span>
          </h1>

          {/* Subheading */}
          <p style={{ fontSize: '1.25rem', color: '#a3a3a3', maxWidth: '42rem', margin: '0 auto 2.5rem' }}>
            SayPay charges a small fee to leave a review — making spam economically worthless and every real opinion genuinely valuable.
          </p>

          {/* CTA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            {!submitted ? (
              <>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '9999px',
                    padding: '0.75rem 1.5rem',
                    color: 'white',
                    width: '18rem',
                    outline: 'none',
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = '#a855f7'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
                />
                <button
                  onClick={() => { if (email) setSubmitted(true) }}
                  style={{
                    background: '#9333ea',
                    color: 'white',
                    padding: '0.75rem 2rem',
                    borderRadius: '9999px',
                    border: 'none',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 0 40px rgba(168, 85, 247, 0.3)',
                  }}
                >
                  Get Early Access
                </button>
              </>
            ) : (
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', padding: '0.75rem 2rem', borderRadius: '9999px', color: '#c084fc', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                ✅ You're on the list!
              </div>
            )}
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center', marginTop: '4rem', flexWrap: 'wrap' }}>
            {[
              { value: '0%', label: 'Bot reviews' },
              { value: '$0.99', label: 'Entry fee' },
              { value: '100%', label: 'Human verified' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '1.875rem',
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#737373', marginTop: '0.25rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section style={{ padding: '6rem 1.5rem', maxWidth: '56rem', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1.5rem' }}>
          Fake reviews are{' '}
          <span style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            destroying trust.
          </span>
        </h2>
        <p style={{ fontSize: '1.125rem', color: '#a3a3a3', maxWidth: '42rem', margin: '0 auto' }}>
          Google, Yelp, and Amazon are flooded with bots, paid shills, and competitor sabotage. SayPay fixes this with one idea: <strong>if it costs something, it means something.</strong>
        </p>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{ padding: '6rem 1.5rem', background: 'rgba(255, 255, 255, 0.02)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 900, textAlign: 'center', marginBottom: '1rem' }}>Every action costs a little.</h2>
          <p style={{ textAlign: 'center', color: '#737373', marginBottom: '4rem' }}>That's the point.</p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
          }}>
            {actions.map((a, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  padding: '1.5rem',
                  borderRadius: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                  e.currentTarget.style.borderColor = '#a855f7'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{a.icon}</div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{a.label}</h3>
                  </div>
                  <div style={{ color: '#c084fc', fontWeight: 900, fontSize: '1.5rem' }}>{a.price}</div>
                </div>
                <p style={{ color: '#a3a3a3', fontSize: '0.875rem' }}>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" style={{ padding: '6rem 1.5rem', maxWidth: '56rem', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 900, textAlign: 'center', marginBottom: '4rem' }}>How it works</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {steps.map((s, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: '1.5rem',
                alignItems: 'flex-start',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                padding: '1.5rem',
                borderRadius: '1rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <span style={{ color: '#a855f7', fontWeight: 900, fontSize: '2rem', lineHeight: 1 }}>{s.num}</span>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>{s.title}</h3>
                <p style={{ color: '#a3a3a3' }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* B2B CTA */}
      <section style={{ padding: '6rem 1.5rem' }}>
        <div style={{
          maxWidth: '56rem',
          margin: '0 auto',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: '1.5rem',
          padding: '3rem',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom right, rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.05))', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 10 }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem' }}>Are you a business?</h2>
            <p style={{ color: '#a3a3a3', marginBottom: '2rem', maxWidth: '42rem', margin: '0 auto 2rem' }}>
              Get real consumer demand data. Know what customers actually want, backed by what they paid to say.
            </p>
            <button style={{
              background: 'white',
              color: 'black',
              padding: '0.75rem 2rem',
              borderRadius: '9999px',
              border: 'none',
              fontWeight: 700,
              cursor: 'pointer',
            }}>
              Talk to us about B2B →
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', padding: '2.5rem 1.5rem', textAlign: 'center', color: '#737373', fontSize: '0.875rem' }}>
        <span style={{ fontSize: '1.125rem', fontWeight: 700, background: 'linear-gradient(135deg, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          SayPay
        </span>
        <p style={{ marginTop: '0.5rem' }}>© 2025 SayPay. Every word means something.</p>
      </footer>
    </div>
  )
}
