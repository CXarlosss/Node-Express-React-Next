// src/app/(public)/explore/Destacados/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios'; // Importar axios para manejo de errores
import { useAuthStore } from "@/store/auth"; // Importar useAuthStore si la API requiere autenticación
import { useRouter } from 'next/navigation'; // Importar useRouter para redirección
import { Loader2, Filter, ArrowDownWideNarrow } from 'lucide-react'; // Importar Loader2, Filter, ArrowDownWideNarrow

interface PublicTreeType {
  _id: string;
  name: string;
  description: string;
  isPublic: boolean;
  // author: { _id: string; name: string; }; // Si incluyes el autor
}

export default function DestacadosPage() {
  const router = useRouter();
  const token = useAuthStore(state => state.token);
  const hasHydrated = useAuthStore(state => state.hasHydrated);

  const [publicTrees, setPublicTrees] = useState<PublicTreeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Optional: Route protection if the featured trees API requires authentication
    if (!hasHydrated) {
        setLoading(true); // Keep loading state while hydrating
        return;
    }
    // If the page should be public, you can comment out the token-based redirection
    // if (!token) {
    //     router.push('/login');
    //     return;
    // }

    const fetchPublicTrees = async () => {
      try {
        // Here would go your actual API call for featured public trees
        // Example: const res = await api.get('/trees/public/featured', { headers: { Authorization: `Bearer ${token}` } });
        // setPublicTrees(res.data);

        // Simulation of an API call with a small delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Example data for demonstration
        setPublicTrees([
          { _id: '1', name: 'Guía Completa de React', description: 'Un árbol detallado sobre el ecosistema de React, desde lo básico hasta hooks avanzados.', isPublic: true },
          { _id: '2', name: 'Fundamentos de Diseño UI', description: 'Principios clave y herramientas para crear interfaces de usuario intuitivas y atractivas.', isPublic: true },
          { _id: '3', name: 'SEO para Principiantes', description: 'Todo lo que necesitas saber para optimizar tu sitio web para motores de búsqueda.', isPublic: true },
          { _id: '4', name: 'Introducción a Machine Learning', description: 'Conceptos básicos y algoritmos populares en el aprendizaje automático.', isPublic: true },
          { _id: '5', name: 'Gestión de Proyectos Ágiles', description: 'Metodologías y herramientas para la gestión eficiente de proyectos de software.', isPublic: true },
          { _id: '6', name: 'Dominando TypeScript', description: 'Aprende a usar TypeScript para construir aplicaciones robustas y escalables.', isPublic: true },
          { _id: '7', name: 'Principios SOLID en Desarrollo', description: 'Entiende los principios SOLID para escribir código más limpio y mantenible.', isPublic: true },
        ]);
      } catch (err: unknown) {
        console.error("Error al cargar árboles públicos destacados:", err);
        if (axios.isAxiosError(err) && err.response && err.response.status === 401) {
          // router.push('/login'); // Uncomment if the public trees API requires authentication
          setError('Necesitas iniciar sesión para ver los árboles destacados.');
        } else {
          setError('Error al cargar los árboles destacados. Por favor, inténtalo de nuevo más tarde.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPublicTrees();
  }, [hasHydrated, token, router]); // Add dependencies

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-green-light to-primary-green-lighter text-custom-gray-dark px-4 py-16 sm:px-6 md:px-10">
      <div className="max-w-6xl mx-auto space-y-12">
        <h1 className="text-6xl font-extrabold text-primary-green-darker text-center mb-4 leading-tight">
          Árboles Destacados ✨
        </h1>
        <p className="text-2xl text-custom-gray-medium text-center max-w-3xl mx-auto mb-10">
          Descubre los árboles de conocimiento más populares y valorados por nuestra comunidad.
        </p>

        <section className="bg-white p-8 rounded-2xl shadow-xl border border-primary-green-light">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-3xl font-bold text-primary-green-darker">
              Explora la Colección
            </h2>
            <div className="flex gap-4">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-custom-gray-lighter text-custom-gray-dark border border-custom-gray-light hover:bg-custom-gray-light transition-colors">
                    <Filter className="w-5 h-5" /> Filtrar
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-custom-gray-lighter text-custom-gray-dark border border-custom-gray-light hover:bg-custom-gray-light transition-colors">
                    <ArrowDownWideNarrow className="w-5 h-5" /> Ordenar
                </button>
            </div>
          </div>
          
          {error && <p className="text-red-600 text-base text-center mb-6 p-3 bg-red-50 rounded-lg border border-red-200">{error}</p>}

          {loading ? (
            <p className="text-custom-gray-medium text-center text-lg flex items-center justify-center gap-2 py-10">
              <Loader2 className="h-6 w-6 animate-spin" /> Cargando árboles destacados...
            </p>
          ) : publicTrees.length === 0 ? (
            <p className="text-custom-gray-medium text-center text-lg py-10">No hay árboles públicos destacados en este momento.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> {/* Aumentado el gap */}
              {publicTrees.map(tree => (
                <Link
                  key={tree._id}
                  href={`/trees/${tree._id}/view`} // Assuming a route to view public trees
                  className="block bg-custom-gray-lighter p-6 rounded-2xl border-2 border-primary-green hover:border-primary-green-dark transition-all duration-300 transform hover:scale-[1.03] shadow-lg hover:shadow-xl flex flex-col justify-between" // Estilo más destacado
                >
                  <div>
                    <h3 className="text-2xl font-bold text-primary-green-darker mb-2 leading-snug">{tree.name}</h3> {/* Título más grande */}
                    <p className="text-sm text-custom-gray-dark line-clamp-3 mb-4">{tree.description}</p>
                    {/* {tree.author && <p className="text-xs text-custom-gray-light mt-3">Por: {tree.author.name}</p>} */}
                  </div>
                  <div className="mt-auto pt-4 border-t border-custom-gray-light text-right"> {/* Botón al final de la tarjeta */}
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-primary-green text-white shadow-sm">
                      Ver Árbol
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
