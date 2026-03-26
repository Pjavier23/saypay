import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../pages/_app'

export default function Nav() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  return (
    <header style={{
      position: 'fixed', top: 0, width: '100%', zIndex: 50,
      background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div style={{
        maxWidth: '1200px', margin: '0 auto',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0.875rem 1.5rem',
      }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            fontSize: '1.5rem', fontWeight: '900',
            background: 'linear-gradient(135deg, #ff006e, #1dd1dd)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>SayPay</span>
        </Link>

        <nav style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
          <Link href="/explore" style={{
            color: router.pathname === '/explore' ? '#fff' : '#888',
            textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem',
            padding: '0.5rem 0.875rem', borderRadius: '0.5rem',
            background: router.pathname === '/explore' ? 'rgba(255,255,255,0.06)' : 'transparent',
          }}>Explore</Link>
          <Link href="/leaderboards" style={{
            color: router.pathname === '/leaderboards' ? '#fff' : '#888',
            textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem',
            padding: '0.5rem 0.875rem', borderRadius: '0.5rem',
          }}>Leaderboard</Link>

          {user ? (
            <>
              <Link href="/dashboard">
                <button style={{
                  background: 'rgba(255,0,110,0.12)', color: '#ff006e',
                  border: '1px solid rgba(255,0,110,0.25)',
                  padding: '0.5rem 1.1rem', borderRadius: '9999px',
                  fontWeight: '700', cursor: 'pointer', fontSize: '0.875rem',
                  marginLeft: '0.5rem',
                }}>My Reviews</button>
              </Link>
              <button
                onClick={() => { signOut(); router.push('/') }}
                style={{
                  background: 'transparent', color: '#555',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '0.5rem 1rem', borderRadius: '9999px',
                  fontWeight: '600', cursor: 'pointer', fontSize: '0.85rem',
                }}
              >Sign out</button>
            </>
          ) : (
            <>
              <Link href="/login" style={{
                color: '#aaa', textDecoration: 'none', fontWeight: '600',
                fontSize: '0.9rem', padding: '0.5rem 0.875rem',
              }}>Log in</Link>
              <Link href="/signup">
                <button style={{
                  background: 'linear-gradient(135deg, #ff006e, #ffdd00)',
                  color: '#000', padding: '0.55rem 1.25rem', borderRadius: '9999px',
                  border: 'none', fontWeight: '800', cursor: 'pointer', fontSize: '0.875rem',
                }}>Get Started</button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
