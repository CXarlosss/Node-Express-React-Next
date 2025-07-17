// src/app/(public)/explore/Tendencias/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Loader2, TrendingUp, Sparkles } from "lucide-react"; // Added Sparkles for a touch of "new/hot"

interface TrendingTreeType {
  _id: string;
  name: string;
  description: string;
  // You might want to add metrics like 'views', 'likes', 'createdAt'
  // to help determine trending status, but for display, name and description are key.
  views?: number; // Example: Add a views count
  likes?: number; // Example: Add a likes count
  updatedAt?: string; // To show recency
}

export default function TendenciasPage() {
  const [trendingTrees, setTrendingTrees] = useState<TrendingTreeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Tendencias Recientes | DevTree";

    const fetchTrendingTrees = async () => {
      setLoading(true);
      setError("");
      try {
        // Replace with your actual backend endpoint for trending trees
        // Example: GET http://localhost:4000/api/trees/trending
        const res = await axios.get("http://localhost:4000/api/trees/trending");
        setTrendingTrees(res.data);
      } catch (err: unknown) {
        console.error("Error al obtener árboles en tendencia:", err);
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ||
              "Error al cargar las tendencias. Inténtalo de nuevo."
          );
        } else {
          setError("Ha ocurrido un error inesperado al cargar las tendencias.");
        }
        setTrendingTrees([]); // Clear results on error
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingTrees();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-green-light to-primary-green-lighter text-custom-gray-dark px-4 py-16 sm:px-6 md:px-10">
      <div className="max-w-6xl mx-auto space-y-12">
        <h1 className="text-5xl font-extrabold text-primary-green-darker text-center mb-10">
          Tendencias Recientes <span className="text-primary-green">🔥</span>
        </h1>

        <p className="text-xl text-custom-gray-medium text-center max-w-2xl mx-auto mb-12">
          Descubre los árboles de conocimiento más populares y en auge de la
          comunidad de DevTree.
        </p>

        <section className="bg-white p-8 rounded-2xl shadow-xl border border-primary-green-light">
          <h2 className="text-3xl font-bold text-primary-green-darker mb-6 flex items-center justify-center gap-3">
            <TrendingUp className="w-8 h-8 text-primary-green-darker" /> ¡Lo más
            popular ahora mismo!
          </h2>

          {error && (
            <p className="text-red-600 text-base text-center mb-6 p-3 bg-red-50 rounded-lg border border-red-200">
              {error}
            </p>
          )}

          {loading ? (
            <p className="text-lg text-center text-custom-gray-medium flex items-center justify-center gap-2 py-10">
              <Loader2 className="h-6 w-6 animate-spin" /> Cargando
              tendencias...
            </p>
          ) : trendingTrees.length === 0 ? (
            <p className="text-lg text-center text-custom-gray-medium flex items-center justify-center gap-2 py-10">
              <Sparkles className="h-6 w-6 text-primary-green" /> Por ahora no
              hay árboles en tendencia. ¡Sé el primero en crear uno popular!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trendingTrees.map((tree) => (
                <Link
                  key={tree._id}
                  href={`/explore/Destacados/${tree._id}/destacados_view`}
                  className="block bg-custom-gray-lighter p-6 rounded-2xl border-2 border-primary-green hover:border-primary-green-dark transition-all duration-300 transform hover:scale-[1.03] shadow-lg hover:shadow-xl flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-2xl font-bold text-primary-green-darker mb-2 leading-snug">
                      {tree.name}
                    </h3>
                    <p className="text-sm text-custom-gray-dark line-clamp-3 mb-4">
                      {tree.description}
                    </p>
                    {tree.views !== undefined && (
                      <p className="text-xs text-custom-gray-medium mt-2">
                        Vistas: {tree.views.toLocaleString()}
                      </p>
                    )}
                    {tree.likes !== undefined && (
                      <p className="text-xs text-custom-gray-medium mt-1">
                        Likes: {tree.likes.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="mt-auto pt-4 border-t border-custom-gray-light text-right">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-primary-green text-white shadow-sm">
                      Ver Árbol
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
