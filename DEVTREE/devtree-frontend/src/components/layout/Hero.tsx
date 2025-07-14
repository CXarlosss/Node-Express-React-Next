// src/components/layout/Hero.tsx
"use client";

import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <section className="h-screen flex flex-col justify-center items-center text-center px-4">
      <motion.h1
        className="text-5xl md:text-6xl font-extrabold text-white mb-6"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Tu conocimiento en forma de árbol
      </motion.h1>
      <motion.p
        className="text-lg md:text-xl text-gray-300 mb-10 max-w-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        Organiza tus ideas, domina habilidades y construye conexiones visuales que sí importan.
      </motion.p>
      <motion.a
        href="#"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-6 py-3 bg-green-500 text-black font-semibold rounded-xl shadow-md transition"
      >
        🌱 Empieza tu árbol
      </motion.a>
    </section>
  );
};
