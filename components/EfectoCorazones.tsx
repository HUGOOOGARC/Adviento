'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CorazonParticula {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

export default function EfectoCorazones() {
  const [particulas, setParticulas] = useState<CorazonParticula[]>([]);

  useEffect(() => {
    const manejarClick = (e: MouseEvent) => {
      const colores = ['#B83232', '#EAD7C5', '#FF4D4D', '#FFD700'];
      const nuevasParticulas: CorazonParticula[] = Array.from({ length: 6 }).map((_, i) => ({
        id: Date.now() + i + Math.random(),
        x: e.clientX + (Math.random() * 40 - 20),
        y: e.clientY + (Math.random() * 40 - 20),
        size: Math.random() * 16 + 12,
        color: colores[Math.floor(Math.random() * colores.length)],
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
            initial={{ opacity: 1, scale: 0.5, x: p.x, y: p.y }}
            animate={{ opacity: 0, scale: 1.4, y: p.y - 80, x: p.x + (Math.random() * 40 - 20) }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              fontSize: `${p.size}px`,
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