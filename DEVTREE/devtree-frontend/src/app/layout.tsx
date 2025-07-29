// src/app/layout.tsx
export const metadata = {
  title: 'DevTree',
  description: 'Tu plataforma para crear y explorar árboles de conocimiento.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
