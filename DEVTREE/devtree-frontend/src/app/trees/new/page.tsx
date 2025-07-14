// app/trees/new/page.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { useState } from 'react'

const schema = z.object({
  title: z.string().min(2, 'El título es obligatorio'),
  description: z.string().min(5, 'Añade una descripción más detallada'),
  isPublic: z.boolean().optional()
})

type FormData = z.infer<typeof schema>

export default function NewTreePage() {
  const { token } = useAuthStore()
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setError('')
    try {
      await axios.post(
        'http://localhost:4000/api/trees',
        data,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      router.push('/dashboard')
    } catch (err) {
      setError('No se pudo crear el árbol. Intenta de nuevo.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-zinc-950 border border-zinc-800 rounded-2xl p-10 shadow-2xl w-full max-w-lg space-y-5"
      >
        <h1 className="text-3xl font-bold text-center">🌳 Crear nuevo árbol</h1>

        <div>
          <label className="block mb-1 text-sm">Título</label>
          <input
            type="text"
            {...register('title')}
            className="w-full px-4 py-2 rounded-xl border outline-none text-black"
          />
          {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
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
          <input
            type="checkbox"
            {...register('isPublic')}
            className="w-4 h-4"
          />
          <label className="text-sm">Hacer este árbol público</label>
        </div>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-xl transition"
        >
          {loading ? 'Creando...' : 'Crear árbol'}
        </button>
      </form>
    </main>
  )
}
