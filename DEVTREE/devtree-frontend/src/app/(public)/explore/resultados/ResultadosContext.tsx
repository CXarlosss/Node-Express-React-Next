// src/app/(public)/explore/resultados/ResultadosContent.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { Loader2, FolderSearch } from 'lucide-react';

type TreeType = {
  _id: string;
  name: string;
  description: string;
  type?: 'idea' | 'recurso' | 'skill';
  tags?: string[];
};

export default function ResultadosContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') ?? '';
  const query = searchParams.get('query') ?? '';

  const [results, setResults] = useState<TreeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (category) {
      document.title = `Resultados: ${category} | DevTree`;
    } else if (query) {
      document.title = `Resultados de Búsqueda: ${query} | DevTree`;
    } else {
      document.title = `Resultados | DevTree`;
    }
  }, [category, query]);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError('');
      if (!category && !query) {
        setError('No se ha especificado una categoría o término de búsqueda.');
        setLoading(false);
        setResults([]);
        return;
      }

      try {
        let apiUrl = '';
        if (category) {
          apiUrl = `/api/trees/category/${encodeURIComponent(category)}`;
        } else {
          apiUrl = `/api/trees/search?q=${encodeURIComponent(query)}`;
        }

        const res = await axios.get(apiUrl);
        setResults(res.data);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Error al cargar los resultados.');
        } else {
          setError('Ha ocurrido un error inesperado.');
        }
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [category, query]);

  const displayTitle = category
    ? `Resultados para: ${category}`
    : query
    ? `Resultados de Búsqueda para: ${query}`
    : 'Resultados de Exploración';

  const noResultsMessage = category
    ? `No se encontraron árboles para la categoría "${category}".`
    : query
    ? `No se encontraron árboles para la búsqueda de "${query}".`
    : 'No se encontraron resultados.';

  return (
    <>
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

        {error && (
          <p className="text-red-600 text-base text-center mb-6 p-3 bg-red-50 rounded-lg border border-red-200">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-lg text-center text-custom-gray-medium flex items-center justify-center gap-2 py-10">
            <Loader2 className="h-6 w-6 animate-spin" /> Cargando resultados...
          </p>
        ) : results.length === 0 && !error ? (
          <p className="text-lg text-center text-custom-gray-medium flex items-center justify-center gap-2 mt-10">
            <FolderSearch className="h-6 w-6" /> {noResultsMessage}
          </p>
        ) : (
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
                  {tree.type && (
                    <span className="inline-block mt-2 text-xs font-semibold bg-primary-green-light text-primary-green-darker px-3 py-1 rounded-full border border-primary-green">
                      {tree.type === 'idea'
                        ? '💡 Idea'
                        : tree.type === 'recurso'
                        ? '📚 Recurso'
                        : '💪 Habilidad'}
                    </span>
                  )}
                  {tree.tags?.length && tree.tags.length > 0 && (
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
    </>
  );
}

