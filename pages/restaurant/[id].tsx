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
  7: {
    id: 7,
    name: 'Thai Orchid',
    location: 'Georgetown, DC',
    rating: 4.4,
    cuisine: 'Thai',
    address: '3241 M St NW, Washington, DC 20007',
    hours: 'Mon-Sun 11:30 AM - 10:30 PM',
    phone: '(202) 555-0129',
  },
  8: {
    id: 8,
    name: 'Pupatella',
    location: 'Navy Yard, DC',
    rating: 4.6,
    cuisine: 'Pizza',
    address: '1250 Van St SE, Washington, DC 20003',
    hours: 'Mon-Sun 12:00 PM - 11:00 PM',
    phone: '(202) 555-0130',
  },
}

const reviewsByRestaurant: { [key: number]: any[] } = {
  1: [ // Chipotle
    { id: 1, author: 'Pedro Guerrero', userId: 'pedro', rating: 5, text: 'Amazing fresh ingredients! The carnitas burrito bowl is absolutely fire. Best in DC.', date: '2 days ago', paidTier: 'standard' },
    { id: 2, author: 'Marcus Williams', userId: 'marcus', rating: 4, text: 'Great customization options. My steak bowl was perfectly seasoned. Wish they had more proteins.', date: '1 week ago', paidTier: 'standard' },
    { id: 3, author: 'Alice Chen', userId: 'alice', rating: 5, text: 'The sofritas are so good. Super fresh veggies and their lime-cilantro rice is perfect.', date: '2 weeks ago', paidTier: 'standard' },
    { id: 4, author: 'David L.', userId: null, rating: 3, text: 'Food is decent but the line is always crazy long during lunch. Maybe come off-peak.', date: '1 month ago', paidTier: 'standard' },
  ],
  2: [ // Sweetgreen
    { id: 1, author: 'Pedro Guerrero', userId: 'pedro', rating: 5, text: 'Honestly the best salad bowl in DC. Their dressing is *chef\'s kiss*. Worth every penny.', date: '2 days ago', paidTier: 'standard' },
    { id: 2, author: 'Marcus Williams', userId: 'marcus', rating: 4, text: 'Super fresh greens and great toppings. The warm grain bowls are solid too. A bit pricey though.', date: '1 week ago', paidTier: 'standard' },
    { id: 3, author: 'Alice Chen', userId: 'alice', rating: 5, text: 'Love how they source local ingredients. The roasted beet salad is incredible.', date: '2 weeks ago', paidTier: 'standard' },
    { id: 4, author: 'Sarah K.', userId: null, rating: 4, text: 'Healthy and tasty. Great for lunch. They move the lines pretty fast.', date: '1 month ago', paidTier: 'standard' },
  ],
  3: [ // Shake Shack
    { id: 1, author: 'Pedro Guerrero', userId: 'pedro', rating: 5, text: 'Their ShackBurger is buttery perfection. The brioche bun is perfectly toasted.', date: '2 days ago', paidTier: 'standard' },
    { id: 2, author: 'Marcus Williams', userId: 'marcus', rating: 4, text: 'Quality beef, crispy fries. A little pricey for a burger but worth it.', date: '1 week ago', paidTier: 'standard' },
    { id: 3, author: 'Alice Chen', userId: 'alice', rating: 4, text: 'Great shakes too! The black and white milkshake is nostalgic and delicious.', date: '2 weeks ago', paidTier: 'standard' },
    { id: 4, author: 'James K.', userId: null, rating: 4, text: 'Consistently good burgers. Friendly staff. Navy Yard location is convenient.', date: '1 month ago', paidTier: 'standard' },
  ],
  4: [ // Chick-fil-A
    { id: 1, author: 'Pedro Guerrero', userId: 'pedro', rating: 5, text: 'Their chicken sandwich is iconic. Perfectly crispy and never dried out. Lemonade is unbeatable.', date: '2 days ago', paidTier: 'standard' },
    { id: 2, author: 'Marcus Williams', userId: 'marcus', rating: 5, text: 'Fast service, amazing chicken. Spicy chicken sandwich > regular. Both are elite.', date: '1 week ago', paidTier: 'standard' },
    { id: 3, author: 'Alice Chen', userId: 'alice', rating: 4, text: 'Classic fast food done right. Waffle fries are addictive. Consistent quality always.', date: '2 weeks ago', paidTier: 'standard' },
    { id: 4, author: 'Maria T.', userId: null, rating: 5, text: 'Best fast food chicken hands down. Staff is actually nice. Worth the wait.', date: '1 month ago', paidTier: 'standard' },
  ],
  5: [ // Thai Orchid
    { id: 1, author: 'Marcus Williams', userId: 'marcus', rating: 5, text: 'Authentic Thai flavors. The pad krapow gai is exceptional. Heat level is perfect.', date: '1 day ago', paidTier: 'standard' },
    { id: 2, author: 'Pedro Guerrero', userId: 'pedro', rating: 4, text: 'Great red curry and pad thai. Portion sizes are generous. Georgetown location is beautiful.', date: '1 week ago', paidTier: 'standard' },
    { id: 3, author: 'Alice Chen', userId: 'alice', rating: 5, text: 'Green curry was amazing. Fresh basil and coconut milk balanced perfectly.', date: '2 weeks ago', paidTier: 'standard' },
    { id: 4, author: 'Tom L.', userId: null, rating: 4, text: 'Delicious authentic Thai. Can get crowded on weekends but worth it.', date: '1 month ago', paidTier: 'standard' },
  ],
  6: [ // Panda Express
    { id: 1, author: 'Sarah M.', userId: null, rating: 4, text: 'Great orange chicken. Perfect balance of sweet and spicy. Fast service.', date: '2 days ago', paidTier: 'standard' },
    { id: 2, author: 'James K.', userId: null, rating: 4, text: 'Solid for what it is. Fried rice is fluffy and flavorful. Good value.', date: '1 week ago', paidTier: 'standard' },
    { id: 3, author: 'David L.', userId: null, rating: 3, text: 'Decent Asian fusion. Not authentic Thai but hits the spot. Bethesda location is convenient.', date: '2 weeks ago', paidTier: 'standard' },
    { id: 4, author: 'Maria T.', userId: null, rating: 4, text: 'Black pepper angus steak is tasty. Consistent quality across locations.', date: '1 month ago', paidTier: 'standard' },
  ],
  7: [ // Thai Orchid
    { id: 1, author: 'Marcus Williams', userId: 'marcus', rating: 5, text: 'Authentic Thai flavors. The pad krapow gai is exceptional. Heat level is perfect.', date: '1 day ago', paidTier: 'standard' },
    { id: 2, author: 'Pedro Guerrero', userId: 'pedro', rating: 4, text: 'Great red curry and pad thai. Portion sizes are generous. Georgetown location is beautiful.', date: '1 week ago', paidTier: 'standard' },
    { id: 3, author: 'Alice Chen', userId: 'alice', rating: 5, text: 'Green curry was amazing. Fresh basil and coconut milk balanced perfectly.', date: '2 weeks ago', paidTier: 'standard' },
    { id: 4, author: 'Tom L.', userId: null, rating: 4, text: 'Delicious authentic Thai. Can get crowded on weekends but worth it.', date: '1 month ago', paidTier: 'standard' },
  ],
  8: [ // Pupatella
    { id: 1, author: 'Marcus Williams', userId: 'marcus', rating: 5, text: 'Neapolitan pizza perfection. The crust is crispy and charred just right. Margherita is a masterpiece.', date: '2 days ago', paidTier: 'standard' },
    { id: 2, author: 'Pedro Guerrero', userId: 'pedro', rating: 5, text: 'Best pizza in DC hands down. Mozzarella di bufala is creamy, sauce is tangy. Worth the wait.', date: '1 week ago', paidTier: 'standard' },
    { id: 3, author: 'Sarah K.', userId: null, rating: 5, text: 'Authentic Neapolitan style. Each pizza is a work of art. Prices are fair for the quality.', date: '2 weeks ago', paidTier: 'standard' },
    { id: 4, author: 'James L.', userId: null, rating: 4, text: 'Incredible pizza with beautiful wood-fired char. High quality ingredients shine through.', date: '1 month ago', paidTier: 'standard' },
  ],
}

export default function RestaurantDetail() {
  const router = useRouter()
  const { id } = router.query
  const restaurant = id ? mockRestaurants[parseInt(id as string)] : null
  const reviews = id ? reviewsByRestaurant[parseInt(id as string)] || [] : []

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
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #ff1493, #00d9ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', cursor: 'pointer' }}>
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
      <section style={{
        padding: '8rem 2rem 4rem',
        background: 'linear-gradient(180deg, rgba(255, 20, 147, 0.2) 0%, rgba(0, 217, 255, 0.1) 50%, rgba(10, 10, 10, 0) 100%), url("https://images.unsplash.com/photo-1504674900769-7c6416e047c6?w=1600&h=800&fit=crop")',
        backgroundSize: 'auto, cover',
        backgroundPosition: 'center, center',
        backgroundAttachment: 'scroll, fixed',
      }}>
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
                background: '#ff1493',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '0.5rem',
                border: 'none',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '1rem',
                boxShadow: '0 0 40px rgba(255, 20, 147, 0.3)',
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
      <section style={{ padding: '4rem 2rem', background: 'linear-gradient(180deg, rgba(0, 217, 255, 0.05) 0%, #0a0a0a 100%)' }}>
        <div style={{ maxWidth: '70rem', margin: '0 auto' }}>
          <div style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Reviews</h2>
            <p style={{ color: '#999', fontSize: '1.125rem' }}>
              <span style={{ color: '#00d9ff', fontWeight: '700' }}>{reviews.length}</span> verified reviews. <span style={{ color: '#ff1493', fontWeight: '700' }}>Paid reviews</span> ranked first — people put their money where their mouth is.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {reviews.sort((a: any, b: any) => {
              const tierOrder = { premium: 0, standard: 1, free: 2 }
              return (tierOrder[a.paidTier as keyof typeof tierOrder] || 1) - (tierOrder[b.paidTier as keyof typeof tierOrder] || 1)
            }).map(review => {
              const isPremium = review.paidTier === 'premium'
              const isStandard = review.paidTier === 'standard'
              const isFree = review.paidTier === 'free'
              
              return (
              <div
                key={review.id}
                style={{
                  background: isFree ? 'rgba(255, 255, 255, 0.01)' : isPremium ? 'linear-gradient(135deg, rgba(255, 20, 147, 0.1), rgba(0, 217, 255, 0.1))' : 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(10px)',
                  padding: '2rem',
                  borderRadius: '1.5rem',
                  border: isPremium ? '2px solid #ff1493' : '1px solid ' + (isFree ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)'),
                  boxShadow: isPremium ? '0 0 30px rgba(255, 20, 147, 0.4), 0 8px 32px rgba(0, 217, 255, 0.1)' : '0 8px 32px rgba(0, 217, 255, ' + (isFree ? '0.02' : '0.05)'),
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  opacity: isFree ? 0.6 : 1,
                  order: isPremium ? -1 : isStandard ? 0 : 1,
                }}
                onMouseEnter={(e: any) => {
                  if (!isFree) {
                    e.currentTarget.style.background = isPremium ? 'linear-gradient(135deg, rgba(255, 20, 147, 0.15), rgba(0, 217, 255, 0.15))' : 'rgba(255, 255, 255, 0.05)'
                    e.currentTarget.style.borderColor = isPremium ? '#ff1493' : '#00d9ff'
                    e.currentTarget.style.boxShadow = isPremium ? '0 0 40px rgba(255, 20, 147, 0.6), 0 12px 48px rgba(0, 217, 255, 0.2)' : '0 12px 48px rgba(0, 217, 255, 0.15)'
                  }
                }}
                onMouseLeave={(e: any) => {
                  e.currentTarget.style.background = isFree ? 'rgba(255, 255, 255, 0.01)' : isPremium ? 'linear-gradient(135deg, rgba(255, 20, 147, 0.1), rgba(0, 217, 255, 0.1))' : 'rgba(255, 255, 255, 0.03)'
                  e.currentTarget.style.borderColor = isPremium ? '#ff1493' : isFree ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)'
                  e.currentTarget.style.boxShadow = isPremium ? '0 0 30px rgba(255, 20, 147, 0.4), 0 8px 32px rgba(0, 217, 255, 0.1)' : '0 8px 32px rgba(0, 217, 255, ' + (isFree ? '0.02)' : '0.05)')
                }}
              >
                {/* Header: Author + Rating */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flex: 1 }}>
                    {/* Avatar */}
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #ff1493, #00d9ff)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      flexShrink: 0,
                    }}>
                      {review.author.charAt(0)}
                    </div>
                    
                    {/* Author Info */}
                    <div>
                      {review.userId ? (
                        <Link href={`/profile/${review.userId}`} style={{ textDecoration: 'none' }}>
                          <h3 style={{ fontWeight: 800, marginBottom: '0.25rem', color: '#ff1493', cursor: 'pointer', fontSize: '1.125rem' }}>
                            {review.author}
                          </h3>
                        </Link>
                      ) : (
                        <h3 style={{ fontWeight: 800, marginBottom: '0.25rem', fontSize: '1.125rem' }}>
                          {review.author}
                        </h3>
                      )}
                      <p style={{ color: '#999', fontSize: '0.875rem' }}>{review.date}</p>
                    </div>
                  </div>

                  {/* Rating Badge */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #ff1493, #00d9ff)',
                      padding: '0.75rem 1.25rem',
                      borderRadius: '9999px',
                      fontWeight: '800',
                      fontSize: '1.25rem',
                      color: '#fff',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                    }}>
                      {'⭐ ' + review.rating.toFixed(1)}
                    </div>
                    {review.paidTier !== 'free' && (
                      <span style={{
                        background: review.paidTier === 'premium' ? 'linear-gradient(135deg, #ff1493, #00d9ff)' : '#39ff14',
                        color: review.paidTier === 'premium' ? '#fff' : '#000',
                        padding: '0.35rem 0.85rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        boxShadow: review.paidTier === 'premium' ? '0 0 12px rgba(255, 20, 147, 0.5)' : 'none',
                      }}>
                        {review.paidTier === 'premium' ? '★ Premium' : '✓ Verified'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Review Text */}
                <p style={{
                  color: '#e5e5e5',
                  fontSize: '1rem',
                  lineHeight: '1.7',
                  marginBottom: '1.5rem',
                  fontWeight: '500',
                }}>
                  {review.text}
                </p>

                {/* Engagement Footer */}
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                }}>
                  <button style={{
                    background: 'rgba(255, 20, 147, 0.1)',
                    color: '#ff1493',
                    border: '1px solid rgba(255, 20, 147, 0.3)',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e: any) => {
                    e.currentTarget.style.background = 'rgba(255, 20, 147, 0.2)'
                    e.currentTarget.style.borderColor = '#ff1493'
                  }}
                  onMouseLeave={(e: any) => {
                    e.currentTarget.style.background = 'rgba(255, 20, 147, 0.1)'
                    e.currentTarget.style.borderColor = 'rgba(255, 20, 147, 0.3)'
                  }}>
                    👍 Helpful (8)
                  </button>
                  <button style={{
                    background: 'rgba(0, 217, 255, 0.1)',
                    color: '#00d9ff',
                    border: '1px solid rgba(0, 217, 255, 0.3)',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e: any) => {
                    e.currentTarget.style.background = 'rgba(0, 217, 255, 0.2)'
                    e.currentTarget.style.borderColor = '#00d9ff'
                  }}
                  onMouseLeave={(e: any) => {
                    e.currentTarget.style.background = 'rgba(0, 217, 255, 0.1)'
                    e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)'
                  }}>
                    💬 Reply
                  </button>
                  <button style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#999',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    marginLeft: 'auto',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e: any) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                    e.currentTarget.style.color = '#fff'
                  }}
                  onMouseLeave={(e: any) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                    e.currentTarget.style.color = '#999'
                  }}>
                    ⋯ More
                  </button>
                </div>
              </div>
            )
            })}
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
                background: '#ff1493',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '0.5rem',
                border: 'none',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '1rem',
                boxShadow: '0 0 40px rgba(255, 20, 147, 0.3)',
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
