export function BusinessCardSkeleton() {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '1.25rem', overflow: 'hidden',
    }}>
      <div style={{ height: '155px', background: 'rgba(255,255,255,0.05)' }} className="skeleton-pulse" />
      <div style={{ padding: '1.1rem' }}>
        <div style={{ height: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.4rem', marginBottom: '0.5rem', width: '70%' }} className="skeleton-pulse" />
        <div style={{ height: '0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.4rem', marginBottom: '0.75rem', width: '50%' }} className="skeleton-pulse" />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ height: '0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.4rem', width: '40%' }} className="skeleton-pulse" />
          <div style={{ height: '0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.4rem', width: '30%' }} className="skeleton-pulse" />
        </div>
      </div>
    </div>
  )
}

export function ReviewCardSkeleton() {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '1.25rem', padding: '1.5rem',
    }}>
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', flexShrink: 0 }} className="skeleton-pulse" />
        <div style={{ flex: 1 }}>
          <div style={{ height: '0.875rem', background: 'rgba(255,255,255,0.06)', borderRadius: '0.4rem', marginBottom: '0.4rem', width: '40%' }} className="skeleton-pulse" />
          <div style={{ height: '0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.4rem', width: '60%' }} className="skeleton-pulse" />
        </div>
      </div>
      <div style={{ height: '0.875rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.4rem', marginBottom: '0.4rem' }} className="skeleton-pulse" />
      <div style={{ height: '0.875rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.4rem', marginBottom: '0.4rem', width: '80%' }} className="skeleton-pulse" />
      <div style={{ height: '0.875rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.4rem', width: '60%' }} className="skeleton-pulse" />
    </div>
  )
}
