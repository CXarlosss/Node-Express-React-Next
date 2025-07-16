// src/app/new-tree/page.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { api } from '@/lib/api'

// 1. ✅ Define el ESQUEMA ZOD
//    La clave aquí es que el tipo INFERIDO directamente del esquema
//    (antes de .transform()) representará los tipos de entrada del formulario.
const schema = z.object({
  name: z.string().min(2, 'El nombre es obligatorio'),
  description: z.string().min(5, 'Añade una descripción más detallada'),
  isPublic: z.boolean().optional(),
  tags: z.string().optional() // 👈 'tags' es un string (o undefined) en la entrada del formulario
})

// 2. ✅ Define el tipo para la ENTRADA del formulario
type FormInput = z.infer<typeof schema>;

// 3. ✅ Define el tipo para la SALIDA del formulario (después de transformaciones)
//    Aquí 'tags' es explícitamente un array de strings.
type FormOutput = {
  name: string;
  description: string;
  isPublic?: boolean;
  tags: string[]; // 👈 'tags' es un array de strings después de la transformación
}

export default function NewTreePage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormInput>({ // 👈 Usamos FormInput aquí para el resolver
    resolver: zodResolver(schema)
  })

  // 4. ✅ Aplica la transformación DENTRO de onSubmit o en una variable previa.
  //    La función onSubmit recibirá `data` como `FormInput`.
  const onSubmit = async (inputData: FormInput) => {
    // Aplicamos la transformación a 'tags' aquí.
    const transformedTags = inputData.tags
      ? inputData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      : [];

    const payload: FormOutput = { // 👈 Creamos el payload con el tipo FormOutput
      ...inputData,
      tags: transformedTags
    };

    console.log('📦 Payload que se envía:', payload); // <--- Ahora loguea el payload transformado

    setLoading(true);
    setError('');
    try {
      await api.post('/trees', payload); // 👈 Enviamos el payload transformado
      router.push('/dashboard');
    } catch (err) {
      setError('No se pudo crear el árbol. Intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
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
          <label htmlFor="name" className="block mb-1 text-sm">Título</label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className="w-full px-4 py-2 rounded-xl border border-zinc-700 bg-zinc-800 text-white placeholder-zinc-500 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            placeholder="Ej: Curso de React y Next.js"
          />
          {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block mb-1 text-sm">Descripción</label>
          <textarea
            id="description"
            {...register('description')}
            rows={3}
            className="w-full px-4 py-2 rounded-xl border border-zinc-700 bg-zinc-800 text-white placeholder-zinc-500 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
            placeholder="Describe brevemente el contenido de tu árbol."
          />
          {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>}
        </div>

        {/* Campo: Tags */}
        <div>
          <label htmlFor="tags" className="block mb-1 text-sm">
            Etiquetas (separadas por comas)
          </label>
          <input
            id="tags"
            type="text"
            {...register('tags')} // Aquí 'tags' se registra como 'string | undefined'
            className="w-full px-4 py-2 rounded-xl border border-zinc-700 bg-zinc-800 text-white placeholder-zinc-500 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            placeholder="Ej: Programación, Frontend, JavaScript, Desarrollo Web"
          />
          {errors.tags && <p className="text-red-400 text-sm mt-1">{errors.tags.message}</p>}
        </div>

        <div className="flex items-center gap-2">
          <input
            id="isPublic"
            type="checkbox"
            {...register('isPublic')}
            className="w-4 h-4 text-green-600 bg-zinc-700 border-zinc-600 rounded focus:ring-green-500 focus:ring-offset-zinc-950"
          />
          <label htmlFor="isPublic" className="text-sm">Hacer este árbol público</label>
        </div>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-zinc-950 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creando...' : 'Crear árbol'}
        </button>
      </form>
    </main>
  )
}