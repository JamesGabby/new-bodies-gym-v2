// src/hooks/use-auth.ts
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/stores/auth-store'
import { SignUpInput, LoginInput } from '@/lib/validations'
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/lib/constants'

export function useAuth() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { setUser, setProfile, setMembership, reset } = useAuthStore()

  const signUp = async (data: SignUpInput) => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            phone: data.phone || null,
            date_of_birth: data.dateOfBirth || null,
          },
        },
      })

      if (signUpError) {
        throw signUpError
      }

      if (authData.user) {
        // Update profile with additional data
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            first_name: data.firstName,
            last_name: data.lastName,
            phone: data.phone || null,
            date_of_birth: data.dateOfBirth || null,
            marketing_consent: data.marketingConsent,
            terms_accepted: data.termsAccepted,
            terms_accepted_at: new Date().toISOString(),
          })
          .eq('id', authData.user.id)

        if (profileError) {
          console.error('Profile update error:', profileError)
        }
      }

      toast.success(SUCCESS_MESSAGES.signedUp)
      router.push('/signup/verify-email')
      
      return { success: true, data: authData }
    } catch (error: any) {
      const message = error.message || ERROR_MESSAGES.generic
      toast.error(message)
      return { success: false, error: message }
    } finally {
      setIsLoading(false)
    }
  }

  const signIn = async (data: LoginInput, redirectTo?: string) => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        throw error
      }

      if (authData.user) {
        setUser({
          id: authData.user.id,
          email: authData.user.email!,
        })

        // Fetch profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single()

        if (profile) {
          setProfile(profile)
        }

        // Fetch membership
        const { data: membership } = await supabase
          .from('memberships')
          .select('*')
          .eq('user_id', authData.user.id)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (membership) {
          setMembership(membership)
        }
      }

      toast.success(SUCCESS_MESSAGES.loggedIn)
      router.push(redirectTo || '/')
      router.refresh()

      return { success: true, data: authData }
    } catch (error: any) {
      let message = ERROR_MESSAGES.generic
      
      if (error.message?.includes('Invalid login credentials')) {
        message = 'Invalid email or password. Please try again.'
      } else if (error.message?.includes('Email not confirmed')) {
        message = 'Please verify your email address before signing in.'
      } else {
        message = error.message
      }

      toast.error(message)
      return { success: false, error: message }
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        throw error
      }

      reset()
      toast.success(SUCCESS_MESSAGES.loggedOut)
      router.push('/')
      router.refresh()

      return { success: true }
    } catch (error: any) {
      toast.error(error.message || ERROR_MESSAGES.generic)
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const forgotPassword = async (email: string) => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        throw error
      }

      toast.success('Password reset email sent. Please check your inbox.')
      return { success: true }
    } catch (error: any) {
      toast.error(error.message || ERROR_MESSAGES.generic)
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (password: string) => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) {
        throw error
      }

      toast.success(SUCCESS_MESSAGES.passwordChanged)
      router.push('/login')
      
      return { success: true }
    } catch (error: any) {
      toast.error(error.message || ERROR_MESSAGES.generic)
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      })

      if (error) {
        throw error
      }

      return { success: true }
    } catch (error: any) {
      toast.error(error.message || ERROR_MESSAGES.generic)
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const resendVerificationEmail = async (email: string) => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      })

      if (error) {
        throw error
      }

      toast.success('Verification email sent. Please check your inbox.')
      return { success: true }
    } catch (error: any) {
      toast.error(error.message || ERROR_MESSAGES.generic)
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    signUp,
    signIn,
    signOut,
    forgotPassword,
    resetPassword,
    signInWithGoogle,
    resendVerificationEmail,
  }
}