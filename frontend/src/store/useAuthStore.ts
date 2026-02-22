import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, authAPI } from '../lib/api'

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  
  login: (email: string, senha: string) => Promise<{ success: boolean; error?: string }>
  register: (nome: string, email: string, senha: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (email: string, senha: string) => {
        set({ isLoading: true })
        try {
          const response = await authAPI.login(email, senha)
          
          if (response.success) {
            localStorage.setItem('token', response.token)
            set({
              user: response.user,
              token: response.token,
              isAuthenticated: true,
              isLoading: false,
            })
            return { success: true }
          } else {
            set({ isLoading: false })
            return { success: false, error: response.error }
          }
        } catch (error: any) {
          set({ isLoading: false })
          return { 
            success: false, 
            error: error.response?.data?.error || 'Erro ao fazer login' 
          }
        }
      },

      register: async (nome: string, email: string, senha: string) => {
        set({ isLoading: true })
        try {
          const response = await authAPI.register(nome, email, senha)
          
          if (response.success) {
            set({ isLoading: false })
            return { success: true }
          } else {
            set({ isLoading: false })
            return { success: false, error: response.error }
          }
        } catch (error: any) {
          set({ isLoading: false })
          return { 
            success: false, 
            error: error.response?.data?.error || 'Erro ao criar conta' 
          }
        }
      },

      logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    // Não remove o email lembrado aqui - usuário decide no próximo login
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    })
  },

      checkAuth: async () => {
        const token = localStorage.getItem('token')
        if (!token) {
          set({ isAuthenticated: false })
          return
        }

        set({ isLoading: true })
        try {
          const user = await authAPI.getProfile()
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          localStorage.removeItem('token')
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
