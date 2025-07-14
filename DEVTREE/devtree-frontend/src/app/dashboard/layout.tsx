'use client'

import { useAuthStore } from '@/store/auth'
import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const logout = useAuthStore(state => state.logout)
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div>
      <nav className="bg-black text-white p-4 flex justify-between">
        <span className="font-bold">DevTree 🌳</span>
        <button onClick={handleLogout} className="hover:underline">
          Cerrar sesión
        </button>
      </nav>
      {children}
    </div>
  )
}
