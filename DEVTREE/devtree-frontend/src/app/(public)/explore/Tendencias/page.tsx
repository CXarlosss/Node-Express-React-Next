// src/app/(public)/explore/Tendencias/page.tsx
'use client';

import React from 'react';

export default function TendenciasPage() { // <-- CAMBIO CLAVE: export default function
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-green-light to-primary-green-lighter text-custom-gray-dark px-4 py-16 sm:px-6 md:px-10">
      <div className="max-w-6xl mx-auto space-y-12">
        <h1 className="text-5xl font-extrabold text-primary-green-darker text-center mb-10">
          Tendencias Recientes 🔥
        </h1>

        <section className="bg-white p-8 rounded-2xl shadow-xl border border-primary-green-light">
          <h2 className="text-3xl font-bold text-primary-green-darker mb-6">
            ¡Lo más popular ahora mismo!
          </h2>
          <p className="text-custom-gray-medium text-center text-lg">
            ¡Próximamente! Descubre los árboles y nodos más populares y en auge de la comunidad.
          </p>
          {/* Aquí podrías añadir un componente para mostrar los elementos en tendencia */}
          {/* Por ejemplo, una lista de árboles o nodos con contadores de vistas/likes */}
        </section>
      </div>
    </main>
  );
}
