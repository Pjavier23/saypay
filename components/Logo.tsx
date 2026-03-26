import Link from 'next/link'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  href?: string
}

const sizes = {
  sm: { icon: 26, fontSize: '1.25rem' },
  md: { icon: 32, fontSize: '1.6rem' },
  lg: { icon: 48, fontSize: '2.25rem' },
}

export default function Logo({ size = 'md', showIcon = true, href = '/' }: LogoProps) {
  const { icon, fontSize } = sizes[size]

  const mark = showIcon ? (
    <svg
      width={icon}
      height={icon}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <defs>
        <linearGradient id={`bubbleGrad-${size}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff006e" />
          <stop offset="100%" stopColor="#ffdd00" />
        </linearGradient>
      </defs>
      <path
        d="M5 5C5 3.895 5.895 3 7 3H25C26.105 3 27 3.895 27 5V19C27 20.105 26.105 21 25 21H18.5L15 27L11.5 21H7C5.895 21 5 20.105 5 19V5Z"
        fill={`url(#bubbleGrad-${size})`}
      />
      <text
        x="16"
        y="16.5"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize="12"
        fontWeight="900"
        fontFamily="system-ui, sans-serif"
      >
        $
      </text>
    </svg>
  ) : null

  const wordmark = (
    <span
      style={{
        fontSize,
        fontWeight: 900,
        letterSpacing: '-0.02em',
        lineHeight: 1,
        fontFamily: 'system-ui, sans-serif',
        userSelect: 'none',
      }}
    >
      <span style={{ color: '#fff' }}>Say</span>
      <span
        style={{
          background: 'linear-gradient(135deg, #ff006e, #ffdd00)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Pay
      </span>
    </span>
  )

  return (
    <Link
      href={href}
      style={{
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: size === 'lg' ? '0.625rem' : '0.4rem',
      }}
    >
      {mark}
      {wordmark}
    </Link>
  )
}
