// src/app/(public)/explore/resultados/page.tsx
import { Suspense } from 'react';
import ResultadosContent from './ResultadosContext';

export default function ResultadosPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 px-4 py-16 sm:px-6 md:px-10">
      <div className="max-w-6xl mx-auto space-y-12">
        <Suspense fallback={<p className="text-center py-10 text-lg">Cargando resultados...</p>}>
          <ResultadosContent />
        </Suspense>
      </div>
    </main>
  );
}
