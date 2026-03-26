import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import Logo from '../components/Logo'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: loginErr } = await supabase.auth.signInWithPassword({ email, password })
    if (loginErr) { setError(loginErr.message); setLoading(false) }
    else router.push('/dashboard')
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
          <p style={{ color: '#666', marginTop: '0.5rem', fontSize: '1rem' }}>Welcome back. Your opinions await.</p>
        </div>

        <form
          onSubmit={handleLogin}
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

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', color: '#aaa', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '0.75rem', padding: '0.875rem 1rem', color: '#fff', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', color: '#aaa', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '0.75rem', padding: '0.875rem 1rem', color: '#fff', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', background: loading ? 'rgba(255,0,110,0.4)' : 'linear-gradient(135deg, #ff006e, #ffdd00)', color: '#000', padding: '1rem', borderRadius: '0.75rem', border: 'none', fontWeight: 800, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
          >
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>

          <p style={{ textAlign: 'center', color: '#666', marginTop: '1.5rem', fontSize: '0.9rem' }}>
            No account?{' '}
            <Link href="/signup" style={{ color: '#ff006e', fontWeight: 700, textDecoration: 'none' }}>Sign up for free</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
