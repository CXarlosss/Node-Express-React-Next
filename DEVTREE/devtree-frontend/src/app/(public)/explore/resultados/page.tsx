'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, FolderSearch } from 'lucide-react';
import Link from 'next/link';

type TreeType = {
  _id: string;
  name: string;
  description: string;
};

export default function ResultadosCategoriaPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') ?? '';

  const [results, setResults] = useState<TreeType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (category) {
      document.title = `Resultados: ${category} | DevTree`;
    }
  }, [category]);

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      const mockResults: Record<string, TreeType[]> = {
        'Desarrollo Web': [
          { _id: '1', name: 'Guía de HTML y CSS', description: 'Aprende desde cero cómo construir páginas web básicas.' },
          { _id: '2', name: 'React y TypeScript', description: 'Crea aplicaciones modernas con React y tipado fuerte.' },
        ],
        'Diseño UX/UI': [
          { _id: '3', name: 'Fundamentos de UX', description: 'Conoce las bases para diseñar experiencias memorables.' },
        ],
        'Marketing Digital': [
          { _id: '4', name: 'Estrategias SEO', description: 'Posiciona tu web en los primeros lugares de Google.' },
        ],
      };

      setResults(mockResults[category] || []);
      setLoading(false);
    }, 600);
  }, [category]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-green-light to-primary-green-lighter text-custom-gray-dark px-4 py-16 sm:px-6 md:px-10">
      <div className="max-w-6xl mx-auto space-y-10">
        <h1 className="text-4xl font-extrabold text-primary-green-darker text-center">
          Resultados para: <span className="text-primary-green">{category || 'Categoría desconocida'}</span>
        </h1>

        {loading ? (
          <p className="text-lg text-center text-custom-gray-medium flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" /> Cargando resultados...
          </p>
        ) : results.length === 0 ? (
          <p className="text-lg text-center text-custom-gray-medium flex items-center justify-center gap-2 mt-10">
            <FolderSearch className="h-6 w-6" /> No se encontraron árboles para esta categoría.
          </p>
        ) : (
          <>
            <p className="text-sm text-custom-gray-medium text-center">
              {results.length} árbol(es) encontrado(s)
            </p>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map(tree => (
                <Link
                  key={tree._id}
                  href={`/trees/${tree._id}/view`}
                  className="block bg-white p-6 rounded-xl border border-custom-gray-light shadow-sm hover:shadow-md hover:border-primary-green transition-all duration-200 transform hover:scale-[1.02]"
                >
                  <h3 className="text-xl font-semibold text-primary-green-darker mb-2">{tree.name}</h3>
                  <p className="text-sm text-custom-gray-medium line-clamp-3">{tree.description}</p>
                </Link>
              ))}
            </section>

            <div className="text-center pt-8">
              <Link href="/explore/Categorias" className="text-primary-green hover:underline text-sm">
                ← Volver a categorías
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
