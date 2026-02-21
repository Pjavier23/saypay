import { useRouter } from 'next/router'
import Link from 'next/link'

const mockRestaurants: { [key: number]: any } = {
  1: {
    id: 1,
    name: 'Chipotle',
    location: 'Dupont Circle, DC',
    rating: 4.2,
    cuisine: 'Mexican',
    address: '1501 Connecticut Ave NW, Washington, DC 20036',
    hours: 'Mon-Sun 10:45 AM - 10:00 PM',
    phone: '(202) 555-0123',
  },
  2: {
    id: 2,
    name: 'Sweetgreen',
    location: 'Downtown DC',
    rating: 4.5,
    cuisine: 'Salads',
    address: '1025 Vermont Ave NW, Washington, DC 20005',
    hours: 'Mon-Fri 6:30 AM - 8:00 PM, Sat-Sun 8:00 AM - 8:00 PM',
    phone: '(202) 555-0124',
  },
  3: {
    id: 3,
    name: 'Shake Shack',
    location: 'Navy Yard, DC',
    rating: 4.1,
    cuisine: 'Burgers',
    address: '1221 Van St SE, Washington, DC 20003',
    hours: 'Mon-Sun 11:00 AM - 11:00 PM',
    phone: '(202) 555-0125',
  },
  4: {
    id: 4,
    name: 'Chick-fil-A',
    location: 'Gallery Place, DC',
    rating: 4.3,
    cuisine: 'Chicken',
    address: '701 8th St NW, Washington, DC 20001',
    hours: 'Mon-Sat 6:30 AM - 9:00 PM, Closed Sundays',
    phone: '(202) 555-0126',
  },
  5: {
    id: 5,
    name: 'Thai Orchid',
    location: 'Georgetown, DC',
    rating: 4.4,
    cuisine: 'Thai',
    address: '3241 M St NW, Washington, DC 20007',
    hours: 'Mon-Sun 11:30 AM - 10:30 PM',
    phone: '(202) 555-0127',
  },
  6: {
    id: 6,
    name: 'Panda Express',
    location: 'Bethesda, MD',
    rating: 3.8,
    cuisine: 'Chinese',
    address: '4815 Bethesda Ave, Bethesda, MD 20814',
    hours: 'Mon-Sun 10:30 AM - 9:00 PM',
    phone: '(301) 555-0128',
  },
}

const mockReviews = [
  { id: 1, author: 'Pedro Guerrero', userId: 'pedro', rating: 5, text: 'Amazing fresh ingredients! Best burrito bowl I\'ve had.', date: '2 days ago', paid: true },
  { id: 2, author: 'Marcus Williams', userId: 'marcus', rating: 4, text: 'Good quality, but the flavors could be bolder. Still solid though.', date: '1 week ago', paid: true },
  { id: 3, author: 'Alice Chen', userId: 'alice', rating: 5, text: 'Staff is super friendly and efficient. Highly recommend!', date: '2 weeks ago', paid: true },
  { id: 4, author: 'David L.', userId: null, rating: 3, text: 'Decent food but the line is always crazy long.', date: '1 month ago', paid: true },
]

export default function RestaurantDetail() {
  const router = useRouter()
  const { id } = router.query
  const restaurant = id ? mockRestaurants[parseInt(id as string)] : null

  if (!restaurant) {
    return <div style={{ background: '#0a0a0a', color: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>
  }

  const handleReview = async () => {
    // For now, redirect to Stripe checkout
    // In production, this would be a full review form
    window.location.href = 'https://buy.stripe.com/test' // Placeholder - would use real Stripe link
  }

  return (
    <div style={{ background: '#0a0a0a', color: '#fff', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 50,
        background: 'rgba(10, 10, 10, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '1rem 2rem',
      }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', cursor: 'pointer' }}>
              SayPay
            </span>
          </Link>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/" style={{ textDecoration: 'none', color: '#999', cursor: 'pointer' }}>Home</Link>
            <Link href="/restaurants" style={{ textDecoration: 'none', color: '#999', cursor: 'pointer' }}>Restaurants</Link>
          </div>
        </div>
      </header>

      {/* Restaurant Header */}
      <section style={{ padding: '8rem 2rem 4rem', background: 'linear-gradient(180deg, rgba(168, 85, 247, 0.1) 0%, rgba(10, 10, 10, 0) 100%)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '3rem' }}>
            <div>
              <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem' }}>{restaurant.name}</h1>
              <p style={{ color: '#999', fontSize: '1.125rem', marginBottom: '1rem' }}>📍 {restaurant.location}</p>
              <div style={{ display: 'flex', gap: '2rem', color: '#999' }}>
                <span>⭐ {restaurant.rating} rating</span>
                <span>🍽️ {restaurant.cuisine}</span>
              </div>
            </div>
            <button
              onClick={handleReview}
              style={{
                background: '#9333ea',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '0.5rem',
                border: 'none',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '1rem',
                boxShadow: '0 0 40px rgba(168, 85, 247, 0.3)',
              }}
            >
              💬 Write a Review ($0.99)
            </button>
          </div>

          {/* Info */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            padding: '2rem',
            borderRadius: '1rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <div>
              <p style={{ color: '#737373', marginBottom: '0.5rem' }}>Address</p>
              <p>{restaurant.address}</p>
            </div>
            <div>
              <p style={{ color: '#737373', marginBottom: '0.5rem' }}>Hours</p>
              <p>{restaurant.hours}</p>
            </div>
            <div>
              <p style={{ color: '#737373', marginBottom: '0.5rem' }}>Phone</p>
              <p>{restaurant.phone}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section style={{ padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '3rem' }}>Reviews ({mockReviews.length})</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {mockReviews.map(review => (
              <div
                key={review.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  padding: '1.5rem',
                  borderRadius: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div>
                    {review.userId ? (
                      <Link href={`/profile/${review.userId}`} style={{ textDecoration: 'none' }}>
                        <h3 style={{ fontWeight: 700, marginBottom: '0.25rem', color: '#a855f7', cursor: 'pointer' }}>{review.author}</h3>
                      </Link>
                    ) : (
                      <h3 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{review.author}</h3>
                    )}
                    <p style={{ color: '#737373', fontSize: '0.875rem' }}>{review.date}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span>{'⭐'.repeat(review.rating)}</span>
                    {review.paid && <span style={{ background: '#10b981', padding: '0.25rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: '600' }}>Verified</span>}
                  </div>
                </div>
                <p style={{ color: '#d1d5db' }}>{review.text}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{
            marginTop: '4rem',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            padding: '3rem',
            borderRadius: '1rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center',
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Have you been here?</h3>
            <p style={{ color: '#999', marginBottom: '2rem' }}>Share your genuine opinion and help others make better decisions.</p>
            <button
              onClick={handleReview}
              style={{
                background: '#9333ea',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '0.5rem',
                border: 'none',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '1rem',
                boxShadow: '0 0 40px rgba(168, 85, 247, 0.3)',
              }}
            >
              Write a Review for $0.99
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', padding: '2rem', marginTop: '4rem', textAlign: 'center', color: '#737373', fontSize: '0.875rem' }}>
        <p>© 2025 SayPay. Every word means something.</p>
      </footer>
    </div>
  )
}
