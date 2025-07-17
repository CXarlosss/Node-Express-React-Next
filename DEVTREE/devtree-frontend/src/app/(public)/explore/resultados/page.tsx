// src/app/(public)/explore/resultados/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'; // Para leer parámetros de la URL
import Link from 'next/link';
import axios from 'axios';
import { Loader2, FolderSearch } from 'lucide-react'; // Para el spinner de carga y el icono de no resultados

// Asegúrate de que este tipo coincida exactamente con la estructura de tus "árboles" en el backend
type TreeType = {
  _id: string;
  name: string;        // Nombre del árbol (usado en el título de la tarjeta)
  description: string; // Descripción del árbol
  type?: 'idea' | 'recurso' | 'skill'; // Tipo opcional del árbol
  tags?: string[];     // Array de tags opcional
  // Añade cualquier otra propiedad que tus árboles puedan tener y que necesites mostrar
};

export default function ResultadosPage() {
  const searchParams = useSearchParams();
  // Usa el operador de fusión nula (?? '') para asegurar que siempre haya un string, incluso si el parámetro no está en la URL.
  const category = searchParams.get('category') ?? ''; 
  const query = searchParams.get('query') ?? ''; // Nuevo: Captura el parámetro 'query'

  const [results, setResults] = useState<TreeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Efecto para actualizar el título de la página en el navegador
  useEffect(() => {
    if (category) {
      document.title = `Resultados: ${category} | DevTree`;
    } else if (query) {
      document.title = `Resultados de Búsqueda: ${query} | DevTree`;
    } else {
      document.title = `Resultados | DevTree`; // Título por defecto si no hay filtros
    }
  }, [category, query]); // Se ejecuta cada vez que 'category' o 'query' cambian

  // Efecto para cargar los resultados de la API
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(''); // Limpia cualquier error anterior

      // Si no hay categoría ni término de búsqueda, mostramos un mensaje y no hacemos llamada API.
      // Esto evita cargar "todo" o mostrar un error si la página se accede sin parámetros.
      if (!category && !query) {
        setError('No se ha especificado una categoría o término de búsqueda para mostrar resultados.');
        setLoading(false);
        setResults([]); // Asegura que no haya resultados antiguos mostrándose
        return; 
      }

      try {
        let apiUrl = '';
        
        if (category) {
          // Si hay 'category', construimos la URL para filtrar por categoría.
          // EJEMPLO BACKEND: GET http://localhost:4000/api/trees/category/Desarrollo%20Web
          apiUrl = `http://localhost:4000/api/trees/category/${encodeURIComponent(category)}`;
        } else if (query) {
          // Si hay 'query' (y no 'category'), construimos la URL para la búsqueda general.
          // EJEMPLO BACKEND: GET http://localhost:4000/api/trees/search?q=React%20Hooks
          apiUrl = `http://localhost:4000/api/trees/search?q=${encodeURIComponent(query)}`;
        } else {
            // Este caso es poco probable debido a la comprobación inicial, pero es un fallback
            setError('Filtro de búsqueda no reconocido.');
            setLoading(false);
            return;
        }

        const res = await axios.get(apiUrl);
        setResults(res.data); // Asume que la API devuelve un array de objetos TreeType

      } catch (err: unknown) {
        console.error('Error al obtener resultados:', err);
        if (axios.isAxiosError(err)) {
          // Si es un error de Axios (ej. respuesta 4xx, 5xx del servidor)
          setError(err.response?.data?.message || 'Error al cargar los resultados. Inténtalo de nuevo.');
        } else {
          // Otro tipo de error (ej. problema de red)
          setError('Ha ocurrido un error inesperado al cargar los resultados.');
        }
        setResults([]); // Asegura que los resultados se vacíen en caso de error
      } finally {
        setLoading(false); // Siempre termina el estado de carga
      }
    };

    fetchResults(); // Llama a la función de obtención de datos
  }, [category, query]); // Se vuelve a ejecutar cuando 'category' o 'query' cambian

  // Determina el texto del título principal basado en los parámetros de la URL
  const displayTitle = category
    ? `Resultados para: ${category}`
    : query
    ? `Resultados de Búsqueda para: ${query}`
    : 'Resultados de Exploración'; // Título por defecto si se accede sin parámetros

  // Determina el mensaje de "no se encontraron resultados"
  const noResultsMessage = category
    ? `No se encontraron árboles para la categoría "${category}".`
    : query
    ? `No se encontraron árboles para la búsqueda de "${query}".`
    : 'No se encontraron resultados.'; // Mensaje por defecto si no hay filtros o no se encuentra nada

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-green-light to-primary-green-lighter text-custom-gray-dark px-4 py-16 sm:px-6 md:px-10">
      <div className="max-w-6xl mx-auto space-y-12">
        <h1 className="text-4xl font-extrabold text-primary-green-darker text-center">
          {displayTitle} <span className="text-primary-green">📚</span>
        </h1>

        <p className="text-xl text-custom-gray-medium text-center max-w-3xl mx-auto mb-10">
          Explora los árboles y nodos relacionados con tu búsqueda.
        </p>

        <section className="bg-white p-8 rounded-2xl shadow-xl border border-primary-green-light">
          <h2 className="text-3xl font-bold text-primary-green-darker mb-6">
            Contenido Relacionado
          </h2>
          
          {/* Mensaje de error si ocurre algún problema con la API o parámetros */}
          {error && (
            <p className="text-red-600 text-base text-center mb-6 p-3 bg-red-50 rounded-lg border border-red-200">
              {error}
            </p>
          )}

          {/* Indicador de carga */}
          {loading ? (
            <p className="text-lg text-center text-custom-gray-medium flex items-center justify-center gap-2 py-10">
              <Loader2 className="h-6 w-6 animate-spin" /> Cargando resultados...
            </p>
          ) : results.length === 0 && !error ? ( // Si no hay resultados y NO hay error
            <p className="text-lg text-center text-custom-gray-medium flex items-center justify-center gap-2 mt-10">
              <FolderSearch className="h-6 w-6" /> {noResultsMessage}
            </p>
          ) : (
            // Grid de resultados si hay árboles para mostrar
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {results.map(tree => (
                <Link
                  key={tree._id}
                    href={`/explore/Destacados/${tree._id}/destacados_view`}
                  className="block bg-custom-gray-lighter p-6 rounded-2xl border-2 border-primary-green hover:border-primary-green-dark transition-all duration-300 transform hover:scale-[1.03] shadow-lg hover:shadow-xl flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-2xl font-bold text-primary-green-darker mb-2 leading-snug">
                      {tree.name}
                    </h3>
                    <p className="text-sm text-custom-gray-dark line-clamp-3 mb-4">
                      {tree.description}
                    </p>
                    {/* Renderizado opcional del tipo de árbol */}
                    {tree.type && (
                      <span className="inline-block mt-2 text-xs font-semibold bg-primary-green-light text-primary-green-darker px-3 py-1 rounded-full border border-primary-green">
                        {tree.type === 'idea'
                          ? '💡 Idea'
                          : tree.type === 'recurso'
                          ? '📚 Recurso'
                          : '💪 Habilidad'}
                      </span>
                    )}
                    {/* Renderizado opcional de tags */}
                    {tree.tags && tree.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {tree.tags.map(tag => (
                          <span
                            key={tag}
                            className="text-xs bg-custom-gray-light text-custom-gray-dark px-2.5 py-1 rounded-md border border-custom-gray-medium font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="mt-auto pt-4 border-t border-custom-gray-light text-right">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-primary-green text-white shadow-sm">
                      Ver Detalle
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