import Logo from './Logo'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(255,255,255,0.07)',
      padding: 'clamp(1.5rem, 4vw, 2.5rem) clamp(1rem, 4vw, 1.5rem)',
      textAlign: 'center',
      color: '#444',
      fontSize: '0.875rem',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'center' }}>
          <Logo size="sm" />
        </div>
        <div
          className="footer-links"
          style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.25rem' }}
        >
          <Link href="/explore" style={{ color: '#555', textDecoration: 'none' }}>Explore</Link>
          <Link href="/leaderboards" style={{ color: '#555', textDecoration: 'none' }}>Leaderboard</Link>
          <Link href="/campaigns" style={{ color: '#555', textDecoration: 'none' }}>For Businesses</Link>
          <Link href="/login" style={{ color: '#555', textDecoration: 'none' }}>Login</Link>
          <Link href="/signup" style={{ color: '#555', textDecoration: 'none' }}>Sign Up</Link>
        </div>
        <p style={{ margin: 0 }}>© {new Date().getFullYear()} SayPay. Your opinion. Your truth. Verified.</p>
      </div>
    </footer>
  )
}
