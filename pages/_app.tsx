import type { AppProps } from 'next/app'
import { createContext, useContext, useEffect, useState } from 'react'
import '../styles/globals.css'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  profile: any | null
  loading: boolean
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export default function App({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else { setProfile(null); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId: string) {
    const { data } = await supabase
      .from('sp_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    setProfile(data)
    setLoading(false)
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      <Component {...pageProps} />
    </AuthContext.Provider>
  )
}
