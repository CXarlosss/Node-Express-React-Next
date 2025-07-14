'use client'

import { useAuthStore } from '@/store/auth'
import { useRouter } from 'next/navigation'
import { LogOut, PlusCircle } from 'lucide-react'

export default function DashboardPage() {
  const logout = useAuthStore(state => state.logout)
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const goToCreateTree = () => {
    router.push('/trees/new')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white flex flex-col items-center justify-center px-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-10 shadow-2xl w-full max-w-lg text-center space-y-6">
        <h1 className="text-4xl font-bold">👋 Bienvenido al Dashboard</h1>
        <p className="text-zinc-400">Tu panel personal de aprendizaje en DevTree</p>

        <div className="space-y-3">
          <button
            onClick={goToCreateTree}
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 px-6 py-2 rounded-lg text-white font-semibold transition w-full"
          >
            <PlusCircle className="w-5 h-5" />
            Crear nuevo árbol
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg text-white font-semibold transition w-full"
          >
            <LogOut className="w-5 h-5" />
            Cerrar sesión
          </button>
        </div>
      </div>
    </main>
  )
}
