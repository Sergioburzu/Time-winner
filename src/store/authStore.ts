import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

interface Family {
  id: string
  name: string
}

interface AuthState {
  user: User | null
  family: Family | null
  isParentUnlocked: boolean
  parentPin: string | null
  isLoading: boolean
  error: string | null

  // Actions
  signUp: (email: string, password: string, familyName: string, pin: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  unlockParent: (pin: string) => boolean
  lockParent: () => void
  loadSession: () => Promise<void>
  setParentPin: (pin: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      family: null,
      isParentUnlocked: false,
      parentPin: null,
      isLoading: false,
      error: null,

      loadSession: async () => {
        set({ isLoading: true })
        try {
          const { data: { session } } = await supabase.auth.getSession()
          if (session?.user) {
            const { data: familyData } = await supabase
              .from('families')
              .select('*')
              .eq('owner_id', session.user.id)
              .single()
            set({ user: session.user, family: familyData, isLoading: false })
          } else {
            set({ user: null, family: null, isLoading: false })
          }
        } catch {
          set({ isLoading: false })
        }
      },

      signUp: async (email, password, familyName, pin) => {
        set({ isLoading: true, error: null })
        try {
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
          })
          if (authError) throw authError
          if (!authData.user) throw new Error('No user returned')

          const { data: familyData, error: familyError } = await supabase
            .from('families')
            .insert({ name: familyName, owner_id: authData.user.id })
            .select()
            .single()
          if (familyError) throw familyError

          set({
            user: authData.user,
            family: familyData,
            parentPin: pin,
            isParentUnlocked: true,
            isLoading: false,
          })
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Error al registrarse'
          set({ error: msg, isLoading: false })
          throw err
        }
      },

      signIn: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password })
          if (error) throw error

          const { data: familyData } = await supabase
            .from('families')
            .select('*')
            .eq('owner_id', data.user.id)
            .single()

          set({ user: data.user, family: familyData, isLoading: false })
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Error al iniciar sesión'
          set({ error: msg, isLoading: false })
          throw err
        }
      },

      signOut: async () => {
        await supabase.auth.signOut()
        set({ user: null, family: null, isParentUnlocked: false })
      },

      unlockParent: (pin) => {
        const { parentPin } = get()
        if (pin === parentPin) {
          set({ isParentUnlocked: true })
          return true
        }
        return false
      },

      lockParent: () => {
        set({ isParentUnlocked: false })
      },

      setParentPin: (pin) => {
        set({ parentPin: pin })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        parentPin: state.parentPin,
      }),
    }
  )
)
