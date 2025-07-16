// src/app/(public)/explore/Categorias/page.tsx
'use client';

import React, { useCallback } from 'react';
import { Tags } from 'lucide-react'; // Importar el icono de Tags

export default function CategoriasPage() { // <-- CAMBIO CLAVE: export default function
  // Mock de categorías para la sección "Explorar por Categorías"
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

  // Lógica de selección de categoría
  const handleSelectCategory = useCallback((categoryName: string) => {
    console.log('Filtrando por categoría:', categoryName);
    // Aquí iría la lógica real para filtrar árboles/nodos por categoría
    // o para redirigir a una página de resultados de categoría.
    // Ejemplo: router.push(`/explore/resultados?category=${categoryName}`);
  }, []);

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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"> {/* Aumentado el gap */}
            {categories.map(category => (
              <button
                key={category.name}
                onClick={() => handleSelectCategory(category.name)}
                className="flex flex-col items-center justify-center p-5 bg-primary-green-light text-primary-green-darker rounded-xl border border-primary-green hover:bg-primary-green hover:text-white transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg font-medium text-center"
              >
                <span className="text-4xl mb-3">{category.icon}</span> {/* Icono más grande */}
                <span className="text-lg font-semibold">{category.name}</span> {/* Texto más grande y negrita */}
              </button>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
