import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthState = {
  token: string | null
  hasHydrated: boolean
  setToken: (token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      hasHydrated: false,
      setToken: (token) =>
        set({
          token,
          hasHydrated: true, // ✅ Esto asegura que tras login ya esté listo
        }),
      logout: () =>
        set({
          token: null,
          hasHydrated: true, // ✅ Esto previene errores tras logout
        }),
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => () => {
        // ✅ Esto se ejecuta cuando Zustand termina de leer de localStorage
        useAuthStore.setState({ hasHydrated: true })
      },
    }
  )
)
