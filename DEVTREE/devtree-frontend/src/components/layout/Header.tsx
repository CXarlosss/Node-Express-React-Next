// src/components/layout/Header.tsx
"use client"; // Asegúrate de que esto esté presente para usar hooks de cliente
import Link from "next/link";
import { useAuthStore } from "@/store/auth"; // Importa tu store de autenticación
import { useRouter } from "next/navigation"; // Para la redirección después del logout

export const Header = () => {
  const { token, logout } = useAuthStore(); // Obtén el token y la función logout
  const router = useRouter();

  const handleLogout = () => {
    logout(); // Llama a la acción logout de tu store
    router.push("/"); // Redirige a la página de inicio o login después de cerrar sesión
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-sm border-b border-primary-green-light shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary-green-darker tracking-tight hover:text-primary-green transition-colors duration-200">
          🌳 DevTree
        </Link>
        <nav className="flex items-center space-x-6"> {/* Usamos flex para el contenedor principal de la navegación */}
          {/* Sección de Navegación Principal */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-base text-custom-gray-medium font-medium hover:text-primary-green-dark transition-colors duration-200">
              Inicio
            </Link>
            <Link href="/explore" className="text-base text-custom-gray-medium font-medium hover:text-primary-green-dark transition-colors duration-200">
              Explorar
            </Link>
          </div>

          {/* Separador visual (opcional, puedes ajustar el estilo) */}
          <div className="h-6 w-px bg-custom-gray-light mx-3 hidden sm:block"></div> {/* Separador solo en pantallas grandes */}

          {/* Sección de Usuario y Autenticación */}
          <div className="flex items-center space-x-6">
            {/* Muestra Dashboard solo si hay un token (usuario logueado) */}
            {token && (
              <Link href="/dashboard" className="text-base text-custom-gray-medium font-medium hover:text-primary-green-dark transition-colors duration-200">
                Dashboard
              </Link>
            )}

            {token ? (
              // Si el usuario está logueado, muestra el botón de Cerrar sesión
              <button
                type="button" // Es importante especificar type="button" para evitar que actúe como submit
                onClick={handleLogout}
                className="px-5 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-200 shadow-md"
              >
                Cerrar sesión
              </button>
            ) : (
              // Si el usuario no está logueado, muestra el botón de Iniciar sesión/Registrarse
              <Link href="/auth" className="px-5 py-2 rounded-full bg-primary-green text-white hover:bg-primary-green-dark transition-colors duration-200 shadow-md">
                Iniciar sesión
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};
