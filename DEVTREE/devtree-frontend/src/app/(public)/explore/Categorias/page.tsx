'use client';

import React, { useCallback } from 'react';
import { Tags } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function CategoriasPage() {
  const router = useRouter();

  const categories = [
    { name: 'Desarrollo Web', icon: '💻' },
    { name: 'Diseño UX/UI', icon: '🎨' },
    { name: 'Marketing Digital', icon: '📈' },
    { name: 'Ciencia de Datos', icon: '📊' },
    { name: 'Inteligencia Artificial', icon: '🤖' },
    { name: 'Productividad', icon: '⏱️' },
    { name: 'Finanzas Personales', icon: '💰' },
    { name: 'Idiomas', icon: '🗣️' },
    { name: 'Salud y Bienestar', icon: '🧘‍♀️' },
    { name: 'Cocina y Recetas', icon: '🍳' },
  ];

  const handleSelectCategory = useCallback((categoryName: string) => {
    router.push(`/explore/resultados?category=${encodeURIComponent(categoryName)}`);
  }, [router]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-green-light to-primary-green-lighter text-custom-gray-dark px-4 py-16 sm:px-6 md:px-10">
      <div className="max-w-6xl mx-auto space-y-12">
        <h1 className="text-5xl font-extrabold text-primary-green-darker text-center mb-10">
          Explorar por Categorías 🏷️
        </h1>

        <p className="text-xl text-custom-gray-medium text-center max-w-2xl mx-auto mb-12">
          Navega por el conocimiento organizado en diversas categorías temáticas.
        </p>

        <section className="bg-white p-8 rounded-2xl shadow-xl border border-primary-green-light">
          <h2 className="text-3xl font-bold text-primary-green-darker mb-6 flex items-center gap-3">
            <Tags className="w-8 h-8 text-primary-green" /> Elige un tema
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map(category => (
              <motion.button
                key={category.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSelectCategory(category.name)}
                className="flex flex-col items-center justify-center p-5 bg-primary-green-light text-primary-green-darker rounded-xl border border-primary-green hover:bg-primary-green hover:text-white transition-all duration-200 shadow-md font-medium text-center"
              >
                <span className="text-4xl mb-3">{category.icon}</span>
                <span className="text-lg font-semibold">{category.name}</span>
              </motion.button>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
