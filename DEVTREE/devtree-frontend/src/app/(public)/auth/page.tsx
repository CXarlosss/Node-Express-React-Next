'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '../../../store/auth'
import { Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// ====================
// VALIDACIONES
// ====================

const loginSchema = z.object({
  email: z.string().email('Email no válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email no válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

type LoginFormData = z.infer<typeof loginSchema>
type RegisterFormData = z.infer<typeof registerSchema>

// ====================
// COMPONENTE LOGIN
// ====================

function LoginForm({
  onSwitchMode,
  setToken,
  setError,
  setLoading,
  loading,
  currentError,
}: {
  onSwitchMode: () => void
  setToken: (token: string | null) => void
  setError: (msg: string) => void
  setLoading: (loading: boolean) => void
  loading: boolean
  currentError: string
}) {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.post('http://localhost:4000/api/auth/login', data)
      setToken(res.data.token)
      router.push('/dashboard')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Credenciales incorrectas.')
      } else {
        setError('Error inesperado. Intenta de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.form
      key="loginForm"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit(onSubmit)}
      className="bg-zinc-900 text-white p-8 rounded-3xl w-full max-w-md space-y-7 border border-primary-green-dark shadow-lg"
    >
      <h1 className="text-4xl font-bold text-center text-primary-green-light">Inicia sesión 👋</h1>

      <div>
        <label htmlFor="login-email" className="block text-sm mb-1.5 text-zinc-300">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          {...register('email')}
          className="w-full px-4 py-2.5 bg-zinc-800 text-white border border-zinc-700 rounded-xl"
          placeholder="correo@ejemplo.com"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="login-password" className="block text-sm mb-1.5 text-zinc-300">
          Contraseña
        </label>
        <input
          id="login-password"
          type="password"
          {...register('password')}
          className="w-full px-4 py-2.5 bg-zinc-800 text-white border border-zinc-700 rounded-xl"
          placeholder="••••••••"
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
      </div>

      {currentError && <p className="text-red-500 text-sm text-center">{currentError}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary-green hover:bg-primary-green-dark text-white py-3 rounded-xl font-semibold flex justify-center items-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Entrando...
          </>
        ) : (
          'Entrar'
        )}
      </button>

      <p className="text-center text-zinc-400 text-sm">
        ¿No tienes una cuenta?{' '}
        <button type="button" onClick={onSwitchMode} className="text-primary-green-light underline">
          Regístrate aquí
        </button>
      </p>
    </motion.form>
  )
}

// ====================
// COMPONENTE REGISTRO
// ====================

function RegisterForm({
  onSwitchMode,
  setToken,
  setError,
  setLoading,
  loading,
  currentError,
}: {
  onSwitchMode: () => void
  setToken: (token: string | null) => void
  setError: (msg: string) => void
  setLoading: (loading: boolean) => void
  loading: boolean
  currentError: string
}) {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.post('http://localhost:4000/api/auth/register', data)
      setToken(res.data.token)
      router.push('/dashboard')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Error al registrarse.')
      } else {
        setError('Error inesperado. Intenta de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.form
      key="registerForm"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit(onSubmit)}
      className="bg-zinc-900 text-white p-8 rounded-3xl w-full max-w-md space-y-7 border border-primary-green-dark shadow-lg"
    >
      <h1 className="text-4xl font-bold text-center text-primary-green-light">Crea tu cuenta 🚀</h1>

      <div>
        <label htmlFor="register-name" className="block text-sm mb-1.5 text-zinc-300">
          Nombre
        </label>
        <input
          id="register-name"
          type="text"
          {...register('name')}
          className="w-full px-4 py-2.5 bg-zinc-800 text-white border border-zinc-700 rounded-xl"
          placeholder="Tu nombre completo"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="register-email" className="block text-sm mb-1.5 text-zinc-300">
          Email
        </label>
        <input
          id="register-email"
          type="email"
          {...register('email')}
          className="w-full px-4 py-2.5 bg-zinc-800 text-white border border-zinc-700 rounded-xl"
          placeholder="correo@ejemplo.com"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="register-password" className="block text-sm mb-1.5 text-zinc-300">
          Contraseña
        </label>
        <input
          id="register-password"
          type="password"
          {...register('password')}
          className="w-full px-4 py-2.5 bg-zinc-800 text-white border border-zinc-700 rounded-xl"
          placeholder="••••••••"
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
      </div>

      {currentError && <p className="text-red-500 text-sm text-center">{currentError}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary-green hover:bg-primary-green-dark text-white py-3 rounded-xl font-semibold flex justify-center items-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Registrando...
          </>
        ) : (
          'Crear cuenta'
        )}
      </button>

      <p className="text-center text-zinc-400 text-sm">
        ¿Ya tienes una cuenta?{' '}
        <button type="button" onClick={onSwitchMode} className="text-primary-green-light underline">
          Inicia sesión aquí
        </button>
      </p>
    </motion.form>
  )
}

// ====================
// PÁGINA PRINCIPAL
// ====================

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const setToken = useAuthStore(state => state.setToken)

  const handleSwitchMode = () => {
    setMode(prev => (prev === 'login' ? 'register' : 'login'))
    setError('')
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-green-darker to-zinc-950 px-4 py-10">
      <AnimatePresence mode="wait">
        {mode === 'login' ? (
          <LoginForm
            onSwitchMode={handleSwitchMode}
            setToken={setToken}
            setError={setError}
            setLoading={setLoading}
            loading={loading}
            currentError={error}
          />
        ) : (
          <RegisterForm
            onSwitchMode={handleSwitchMode}
            setToken={setToken}
            setError={setError}
            setLoading={setLoading}
            loading={loading}
            currentError={error}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
