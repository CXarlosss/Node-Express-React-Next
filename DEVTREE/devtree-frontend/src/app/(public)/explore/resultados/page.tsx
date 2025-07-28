// src/app/(public)/explore/resultados/page.tsx
import dynamic from 'next/dynamic'; // Importa next/dynamic para deshabilitar SSR

// Importa ResultadosContent dinámicamente con SSR deshabilitado.
// Esto asegura que useSearchParams() solo se ejecute en el cliente.
const ResultadosContent = dynamic(() => import('./ResultadosContent'), {
  ssr: false, // Deshabilita el Server-Side Rendering para este componente
  // Muestra un mensaje de carga mientras el componente se hidrata en el cliente
  loading: () => (
    <p className="text-center py-10 text-lg text-text-medium">Cargando resultados...</p>
  ),
});

export default function ResultadosPage() {
  return (
    // Usa tus colores de fondo y texto base definidos en globals.css
    <main className="min-h-screen bg-gradient-to-br from-accent-green-lighter to-accent-green-light text-text-dark px-4 py-16 sm:px-6 md:px-10">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Renderiza el componente ResultadosContent que ahora solo se ejecutará en el cliente.
            El fallback de Suspense ya no es necesario aquí porque `dynamic` con `loading` lo maneja. */}
        <ResultadosContent />
      </div>
    </main>
  );
}
