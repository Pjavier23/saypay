import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SayPay — Reviews That Mean Something',
  description: 'The first review platform where every word costs something — making every review worth reading.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
