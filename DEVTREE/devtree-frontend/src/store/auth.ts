import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthState = {
  user: { _id: string; username: string } | null;
  token: string | null
  hasHydrated: boolean
setToken: (token: string | null) => void

  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
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
