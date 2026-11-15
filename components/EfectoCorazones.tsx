'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ParticulaCorazon {
  id: number;
  x: number;
  y: number;
  tamano: number;
  color: string;
  rotacion: number;
}

export default function EfectoCorazones() {
  const [particulas, setParticulas] = useState<ParticulaCorazon[]>([]);

  useEffect(() => {
    const manejarClick = (e: MouseEvent) => {
      const paleta = ['#B83232', '#EAD7C5', '#FF4D4D', '#FFD700', '#D4AF37'];
      const nuevasParticulas: ParticulaCorazon[] = Array.from({ length: 6 }).map((_, idx) => ({
        id: Date.now() + idx + Math.random(),
        x: e.clientX + (Math.random() * 30 - 15),
        y: e.clientY + (Math.random() * 30 - 15),
        tamano: Math.random() * 16 + 12,
        color: paleta[Math.floor(Math.random() * paleta.length)],
        rotacion: Math.random() * 60 - 30,
      }));

      setParticulas((prev) => [...prev.slice(-20), ...nuevasParticulas]);
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
            initial={{ opacity: 1, scale: 0.4, x: p.x, y: p.y, rotate: 0 }}
            animate={{
              opacity: 0,
              scale: 1.5,
              y: p.y - 85,
              x: p.x + (Math.random() * 40 - 20),
              rotate: p.rotacion,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              fontSize: `${p.tamano}px`,
              color: p.color,
            }}
          >
            ❤️
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}