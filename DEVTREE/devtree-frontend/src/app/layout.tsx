import "../styles/tailwind.css"; // Asegúrate de que esta ruta sea correcta

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      {/* Aplicamos las clases base definidas en tailwind.config.ts y globals.css */}
      <body className="bg-primary-green-light text-custom-gray-dark font-sans antialiased">
        {children}
      </body>
    </html>
  );
}