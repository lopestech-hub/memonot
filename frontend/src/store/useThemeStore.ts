import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeMode = 'light' | 'dark'

interface ThemeState {
  theme: ThemeMode
  toggleTheme: () => void
  setTheme: (theme: ThemeMode) => void
}

const getPreferredTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: getPreferredTheme(),
      toggleTheme: () => {
        const nextTheme = get().theme === 'light' ? 'dark' : 'light'
        set({ theme: nextTheme })
      },
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'memonot-theme',
    }
  )
)
