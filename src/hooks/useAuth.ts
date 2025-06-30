import { useState, useEffect } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
}

export interface SignUpData {
  email: string
  password: string
  name: string
}

export interface SignInData {
  email: string
  password: string
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error)
        setState(prev => ({ ...prev, error: error.message, loading: false }))
      } else {
        setState(prev => ({ 
          ...prev, 
          session, 
          user: session?.user ?? null, 
          loading: false 
        }))
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        
        setState(prev => ({ 
          ...prev, 
          session, 
          user: session?.user ?? null, 
          loading: false,
          error: null
        }))

        // Create profile when user signs up
        if (event === 'SIGNED_UP' && session?.user) {
          await createUserProfile(session.user)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const createUserProfile = async (user: User) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.name || user.email!.split('@')[0],
          avatar: '👤',
          reputation: 50,
          badges: [],
          subscription_tier: 'free'
        })

      if (error && error.code !== '23505') { // Ignore duplicate key errors
        console.error('Error creating profile:', error)
      }
    } catch (error) {
      console.error('Error creating profile:', error)
    }
  }

  const signUp = async ({ email, password, name }: SignUpData) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      })

      if (error) {
        setState(prev => ({ ...prev, error: error.message, loading: false }))
        return { data: null, error }
      }

      setState(prev => ({ ...prev, loading: false }))
      return { data, error: null }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred'
      setState(prev => ({ ...prev, error: message, loading: false }))
      return { data: null, error: { message } as AuthError }
    }
  }

  const signIn = async ({ email, password }: SignInData) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        setState(prev => ({ ...prev, error: error.message, loading: false }))
        return { data: null, error }
      }

      setState(prev => ({ ...prev, loading: false }))
      return { data, error: null }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred'
      setState(prev => ({ ...prev, error: message, loading: false }))
      return { data: null, error: { message } as AuthError }
    }
  }

  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        setState(prev => ({ ...prev, error: error.message, loading: false }))
        return { error }
      }

      setState(prev => ({ 
        ...prev, 
        user: null, 
        session: null, 
        loading: false 
      }))
      return { error: null }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred'
      setState(prev => ({ ...prev, error: message, loading: false }))
      return { error: { message } as AuthError }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) {
        setState(prev => ({ ...prev, error: error.message, loading: false }))
        return { error }
      }

      setState(prev => ({ ...prev, loading: false }))
      return { error: null }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred'
      setState(prev => ({ ...prev, error: message, loading: false }))
      return { error: { message } as AuthError }
    }
  }

  return {
    ...state,
    signUp,
    signIn,
    signOut,
    resetPassword
  }
}