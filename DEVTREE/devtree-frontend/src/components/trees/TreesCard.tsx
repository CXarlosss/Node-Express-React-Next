import Link from 'next/link';

type Props = {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
};

export default function TreeCard({ id, name, description, isPublic }: Props) {
  return (
    <div className="bg-[var(--color-background-light)] border border-[var(--color-border-light)] rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 space-y-4">
      {/* Título del árbol */}
      <h2 className="text-xl font-bold text-[var(--color-text-dark)]">{name}</h2>

      {/* Descripción */}
      <p className="text-sm text-[var(--color-text-medium)] line-clamp-3">{description}</p>

      {/* Estado de privacidad */}
      <span className="inline-block text-xs font-medium text-[var(--color-text-light)]">
        {isPublic ? '🌍 Público' : '🔒 Privado'}
      </span>

      {/* Enlace al árbol */}
      <Link
        href={`/trees/${id}`}
        className="inline-block mt-2 text-sm font-semibold text-[var(--color-primary-green)] hover:underline"
        aria-label={`Ver árbol ${name}`}
      >
        Ver árbol →
      </Link>
    </div>
  );
}
