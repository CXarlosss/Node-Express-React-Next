'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useParams, useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { useAuthStore } from "@/store/auth"; // Asegúrate de que la ruta sea correcta

import axios from 'axios' // Importa axios para el manejo de errores

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
  // Añadir la protección de ruta aquí también
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  useEffect(() => {
    // Redirigir si no está logueado y el estado ya ha hidratado (protección de ruta en el cliente)
    if (hasHydrated && !token) {
      router.push("/login");
      return;
    }
    // Si no ha hidratado o no hay token, esperar
    if (!hasHydrated || !token) return;


    const fetchTree = async () => {
      try {
        const res = await api.get(`/trees/${id}/private`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const tree = res.data
        setValue('name', tree.name)
        setValue('description', tree.description)
        setValue('isPublic', tree.isPublic)
      } catch (err: unknown) { // Añadir 'unknown' al tipo de error
        console.error("Error al cargar el árbol:", err)
        // Manejo de errores de Axios para redirección en 401
        if (axios.isAxiosError(err) && err.response && err.response.status === 401) {
          router.push('/login');
        } else {
          setError('Error al cargar el árbol. Asegúrate de tener permisos.');
        }
      } finally {
        setLoading(false)
      }
    }

    fetchTree()
  }, [id, token, setValue, hasHydrated, router]) // Asegúrate de incluir todas las dependencias

  const onSubmit = async (data: FormData) => {
    setError(''); // Limpiar errores previos
    try {
      await api.put(`/trees/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      })
      router.push('/dashboard')
    } catch (err: unknown) { // Añadir 'unknown' al tipo de error
      console.error("Error al guardar cambios:", err)
      if (axios.isAxiosError(err) && err.response && err.response.status === 401) {
        router.push('/login');
      } else {
        setError('Error al guardar los cambios. Inténtalo de nuevo.');
      }
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
    } catch (err: unknown) { // Añadir 'unknown' al tipo de error
      console.error("Error al eliminar el árbol:", err)
      if (axios.isAxiosError(err) && err.response && err.response.status === 401) {
        router.push('/login');
      } else {
        setError('Error al eliminar el árbol. Por favor, inténtalo de nuevo.');
      }
    }
  }

  // Protección de ruta inicial
  if (!hasHydrated || (!token && !loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-green-light to-primary-green-lighter text-custom-gray-dark">
        <p className="text-lg text-custom-gray-medium">Verificando autenticación...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-green-light to-primary-green-lighter text-custom-gray-dark">
        <p className="text-lg text-custom-gray-medium">Cargando datos del árbol...</p>
      </div>
    );
  }


  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-green-light to-primary-green-lighter text-custom-gray-dark px-4 py-16">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white border border-primary-green-light rounded-2xl p-8 md:p-10 shadow-xl w-full max-w-lg space-y-6"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary-green-darker text-center mb-6">
          ✏️ Editar tu Árbol
        </h1>

        <div>
          <label htmlFor="name" className="block mb-2 text-custom-gray-dark text-base font-medium">Nombre</label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className="w-full px-4 py-2.5 rounded-lg border border-custom-gray-light focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none text-custom-gray-dark bg-custom-gray-lighter transition duration-200"
            placeholder="Ej: Mi árbol de Marketing Digital"
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block mb-2 text-custom-gray-dark text-base font-medium">Descripción</label>
          <textarea
            id="description"
            {...register('description')}
            rows={4} // Aumentado a 4 filas para más espacio
            className="w-full px-4 py-2.5 rounded-lg border border-custom-gray-light focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none text-custom-gray-dark bg-custom-gray-lighter resize-none transition duration-200"
            placeholder="Ej: Un espacio para organizar mis estrategias de SEO y redes sociales."
          />
          {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>}
        </div>

        <div className="flex items-center gap-3 mt-4">
          <input
            id="isPublic"
            type="checkbox"
            {...register('isPublic')}
            className="w-5 h-5 text-primary-green bg-custom-gray-lighter border-custom-gray-medium rounded focus:ring-primary-green focus:ring-2 cursor-pointer"
          />
          <label htmlFor="isPublic" className="text-base text-custom-gray-dark select-none">Hacer público este árbol</label>
        </div>

        {error && <p className="text-red-600 text-base text-center mt-4 p-3 bg-red-50 rounded-lg border border-red-200">{error}</p>}

        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <button
            type="submit"
            className="flex-1 bg-primary-green hover:bg-primary-green-dark text-white font-semibold py-3 rounded-xl transition-all duration-300 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-green-dark focus:ring-offset-2 focus:ring-offset-white"
          >
            Guardar cambios
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2 focus:ring-offset-white"
          >
            Eliminar árbol
          </button>
        </div>
      </form>
    </main>
  )
}