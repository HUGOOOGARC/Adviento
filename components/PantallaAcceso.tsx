'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Lock } from 'lucide-react';

interface PantallaAccesoProps {
  onAcceso: () => void;
}

const CLAVE_STORAGE = 'adviento_acceso_lucia';

// Respuestas válidas (formatos distintos de la misma fecha)
const RESPUESTAS_VALIDAS = [
  '14-10-2026',
  '14/10/2026',
  '14102026',
  '14 10 2026',
  '14-10-26',
  '14/10/26',
];

function normalizar(str: string) {
  return str.trim().toLowerCase().replace(/\s+/g, ' ');
}

export default function PantallaAcceso({ onAcceso }: PantallaAccesoProps) {
  const [respuesta, setRespuesta] = useState('');
  const [error, setError] = useState(false);
  const [sacudida, setSacudida] = useState(false);
  const [correcto, setCorrecto] = useState(false);

  // Comprobar si ya tiene acceso guardado
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const acceso = localStorage.getItem(CLAVE_STORAGE);
      if (acceso === 'true') {
        onAcceso();
      }
    }
  }, [onAcceso]);

  const verificar = () => {
    const resp = normalizar(respuesta);
    const esCorrecta = RESPUESTAS_VALIDAS.some(
      (v) => normalizar(v) === resp
    );

    if (esCorrecta) {
      setCorrecto(true);
      setError(false);
      localStorage.setItem(CLAVE_STORAGE, 'true');
      // Pequeña pausa para ver la animación de éxito
      setTimeout(() => {
        onAcceso();
      }, 1200);
    } else {
      setError(true);
      setSacudida(true);
      setTimeout(() => setSacudida(false), 600);
      setRespuesta('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') verificar();
  };

  return (
    <AnimatePresence>
      <motion.div
        key="acceso"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#FDF8F2]"
      >
        {/* Decoración de fondo sutil */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          <div className="absolute top-8 left-6 text-[#EAD7C5] text-5xl opacity-40">❄️</div>
          <div className="absolute top-16 right-8 text-[#EAD7C5] text-4xl opacity-30">🎄</div>
          <div className="absolute bottom-12 left-10 text-[#EAD7C5] text-4xl opacity-30">⭐</div>
          <div className="absolute bottom-8 right-6 text-[#EAD7C5] text-5xl opacity-40">❄️</div>
        </div>

        <motion.div
          animate={sacudida ? { x: [-8, 8, -8, 8, 0] } : { x: 0 }}
          transition={{ duration: 0.4 }}
          className="relative w-full max-w-sm mx-4"
        >
          <div className="bg-white border border-[#EAD7C5] rounded-3xl shadow-xl px-8 py-10 text-center">

            {/* Icono superior */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.1 }}
              className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#B83232]/10 flex items-center justify-center"
            >
              {correcto ? (
                <Heart className="w-8 h-8 text-[#B83232] fill-[#B83232]" />
              ) : (
                <Lock className="w-8 h-8 text-[#B83232]" />
              )}
            </motion.div>

            {/* Título */}
            <h1 className="font-serif text-2xl text-[#3D2E2B] font-semibold mb-1">
              Calendario de Adviento
            </h1>
            <p className="font-serif text-[#B83232] text-sm font-semibold mb-6">
              ❤️ Para Lucía, con todo mi amor
            </p>

            {/* Pregunta */}
            <div className="bg-[#FDF8F2] border border-[#EAD7C5] rounded-2xl px-5 py-4 mb-6">
              <p className="font-serif text-[#5C4D4A] text-sm leading-relaxed">
                Antes de entrar... una preguntita 🥺
              </p>
              <p className="font-serif text-[#3D2E2B] font-semibold text-base mt-1">
                ¿Qué día empezamos a ser novios? 💑
              </p>
            </div>

            {/* Input */}
            <input
              type="text"
              value={respuesta}
              onChange={(e) => {
                setRespuesta(e.target.value);
                setError(false);
              }}
              onKeyDown={handleKeyDown}
              placeholder="dd-mm-aaaa"
              maxLength={12}
              autoFocus
              className={`w-full text-center font-serif text-lg text-[#3D2E2B] bg-white border-2 rounded-xl px-4 py-3 mb-2 outline-none transition-all placeholder:text-[#C4B5AD] ${
                error
                  ? 'border-[#B83232] bg-red-50'
                  : correcto
                  ? 'border-green-400 bg-green-50'
                  : 'border-[#EAD7C5] focus:border-[#B83232]'
              }`}
            />

            {/* Mensaje de error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs font-serif text-[#B83232] mb-3"
                >
                  Mmm... ¿segura? Piénsalo bien 🥺
                </motion.p>
              )}
              {correcto && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs font-serif text-green-600 mb-3"
                >
                  ¡Claro que lo sabías! ❤️ Entrando...
                </motion.p>
              )}
            </AnimatePresence>

            {/* Botón */}
            {!correcto && (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={verificar}
                className="w-full bg-[#B83232] hover:bg-[#9e2b2b] text-white font-serif font-semibold text-sm py-3 rounded-xl transition-colors shadow-sm mt-1"
              >
                Entrar al calendario 🎄
              </motion.button>
            )}

            {/* Pie */}
            <p className="text-[10px] font-serif text-[#C4B5AD] mt-5">
              Hecho con ❤️ por Hugo
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
