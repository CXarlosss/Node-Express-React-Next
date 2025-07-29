// src/app/layout.tsx
import { Header } from "../components/layout/Header"; // Importa tu componente Header
import "../styles/tailwind.css"; // Asegúrate de que esta ruta sea correcta
import type { Metadata } from 'next';

// Opcional: Define los metadatos de tu aplicación aquí
export const metadata: Metadata = {
  title: 'DevTree',
  description: 'Tu plataforma para crear y explorar árboles de conocimiento.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-primary-green-light text-custom-gray-dark font-sans antialiased">
        {/* Tu Header se renderizará aquí, por encima de todo el contenido de la página */}
        <Header />
        
      
        <div className="pt-10 min-h-screen"> 
          {children}
        </div>
      </body>
    </html>
  );
}