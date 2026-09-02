import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { UserProfile } from '../types'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

interface AuthContextType {
  user: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  isDemo: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const isDemo = !isSupabaseConfigured

  useEffect(() => {
    if (isDemo) {
      const demoUser = localStorage.getItem('midwise_demo_user')
      if (demoUser) {
        setUser(JSON.parse(demoUser))
      }
      setLoading(false)
      return
    }

    supabase!.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          fullName: session.user.user_metadata?.full_name || '',
          createdAt: session.user.created_at,
          totalExams: 0,
          averageScore: 0,
          streak: 0,
        })
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase!.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          fullName: session.user.user_metadata?.full_name || '',
          createdAt: session.user.created_at,
          totalExams: 0,
          averageScore: 0,
          streak: 0,
        })
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    if (isDemo) {
      const demoUser: UserProfile = {
        id: 'demo-' + Date.now(),
        email,
        fullName: email.split('@')[0],
        createdAt: new Date().toISOString(),
        totalExams: 0,
        averageScore: 0,
        streak: 0,
      }
      setUser(demoUser)
      localStorage.setItem('midwise_demo_user', JSON.stringify(demoUser))
      return {}
    }

    const { error } = await supabase!.auth.signInWithPassword({ email, password })
    return { error: error?.message }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    if (isDemo) {
      const demoUser: UserProfile = {
        id: 'demo-' + Date.now(),
        email,
        fullName,
        createdAt: new Date().toISOString(),
        totalExams: 0,
        averageScore: 0,
        streak: 0,
      }
      setUser(demoUser)
      localStorage.setItem('midwise_demo_user', JSON.stringify(demoUser))
      return {}
    }

    const { error } = await supabase!.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    return { error: error?.message }
  }

  const signOut = async () => {
    if (isDemo) {
      setUser(null)
      localStorage.removeItem('midwise_demo_user')
      return
    }
    await supabase!.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, isDemo }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
