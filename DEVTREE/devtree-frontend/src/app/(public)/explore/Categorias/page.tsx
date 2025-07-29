'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function CategoriasPage() {
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTags = async () => {
      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      console.log(process.env.NEXT_PUBLIC_API_BASE_URL)


      try {
        const res = await axios.get(`${API_URL}/api/trees/tags/all`);
        setTags(res.data);
      } catch (err) {
        console.error('Error al cargar tags:', err);
        setError('No se pudieron cargar las categorías.');
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  return (
    <main className="min-h-screen px-6 py-12 bg-gradient-to-br from-primary-green-light to-primary-green-lighter text-custom-gray-dark">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-primary-green-darker mb-6">Categorías disponibles</h1>
        <p className="text-lg text-custom-gray-medium mb-12">
          Elige una categoría para explorar árboles y nodos relacionados.
        </p>

        {loading && <p className="text-center">Cargando categorías...</p>}
        {error && <p className="text-red-600">{error}</p>}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 justify-center">
          {tags.map(tag => (
            <Link
              key={tag}
              href={`/explore/resultados?category=${encodeURIComponent(tag)}`}
              className="px-4 py-3 bg-white rounded-lg shadow hover:bg-primary-green-light hover:text-white font-semibold text-sm border text-primary-green-dark transition"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
