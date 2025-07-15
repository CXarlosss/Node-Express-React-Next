// src/components/trees/TreeCard.tsx
import Link from 'next/link'

type Props = {
  id: string
  name: string
  description: string
  isPublic: boolean
}

export default function TreeCard({ id, name, description, isPublic }: Props) {
  return (
    <div className="bg-zinc-800 rounded-xl p-4 shadow-md space-y-2">
      <h2 className="text-xl font-bold">{name}</h2>
      <p className="text-sm text-zinc-300">{description}</p>
      <span className="text-xs text-zinc-400">
        {isPublic ? '🌍 Público' : '🔒 Privado'}
      </span>
      <Link
        href={`/trees/${id}`}
        className="block mt-2 text-blue-400 hover:underline text-sm"
      >
        Ver árbol →
      </Link>
    </div>
  )
}
