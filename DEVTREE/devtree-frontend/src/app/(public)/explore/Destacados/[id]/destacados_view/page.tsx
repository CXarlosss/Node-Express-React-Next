'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import {
  Loader2, ArrowLeft, BookOpen, Lightbulb, CheckCircle, XCircle
} from 'lucide-react';
import Link from 'next/link';

interface NodeType {
  _id: string;
  title: string;
  description?: string;
  type: 'idea' | 'recurso' | 'skill';
  content?: string;
}

interface TreeDetailType {
  _id: string;
  name: string;
  description: string;
  isPublic: boolean;
  owner?: {
    _id: string;
    username: string;
  };
  nodes: NodeType[];
}

export default function TreeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const treeId = params.id as string;

  const [tree, setTree] = useState<TreeDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!treeId) {
      setError('ID del árbol no proporcionado.');
      setLoading(false);
      return;
    }

    const fetchTreeDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/trees/${treeId}`);
        setTree(res.data);
      } catch (err: unknown) {
        console.error("Error al cargar los detalles del árbol:", err);
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 404) {
            setError('Árbol no encontrado.');
          } else if (err.response?.status === 403) {
            setError('Este árbol es privado o no tienes permiso para verlo.');
          } else {
            setError(err.response?.data?.message || 'Error al cargar el árbol.');
          }
        } else {
          setError('Ha ocurrido un error inesperado.');
        }
        setTree(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTreeDetails();
  }, [treeId]);

  const getNodeIcon = (type: NodeType['type']) => {
    switch (type) {
      case 'idea': return <Lightbulb className="w-5 h-5 text-yellow-500" />;
      case 'recurso': return <BookOpen className="w-5 h-5 text-blue-500" />;
      case 'skill': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-green-light to-primary-green-lighter">
        <Loader2 className="w-6 h-6 animate-spin text-custom-gray-dark" />
        <p className="ml-3 text-custom-gray-medium animate-pulse">Cargando árbol...</p>
      </div>
    );
  }

  if (error || !tree) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gradient-to-br from-primary-green-light to-primary-green-lighter">
        <XCircle className="w-16 h-16 text-red-500 mb-4" />
        <p className="text-lg font-semibold text-red-700 mb-6">{error || 'No se pudo cargar el árbol.'}</p>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 rounded-full bg-primary-green text-white hover:bg-primary-green-dark transition"
        >
          <ArrowLeft className="inline w-5 h-5 mr-2" /> Volver
        </button>
      </div>
    );
  }

  // Agrupar nodos por tipo
  const groupedNodes = {
    idea: tree.nodes.filter(n => n.type === 'idea'),
    recurso: tree.nodes.filter(n => n.type === 'recurso'),
    skill: tree.nodes.filter(n => n.type === 'skill')
  };

  const renderNodeGroup = (title: string, type: keyof typeof groupedNodes, emoji: string) => {
    const nodes = groupedNodes[type];
    if (nodes.length === 0) return null;

    return (
      <section className="mb-12">
        <h3 className="text-2xl font-bold text-primary-green-darker mb-4 flex items-center gap-2">
          {emoji} {title}
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
        {nodes.map(node => (
  <Link
  key={node._id}
href={`/nodo/${node._id}`}

  className="block bg-white border border-custom-gray-light rounded-xl p-5 shadow hover:shadow-md transition"
>

    <div className="flex items-center gap-2 mb-2">
      {getNodeIcon(node.type)}
      <h4 className="text-lg font-semibold text-primary-green-dark">{node.title}</h4>
    </div>
    {node.description && (
      <p className="text-sm text-custom-gray-dark mb-2">{node.description}</p>
    )}
    {node.content && (
      <div className="bg-custom-gray-lighter/50 text-sm p-3 rounded-lg border border-custom-gray-light max-h-32 overflow-auto">
        {node.content}
      </div>
    )}
  </Link>
))}

        </div>
      </section>
    );
  };

  return (
    <main className="min-h-screen px-4 py-16 sm:px-6 md:px-10 bg-gradient-to-br from-primary-green-light to-primary-green-lighter text-custom-gray-dark">
      <div className="max-w-5xl mx-auto space-y-12">

        {/* Header con botón volver */}
        <header className="flex justify-between items-center mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-primary-green-dark hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>
        </header>

        {/* Info del Árbol */}
        <section className="bg-white p-8 rounded-2xl border border-primary-green-light shadow">
          <h1 className="text-4xl font-bold text-primary-green-darker mb-2">{tree.name}</h1>
          {tree.owner && (
            <p className="text-sm text-custom-gray-medium mb-2">
              Creado por: <span className="font-semibold">{tree.owner.username}</span>
            </p>
          )}
          <p className="text-base text-custom-gray-dark mb-4">{tree.description}</p>
          {!tree.isPublic && (
            <div className="text-sm inline-flex items-center gap-1 text-red-600 bg-red-100 px-3 py-1 rounded-full border border-red-300">
              <XCircle className="w-4 h-4" />
              Árbol privado
            </div>
          )}
        </section>

        {/* Nodos agrupados */}
        <section>
          <h2 className="text-3xl font-bold text-primary-green-darker mb-6 flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-primary-green" />
            Nodos del Conocimiento
          </h2>

          {tree.nodes.length === 0 ? (
            <p className="text-center text-lg text-custom-gray-medium py-10">Este árbol aún no tiene nodos.</p>
          ) : (
            <>
              {renderNodeGroup('Ideas', 'idea', '💡')}
              {renderNodeGroup('Recursos', 'recurso', '📚')}
              {renderNodeGroup('Skills', 'skill', '✅')}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
