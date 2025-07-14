// src/components/layout/Header.tsx
export const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white tracking-wide">🌳 DevTree</h1>
        <nav className="space-x-4 text-sm text-white/80">
          <a href="#" className="hover:text-white transition">Inicio</a>
          <a href="#" className="hover:text-white transition">Explorar</a>
          <a href="#" className="hover:text-white transition">Iniciar sesión</a>
        </nav>
      </div>
    </header>
  );
};
