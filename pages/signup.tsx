import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import Logo from '../components/Logo'

export default function Signup() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (username.length < 3) {
      setError('Username must be at least 3 characters')
      setLoading(false)
      return
    }

    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName || username } },
    })

    if (signupError) {
      const msg = signupError.message
      if (msg.includes('already registered') || msg.includes('already been registered')) {
        setError('That email is already registered. Try logging in instead.')
      } else if (msg.includes('rate limit') || msg.includes('too many')) {
        setError('Too many signups. Please wait a few minutes and try again.')
      } else if (msg.includes('password')) {
        setError('Password must be at least 6 characters.')
      } else {
        setError(msg)
      }
      setLoading(false)
      return
    }

    if (data.user) {
      // Small delay to let Supabase session propagate, then create profile via service role
      await new Promise(r => setTimeout(r, 600))

      const profileRes = await fetch('/api/auth/create-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: data.user.id,
          username: username.toLowerCase(),
          displayName: displayName || username,
          email,
        }),
      })
      const profileData = await profileRes.json()
      if (!profileRes.ok) {
        setError(profileData.error || 'Failed to create profile')
        setLoading(false)
        return
      }
    }

    // Show success state, then redirect
    setSuccess(true)
    setLoading(false)
    setTimeout(() => router.push('/dashboard?welcome=1'), 2000)
  }

  return (
    <div
      className="auth-outer"
      style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(1rem,4vw,2rem)' }}
    >
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
            <Logo size="md" />
          </div>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>Your opinion matters. Prove it.</p>
        </div>

        {success ? (
          <div style={{
            background: 'rgba(29,209,221,0.12)', border: '1px solid rgba(29,209,221,0.3)',
            borderRadius: '1.5rem', padding: '2.5rem', textAlign: 'center',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
            <h2 style={{ fontWeight: 900, marginBottom: '0.5rem' }}>Account created!</h2>
            <p style={{ color: '#888', marginBottom: '0' }}>Check your email for a welcome message. Redirecting to your dashboard…</p>
          </div>
        ) : (
          <form
            onSubmit={handleSignup}
            className="auth-form-wrap"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '1.5rem',
              padding: 'clamp(1.25rem,4vw,2.5rem)',
            }}
          >
            {error && (
              <div style={{ background: 'rgba(255,0,110,0.15)', border: '1px solid rgba(255,0,110,0.4)', borderRadius: '0.75rem', padding: '1rem', color: '#ff006e', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                {error}
              </div>
            )}

            {[
              { label: 'Display Name', value: displayName, setter: setDisplayName, type: 'text', placeholder: 'Pedro G.' },
              { label: 'Username', value: username, setter: setUsername, type: 'text', placeholder: 'pedrog (no spaces)' },
              { label: 'Email', value: email, setter: setEmail, type: 'email', placeholder: 'you@example.com' },
              { label: 'Password', value: password, setter: setPassword, type: 'password', placeholder: '8+ characters' },
            ].map(({ label, value, setter, type, placeholder }) => (
              <div key={label} style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', color: '#aaa', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
                <input
                  type={type}
                  value={value}
                  onChange={e => setter(e.target.value)}
                  required
                  placeholder={placeholder}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '0.75rem', padding: '0.875rem 1rem', color: '#fff', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            ))}

            <div style={{ background: 'rgba(29,209,221,0.08)', border: '1px solid rgba(29,209,221,0.2)', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.5rem', marginTop: '0.5rem' }}>
              <p style={{ color: '#1dd1dd', fontSize: '0.85rem', margin: 0 }}>
                🔒 Free to sign up. You only pay $0.99 when you publish a review — that's what makes your voice trusted.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', background: loading ? 'rgba(255,0,110,0.4)' : 'linear-gradient(135deg, #ff006e, #ffdd00)', color: '#000', padding: '1rem', borderRadius: '0.75rem', border: 'none', fontWeight: 800, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Creating your account…' : 'Create Account — Free →'}
            </button>

            <p style={{ textAlign: 'center', color: '#666', marginTop: '1.5rem', fontSize: '0.9rem' }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: '#ff006e', fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
