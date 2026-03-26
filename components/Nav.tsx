import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../pages/_app'
import Logo from './Logo'

export default function Nav() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const linkStyle = (path: string) => ({
    color: router.pathname === path ? '#fff' : '#888',
    textDecoration: 'none',
    fontWeight: 600 as const,
    fontSize: '0.9rem',
    padding: '0.5rem 0.875rem',
    borderRadius: '0.5rem',
    background: router.pathname === path ? 'rgba(255,255,255,0.06)' : 'transparent',
    whiteSpace: 'nowrap' as const,
  })

  return (
    <header style={{
      position: 'fixed', top: 0, width: '100%', zIndex: 50,
      background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div
        className="nav-inner"
        style={{
          maxWidth: '1200px', margin: '0 auto',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '0.875rem 1.5rem',
        }}
      >
        <Logo size="sm" />

        {/* Desktop nav */}
        <nav className="nav-links-desktop" style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
          <Link href="/explore" style={linkStyle('/explore')}>Explore</Link>
          <Link href="/leaderboards" style={linkStyle('/leaderboards')}>Leaderboard</Link>

          {user ? (
            <>
              <Link href="/dashboard">
                <button style={{
                  background: 'rgba(255,0,110,0.12)', color: '#ff006e',
                  border: '1px solid rgba(255,0,110,0.25)',
                  padding: '0.5rem 1.1rem', borderRadius: '9999px',
                  fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem',
                  marginLeft: '0.5rem',
                }}>Dashboard</button>
              </Link>
              <button
                onClick={() => { signOut(); router.push('/') }}
                style={{
                  background: 'transparent', color: '#555',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '0.5rem 1rem', borderRadius: '9999px',
                  fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem',
                }}
              >Sign out</button>
            </>
          ) : (
            <>
              <Link href="/login" style={{
                color: '#aaa', textDecoration: 'none', fontWeight: 600,
                fontSize: '0.9rem', padding: '0.5rem 0.875rem',
              }}>Log In</Link>
              <Link href="/signup">
                <button style={{
                  background: 'linear-gradient(135deg, #ff006e, #ffdd00)',
                  color: '#000', padding: '0.55rem 1.25rem', borderRadius: '9999px',
                  border: 'none', fontWeight: 800, cursor: 'pointer', fontSize: '0.875rem',
                }}>Sign Up</button>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile CTA — hidden on desktop via CSS */}
        <div
          className="nav-mobile-cta"
          style={{ display: 'none', alignItems: 'center', gap: '0.5rem' }}
        >
          {user ? (
            <>
              <Link href="/dashboard">
                <button style={{
                  background: 'rgba(255,0,110,0.12)', color: '#ff006e',
                  border: '1px solid rgba(255,0,110,0.25)',
                  padding: '0.45rem 0.9rem', borderRadius: '9999px',
                  fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem',
                }}>Dashboard</button>
              </Link>
              <button
                onClick={() => { setMobileOpen(!mobileOpen) }}
                style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.25rem', padding: '0.25rem' }}
                aria-label="Menu"
              >☰</button>
            </>
          ) : (
            <>
              <Link href="/login" style={{ color: '#aaa', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem' }}>Log In</Link>
              <Link href="/signup">
                <button style={{
                  background: 'linear-gradient(135deg, #ff006e, #ffdd00)',
                  color: '#000', padding: '0.45rem 0.9rem', borderRadius: '9999px',
                  border: 'none', fontWeight: 800, cursor: 'pointer', fontSize: '0.8rem',
                }}>Sign Up</button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && user && (
        <div style={{
          background: 'rgba(10,10,10,0.98)', borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem',
        }}>
          <Link href="/explore" onClick={() => setMobileOpen(false)} style={{ color: '#bbb', textDecoration: 'none', padding: '0.6rem 0.5rem', fontWeight: 600, fontSize: '0.95rem' }}>Explore</Link>
          <Link href="/leaderboards" onClick={() => setMobileOpen(false)} style={{ color: '#bbb', textDecoration: 'none', padding: '0.6rem 0.5rem', fontWeight: 600, fontSize: '0.95rem' }}>Leaderboard</Link>
          <button
            onClick={() => { setMobileOpen(false); signOut(); router.push('/') }}
            style={{ background: 'none', border: 'none', color: '#666', textAlign: 'left', padding: '0.6rem 0.5rem', cursor: 'pointer', fontSize: '0.95rem' }}
          >Sign out</button>
        </div>
      )}
    </header>
  )
}
