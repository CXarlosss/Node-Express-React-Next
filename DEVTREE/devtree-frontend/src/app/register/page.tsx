'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useAuthStore } from "@/store/auth";
import { Loader2 } from 'lucide-react' // Assuming lucide-react is installed

const schema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email no válido'),
  password: z.string().min(6, 'Mínimo 6 caracteres')
})

type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const router = useRouter()
  const setToken = useAuthStore(state => state.setToken)
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
    setError('') // Clear previous errors
    try {
      // It's recommended to use an environment variable for your API base URL
      // E.g., process.env.NEXT_PUBLIC_API_BASE_URL
      const res = await axios.post('http://localhost:4000/api/auth/register', data)
      setToken(res.data.token)
      router.push('/dashboard')
    } catch (err: unknown) { // Use 'unknown' for better type safety with axios errors
      if (axios.isAxiosError(err)) {
        // Check for specific error messages from your backend if available
        setError(err.response?.data?.message || 'Error al crear la cuenta. Inténtalo de nuevo.')
      } else {
        setError('Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo más tarde.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-green-darker to-zinc-950 px-4 py-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-zinc-900 text-white p-8 md:p-10 rounded-3xl shadow-2xl shadow-zinc-950/50 w-full max-w-md space-y-7 border border-primary-green-dark"
      >
        <h1 className="text-4xl font-extrabold text-center mb-6 text-primary-green-light">
          Crea tu cuenta 🚀
        </h1>

        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1.5 text-zinc-300">Nombre</label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className="w-full px-4 py-2.5 bg-zinc-800 text-white border border-zinc-700 rounded-xl placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary-green-light focus:border-transparent transition duration-200"
            placeholder="Tu nombre completo"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1.5">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1.5 text-zinc-300">Email</label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="w-full px-4 py-2.5 bg-zinc-800 text-white border border-zinc-700 rounded-xl placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary-green-light focus:border-transparent transition duration-200"
            placeholder="correo@ejemplo.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1.5">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1.5 text-zinc-300">Contraseña</label>
          <input
            id="password"
            type="password"
            {...register('password')}
            className="w-full px-4 py-2.5 bg-zinc-800 text-white border border-zinc-700 rounded-xl placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary-green-light focus:border-transparent transition duration-200"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1.5">{errors.password.message}</p>
          )}
        </div>

        {error && <p className="text-red-500 text-sm text-center p-3 bg-red-900/20 border border-red-900 rounded-lg">{error}</p>}

        <button
          type="submit"
          className="w-full bg-primary-green hover:bg-primary-green-dark text-white py-3 rounded-xl font-semibold transition-all duration-300 ease-in-out flex items-center justify-center gap-2 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary-green-light focus:ring-offset-2 focus:ring-offset-zinc-900"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Registrando...
            </>
          ) : (
            'Crear cuenta'
          )}
        </button>

        <p className="text-center text-zinc-400 text-sm mt-4">
          ¿Ya tienes una cuenta?{' '}
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="text-primary-green-light hover:text-primary-green font-medium underline"
          >
            Inicia sesión aquí
          </button>
        </p>
      </form>
    </main>
  )
}