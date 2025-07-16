'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import axios from 'axios' // Import axios for error handling

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
  const hasHydrated = useAuthStore((state) => state.hasHydrated); // For route protection

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  useEffect(() => {
    // Route protection: Redirect if not logged in or token isn't available after hydration
    if (hasHydrated && !token) {
      router.push("/login");
      return;
    }
    // If not hydrated or no token yet, wait
    if (!hasHydrated || !token) return;

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
      } catch (err: unknown) { // 'unknown' type for error
        console.error("Error al cargar el nodo:", err)
        // Specific handling for authentication errors using axios.isAxiosError
        if (axios.isAxiosError(err) && err.response && err.response.status === 401) {
          router.push('/login');
        } else {
          setError('Error al cargar el nodo. Asegúrate de tener permisos o que el nodo exista.');
        }
      } finally {
        setLoading(false)
      }
    }

    fetchNode()
  }, [nodeId, token, setValue, hasHydrated, router]) // Add all dependencies

  const onSubmit = async (data: FormData) => {
    setError(''); // Clear previous errors
    try {
      await api.put(`/nodes/${nodeId}`, {
        ...data,
        // Split tags by comma, trim whitespace, and filter out empty tags
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '') : []
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      router.push(`/trees/${id}/nodes`)
    } catch (err: unknown) { // 'unknown' type for error
      console.error("Error al actualizar el nodo:", err)
      if (axios.isAxiosError(err) && err.response && err.response.status === 401) {
        router.push('/login');
      } else {
        setError('Error al actualizar el nodo. Por favor, inténtalo de nuevo.');
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

  // Render loading state for fetching node data
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-green-light to-primary-green-lighter text-custom-gray-dark">
        <p className="text-lg text-custom-gray-medium">Cargando datos del nodo...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-green-light to-primary-green-lighter text-custom-gray-dark px-4 py-16">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-primary-green-light rounded-2xl p-8 md:p-10 shadow-xl w-full max-w-lg space-y-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary-green-darker text-center mb-6">
          ✏️ Editar Nodo
        </h1>

        <div>
          <label htmlFor="title" className="block mb-2 text-custom-gray-dark text-base font-medium">Título</label>
          <input
            id="title"
            type="text"
            {...register('title')}
            className="w-full px-4 py-2.5 rounded-lg border border-custom-gray-light focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none text-custom-gray-dark bg-custom-gray-lighter transition duration-200"
            placeholder="Ej: Introducción a React Hooks"
          />
          {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block mb-2 text-custom-gray-dark text-base font-medium">Descripción</label>
          <textarea
            id="description"
            {...register('description')}
            rows={4}
            className="w-full px-4 py-2.5 rounded-lg border border-custom-gray-light focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none text-custom-gray-dark bg-custom-gray-lighter resize-none transition duration-200"
            placeholder="Ej: Notas clave sobre useState y useEffect para la gestión de estado."
          />
          {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <label htmlFor="type" className="block mb-2 text-custom-gray-dark text-base font-medium">Tipo</label>
          <select
            id="type"
            {...register('type')}
            className="w-full px-4 py-2.5 rounded-lg border border-custom-gray-light focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none text-custom-gray-dark bg-custom-gray-lighter appearance-none pr-8 cursor-pointer transition duration-200"
          >
            <option value="idea">💡 Idea</option>
            <option value="recurso">📚 Recurso</option>
            <option value="skill">💪 Habilidad</option>
          </select>
          {errors.type && <p className="text-red-600 text-sm mt-1">{errors.type.message}</p>}
        </div>

        <div>
          <label htmlFor="tags" className="block mb-2 text-custom-gray-dark text-base font-medium">Etiquetas (separadas por coma)</label>
          <input
            id="tags"
            type="text"
            {...register('tags')}
            className="w-full px-4 py-2.5 rounded-lg border border-custom-gray-light focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none text-custom-gray-dark bg-custom-gray-lighter transition duration-200"
            placeholder="Ej: react, frontend, javascript"
          />
        </div>

        {error && <p className="text-red-600 text-base text-center mt-4 p-3 bg-red-50 rounded-lg border border-red-200">{error}</p>}

        <button type="submit" className="w-full bg-primary-green hover:bg-primary-green-dark text-white font-semibold py-3 rounded-xl transition-all duration-300 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-green-dark focus:ring-offset-2 focus:ring-offset-white">
          Guardar cambios
        </button>
      </form>
    </main>
  )
}