'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useParams, useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import axios from 'axios'

// Esquema de validación
const schema = z.object({
  title: z.string().min(1, 'El título es obligatorio'),
  content: z.string().min(1, 'El contenido es obligatorio'),
  isPublic: z.boolean().optional(),
})

type FormInput = z.infer<typeof schema>

export default function EditNodePage() {
  const { id: treeId, nodeId } = useParams<{ id: string; nodeId: string }>()
  const router = useRouter()
  const token = useAuthStore(state => state.token)
  const hasHydrated = useAuthStore(state => state.hasHydrated)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (!hasHydrated || !token) return

    const fetchNode = async () => {
      try {
        const res = await api.get(`/nodes/${nodeId}`, {
  headers: { Authorization: `Bearer ${token}` },
})

        const node = res.data
        setValue('title', node.title)
        setValue('content', node.content)
        setValue('isPublic', node.isPublic)
      } catch (err) {
        console.error('Error al cargar el nodo:', err)
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setError('Nodo no encontrado')
        } else {
          setError('Error al cargar el nodo')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchNode()
  }, [treeId, nodeId, token, setValue, hasHydrated])

  const onSubmit = async (data: FormInput) => {
    try {
      await api.put(`/trees/${treeId}/nodes/${nodeId}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      router.push(`/trees/${treeId}/nodes`)
    } catch (err) {
      console.error('Error al actualizar el nodo:', err)
      setError('No se pudo guardar el nodo.')
    }
  }

  if (loading) {
    return <p className="p-4">Cargando nodo...</p>
  }

  return (
    <main className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow mt-10">
      <h1 className="text-2xl font-bold mb-6">✏️ Editar Nodo</h1>

      {error && (
        <p className="mb-4 text-red-600 bg-red-50 p-3 rounded border border-red-200">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block mb-1 font-medium text-gray-700">Título</label>
          <input
            type="text"
            {...register('title')}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-green-400"
          />
          {errors.title && <p className="text-red-600 text-sm">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Contenido</label>
          <textarea
            {...register('content')}
            rows={5}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-green-400 resize-none"
          />
          {errors.content && <p className="text-red-600 text-sm">{errors.content.message}</p>}
        </div>

        <div className="flex items-center gap-3">
          <input
            id="isPublic"
            type="checkbox"
            {...register('isPublic')}
            className="w-5 h-5 text-green-600"
          />
          <label htmlFor="isPublic" className="text-sm">¿Nodo público?</label>
        </div>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition"
        >
          Guardar Cambios
        </button>
      </form>
    </main>
  )
}
