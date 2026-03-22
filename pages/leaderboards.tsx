import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from './_app'

const RANK_COLORS = ['#ffdd00', '#c0c0c0', '#cd7f32']
const RANK_EMOJIS = ['🥇', '🥈', '🥉']

export default function Leaderboard() {
  const { user } = useAuth()
  const [leaders, setLeaders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchLeaders() }, [])

  async function fetchLeaders() {
    const res = await fetch('/api/leaderboard')
    const data = await res.json()
    setLeaders(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  return (
    <div style={{ background: '#0a0a0a', color: '#fff', minHeight: '100vh' }}>
      {/* Nav */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '1rem 2rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: '900', background: 'linear-gradient(135deg, #ff006e, #1dd1dd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SayPay</span>
          </Link>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link href="/explore" style={{ color: '#888', textDecoration: 'none', fontSize: '0.9rem' }}>Explore</Link>
            {user
              ? <Link href="/dashboard" style={{ color: '#ff006e', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '700' }}>Dashboard</Link>
              : <Link href="/signup"><button style={{ background: 'linear-gradient(135deg, #ff006e, #ffdd00)', color: '#000', padding: '0.5rem 1.25rem', borderRadius: '9999px', border: 'none', fontWeight: '800', cursor: 'pointer', fontSize: '0.85rem' }}>Join</button></Link>
            }
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem 4rem' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '0.5rem' }}>
            Top{' '}
            <span style={{ background: 'linear-gradient(135deg, #ffdd00, #ff886e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Reviewers
            </span>
          </h1>
          <p style={{ color: '#666', fontSize: '1rem' }}>
            Ranked by helpful votes. These are the voices the world trusts most.
          </p>
        </div>

        {/* Podium for top 3 */}
        {!loading && leaders.length >= 3 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr 1fr', gap: '0.75rem', marginBottom: '2.5rem' }}>
            {[leaders[1], leaders[0], leaders[2]].map((leader, podiumIdx) => {
              const actualRank = podiumIdx === 0 ? 2 : podiumIdx === 1 ? 1 : 3
              const actualLeader = leader
              const displayName = actualLeader?.display_name || actualLeader?.username || 'Reviewer'
              return (
                <div
                  key={actualLeader?.id}
                  style={{
                    background: actualRank === 1 ? 'rgba(255,221,0,0.08)' : 'rgba(255,255,255,0.03)',
                    border: actualRank === 1 ? '2px solid rgba(255,221,0,0.4)' : '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '1.25rem',
                    padding: '1.5rem 1rem',
                    textAlign: 'center',
                    boxShadow: actualRank === 1 ? '0 0 30px rgba(255,221,0,0.15)' : 'none',
                    marginTop: actualRank === 1 ? '0' : '1.5rem',
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{RANK_EMOJIS[actualRank - 1]}</div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #ff006e, #1dd1dd)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1.2rem', color: '#fff', margin: '0 auto 0.75rem' }}>
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ fontWeight: '800', fontSize: '0.95rem', marginBottom: '0.25rem' }}>{displayName}</div>
                  {actualLeader?.is_elite && (
                    <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, #ff006e, #ffdd00)', color: '#000', fontSize: '0.6rem', padding: '0.1rem 0.5rem', borderRadius: '9999px', fontWeight: '800', marginBottom: '0.5rem' }}>ELITE</div>
                  )}
                  <div style={{ color: RANK_COLORS[actualRank - 1], fontWeight: '800', fontSize: '1.1rem' }}>{actualLeader?.total_helpful}</div>
                  <div style={{ color: '#555', fontSize: '0.75rem' }}>helpful votes</div>
                </div>
              )
            })}
          </div>
        )}

        {/* Full list */}
        {loading ? (
          <div style={{ textAlign: 'center', color: '#555', padding: '3rem' }}>Loading...</div>
        ) : leaders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(255,255,255,0.02)', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.06)', color: '#555' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✍️</div>
            <p>No reviewers yet. Be the first to write a verified review!</p>
            <Link href={user ? '/explore' : '/signup'}>
              <button style={{ marginTop: '1rem', background: 'linear-gradient(135deg, #ff006e, #ffdd00)', color: '#000', padding: '0.75rem 2rem', borderRadius: '9999px', border: 'none', fontWeight: '800', cursor: 'pointer' }}>
                Write the First Review
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {leaders.map((leader, idx) => {
              const displayName = leader.display_name || leader.username || 'Reviewer'
              const rank = idx + 1
              return (
                <div
                  key={leader.id}
                  style={{
                    background: rank <= 3 ? `rgba(${rank === 1 ? '255,221,0' : rank === 2 ? '192,192,192' : '205,127,50'},0.05)` : 'rgba(255,255,255,0.02)',
                    border: rank <= 3 ? `1px solid rgba(${rank === 1 ? '255,221,0' : rank === 2 ? '192,192,192' : '205,127,50'},0.2)` : '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '1rem',
                    padding: '1rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  <div style={{ width: '32px', textAlign: 'center', fontWeight: '900', fontSize: rank <= 3 ? '1.25rem' : '1rem', color: rank <= 3 ? RANK_COLORS[rank - 1] : '#444', flexShrink: 0 }}>
                    {rank <= 3 ? RANK_EMOJIS[rank - 1] : `#${rank}`}
                  </div>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #ff006e, #1dd1dd)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: '#fff', flexShrink: 0 }}>
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {displayName}
                      {leader.is_elite && <span style={{ background: 'linear-gradient(135deg, #ff006e, #ffdd00)', color: '#000', fontSize: '0.6rem', padding: '0.1rem 0.4rem', borderRadius: '9999px', fontWeight: '800' }}>ELITE</span>}
                    </div>
                    <div style={{ color: '#555', fontSize: '0.8rem' }}>{leader.total_reviews} verified reviews</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '800', color: rank <= 3 ? RANK_COLORS[rank - 1] : '#fff' }}>{leader.total_helpful}</div>
                    <div style={{ color: '#555', fontSize: '0.75rem' }}>helpful</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '3rem', background: 'rgba(255,0,110,0.05)', border: '1px solid rgba(255,0,110,0.15)', borderRadius: '1.25rem', padding: '2rem' }}>
          <p style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Want your name up here? 👆</p>
          <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.25rem' }}>Every helpful vote you earn moves you up. Write great reviews, climb the ranks.</p>
          <Link href={user ? '/explore' : '/signup'}>
            <button style={{ background: 'linear-gradient(135deg, #ff006e, #ffdd00)', color: '#000', padding: '0.75rem 2rem', borderRadius: '9999px', border: 'none', fontWeight: '800', cursor: 'pointer' }}>
              {user ? 'Write a Review →' : 'Get Started Free →'}
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
