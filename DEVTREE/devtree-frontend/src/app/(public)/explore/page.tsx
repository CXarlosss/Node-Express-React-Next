'use client'

// useRouter no es necesario aquí ya que Link maneja la navegación
// import { useRouter } from 'next/navigation' 
import Link from 'next/link';
import { Search, Tags, TrendingUp, Star } from 'lucide-react'; // Iconos para las secciones

export default function ExplorePage() {
  // const router = useRouter(); // Eliminado: useRouter no se usa en esta página de hub

  // Define las secciones con sus rutas y iconos
  const sections = [
    {
      name: 'Búsqueda Avanzada',
      description: 'Encuentra árboles y nodos específicos por palabras clave, tipos o etiquetas.',
      path: '/explore/Busqueda',
      icon: <Search className="w-10 h-10 text-primary-green" />,
    },
    {
      name: 'Árboles Destacados',
      description: 'Descubre los árboles públicos más populares y valorados por la comunidad.',
      path: '/explore/Destacados',
      icon: <Star className="w-10 h-10 text-primary-green" />,
    },
    {
      name: 'Explorar por Categorías',
      description: 'Navega por el conocimiento organizado en diversas categorías temáticas.',
      path: '/explore/Categorias',
      icon: <Tags className="w-10 h-10 text-primary-green" />,
    },
    {
      name: 'Tendencias Recientes',
      description: 'Mantente al día con los temas y árboles que están en auge en la plataforma.',
      path: '/explore/Tendencias',
      icon: <TrendingUp className="w-10 h-10 text-primary-green" />,
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-green-light to-primary-green-lighter text-custom-gray-dark px-4 py-16 sm:px-6 md:px-10">
      <div className="max-w-6xl mx-auto space-y-12">
        <h1 className="text-5xl font-extrabold text-primary-green-darker text-center mb-10">
          Explora el Conocimiento 🌍
        </h1>

        <p className="text-xl text-custom-gray-medium text-center max-w-2xl mx-auto mb-12">
          Sumérgete en la vasta biblioteca de árboles de conocimiento. Elige cómo quieres descubrir nuevas ideas y recursos.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((section) => (
            <Link
              key={section.path}
              href={section.path}
              className="group bg-white p-8 rounded-2xl shadow-xl border border-primary-green-light flex flex-col items-center text-center transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-2xl hover:border-primary-green"
            >
              <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                {section.icon}
              </div>
              <h2 className="text-2xl font-bold text-primary-green-darker mb-2 group-hover:text-primary-green transition-colors duration-300">
                {section.name}
              </h2>
              <p className="text-custom-gray-medium text-base leading-relaxed">
                {section.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
