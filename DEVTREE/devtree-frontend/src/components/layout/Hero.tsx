// src/components/layout/Hero.tsx
"use client";

import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <section className="min-h-[calc(100vh-80px)] flex flex-col justify-center items-center text-center px-4 py-16 bg-gradient-to-b from-primary-green-light to-primary-green-lighter">
      <motion.h1
        className="text-5xl md:text-7xl font-extrabold text-primary-green-darker leading-tight mb-6 drop-shadow-sm"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        Transforma tu <span className="text-primary-green">conocimiento</span> en un árbol de ideas
      </motion.h1>
      <motion.p
        className="text-lg md:text-xl text-custom-gray-medium mb-10 max-w-2xl px-4 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
      >
        Organiza tus pensamientos, <strong className="text-primary-green-dark">domina nuevas habilidades</strong> y construye conexiones visuales que realmente dan fruto. ¡Tu mente, cultivada!
      </motion.p>
      <motion.a
        href="/trees/new" // Sugiero un enlace real para empezar a crear
        whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(34, 197, 94, 0.4)" }} // Sombra más prominente al hacer hover
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
        className="px-8 py-4 bg-primary-green text-white font-bold rounded-full shadow-lg transition-all duration-300 ease-in-out hover:bg-primary-green-dark flex items-center gap-2"
      >
        <span className="text-2xl">🌿</span> Empieza a Cultivar tu Árbol
      </motion.a>
    </section>
  );
};