'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { Loader2 } from 'lucide-react'

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
    setError('')
    try {
      const res = await axios.post('http://localhost:4000/api/auth/register', data)
      setToken(res.data.token)
      router.push('/dashboard')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Error del servidor')
      } else {
        setError('Error desconocido')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-zinc-950 text-white p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-6 border border-zinc-800"
      >
        <h1 className="text-3xl font-bold text-center mb-4">Crea tu cuenta</h1>

        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input
            type="text"
            {...register('name')}
            className="w-full px-4 py-2 bg-zinc-800 text-white border border-zinc-700 rounded-lg placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tu nombre"
          />
          {errors.name && (
            <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            {...register('email')}
            className="w-full px-4 py-2 bg-zinc-800 text-white border border-zinc-700 rounded-lg placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="tucorreo@ejemplo.com"
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Contraseña</label>
          <input
            type="password"
            {...register('password')}
            className="w-full px-4 py-2 bg-zinc-800 text-white border border-zinc-700 rounded-lg placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="******"
          />
          {errors.password && (
            <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creando...
            </>
          ) : (
            'Crear cuenta'
          )}
        </button>
      </form>
    </main>
  )
}
