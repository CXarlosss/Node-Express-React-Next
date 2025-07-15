'use client'

import { useAuthStore } from '@/store/auth'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlusCircle, Pencil } from 'lucide-react'
import { api } from '@/lib/api'

interface Tree {
  _id: string
  name: string
  description: string
}

export default function DashboardPage() {
  const token = useAuthStore(state => state.token)
  const hasHydrated = useAuthStore(state => state.hasHydrated)
  const [trees, setTrees] = useState<Tree[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!hasHydrated || !token) return
    const fetchTrees = async () => {
      try {
        const res = await api.get('/trees/mine', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setTrees(res.data)
      } catch (err) {
        console.error('Error cargando árboles', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTrees()
  }, [hasHydrated, token])

  const goToCreateTree = () => {
    router.push('/trees/new')
  }

  const goToEditTree = (id: string) => {
    router.push(`/trees/${id}/edit`)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white px-4 py-10">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">🌳 Tus árboles</h1>
          <button
            onClick={goToCreateTree}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg text-white font-semibold transition"
          >
            <PlusCircle className="w-5 h-5" />
            Crear árbol
          </button>
        </div>

        {loading ? (
          <p className="text-center">Cargando árboles...</p>
        ) : trees.length === 0 ? (
          <p className="text-center text-zinc-400">No tienes árboles creados.</p>
        ) : (
          <ul className="space-y-4">
            {trees.map(tree => (
              <li
                key={tree._id}
                className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl flex justify-between items-start"
              >
                <div>
                  <h2 className="text-xl font-semibold">{tree.name}</h2>
                  <p className="text-zinc-400 text-sm mt-1">{tree.description}</p>
                </div>
                <button
                  onClick={() => goToEditTree(tree._id)}
                  className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg text-sm font-medium"
                >
                  <Pencil className="w-4 h-4" />
                  Editar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
