import type { NextApiRequest, NextApiResponse } from 'next'
import { createServiceClient } from '../../../lib/supabase'

const WELCOME_EMAIL_HTML = (displayName: string, appUrl: string) => `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Welcome to SayPay</title></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:system-ui,-apple-system,sans-serif;color:#ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" style="max-width:540px;background:#111;border:1px solid rgba(255,255,255,0.1);border-radius:16px;overflow:hidden;">
        <!-- Header -->
        <tr><td style="padding:32px 40px 24px;background:linear-gradient(135deg,rgba(255,0,110,0.18) 0%,transparent 70%);">
          <div style="display:inline-flex;align-items:center;gap:8px;margin-bottom:24px;">
            <svg width="28" height="28" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ff006e"/><stop offset="100%" stop-color="#ffdd00"/></linearGradient></defs>
              <path d="M5 5C5 3.895 5.895 3 7 3H25C26.105 3 27 3.895 27 5V19C27 20.105 26.105 21 25 21H18.5L15 27L11.5 21H7C5.895 21 5 20.105 5 19V5Z" fill="url(#g)"/>
              <text x="16" y="17" text-anchor="middle" fill="white" font-size="12" font-weight="900" font-family="system-ui">$</text>
            </svg>
            <span style="font-size:22px;font-weight:900;letter-spacing:-0.02em;"><span style="color:#fff;">Say</span><span style="background:linear-gradient(135deg,#ff006e,#ffdd00);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">Pay</span></span>
          </div>
          <h1 style="margin:0 0 12px;font-size:28px;font-weight:900;line-height:1.15;">Welcome, ${displayName}! 🎉</h1>
          <p style="margin:0;color:#888;font-size:16px;line-height:1.6;">Your account is ready. Start writing reviews that actually matter.</p>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:32px 40px;">
          <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);border-radius:12px;padding:24px;margin-bottom:28px;">
            <p style="margin:0 0 8px;font-weight:800;font-size:15px;">Here's how SayPay works:</p>
            <p style="margin:0 0 8px;color:#aaa;font-size:14px;line-height:1.7;">1. 🍽️ Find a restaurant or business you've visited</p>
            <p style="margin:0 0 8px;color:#aaa;font-size:14px;line-height:1.7;">2. ✍️ Write your honest review — no filter needed</p>
            <p style="margin:0;color:#aaa;font-size:14px;line-height:1.7;">3. 💳 Pay <strong style="color:#fff;">$0.99</strong> to publish — that's what makes it trusted</p>
          </div>
          <p style="margin:0 0 24px;color:#666;font-size:14px;line-height:1.7;text-align:center;font-style:italic;">Your opinion is worth $0.99 — that's what makes it trusted.</p>
          <div style="text-align:center;">
            <a href="${appUrl}/explore" style="display:inline-block;background:linear-gradient(135deg,#ff006e,#ffdd00);color:#000;text-decoration:none;padding:14px 36px;border-radius:9999px;font-weight:900;font-size:16px;">
              Explore Restaurants →
            </a>
          </div>
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.07);text-align:center;">
          <p style="margin:0;color:#444;font-size:12px;">
            <a href="${appUrl}" style="color:#666;text-decoration:none;">saypay.vercel.app</a>
            &nbsp;·&nbsp; You're receiving this because you signed up for SayPay.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { userId, username, displayName, email } = req.body
  if (!userId || !username) return res.status(400).json({ error: 'userId and username required' })

  const supabase = createServiceClient()

  // Check username taken
  const { data: existing } = await supabase
    .from('sp_profiles')
    .select('id')
    .eq('username', username.toLowerCase())
    .single()

  if (existing) return res.status(409).json({ error: 'Username already taken' })

  const { error } = await supabase
    .from('sp_profiles')
    .insert({
      id: userId,
      username: username.toLowerCase(),
      display_name: displayName || username,
    })

  if (error) {
    console.error('Profile creation error:', error)
    return res.status(500).json({ error: error.message })
  }

  // Send welcome email (non-blocking — don't fail signup if email fails)
  if (email && process.env.RESEND_API_KEY) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://saypay.vercel.app'
    try {
      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'SayPay <onboarding@resend.dev>',
          to: [email],
          subject: 'Welcome to SayPay! 🎉',
          html: WELCOME_EMAIL_HTML(displayName || username, appUrl),
        }),
      })
      if (!emailRes.ok) {
        const body = await emailRes.text()
        console.error('Resend email failed:', emailRes.status, body)
      }
    } catch (emailErr) {
      console.error('Resend email error:', emailErr)
    }
  }

  return res.status(200).json({ success: true })
}
