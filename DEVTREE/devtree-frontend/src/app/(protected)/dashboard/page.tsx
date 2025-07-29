"use client";

import { useAuthStore } from "../../../store/auth"; // Asegúrate de que la ruta sea correcta
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Pencil, Eye } from "lucide-react";
import { api } from "../../../lib/api";
import axios from "axios"; // <-- ¡IMPORTA AXIOS AQUÍ!

interface Tree {
  _id: string;
  name: string;
  description: string;
}

export default function DashboardPage() {
  const token = useAuthStore((state) => state.token);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const [trees, setTrees] = useState<Tree[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Redirigir si no está logueado y el estado ya ha hidratado
    if (hasHydrated && !token) {
      router.push("/login"); // Asumiendo que tu página de login es /login
      return; // Detener la ejecución del resto del useEffect
    }

    // Si no ha hidratado o no hay token todavía, esperar
    if (!hasHydrated || !token) return;

    const fetchTrees = async () => {
      try {
        const res = await api.get("/trees/mine", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTrees(res.data);
      } catch (err: unknown) { // 'err' es de tipo 'unknown' por defecto en el bloque catch
        console.error("Error cargando árboles", err);

        // Con 'axios' importado, axios.isAxiosError(err) funciona y tipa 'err'
        if (axios.isAxiosError(err) && err.response && err.response.status === 401) {
          console.error("Token inválido o expirado, redirigiendo a login");
          router.push("/login");
        } else {
          console.error("Un error inesperado ocurrió:", err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTrees();
  }, [hasHydrated, token, router]);

  const goToCreateTree = () => {
    router.push("/trees/new");
  };

  const goToEditTree = (id: string) => {
    router.push(`/trees/${id}/edit`);
  };

  // Muestra un cargando o nada mientras se verifica la autenticación
  if (!hasHydrated || (!token && !loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 text-gray-800">
        <p className="text-lg text-gray-600">Verificando autenticación...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 text-gray-800 px-4 py-10">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-extrabold text-green-800">🌳 Tus Árboles</h1>
          <button
            onClick={goToCreateTree}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 active:bg-green-800 px-5 py-2.5 rounded-full text-white font-semibold shadow-lg transition transform hover:scale-105"
          >
            <PlusCircle className="w-5 h-5" />
            Crear Árbol
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-600 text-lg">Cargando árboles...</p>
        ) : trees.length === 0 ? (
          <div className="text-center bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <p className="text-gray-500 text-lg">
              Parece que aún no tienes árboles creados. ¡Anímate a plantar uno! 🌱
            </p>
            <button
              onClick={goToCreateTree}
              className="mt-6 flex items-center gap-2 mx-auto bg-green-500 hover:bg-green-600 active:bg-green-700 px-6 py-3 rounded-full text-white font-semibold shadow-md transition transform hover:scale-105"
            >
              <PlusCircle className="w-5 h-5" />
              Crear mi primer árbol
            </button>
          </div>
        ) : (
          <ul className="space-y-6">
            {trees.map((tree) => (
              <li
                key={tree._id}
                className="bg-white border border-green-200 p-6 rounded-xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center transform hover:scale-[1.01] transition-transform duration-200"
              >
                <div className="mb-4 sm:mb-0 sm:pr-4">
                  <h2 className="text-2xl font-bold text-green-700">{tree.name}</h2>
                  <p className="text-gray-600 text-base mt-1 line-clamp-2">
                    {tree.description}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => goToEditTree(tree._id)}
                    className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 px-4 py-2 rounded-lg text-white text-sm font-medium shadow transition transform hover:scale-105"
                  >
                    <Pencil className="w-4 h-4" />
                    Editar
                  </button>

                  <button
                    onClick={() => router.push(`/trees/${tree._id}/nodes`)}
                    className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 px-4 py-2 rounded-lg text-white text-sm font-medium shadow transition transform hover:scale-105"
                  >
                    <Eye className="w-4 h-4" />
                    Ver nodos
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}