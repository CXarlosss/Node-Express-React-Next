/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/(public)/explore/Busqueda/page.tsx
'use client';

import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react'; // Importar Loader2
import axios from 'axios'; // Asegúrate de importar axios
import { useAuthStore } from "@/store/auth"; // Importa useAuthStore si la búsqueda requiere autenticación
import { useRouter } from 'next/navigation'; // Importar useRouter para redirección

// Definir un tipo para los resultados de búsqueda (ajusta según tu API)
type SearchResultType = {
  _id: string;
  title: string;
  description: string;
  // Añade otras propiedades relevantes de tus árboles/nodos
};

export default function BusquedaPage() { // <-- CAMBIO CLAVE: export default function
  const router = useRouter();
  const token = useAuthStore(state => state.token);
  const hasHydrated = useAuthStore(state => state.hasHydrated);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
  setError('');
  setLoading(true);

  if (!hasHydrated) {
    setLoading(false);
    return;
  }

  try {
    const res = await axios.get(`http://localhost:4000/api/search?q=${encodeURIComponent(searchTerm)}`);
    setSearchResults(res.data);
  } catch (err: unknown) {
    console.error("Error al buscar:", err);
    if (axios.isAxiosError(err)) {
      setError(err.response?.data?.message || 'Error al realizar la búsqueda. Inténtalo de nuevo.');
    } else {
      setError('Ha ocurrido un error inesperado durante la búsqueda.');
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-green-light to-primary-green-lighter text-custom-gray-dark px-4 py-16 sm:px-6 md:px-10">
      <div className="max-w-6xl mx-auto space-y-12">
        <h1 className="text-5xl font-extrabold text-primary-green-darker text-center mb-10">
          Búsqueda Avanzada 🔎
        </h1>

        <section className="bg-white p-8 rounded-2xl shadow-xl border border-primary-green-light">
          <h2 className="text-3xl font-bold text-primary-green-darker mb-6 flex items-center gap-3">
            <Search className="w-8 h-8 text-primary-green" /> Encuentra lo que buscas
          </h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Busca árboles, nodos o etiquetas..."
              className="w-full px-5 py-3 pr-12 rounded-xl border border-custom-gray-light focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none text-custom-gray-dark bg-custom-gray-lighter transition duration-200 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-green hover:text-primary-green-dark transition-colors"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Search className="w-6 h-6" />}
            </button>
          </div>
          {error && <p className="text-red-600 text-base text-center mt-4 p-3 bg-red-50 rounded-lg border border-red-200">{error}</p>}

          {/* Sección de resultados de búsqueda */}
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-primary-green-darker mb-4">Resultados</h3>
            {loading ? (
              <p className="text-custom-gray-medium text-center text-lg flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" /> Buscando...
              </p>
            ) : searchResults.length === 0 && searchTerm.length > 0 && !error ? (
              <p className="text-custom-gray-medium text-center text-lg">No se encontraron resultados para &{searchTerm}.</p>
            ) : searchResults.length === 0 && searchTerm.length === 0 && !error ? (
              <p className="text-custom-gray-medium text-center text-lg">Escribe algo en la barra de búsqueda para empezar.</p>
            ) : (
              <ul className="space-y-4">
                {searchResults.map((result) => (
                  <li key={result._id} className="bg-custom-gray-lighter p-4 rounded-lg border border-custom-gray-light shadow-sm">
                    <h4 className="text-lg font-semibold text-primary-green-darker mb-1">{result.title}</h4>
                    <p className="text-sm text-custom-gray-dark line-clamp-2">{result.description}</p>
                    {/* Aquí podrías añadir un Link para ver el árbol/nodo completo */}
                    {/* <Link href={`/trees/${result._id}/view`} className="text-primary-green text-sm mt-2 inline-block hover:underline">Ver detalle</Link> */}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
