'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/auth'

const schema = z.object({
  title: z.string().min(2, 'El título es obligatorio'),
  description: z.string().min(5, 'La descripción debe tener al menos 5 caracteres'),
  type: z.enum(['idea', 'recurso', 'skill']),
  tags: z.string().optional()
})

type FormData = z.infer<typeof schema>

export default function EditNodePage() {
  const { id, nodeId } = useParams()
  const router = useRouter()
  const token = useAuthStore(state => state.token)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  useEffect(() => {
    const fetchNode = async () => {
      try {
        const res = await api.get(`/nodes/${nodeId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const node = res.data
        setValue('title', node.title)
        setValue('description', node.description)
        setValue('type', node.type)
        setValue('tags', node.tags.join(', '))
      } catch (err) {
        console.error(err)
        setError('Error al cargar el nodo.')
      } finally {
        setLoading(false)
      }
    }

    fetchNode()
  }, [nodeId, token, setValue])

  const onSubmit = async (data: FormData) => {
    try {
      await api.put(`/nodes/${nodeId}`, {
        ...data,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : []
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      router.push(`/trees/${id}/nodes`)
    } catch (err) {
      console.error(err)
      setError('Error al actualizar el nodo.')
    }
  }

  if (loading) return <p className="text-center text-white mt-10">Cargando nodo...</p>
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>

  return (
    <main className="min-h-screen px-6 py-10 bg-zinc-950 text-white">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl mx-auto space-y-5 bg-zinc-900 p-8 rounded-xl border border-zinc-800">
        <h1 className="text-2xl font-bold mb-2">✏️ Editar nodo</h1>

        <div>
          <label className="block mb-1 text-sm">Título</label>
          <input {...register('title')} className="w-full p-2 rounded text-black" />
          {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block mb-1 text-sm">Descripción</label>
          <textarea {...register('description')} rows={3} className="w-full p-2 rounded text-black" />
          {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block mb-1 text-sm">Tipo</label>
          <select {...register('type')} className="w-full p-2 rounded text-black">
            <option value="idea">Idea</option>
            <option value="recurso">Recurso</option>
            <option value="skill">Skill</option>
          </select>
          {errors.type && <p className="text-red-400 text-sm mt-1">{errors.type.message}</p>}
        </div>

        <div>
          <label className="block mb-1 text-sm">Etiquetas (separadas por coma)</label>
          <input {...register('tags')} className="w-full p-2 rounded text-black" />
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded text-white font-semibold">
          Guardar cambios
        </button>
      </form>
    </main>
  )
}
