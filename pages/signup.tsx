import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

export default function Signup() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (username.length < 3) {
      setError('Username must be at least 3 characters')
      setLoading(false)
      return
    }

    // Check username taken
    const { data: existing } = await supabase
      .from('sp_profiles')
      .select('id')
      .eq('username', username.toLowerCase())
      .single()

    if (existing) {
      setError('Username already taken')
      setLoading(false)
      return
    }

    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName || username } },
    })

    if (signupError) { setError(signupError.message); setLoading(false); return }

    if (data.user) {
      // Create profile
      const { error: profileError } = await supabase
        .from('sp_profiles')
        .insert({
          id: data.user.id,
          username: username.toLowerCase(),
          display_name: displayName || username,
        })

      if (profileError) {
        setError(profileError.message)
        setLoading(false)
        return
      }
    }

    router.push('/dashboard?welcome=1')
  }

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '2rem', fontWeight: '900', background: 'linear-gradient(135deg, #ff006e, #1dd1dd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              SayPay
            </span>
          </Link>
          <p style={{ color: '#666', marginTop: '0.75rem' }}>Your opinion matters. Prove it.</p>
        </div>

        <form onSubmit={handleSignup} style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '1.5rem',
          padding: '2.5rem',
        }}>
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
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
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
            style={{ width: '100%', background: loading ? 'rgba(255,0,110,0.4)' : 'linear-gradient(135deg, #ff006e, #ffdd00)', color: '#000', padding: '1rem', borderRadius: '0.75rem', border: 'none', fontWeight: '800', fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Creating your account...' : 'Create Account — Free →'}
          </button>

          <p style={{ textAlign: 'center', color: '#666', marginTop: '1.5rem', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#ff006e', fontWeight: '700', textDecoration: 'none' }}>Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
