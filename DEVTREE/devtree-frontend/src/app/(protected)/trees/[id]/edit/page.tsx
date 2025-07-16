// src/app/(private)/dashboard/trees/edit/[id]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useParams, useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { useAuthStore } from "@/store/auth";
import axios from 'axios'

// 1. ✅ ACTUALIZAR ESQUEMA ZOD para incluir 'tags' como string de entrada
const schema = z.object({
  name: z.string().min(2, 'El nombre es obligatorio'),
  description: z.string().min(5, 'La descripción debe ser más larga'),
  isPublic: z.boolean().optional(),
  // Campo 'tags' como string para la entrada del formulario
  tags: z.string().optional()
})

// Tipo para los datos de ENTRADA del formulario (antes de la transformación)
type FormInput = z.infer<typeof schema>;

// Tipo para los datos de SALIDA (el payload enviado a la API)
type FormOutput = {
  name: string;
  description: string;
  isPublic?: boolean;
  tags: string[]; // 'tags' será un array de strings en el payload final
}

export default function EditTreePage() {
  const { id } = useParams<{ id: string }>() // Asegurar que 'id' es string
  const router = useRouter()
  const token = useAuthStore(state => state.token)
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormInput>({ // Usamos FormInput aquí
    resolver: zodResolver(schema),
    defaultValues: { // Inicializa tags para evitar undefined en el input
      tags: ''
    }
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
        // 2. ✅ Cargar los tags existentes y convertirlos a una cadena separada por comas
        setValue('tags', tree.tags ? tree.tags.join(', ') : '') // Convierte el array a string
      } catch (err: unknown) {
        console.error("Error al cargar el árbol:", err)
        if (axios.isAxiosError(err) && err.response && err.response.status === 401) {
          router.push('/login');
        } else if (axios.isAxiosError(err) && err.response && err.response.status === 403) {
          setError('No tienes permiso para editar este árbol.');
          router.push('/dashboard'); // O a una página de error de permisos
        } else if (axios.isAxiosError(err) && err.response && err.response.status === 404) {
          setError('Árbol no encontrado.');
          router.push('/dashboard');
        }
         else {
          setError('Error al cargar el árbol. Asegúrate de tener permisos.');
        }
      } finally {
        setLoading(false)
      }
    }

    fetchTree()
  }, [id, token, setValue, hasHydrated, router])

  const onSubmit = async (inputData: FormInput) => { // Recibe FormInput
    setError('');

    // 3. ✅ Realizar la transformación de tags antes de enviar el payload
    const transformedTags = inputData.tags
      ? inputData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      : [];

    const payload: FormOutput = { // Construye el payload como FormOutput
      name: inputData.name,
      description: inputData.description,
      isPublic: inputData.isPublic,
      tags: transformedTags // Envía el array de tags
    };

    try {
      await api.put(`/trees/${id}`, payload, { // Envía el payload transformado
        headers: { Authorization: `Bearer ${token}` }
      })
      router.push('/dashboard')
    } catch (err: unknown) {
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
    } catch (err: unknown) {
      console.error("Error al eliminar el árbol:", err)
      if (axios.isAxiosError(err) && err.response && err.response.status === 401) {
        router.push('/login');
      } else {
        setError('Error al eliminar el árbol. Por favor, inténtalo de nuevo.');
      }
    }
  }

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
            rows={4}
            className="w-full px-4 py-2.5 rounded-lg border border-custom-gray-light focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none text-custom-gray-dark bg-custom-gray-lighter resize-none transition duration-200"
            placeholder="Ej: Un espacio para organizar mis estrategias de SEO y redes sociales."
          />
          {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>}
        </div>

        {/* 4. ✅ NUEVO CAMPO: Tags para edición */}
        <div>
          <label htmlFor="tags" className="block mb-2 text-custom-gray-dark text-base font-medium">
            Etiquetas (separadas por comas)
          </label>
          <input
            id="tags"
            type="text"
            {...register('tags')}
            className="w-full px-4 py-2.5 rounded-lg border border-custom-gray-light focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none text-custom-gray-dark bg-custom-gray-lighter transition duration-200"
            placeholder="Ej: Programación, Frontend, JavaScript"
          />
          {errors.tags && <p className="text-red-600 text-sm mt-1">{errors.tags.message}</p>}
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