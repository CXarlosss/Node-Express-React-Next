import dynamic from 'next/dynamic';

const ResultadosContent = dynamic(() => import('./ResultadosContent'), {
  ssr: false,
  loading: () => (
    <p className="text-center py-10 text-lg text-text-medium">Cargando resultados...</p>
  ),
});

export default function ResultadosPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 px-4 py-16 sm:px-6 md:px-10">
      <div className="max-w-6xl mx-auto space-y-12">
        <ResultadosContent />
      </div>
    </main>
  );
}
