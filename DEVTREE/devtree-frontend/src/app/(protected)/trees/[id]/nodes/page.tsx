'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/auth'

type NodeType = {
  _id: string
  title: string
  description: string
  type: 'idea' | 'recurso' | 'skill'
  tags: string[]
}

type TreeType = {
  _id: string
  name: string
  description: string
  isPublic: boolean
  nodes: NodeType[]
}

export default function TreeNodesPage() {
  const { id } = useParams()
  const router = useRouter()
  const token = useAuthStore(state => state.token)

  const [tree, setTree] = useState<TreeType | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTree = async () => {
      try {
        const res = await api.get(`/trees/${id}/private`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setTree(res.data)
      } catch (err) {
        console.error(err)
        setError('Error al cargar el árbol y sus nodos.')
      } finally {
        setLoading(false)
      }
    }

    fetchTree()
  }, [id, token])

  const goToNewNode = () => {
    router.push(`/trees/${id}/nodes/new`)
  }

  const handleEdit = (nodeId: string) => {
    router.push(`/trees/${id}/nodes/${nodeId}/edit`)
  }

  const deleteNode = async (nodeId: string) => {
    const confirmDelete = confirm('¿Seguro que quieres eliminar este nodo?')
    if (!confirmDelete) return
    try {
      await api.delete(`/nodes/${nodeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setTree(prev =>
        prev ? { ...prev, nodes: prev.nodes.filter(n => n._id !== nodeId) } : null
      )
    } catch (err) {
      alert('Error al eliminar el nodo')
      console.error(err)
    }
  }

  if (loading) return <p className="text-center text-white mt-10">Cargando...</p>
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>
  if (!tree) return null

  return (
    <main className="min-h-screen px-6 py-10 bg-zinc-950 text-white">
      <h1 className="text-3xl font-bold mb-2">{tree.name}</h1>
      <p className="mb-6 text-zinc-400">{tree.description}</p>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">🧩 Nodos</h2>
        <button
          onClick={goToNewNode}
          className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg font-semibold"
        >
          ➕ Crear nuevo nodo
        </button>
      </div>

      {tree.nodes.length === 0 ? (
        <p>No hay nodos en este árbol todavía.</p>
      ) : (
        <ul className="space-y-4">
          {tree.nodes.map(node => (
            <li
              key={node._id}
              className="p-4 rounded-xl border border-zinc-800 bg-zinc-900"
            >
              <h3 className="text-lg font-bold">{node.title}</h3>
              <p className="text-sm text-zinc-400">{node.description}</p>
              <span className="inline-block mt-2 text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                {node.type}
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {node.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs bg-zinc-800 px-2 py-1 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex gap-4">
                <button
                  onClick={() => handleEdit(node._id)}
                  className="text-sm text-blue-400 hover:underline"
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => deleteNode(node._id)}
                  className="text-sm text-red-400 hover:underline"
                >
                  🗑️ Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
