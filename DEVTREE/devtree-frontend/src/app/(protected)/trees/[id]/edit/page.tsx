'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useParams, useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/auth'

const schema = z.object({
  name: z.string().min(2, 'El nombre es obligatorio'),
  description: z.string().min(5, 'La descripción debe ser más larga'),
  isPublic: z.boolean().optional()
})

type FormData = z.infer<typeof schema>

export default function EditTreePage() {
  const { id } = useParams()
  const router = useRouter()
  const token = useAuthStore(state => state.token)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  useEffect(() => {
    const fetchTree = async () => {
      try {
        const res = await api.get(`/trees/${id}/private`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const tree = res.data
        setValue('name', tree.name)
        setValue('description', tree.description)
        setValue('isPublic', tree.isPublic)
      } catch (err) {
        console.error(err)
        setError('Error al cargar el árbol.')
      } finally {
        setLoading(false)
      }
    }

    fetchTree()
  }, [id, token, setValue])

  const onSubmit = async (data: FormData) => {
    try {
      await api.put(`/trees/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      })
      router.push('/dashboard')
    } catch (err) {
      console.error(err)
      setError('Error al guardar los cambios.')
    }
  }

  const handleDelete = async () => {
    const confirmDelete = confirm('¿Seguro que quieres eliminar este árbol? Esta acción no se puede deshacer.')
    if (!confirmDelete) return

    try {
      await api.delete(`/trees/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      router.push('/dashboard')
    } catch (err) {
      console.error(err)
      setError('Error al eliminar el árbol')
    }
  }

  if (loading) return <p className="text-center text-white mt-10">Cargando...</p>

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-zinc-950 border border-zinc-800 rounded-2xl p-10 shadow-2xl w-full max-w-lg space-y-5"
      >
        <h1 className="text-3xl font-bold text-center">✏️ Editar árbol</h1>

        <div>
          <label className="block mb-1 text-sm">Nombre</label>
          <input
            type="text"
            {...register('name')}
            className="w-full px-4 py-2 rounded-xl border outline-none text-black"
          />
          {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block mb-1 text-sm">Descripción</label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full px-4 py-2 rounded-xl border outline-none text-black resize-none"
          />
          {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>}
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" {...register('isPublic')} className="w-4 h-4" />
          <label className="text-sm">Hacer público</label>
        </div>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl transition"
        >
          Guardar cambios
        </button>

        <button
          type="button"
          onClick={handleDelete}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-xl transition mt-2"
        >
          Eliminar árbol
        </button>
      </form>
    </main>
  )
}
