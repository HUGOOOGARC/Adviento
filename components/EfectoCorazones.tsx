'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particula {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

export default function EfectoCorazones() {
  const [particulas, setParticulas] = useState<Particula[]>([]);

  useEffect(() => {
    const manejarClick = (e: MouseEvent) => {
      const colores = ['#B83232', '#EAD7C5', '#FF4D4D', '#FFD700'];
      const nuevas: Particula[] = Array.from({ length: 5 }).map((_, i) => ({
        id: Date.now() + i + Math.random(),
        x: e.clientX + (Math.random() * 30 - 15),
        y: e.clientY + (Math.random() * 30 - 15),
        size: Math.random() * 14 + 12,
        color: colores[Math.floor(Math.random() * colores.length)],
      }));

      setParticulas((prev) => [...prev.slice(-15), ...nuevas]);
    };

    window.addEventListener('click', manejarClick);
    return () => window.removeEventListener('click', manejarClick);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {particulas.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, scale: 0.5, x: p.x, y: p.y }}
            animate={{ opacity: 0, scale: 1.4, y: p.y - 70, x: p.x + (Math.random() * 30 - 15) }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ position: 'absolute', fontSize: `${p.size}px`, color: p.color }}
          >
            ❤️
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}