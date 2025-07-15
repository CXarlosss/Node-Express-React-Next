import axios from 'axios'
import { useAuthStore } from '@/store/auth'

export const api = axios.create({
  baseURL: 'http://localhost:4000/api',
})

// Añadir token automáticamente a cada request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
