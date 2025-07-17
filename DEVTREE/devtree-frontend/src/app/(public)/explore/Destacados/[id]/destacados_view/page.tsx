// src/app/(public)/explore/Destacados/destacados_view/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation'; // Para obtener el ID de la URL y para navegación
import axios from 'axios'; // Para hacer la llamada a la API
import { Loader2, ArrowLeft, BookOpen, Lightbulb, CheckCircle, XCircle, FolderSearch } from 'lucide-react'; // Iconos (FolderSearch añadido aquí)

// Define la interfaz para el tipo de nodo (ajusta según tu modelo real de Node)
interface NodeType {
  _id: string;
  title: string;
  description?: string; // Opcional
  type: 'idea' | 'recurso' | 'skill'; // Tipos de nodos
  content?: string; // Contenido detallado del nodo
  // Otros campos que p uedan tener tus nodos
}

// Define la interfaz para el tipo de árbol (ajusta según tu modelo real de Tree)
interface TreeDetailType {
  _id: string;
  name: string;
  description: string;
  isPublic: boolean;
  owner?: { // Opcional, si quieres mostrar el autor
    _id: string;
    username: string; // O el nombre de usuario
  };
  nodes: NodeType[]; // Los nodos que componen el árbol
}

export default function TreeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const treeId = params.id as string; // Obtener el ID del árbol de la URL

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
      setLoading(true);
      setError('');
      try {
        // Llama a tu API de backend para obtener los detalles del árbol.
        // Asegúrate de que tu ruta de Express router.get('/:id') o similar
        // esté configurada para devolver los nodos populados si es necesario.
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
            setError(err.response?.data?.message || 'Error al cargar el árbol. Inténtalo de nuevo.');
          }
        } else {
          setError('Ha ocurrido un error inesperado al cargar el árbol.');
        }
        setTree(null); // Asegurarse de que el árbol sea nulo en caso de error
      } finally {
        setLoading(false);
      }
    };

    fetchTreeDetails();
  }, [treeId]); // Dependencia del useEffect para que se ejecute cuando cambie el ID del árbol

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-green-light to-primary-green-lighter text-custom-gray-dark">
        <p className="text-lg text-custom-gray-medium animate-pulse flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" /> Cargando detalles del árbol...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-green-light to-primary-green-lighter text-custom-gray-dark px-4 text-center">
        <XCircle className="h-16 w-16 text-red-500 mb-4" />
        <p className="text-xl text-red-700 font-semibold mb-6">{error}</p>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center px-6 py-3 rounded-full bg-primary-green text-white hover:bg-primary-green-dark transition-colors duration-200 shadow-md"
        >
          <ArrowLeft className="h-5 w-5 mr-2" /> Volver
        </button>
      </div>
    );
  }

  if (!tree) {
    // Esto es un fallback, ya que `error` debería manejar la mayoría de los casos sin árbol.
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-green-light to-primary-green-lighter text-custom-gray-dark px-4 text-center">
        <FolderSearch className="h-16 w-16 text-custom-gray-medium mb-4" />
        <p className="text-xl text-custom-gray-dark font-semibold mb-6">No se pudo cargar el árbol.</p>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center px-6 py-3 rounded-full bg-primary-green text-white hover:bg-primary-green-dark transition-colors duration-200 shadow-md"
        >
          <ArrowLeft className="h-5 w-5 mr-2" /> Volver
        </button>
      </div>
    );
  }

  // Helper para obtener el icono según el tipo de nodo
  const getNodeIcon = (type: NodeType['type']) => {
    switch (type) {
      case 'idea': return <Lightbulb className="w-5 h-5 text-yellow-500" />;
      case 'recurso': return <BookOpen className="w-5 h-5 text-blue-500" />;
      case 'skill': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return null;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-green-light to-primary-green-lighter text-custom-gray-dark px-4 py-16 sm:px-6 md:px-10">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Botón para volver */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center px-4 py-2 rounded-full bg-white text-primary-green-darker hover:bg-custom-gray-lighter transition-colors duration-200 shadow-md mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" /> Volver
        </button>

        {/* Sección de información general del árbol */}
        <section className="bg-white p-8 rounded-2xl shadow-xl border border-primary-green-light">
          <h1 className="text-4xl font-extrabold text-primary-green-darker mb-4 leading-tight">
            {tree.name}
          </h1>
          {tree.owner && (
            <p className="text-sm text-custom-gray-medium mb-4">
              Creado por: <span className="font-semibold text-primary-green-dark">{tree.owner.username || 'Usuario Desconocido'}</span>
            </p>
          )}
          <p className="text-lg text-custom-gray-dark leading-relaxed mb-6">
            {tree.description}
          </p>
          {!tree.isPublic && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-300">
              <XCircle className="h-3 w-3 mr-1" /> Árbol Privado
            </span>
          )}
        </section>

        {/* Sección de Nodos del Árbol */}
        <section className="bg-white p-8 rounded-2xl shadow-xl border border-primary-green-light">
          <h2 className="text-3xl font-bold text-primary-green-darker mb-6 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary-green" /> Nodos del Conocimiento
          </h2>

          {tree.nodes.length === 0 ? (
            <p className="text-custom-gray-medium text-center text-lg py-8">Este árbol aún no tiene nodos.</p>
          ) : (
            <div className="space-y-6">
              {tree.nodes.map((node, index) => (
                <div key={node._id || index} className="bg-custom-gray-lighter p-6 rounded-xl border border-custom-gray-light shadow-sm">
                  <div className="flex items-center mb-3">
                    {getNodeIcon(node.type)}
                    <h3 className="text-xl font-semibold text-primary-green-darker ml-3">{node.title}</h3>
                  </div>
                  {node.description && (
                    <p className="text-sm text-custom-gray-dark leading-relaxed mb-3">{node.description}</p>
                  )}
                  {node.content && (
                    <div className="bg-white p-4 rounded-lg border border-custom-gray-light text-sm text-custom-gray-darker overflow-auto max-h-40">
                      <p>{node.content}</p> {/* Mostrar contenido detallado del nodo */}
                    </div>
                  )}
                  {/* Aquí podrías añadir más detalles del nodo, como enlaces, imágenes, etc. */}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
