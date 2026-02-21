'use client'

import { useState } from 'react'

const actions = [
  { icon: '📝', label: 'Verified Review', price: '$0.99', desc: 'Your opinion, backed by skin in the game.' },
  { icon: '⬆️', label: 'Upvote', price: '$0.99', desc: 'Bring back a dish, product, or idea you love.' },
  { icon: '💛', label: 'Tip', price: 'Any amount', desc: 'Show a chef or creator real appreciation.' },
  { icon: '🎯', label: 'Community Campaign', price: '$3.00', desc: 'Rally the crowd around something worth fighting for.' },
]

const steps = [
  { step: '01', title: 'Find a business', desc: 'Search any restaurant, brand, or creator on SayPay.' },
  { step: '02', title: 'Pay to say', desc: 'A small fee ensures you mean every word you write.' },
  { step: '03', title: 'Build real trust', desc: 'Your review carries weight because it cost something.' },
]

const stats = [
  { value: '0%', label: 'Bot reviews possible' },
  { value: '$0.99', label: 'Lowest barrier to entry' },
  { value: '100%', label: 'Verified human opinions' },
]

export default function Home() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur px-6 py-4 flex justify-between items-center border-b border-white/10">
        <span className="text-xl font-bold" style={{
          background: 'linear-gradient(135deg, #a855f7, #ec4899, #f59e0b)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>SayPay</span>
        <div className="flex gap-6 items-center text-sm text-gray-400">
          <a href="#how" className="hover:text-white transition">How it works</a>
          <a href="#pricing" className="hover:text-white transition">Pricing</a>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full text-sm font-medium transition">
            Get Early Access
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20">
        {/* Background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur px-4 py-2 rounded-full text-sm text-purple-300 mb-8 border border-white/10">
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
            The end of fake reviews
          </div>

          <h1 className="text-6xl md:text-8xl font-black leading-none mb-6">
            Reviews that<br />
            <span style={{
              background: 'linear-gradient(135deg, #a855f7, #ec4899, #f59e0b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>mean something.</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            SayPay charges a small fee to leave a review — making spam economically worthless
            and every real opinion genuinely valuable.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {!submitted ? (
              <>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-full px-6 py-3 text-white placeholder-gray-500 outline-none focus:border-purple-500 w-72"
                />
                <button
                  onClick={() => { if (email) setSubmitted(true) }}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-semibold transition"
                  style={{ boxShadow: '0 0 40px rgba(168,85,247,0.3)' }}
                >
                  Get Early Access
                </button>
              </>
            ) : (
              <div className="bg-white/5 backdrop-blur px-8 py-3 rounded-full text-purple-300 font-medium border border-white/10">
                ✅ You're on the list! We'll be in touch.
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-12 justify-center mt-16">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-black" style={{
                  background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>{s.value}</div>
                <div className="text-sm text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-black mb-6">
          Fake reviews are{' '}
          <span style={{
            background: 'linear-gradient(135deg, #a855f7, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>destroying trust.</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Google, Yelp, and Amazon are flooded with bots, paid shills, and competitor sabotage.
          Nobody knows what to believe. SayPay fixes this with one simple idea:
          <strong className="text-white"> if it costs something, it means something.</strong>
        </p>
      </section>

      {/* Actions / Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-4">Every action costs a little.</h2>
          <p className="text-gray-400 text-center mb-16">That's the point.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {actions.map(a => (
              <div key={a.label} className="bg-white/5 backdrop-blur rounded-2xl p-6 hover:border-purple-500/50 hover:bg-white/10 transition border border-white/10 group">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-3xl">{a.icon}</span>
                    <h3 className="text-xl font-bold mt-2">{a.label}</h3>
                  </div>
                  <span className="text-purple-400 font-black text-2xl">{a.price}</span>
                </div>
                <p className="text-gray-400 text-sm">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 px-6 max-w-4xl mx-auto">
        <h2 className="text-4xl font-black text-center mb-16">How it works</h2>
        <div className="space-y-8">
          {steps.map(s => (
            <div key={s.step} className="flex gap-6 items-start bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
              <span className="text-purple-500 font-black text-4xl leading-none">{s.step}</span>
              <div>
                <h3 className="text-xl font-bold mb-1">{s.title}</h3>
                <p className="text-gray-400">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Business CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur rounded-3xl p-12 text-center relative overflow-hidden border border-white/10">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-pink-900/20 pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-4xl font-black mb-4">Are you a business?</h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Get real consumer demand data — not vanity metrics. Know exactly what your customers
              actually want, backed by what they paid to say.
            </p>
            <button className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition">
              Talk to us about B2B →
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 px-6 text-center text-gray-600 text-sm">
        <span className="font-bold text-lg" style={{
          background: 'linear-gradient(135deg, #a855f7, #ec4899)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>SayPay</span>
        <p className="mt-2">© 2025 SayPay. Every word means something.</p>
      </footer>

    </main>
  )
}
