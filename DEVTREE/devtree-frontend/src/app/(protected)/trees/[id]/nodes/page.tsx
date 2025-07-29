'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { api } from '../../../../../lib/api'
import { useAuthStore } from "../../../../../store/auth";
import axios from 'axios'; // Import axios for error handling

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
  const hasHydrated = useAuthStore((state) => state.hasHydrated); // For route protection

  const [tree, setTree] = useState<TreeType | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Route protection: Redirect if not logged in or token isn't available after hydration
    if (hasHydrated && !token) {
      router.push("/login");
      return;
    }
    // If not hydrated or no token yet, wait
    if (!hasHydrated || !token) return;

    const fetchTree = async () => {
      try {
        const res = await api.get(`/trees/${id}/private`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setTree(res.data)
      } catch (err: unknown) { // Use unknown type for error for better safety
        console.error("Error al cargar el árbol:", err);
        // Specific handling for authentication errors
        if (axios.isAxiosError(err) && err.response && err.response.status === 401) {
          router.push('/login');
        } else {
          setError('Error al cargar el árbol y sus nodos. Asegúrate de tener permisos o que el árbol exista.');
        }
      } finally {
        setLoading(false)
      }
    }

    fetchTree()
  }, [id, token, hasHydrated, router]) // Add all dependencies

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
      // Optimistically update UI
      setTree(prev =>
        prev ? { ...prev, nodes: prev.nodes.filter(n => n._id !== nodeId) } : null
      )
      // Optionally show a success message
      alert('Nodo eliminado con éxito.');
    } catch (err: unknown) { // Use unknown type for error
      console.error("Error al eliminar el nodo:", err);
      if (axios.isAxiosError(err) && err.response && err.response.status === 401) {
        router.push('/login');
      } else {
        alert('Error al eliminar el nodo. Por favor, inténtalo de nuevo.');
      }
    }
  }

  // Render loading state for authentication/hydration check
  if (!hasHydrated || (!token && !loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-green-light to-primary-green-lighter text-custom-gray-dark">
        <p className="text-lg text-custom-gray-medium">Verificando autenticación...</p>
      </div>
    );
  }

  // Render loading state for fetching tree data
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-green-light to-primary-green-lighter text-custom-gray-dark">
        <p className="text-lg text-custom-gray-medium">Cargando árbol y nodos...</p>
      </div>
    );
  }

  // Handle case where tree data isn't loaded (e.g., after an error)
  if (!tree) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-green-light to-primary-green-lighter text-custom-gray-dark">
            <p className="text-lg text-red-600">No se pudo cargar el árbol. {error}</p>
        </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-green-light to-primary-green-lighter text-custom-gray-dark p-6 sm:p-10 md:p-16">
      <div className="max-w-4xl mx-auto bg-white border border-primary-green-light rounded-2xl p-6 md:p-8 shadow-xl">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary-green-darker mb-3">
          🌳 {tree.name}
        </h1>
        <p className="mb-6 text-custom-gray-medium text-lg leading-relaxed">
          {tree.description}
        </p>

        <hr className="border-t-2 border-custom-gray-light mb-6" />

        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-2xl font-bold text-primary-green-darker">
            🧩 Nodos del Árbol
          </h2>
          <button
            onClick={goToNewNode}
            className="bg-primary-green hover:bg-primary-green-dark text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-green-dark focus:ring-offset-2 focus:ring-offset-white whitespace-nowrap"
          >
            ➕ Crear Nuevo Nodo
          </button>
        </div>

        {error && <p className="text-red-600 text-base text-center mb-6 p-3 bg-red-50 rounded-lg border border-red-200">{error}</p>}


        {tree.nodes.length === 0 ? (
          <div className="text-center p-8 border border-custom-gray-light rounded-lg bg-custom-gray-lighter text-custom-gray-dark">
            <p className="text-lg font-medium">No hay nodos en este árbol todavía.</p>
            <p className="text-custom-gray-medium mt-2">¡Haz clic en Crear Nuevo Nodo para empezar!</p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tree.nodes.map(node => (
              <li
                key={node._id}
                className="p-6 rounded-xl border border-primary-green-light bg-white shadow-md hover:shadow-lg transition duration-200 ease-in-out flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-bold text-primary-green-darker mb-2">{node.title}</h3>
                  <p className="text-sm text-custom-gray-dark leading-relaxed mb-3">{node.description}</p>
                  <span className="inline-block mt-2 text-xs font-semibold bg-primary-green-light text-primary-green-darker px-3 py-1 rounded-full border border-primary-green">
                    {node.type === 'idea' ? '💡 Idea' : node.type === 'recurso' ? '📚 Recurso' : '💪 Habilidad'}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {node.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-xs bg-custom-gray-lighter text-custom-gray-dark px-2.5 py-1 rounded-md border border-custom-gray-light font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex gap-4 justify-end">
                  <button
                    onClick={() => handleEdit(node._id)}
                    className="text-primary-green-dark hover:text-primary-green-darker font-medium text-sm transition duration-200 hover:underline flex items-center gap-1"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => deleteNode(node._id)}
                    className="text-red-600 hover:text-red-700 font-medium text-sm transition duration-200 hover:underline flex items-center gap-1"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}