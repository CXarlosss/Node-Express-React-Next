// src/app/(public)/explore/Destacados/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios'; // Importar axios para manejo de errores
import { Loader2} from 'lucide-react'; // Importar Loader2, Filter, ArrowDownWideNarrow

interface PublicTreeType {
  _id: string;
  name: string;
  description: string;
  isPublic: boolean;
  // author: { _id: string; name: string; }; // Si incluyes el autor
}

export default function DestacadosPage() {
 

  const [publicTrees, setPublicTrees] = useState<PublicTreeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


useEffect(() => {
  const fetchPublicTrees = async () => {
    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
      const res = await axios.get(`${API_URL}/api/trees/public`);
      console.log('🌳 Árboles destacados recibidos:', res.data);
      setPublicTrees(res.data);
    } catch (err: unknown) {
      console.error("Error al cargar árboles públicos destacados:", err);
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError('Necesitas iniciar sesión para ver los árboles destacados.');
      } else {
        setError('Error al cargar los árboles destacados. Por favor, inténtalo de nuevo más tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  fetchPublicTrees();
}, []); // 👈 Nada de `hasHydrated` aquí


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
                  href={`/explore/Destacados/${tree._id}/destacados_view`} // <-- RUTA CORREGIDA AQUÍ
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
