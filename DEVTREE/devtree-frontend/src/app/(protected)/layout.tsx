'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '../../store/auth'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const token = useAuthStore(state => state.token)
  const hasHydrated = useAuthStore(state => state.hasHydrated)
  const router = useRouter()

  useEffect(() => {
    // If the store has hydrated and there's no token, redirect to login
    if (hasHydrated && !token) {
      router.push('/login')
    }
  }, [hasHydrated, token, router]) // Dependencies array ensures effect runs when these values change

  // Show a full-screen loading indicator while authentication state is being determined
  if (!hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-green-light to-primary-green-lighter text-custom-gray-dark">
        <p className="text-lg text-custom-gray-medium animate-pulse">Cargando...</p>
      </div>
    );
  }

  // If hydrated but no token, this means the user is not authenticated and has been redirected
  // We return null here to prevent rendering the children while the redirect is happening.
  if (!token) {
    return null;
  }

  // If authenticated, render the children
  return <>{children}</>;
}