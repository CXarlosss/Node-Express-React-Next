'use client'

import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { api } from '@/lib/api'
import { useAuthStore } from "@/store/auth"; // Asegúrate de que la ruta sea correcta
import { useState, useEffect } from 'react' // Importa useEffect para la protección de ruta
import axios from 'axios'; // Importa axios para el manejo de errores

const schema = z.object({
  title: z.string().min(2, 'El título es obligatorio'),
  description: z.string().min(5, 'La descripción debe tener al menos 5 caracteres'),
  type: z.enum(['idea', 'recurso', 'skill'], { // Añadimos el mensaje de error personalizado para el tipo
    message: 'El tipo es obligatorio',
  }),
  tags: z.string().optional()
});

type FormData = z.infer<typeof schema>

export default function NewNodePage() {
  const { id } = useParams()
  const router = useRouter()
  const token = useAuthStore(state => state.token)
  const hasHydrated = useAuthStore((state) => state.hasHydrated); // Para protección de ruta

  const [error, setError] = useState('')
  const [loadingAuth, setLoadingAuth] = useState(true); // Nuevo estado para la carga de autenticación


  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { // Establece un valor predeterminado para el select
      type: "" as 'idea' | 'recurso' | 'skill', // Esto permite que el valor inicial sea un string vacío para el placeholder
    },
  })

  // Protección de ruta: Redirigir si no está logueado o si el token no está disponible después de hidratar
  useEffect(() => {
    if (hasHydrated) {
      if (!token) {
        router.push("/login");
      }
      setLoadingAuth(false);
    }
  }, [hasHydrated, token, router]);

  const onSubmit = async (data: FormData) => {
    setError(''); // Limpiar errores previos
    try {
      await api.post('/nodes', {
        ...data,
        parent: null,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '') : [],
        tree: id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      router.push(`/trees/${id}/nodes`)
    } catch (err: unknown) { // Tipo 'unknown' para el error
      console.error("Error al crear el nodo:", err)
      // Manejo específico para errores de autenticación
      if (axios.isAxiosError(err) && err.response && err.response.status === 401) {
        router.push('/login');
      } else {
        setError('Error al crear el nodo. Asegúrate de que todos los campos sean válidos.');
      }
    }
  }

  // Si está cargando el estado de autenticación
  if (loadingAuth || (!hasHydrated && !token)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-green-light to-primary-green-lighter text-custom-gray-dark">
        <p className="text-lg text-custom-gray-medium">Verificando autenticación...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-green-light to-primary-green-lighter text-custom-gray-dark px-4 py-16">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-primary-green-light rounded-2xl p-8 md:p-10 shadow-xl w-full max-w-lg space-y-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary-green-darker text-center mb-6">
          ➕ Crear Nuevo Nodo
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
            rows={4} // Incrementado a 4 filas para más espacio
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
            <option value="">Selecciona una opción</option>
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
          Crear Nodo
        </button>
      </form>
    </main>
  )
}