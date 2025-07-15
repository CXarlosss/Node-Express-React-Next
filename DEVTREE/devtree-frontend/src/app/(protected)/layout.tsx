'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const token = useAuthStore(state => state.token)
  const hasHydrated = useAuthStore(state => state.hasHydrated)
  const router = useRouter()

  useEffect(() => {
    if (hasHydrated && !token) {
      router.push('/login')
    }
  }, [hasHydrated, token, router])

  if (!hasHydrated) return <p className="text-white text-center mt-10">Cargando...</p>
  if (!token) return null

  return <>{children}</>
}
