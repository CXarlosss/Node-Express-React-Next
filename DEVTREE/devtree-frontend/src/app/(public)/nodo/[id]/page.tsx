'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { BookOpen, CheckCircle, Lightbulb } from 'lucide-react';
import CommentSection from '../../../../components/comments/CommentSection';

interface NodeType {
  _id: string;
  title: string;
  description?: string;
  content?: string;
  type: 'idea' | 'recurso' | 'skill';
  createdBy: { _id: string; username: string };
  tree: {
    _id: string;
    name: string;
    isPublic: boolean;
    owner: string;
  };
}

export default function PublicNodePage() {
  const { id } = useParams<{ id: string }>();
  const [node, setNode] = useState<NodeType | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchNode = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/nodes/${id}`);
        console.log('Node data:', res.data);
        setNode(res.data);
      } catch (err) {
        console.error('Error al cargar el nodo:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNode();
    }
  }, [id]);

  const getNodeIcon = () => {
    switch (node?.type) {
      case 'idea':
        return <Lightbulb className="w-6 h-6 text-yellow-500" />;
      case 'recurso':
        return <BookOpen className="w-6 h-6 text-blue-500" />;
      case 'skill':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      default:
        return null;
    }
  };

  if (loading || !node) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-green-light to-primary-green-lighter">
        <p className="text-custom-gray-medium animate-pulse">Cargando nodo...</p>
      </div>
    );
  }

  const isPublic = node.tree?.isPublic;

  return (
    <main className="min-h-screen px-4 py-16 sm:px-6 md:px-10 bg-gradient-to-br from-primary-green-light to-primary-green-lighter text-custom-gray-dark">
      <div className="max-w-3xl mx-auto space-y-10">
        <section className="bg-white border border-primary-green-light rounded-2xl p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            {getNodeIcon()}
            <h1 className="text-3xl font-bold text-primary-green-darker">{node.title}</h1>
          </div>
          {node.description && (
            <p className="text-base text-custom-gray-dark mb-3">{node.description}</p>
          )}
          {node.content && (
            <div className="bg-custom-gray-lighter/50 p-4 rounded-lg border border-custom-gray-light text-sm text-custom-gray-dark whitespace-pre-wrap">
              {node.content}
            </div>
          )}
          <p className="text-sm text-custom-gray-medium mt-4">
            Nodo dentro de: <strong>{node.tree.name}</strong>
          </p>
        </section>

        {/* Comentarios */}
        {isPublic && node && (
          <CommentSection
            nodeId={node._id}
            isPublic={node.tree.isPublic}
            nodeOwnerId={node.createdBy._id}
          />
        )}
      </div>
    </main>
  );
}
