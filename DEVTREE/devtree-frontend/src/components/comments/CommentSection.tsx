"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { MessageCircle } from "lucide-react";
import { useAuthStore } from "../../store/auth";

interface Comment {
  _id: string;
  text: string;
  author: { _id: string; name: string };
  createdAt: string;
}

interface CommentSectionProps {
  nodeId: string;
  isPublic: boolean;
  nodeOwnerId: string;
}

export default function CommentSection({
  nodeId,
  isPublic,
  nodeOwnerId,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  const isOwner = user?._id === nodeOwnerId;

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/comments/${nodeId}/comments`
        );
        setComments(res.data);
      } catch (err) {
        console.error("Error al cargar comentarios:", err);
      }
    };

    if (isPublic) fetchComments();
  }, [nodeId, isPublic]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await axios.post(
        `http://localhost:4000/api/comments/${nodeId}`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments((prev) => [res.data, ...prev]);
      setCommentText("");
    } catch (err) {
      console.error("Error al enviar comentario:", err);
    }
  };

  if (!isPublic) return null;

  return (
    <section className="bg-white border border-custom-gray-light rounded-2xl p-6 shadow space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-primary-green" />
        <h2 className="text-xl font-semibold">Comentarios</h2>
      </div>

      {comments.length === 0 ? (
        <p className="text-sm text-custom-gray-medium">
          Sé el primero en comentar.
        </p>
      ) : (
        <ul className="space-y-4">
          {comments.map((c) => (
            <li
              key={c._id}
              className="bg-custom-gray-lighter p-4 rounded-lg border border-custom-gray-light"
            >
              <p className="text-sm text-custom-gray-dark">{c.text}</p>
              <p className="text-xs text-custom-gray-medium mt-1">
                — {c.author?.name || "Usuario"}
              </p>
            </li>
          ))}
        </ul>
      )}

      {hasHydrated && token && !isOwner && (
        <form onSubmit={handleSubmitComment} className="space-y-2">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            required
            placeholder="Escribe un comentario..."
            className="w-full p-3 rounded-lg border border-custom-gray-light resize-none"
            rows={3}
          />
          <button
            type="submit"
            className="bg-primary-green text-white px-4 py-2 rounded-full hover:bg-primary-green-dark transition"
          >
            Comentar
          </button>
        </form>
      )}

      {!token && hasHydrated && (
        <p className="text-sm text-custom-gray-medium italic">
          Inicia sesión para dejar un comentario.
        </p>
      )}
    </section>
  );
}
