'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function LucesNavidenas() {
  const luces = [
    { color: '#FFD700', sombra: 'rgba(255, 215, 0, 0.95)' }, // Dorado cálido
    { color: '#B83232', sombra: 'rgba(184, 50, 50, 0.95)' },  // Carmesí festivo
    { color: '#2E7D32', sombra: 'rgba(46, 125, 50, 0.95)' },  // Verde abeto
    { color: '#FF9800', sombra: 'rgba(255, 152, 0, 0.95)' },  // Ámbar suave
    { color: '#FFD700', sombra: 'rgba(255, 215, 0, 0.95)' },
    { color: '#B83232', sombra: 'rgba(184, 50, 50, 0.95)' },
    { color: '#2E7D32', sombra: 'rgba(46, 125, 50, 0.95)' },
    { color: '#FF9800', sombra: 'rgba(255, 152, 0, 0.95)' },
  ];

  return (
    <div className="w-full max-w-md mx-auto mb-2 relative py-2 select-none">
      {/* Guirnalda / Cable de luces */}
      <svg className="w-full h-8 absolute top-0 left-0 overflow-visible pointer-events-none" viewBox="0 0 400 30">
        <path
          d="M 0,10 Q 50,26 100,10 Q 150,26 200,10 Q 250,26 300,10 Q 350,26 400,10"
          fill="none"
          stroke="#7A5A4A"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* Bombillas LED animadas */}
      <div className="flex justify-between items-center relative z-10 px-6 pt-3">
        {luces.map((luz, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.4, rotate: [0, -12, 12, 0] }}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 1.4 + (i % 3) * 0.3,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            className="w-4 h-6 rounded-full cursor-pointer relative"
            style={{
              backgroundColor: luz.color,
              boxShadow: `0 0 14px 4px ${luz.sombra}`,
            }}
          >
            {/* Casquillo metálico de la bombilla */}
            <div className="w-2.5 h-1.5 bg-gray-400 mx-auto -mt-1 rounded-t-sm border border-gray-600" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}